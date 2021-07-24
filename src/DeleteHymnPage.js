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
import {GlobalContext} from "./App";
import {isLoggedIn, isLoggedOut} from "./utils";

const DeleteHymnPage = (props)=>{
  let { id } = useParams();
  const history = useHistory()
  const { globalState, setGlobalState } = React.useContext(GlobalContext);
  useEffect(() => {
    if (isLoggedOut(globalState)) {
      history.push('/login')
    }
  }, [globalState])


  const doDelete = ()=>{
    const deleteData = async ()=>{
      try{
        await db.runTransaction(async (transaction)=>{
          let categoryID = (await transaction.get(db.collection('hymns').doc(id))).data().category
          let categoryMapData = (await transaction.get(db.collection('hymnCategory').doc('categories'))).data().categoryMap
          let updateMap = {}

          //update old category content
          if (categoryMapData[categoryID] !== undefined) {
            let oldCategoryHymns = categoryMapData[categoryID].categoryContent
            for (let i = 0; i < oldCategoryHymns.length; i++) {
              if (oldCategoryHymns[i].hymnID === id) {
                oldCategoryHymns.splice(i, 1)
                break
              }
            }
            updateMap[`categoryMap.${categoryID}.categoryContent`] = oldCategoryHymns
          }
          transaction.update(db.collection('hymnCategory').doc('categories'), updateMap)
          transaction.delete(db.collection('hymns').doc(id))
        })
        setIsSuccess(true)
      }catch (e) {
        console.error(e)
        setIsSuccess(false)
      }
      openNotifyDialog()
    }

    if (isLoggedIn(globalState)) {
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
        <DialogTitle id="alert-dialog-title">Hymn Deletion</DialogTitle>
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

export default DeleteHymnPage
