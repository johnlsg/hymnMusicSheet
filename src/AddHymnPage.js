import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper, Snackbar,
  TextField, Typography
} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import {makeStyles} from "@material-ui/core/styles";
import {useEffect, useState} from "react";
import db from "./firebase.config";
import {
  useParams
} from "react-router-dom";
import React,{Fragment} from "react";

const useStyles = makeStyles((theme)=>({
  formContainer:{
    display:"flex",
    flexDirection:"column",
    margin:"50px",
    padding:"30px",
    backgroundColor:"#f5f5f5",
    gap:"50px",
    alignItems:"flex-start"
  }
}))

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AddHymnPage = (props)=>{
  let { id } = useParams();
  const classes = useStyles()
  const [mode, setMode] = useState("loading")
  const [hymnID, setHymnID] = useState("")
  const [hymnName, setHymnName] = useState("")
  const [hymnMusicABC, setHymnMusicABC] = useState("")
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleConfirmDialogClose = (e)=>{
    setConfirmDialogOpen(false)
  }

  const openConfirmDialog = (e)=>{
    setConfirmDialogOpen(true)
  }

  const handleAlertClose = (e)=>{
    setAlertOpen(false)
  }

  const openAlert = (success)=>{
    setIsSuccess(success)
    setAlertOpen(true)
  }


  useEffect(()=>{
    const fetchHymn = async ()=>{
      const docRef = await db.collection('hymns').doc(id).get()
      const data = docRef.data()
      if(!!data.name && !!data.musicABC){
        setHymnName(data.name)
        setHymnMusicABC(data.musicABC.replaceAll("\\n","\n"))
        setMode("edit")
      }
    }
    if(id!==undefined || !!id){
      setHymnID(id)
      fetchHymn()
    }else{
      setMode("add")
    }

  },[])

  const handleSubmit = (e)=>{
    const submitData = async ()=>{
      if(mode==="add"){
        try{
          const ref = await db.collection('hymns').add({name:hymnName, musicABC:hymnMusicABC})
        }catch (e) {
          console.error(e)
          openAlert(false)
        }
      }else if(mode==="edit"){
        try{
          const ref = await db.collection('hymns').doc(hymnID)
          ref.update({
            name:hymnName,
            musicABC:hymnMusicABC
          })
        }catch (e) {
          console.error(e)
          openAlert(false)
        }
      }
      openAlert(true)
    }
    submitData()
  }

  const confirmAndSubmit = (e)=>{
    handleConfirmDialogClose()
    handleSubmit()
  }

  return (
    <form autoComplete="off" noValidate>
      <Paper className={classes.formContainer}>
        {
          mode==="loading"?(
            <Typography>
              Loading
            </Typography>
            ):(
            <React.Fragment>
              <TextField id="hymnName" variant="filled" label="Hymn Name" value={hymnName} onChange={(e)=>{setHymnName(e.target.value)}}/>
              <TextField id="hymnMusicABC" multiline variant="filled" label="Hymn Music ABC" fullWidth  value={hymnMusicABC} onChange={(e)=>{setHymnMusicABC(e.target.value)}}/>
              <Button variant="contained" onClick={openConfirmDialog}>Submit</Button>
            </React.Fragment>
          )
        }
      </Paper>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
        {isSuccess?(
          <Alert onClose={handleAlertClose} severity="success">
            Successful
          </Alert>
        ):(
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
            Confirm to add the hymn ?
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

export default AddHymnPage
