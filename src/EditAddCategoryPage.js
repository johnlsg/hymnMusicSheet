import {makeStyles, useTheme} from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {GlobalContext} from "./App";
import db from "./firebase.config";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Snackbar,
  TextField,
  Typography, useMediaQuery
} from "@material-ui/core";
import {generateID, isLoggedOut} from "./utils";


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
  formContainerMobile:{
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    gap: "50px",
    alignItems: "flex-start"
  }
}))

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const EditAddCategoryPage = (props) => {
  let {id} = useParams();
  const classes = useStyles()
  const history = useHistory()
  const [mode, setMode] = useState("loading")
  const [hymnCategoryName, setHymnCategoryName] = useState("")
  const [alertOpen, setAlertOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const {globalState, setGlobalState} = React.useContext(GlobalContext);
  const theme = useTheme();
  const isNarrowScreen = useMediaQuery(theme.breakpoints.down('sm'));
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
    const fetchHymnCategory = async () => {
      const docRef = await db.collection('hymnCategory').doc('categories').get()
      let data = docRef.data()
      data = data.categoryMap
      if(data[id] !== undefined){
        data = data[id]
        setHymnCategoryName(data.categoryName)
        console.log("dsdssds")
        console.log(data)
      }else{
        history.push('/error')
      }
      setMode("edit")
    }
    if (id !== undefined || !!id) {
      fetchHymnCategory()
    } else {
      setMode("add")
      setHymnCategoryName("")
    }

  }, [id])

  const handleSubmit = (e) => {
    const submitData = async () => {
      let err = false
      let transaction_ref = db.batch()
      if (mode === "add") {
        try {
          const ref = db.collection('hymnCategory').doc('categories')
          let tmpMap = {}
          const newID = generateID()
          tmpMap[`categoryMap.${newID}.categoryName`] = hymnCategoryName
          tmpMap[`categoryMap.${newID}.categoryContent`] = []
          transaction_ref.update(ref, tmpMap)
          await transaction_ref.commit(tmpMap)
        } catch (e) {
          err = true
          console.error(e)
        }
      } else if (mode === "edit") {
        try {
          const ref = db.collection('hymnCategory').doc('categories')
          let tmpMap = {}
          tmpMap[`categoryMap.${id}.categoryName`] = hymnCategoryName
          transaction_ref.update(ref, tmpMap)
          await transaction_ref.commit(tmpMap)
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


  return (
    <form autoComplete="off" noValidate>
      <Paper className={isNarrowScreen?classes.formContainerMobile:classes.formContainer}>
        {
          mode === "loading" ? (
            <Typography>
              Loading
            </Typography>
          ) : (
            <React.Fragment>
              <TextField id="hymnCategoryName" variant="filled" label="Hymn Category Name"
                         value={hymnCategoryName} onChange={(e) => {
                setHymnCategoryName(e.target.value)
              }}/>
              <Button variant="contained" onClick={handleSubmit}>Submit</Button>
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

    </form>
  )
}

export default EditAddCategoryPage
