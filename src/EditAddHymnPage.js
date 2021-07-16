import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography
} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import {makeStyles} from "@material-ui/core/styles";
import React, {useEffect, useState} from "react";
import db from "./firebase.config";
import {useHistory, useParams} from "react-router-dom";
import {GlobalContext} from "./App";
import {isLoggedOut} from "./utils";
import abcjs from "abcjs";

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
  const [hymnMusicABC, setHymnMusicABC] = useState("")
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const {globalState, setGlobalState} = React.useContext(GlobalContext)
  const [categorySelected, setCategorySelected] = useState('')
  const [categoryList, setCategoryList] = useState([])
  const [oldCategory, setOldCategory] = useState('')

  const handleConfirmDialogClose = (e) => {
    setConfirmDialogOpen(false)
  }

  const openConfirmDialog = (e) => {
    setConfirmDialogOpen(true)
  }

  const handleAlertClose = (e) => {
    setAlertOpen(false)
  }

  const openAlert = (success) => {
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
        // setHymnName(data.name)
        setHymnMusicABC(data.musicABC.replaceAll("\\n", "\n"))
        if (!!data.category) {
          setOldCategory(data.category)
          setCategorySelected(data.category)
        }
        setMode("edit")
      }
    }
    if (id !== undefined || !!id) {
      setHymnID(id)
      fetchHymn()
    } else {
      setMode("add")
      // setHymnName("")
      setHymnMusicABC("")
    }

  }, [id])

  useEffect(() => {
    const fetchCategory = async () => {
      const ref = await db.collection('hymnCategory').doc('categories').get()
      const data = ref.data().categoryMap
      let categoryArr = []
      for (let key of Object.keys(data)) {
        categoryArr.push({id: key, name: data[key].categoryName})
      }
      setCategoryList(categoryArr)
    }
    fetchCategory()
  }, [])

  const handleSubmit = (e) => {
    const submitData = async () => {
      let err = false
      let parsed = abcjs.renderAbc("*", hymnMusicABC)[0]
      let hymnTitle = ""
      if (!!parsed.metaText && !!parsed.metaText.title) {
        hymnTitle = parsed.metaText.title
      } else {
        throw 'title not found'
      }

      if (mode === "add") {
        try {
          if (categorySelected === '') {
            await db.collection('hymns').add({musicABC: hymnMusicABC, category: ''})
          } else {
            const hymnDocRef = db.collection('hymns').doc()
            await db.runTransaction(async (transaction) => {
              let categoryMapData = (await transaction.get(db.collection('hymnCategory').doc('categories'))).data().categoryMap
              if (categoryMapData[categorySelected] === undefined) {
                throw 'category not exist'
              }
              transaction.set(hymnDocRef, {musicABC: hymnMusicABC, category: categorySelected})
              let tmpArr = categoryMapData[categorySelected].categoryContent
              tmpArr.push({hymnID: hymnDocRef.id, hymnName: hymnTitle})
              let updateMap = {}
              updateMap[`categoryMap.${categorySelected}.categoryContent`] = tmpArr
              transaction.update(db.collection('hymnCategory').doc('categories'), updateMap)
            })
          }
        } catch (e) {
          err = true
          console.error(e)
        }
      } else if (mode === "edit") {
        try {
          if (categorySelected === '' && oldCategory === '') {
            await db.collection('hymns').doc(id).update({musicABC: hymnMusicABC, category: ''})
            return
          }

          const hymnDocRef = db.collection('hymns').doc(id)
          await db.runTransaction(async (transaction) => {
            let categoryMapData = (await transaction.get(db.collection('hymnCategory').doc('categories'))).data().categoryMap
            let updateMap = {}
            //update old category content
            if (categoryMapData[oldCategory] !== undefined) {
              let oldCategoryHymns = categoryMapData[oldCategory].categoryContent
              for (let i = 0; i < oldCategoryHymns.length; i++) {
                if (oldCategoryHymns[i].hymnID === id) {
                  oldCategoryHymns.splice(i, 1)
                  break
                }
              }
              updateMap[`categoryMap.${oldCategory}.categoryContent`] = oldCategoryHymns
            }
            //update new category content
            if(categorySelected !== "" && categoryMapData[categorySelected] === undefined) {
              throw 'category not exist'
            }else if(categorySelected!==''){
              let newCategoryHymns = categoryMapData[categorySelected].categoryContent
              newCategoryHymns.push({hymnID: hymnDocRef.id, hymnName: hymnTitle})
              updateMap[`categoryMap.${categorySelected}.categoryContent`] = newCategoryHymns
            }
            transaction.update(db.collection('hymnCategory').doc('categories'), updateMap)
            transaction.update(db.collection('hymns').doc(id), {musicABC:hymnMusicABC, category:categorySelected})
          })
        } catch (e) {
          err = true
          console.error(e)
        }
      }
      if (err) {
        openAlert(false)
      } else {
        openAlert(true)
      }
    }

    submitData()

  }

  const confirmAndSubmit = (e) => {
    handleConfirmDialogClose()
    handleSubmit()
  }

  const handleCategorySelectChange = (e) => {
    setCategorySelected(e.target.value)
    console.log(e.target.value)
  }

  return (
    <form autoComplete="off" noValidate>
      <Paper className={classes.formContainer}>
        {
          mode === "loading" ? (
            <Typography>
              Loading
            </Typography>
          ) : (
            <React.Fragment>
              {/*<TextField id="hymnName" variant="filled" label="Hymn Name" value={hymnName} onChange={(e) => {*/}
              {/*  setHymnName(e.target.value)*/}
              {/*}}/>*/}
              <TextField id="hymnMusicABC" multiline variant="filled" label="Hymn Music ABC Notation" fullWidth
                         value={hymnMusicABC} onChange={(e) => {
                setHymnMusicABC(e.target.value)
              }}/>
              <FormControl variant="filled" className={classes.selectControl}>
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
              <Button variant="contained" onClick={openConfirmDialog}>Submit</Button>
            </React.Fragment>
          )
        }
      </Paper>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
        {isSuccess === true ? (
          <Alert onClose={handleAlertClose} severity="success">
            Successful
          </Alert>
        ) : (
          <Alert onClose={handleAlertClose} severity="error">
            Error
          </Alert>
        )}
      </Snackbar>
      <Dialog
        open={confirmDialogOpen}
        onClose={handleConfirmDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Submit</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Confirm to submit ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="primary">
            No
          </Button>
          <Button onClick={confirmAndSubmit} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  )
}

export default EditAddHymnPage
