import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery
} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import {makeStyles, useTheme} from "@material-ui/core/styles";
import React, {useEffect, useState} from "react";
import db from "./firebase.config";
import {useHistory, useParams} from "react-router-dom";
import {GlobalContext} from "./App";
import {isLoggedOut} from "./utils";
import abcjs from "abcjs";
import slugify from "slugify";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    margin: "50px",
    padding: "30px",
    backgroundColor: "#f5f5f5",
    gap: "50px",
    alignItems: "flex-start"
  },
  formContainerMobile: {
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    gap: "50px",
    alignItems: "flex-start"
  },
  selectControl: {
    minWidth: "120px"
  }
}))

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const EditAddHymnPage = (props) => {
  let {id} = useParams();
  const classes = useStyles()
  const history = useHistory()
  const [mode, setMode] = useState("loading")
  const [hymnID, setHymnID] = useState("")
  // const [hymnName, setHymnName] = useState("")
  const [successRedirect, setSuccessRedirect] = useState()
  const [hymnMusicABC, setHymnMusicABC] = useState("")
  const [alertOpen, setAlertOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const {globalState, setGlobalState} = React.useContext(GlobalContext)
  const [categorySelected, setCategorySelected] = useState('')
  const [categoryList, setCategoryList] = useState([])
  const [errorMsg, setErrorMsg] = useState('Error')
  const theme = useTheme();
  const isNarrowScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleAlertClose = (e) => {
    setAlertOpen(false)
  }

  const openAlert = (success, errMsg = "Error") => {
    setErrorMsg(errMsg)
    setIsSuccess(success)
    setAlertOpen(true)
  }

  useEffect(() => {
    if (isLoggedOut(globalState)) {
      history.push('/login')
    }
  }, [globalState])
  useEffect(() => {
    const fetchHymn = async () => {
      const docRef = await db.collection('hymns').doc(id).get()
      const data = docRef.data()
      if (data === undefined) {
        history.push('/')
      } else if (!!data.musicABC) {
        setHymnMusicABC(data.musicABC)
        if (!!data.category) {
          setCategorySelected(data.category)
        }
        setHymnID(id)
        setMode("edit")
      }
    }
    const fetchCategory = async () => {
      const ref = await db.collection('hymnCategory').doc('categories').get()
      const data = ref.data().categoryMap
      let categoryArr = []
      for (let key of Object.keys(data)) {
        categoryArr.push({id: key, name: data[key].categoryName})
      }
      setCategoryList(categoryArr)
      if (id !== undefined || !!id) {
        await fetchHymn()
      } else {
        setMode("add")
        setHymnMusicABC("")
      }
      if (!!categorySelected && categorySelected !== '' && data[categorySelected] === undefined) {
        setCategorySelected('')
      }
    }
    fetchCategory()


  }, [id])

  const redirectToHymn = () => {
    if (!!successRedirect) {
      history.push("/hymn/" + successRedirect)
    }
  }
  const handleSubmit = (e) => {
    const submitData = async () => {
      let parsed = abcjs.renderAbc("*", hymnMusicABC)[0]
      let hymnTitle = ""
      if (!!parsed.metaText && !!parsed.metaText.title) {
        hymnTitle = parsed.metaText.title
      } else {
        throw 'Title not found'
      }
      let slug = slugify(hymnTitle, {strict: true})
      if (mode === "add") {
        if (categorySelected === '') {
          let newDocRef = db.collection('hymns').doc()
          slug = slug +"-"+ newDocRef.id.slice(-6)
          await newDocRef.set({musicABC: hymnMusicABC, category: '', hymnName: hymnTitle, slug: slug})
          return slug
        } else {
          const hymnDocRef = db.collection('hymns').doc()
          slug = slug +"-"+ hymnDocRef.id.slice(-6)
          await db.runTransaction(async (transaction) => {
            let categoryMapData = (await transaction.get(db.collection('hymnCategory').doc('categories'))).data().categoryMap
            if (categoryMapData[categorySelected] === undefined) {
              throw 'Category not exist'
            }
            transaction.set(hymnDocRef, {
              musicABC: hymnMusicABC,
              category: categorySelected,
              hymnName: hymnTitle,
              slug: slug
            })
            let tmpArr = categoryMapData[categorySelected].categoryContent
            tmpArr.push({hymnID: hymnDocRef.id, hymnName: hymnTitle, slug: slug})
            let updateMap = {}
            updateMap[`categoryMap.${categorySelected}.categoryContent`] = tmpArr
            transaction.update(db.collection('hymnCategory').doc('categories'), updateMap)
          })
          return slug
        }
      } else if (mode === "edit") {

        const hymnDocRef = db.collection('hymns').doc(hymnID)
        slug = slug+"-" + hymnDocRef.id.slice(-6)
        console.log(slug)
        await db.runTransaction(async (transaction) => {
          let categoryMapData = (await transaction.get(db.collection('hymnCategory').doc('categories'))).data().categoryMap
          let oldCategory = (await transaction.get(hymnDocRef)).data().category
          let updateMap = {}
          //update old category content
          if (oldCategory !== undefined && categoryMapData[oldCategory] !== undefined) {
            let oldCategoryHymns = categoryMapData[oldCategory].categoryContent
            for (let i = 0; i < oldCategoryHymns.length; i++) {
              if (oldCategoryHymns[i].hymnID === hymnID) {
                oldCategoryHymns.splice(i, 1)
                break
              }
            }
            updateMap[`categoryMap.${oldCategory}.categoryContent`] = oldCategoryHymns
          }
          //update new category content
          if (categorySelected !== "" && categoryMapData[categorySelected] === undefined) {
            throw 'New category no longer exist'
          } else if (categorySelected !== '') {
            let newCategoryHymns = categoryMapData[categorySelected].categoryContent
            newCategoryHymns.push({hymnID: hymnDocRef.id, hymnName: hymnTitle, slug: slug})
            updateMap[`categoryMap.${categorySelected}.categoryContent`] = newCategoryHymns
          }
          transaction.update(db.collection('hymnCategory').doc('categories'), updateMap)
          transaction.update(db.collection('hymns').doc(hymnID), {
            musicABC: hymnMusicABC,
            category: categorySelected,
            hymnName: hymnTitle,
            slug: slug
          })
        })
        return slug
      }
    }

    submitData().then((redirectSlug) => {
      setSuccessRedirect(redirectSlug)
      openAlert(true)
    }).catch((e) => {
      console.error(e)
      openAlert(false, e)
    })

  }

  const handleCategorySelectChange = (e) => {
    setCategorySelected(e.target.value)
  }
  return (
    <form autoComplete="off" noValidate>
      <Paper className={isNarrowScreen ? classes.formContainerMobile : classes.formContainer}>
        {
          mode === "loading" ? (
            <Typography>
              Loading
            </Typography>
          ) : (
            <React.Fragment>

              <TextField required id="hymnMusicABC" multiline variant="filled" label="Hymn Music ABC Notation" fullWidth
                         value={hymnMusicABC} onChange={(e) => {
                setHymnMusicABC(e.target.value)
              }}/>
              <FormControl required variant="filled" className={classes.selectControl}>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={categorySelected}
                  onChange={handleCategorySelectChange}
                  autoWidth
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {
                    categoryList.map((value) => {
                      return (
                        <MenuItem key={value.id} value={value.id}>{value.name}</MenuItem>
                      )
                    })
                  }
                </Select>
              </FormControl>
              <Button variant="contained" onClick={handleSubmit}>Submit</Button>
            </React.Fragment>
          )
        }
      </Paper>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
        {isSuccess === true ? (
          <Alert onClose={handleAlertClose} severity="success" action={(!!successRedirect) ? (
            <Button onClick={redirectToHymn}>View</Button>
          ) : null
          }>
            Successful
          </Alert>
        ) : (
          <Alert onClose={handleAlertClose} severity="error">
            {errorMsg}
          </Alert>
        )}
      </Snackbar>
    </form>
  )
}

export default EditAddHymnPage
