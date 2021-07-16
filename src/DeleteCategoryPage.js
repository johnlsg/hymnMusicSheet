import {useHistory, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {GlobalContext} from "./App";
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
import {isLoggedIn, isLoggedOut} from "./utils";
import firebase from "firebase";

const DeleteCategoryPage = (props)=>{
  let { id } = useParams();
  const history = useHistory()
  const { globalState, setGlobalState } = React.useContext(GlobalContext);
  useEffect(()=>{
    if(isLoggedOut(globalState)){
      history.push('/login')
    }
  },[])


  const doDelete = ()=>{
    const deleteData = async ()=>{
      try{
        await db.runTransaction(async (transaction)=>{
          let categoryMapData = (await transaction.get(db.collection('hymnCategory').doc('categories'))).data().categoryMap
          let updateMap = {}

          if (categoryMapData[id] !== undefined) {
            updateMap[`categoryMap.${id}`] = firebase.firestore.FieldValue.delete()
          }
          transaction.update(db.collection('hymnCategory').doc('categories'), updateMap)
        })
        setIsSuccess(true)
      }catch (e) {
        console.error(e)
        setIsSuccess(false)
      }
      openNotifyDialog()
    }
    if(isLoggedIn(globalState)){
      deleteData()
    }
  }

  const redirectHome = ()=>{
    history.push('/')
  }

  const [notifyDialogOpen, setNotifyDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const handleNotifyDialogClose = (e)=>{
    setNotifyDialogOpen(false)
    redirectHome()
  }

  const openNotifyDialog = (e)=>{
    setNotifyDialogOpen(true)
  }

  const handleConfirmDialogClose = (e)=>{
    setConfirmDialogOpen(false)
    redirectHome()
  }

  return (
    <div>
      <Dialog
        open={notifyDialogOpen}
        onClose={handleNotifyDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Category Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {
              isSuccess?(
                <Typography>
                  Category deleted successfully
                </Typography>
              ):(
                <Typography>
                  Error deleting category
                </Typography>
              )
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNotifyDialogClose} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDialogOpen}
        onClose={handleConfirmDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Confirm to delete ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={redirectHome} color="primary">
            No
          </Button>
          <Button onClick={doDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default DeleteCategoryPage
