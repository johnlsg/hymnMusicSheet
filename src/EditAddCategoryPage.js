import {makeStyles} from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {AuthContext} from "./App";
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
  Typography
} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";


const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    margin: "50px",
    padding: "30px",
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
  const [hymnCategory, setHymnCategory] = useState("")
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const {globalState, setGlobalState} = React.useContext(AuthContext);
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
    if (globalState.user === undefined) {
      history.push('/')
    }
  }, [])

  useEffect(() => {
    const fetchHymn = async () => {
      const docRef = await db.collection('hymnCategory').doc(id).get()
      const data = docRef.data()
      if (!!data.categoryName) {
        setHymnCategory(data.categoryName)
        setMode("edit")
      }
    }
    if (id !== undefined || !!id) {
      fetchHymn()
    } else {
      setMode("add")
      setHymnCategory("")
    }

  }, [id])

  const handleSubmit = (e) => {
    const submitData = async () => {
      let err = false
      if (mode === "add") {
        try {
          const ref = await db.collection('hymnCategory').add({categoryName: hymnCategory})
        } catch (e) {
          err = true
          console.error(e)
        }
      } else if (mode === "edit") {
        try {
          const ref = await db.collection('hymnCategory').doc(id)
          await ref.update({
            categoryName: hymnCategory
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
              <TextField id="hymnCategoryName" variant="filled" label="Hymn Category Name"
                         value={hymnCategory} onChange={(e) => {
                setHymnCategory(e.target.value)
              }}/>
              <Autocomplete
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="filled"
                    label="test"
                    placeholder="Favorites"
                  />
                )}
                options={['abc','def']}
              />
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

export default EditAddCategoryPage
