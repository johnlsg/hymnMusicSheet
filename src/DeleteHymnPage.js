import React, {useEffect, useState} from "react";
import {useParams, useHistory} from "react-router-dom";
import db from "./firebase.config";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from "@material-ui/core";
import {AuthContext} from "./App";

const DeleteHymnPage = (props)=>{
  let { id } = useParams();
  const history = useHistory()
  const { globalState, setGlobalState } = React.useContext(AuthContext);
  useEffect(()=>{
    if(globalState.user===undefined){
      history.push('/')
    }
  },[])
  useEffect(()=>{
    const deleteData = async ()=>{
      try{
        const ref = await db.collection('hymns').doc(id).delete()
        setIsSuccess(true)
      }catch (e) {
        console.error(e)
        setIsSuccess(false)
      }
      openConfirmDialog()
    }
    if(globalState.user!==undefined){
      deleteData()
    }
  },[id])

  const redirectHome = ()=>{
    history.push('/')
  }

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const handleConfirmDialogClose = (e)=>{
    setConfirmDialogOpen(false)
    redirectHome()
  }

  const openConfirmDialog = (e)=>{
    setConfirmDialogOpen(true)
  }

  return (
    <div>
      <Dialog
        open={confirmDialogOpen}
        onClose={handleConfirmDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Hymn Deleted</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {
              isSuccess?(
                <Typography>
                  Hymn deleted successfully
                </Typography>
              ):(
                <Typography>
                  Error deleting hymn
                </Typography>
              )
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )

}

export default DeleteHymnPage
