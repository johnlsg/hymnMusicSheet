import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {GlobalContext} from "./App";
import db from "./firebase.config";
import abcjs from "abcjs";
import Typography from "@material-ui/core/Typography";
import {List, ListItem, ListItemSecondaryAction, ListItemText, Paper} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  homeRoot: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  listContainer:{
    backgroundColor:"#f5f5f5",
    maxWidth:"800px",
    width:"100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding:"20px",
    marginTop:"30px"
  },
  list:{
    maxWidth:"500px",
    width:"100%",
  },
  titleContainer:{
    marginTop:"30px"
  }
}))

const ListCategoryPage = (props)=>{
  const classes = useStyles()
  const history = useHistory()
  const [hymnCategoryList, setHymnCategoryList] = useState([])
  const { globalState, setGlobalState } = React.useContext(GlobalContext);

  useEffect(() => {
    const fetchHymnCategory = async () => {
      let categoryMap = (await db.collection("hymnCategory").doc('categories').get()).data().categoryMap
      let tmpArr = []

      for(let key of Object.keys(categoryMap)) {
          tmpArr.push({
            categoryName:categoryMap[key].categoryName,
            id:key
          })
      }
      setHymnCategoryList(tmpArr)
    }
    fetchHymnCategory()
  }, [])
  return (
    <div className={classes.homeRoot}>
      <div className={classes.titleContainer}>
        <Typography variant={"h3"}>Hymn Categories</Typography>
      </div>
      <Paper className={classes.listContainer}>
        <List className={classes.list}>
          {hymnCategoryList.map((item,index) => (
              <div key={item.id}>
                <ListItem button divider={hymnCategoryList[index+1]!== undefined} onClick={()=>{history.push(`/category/${item.id}`)}}>
                  <ListItemText primary={item.categoryName}/>
                  {
                    globalState.user!==undefined?(
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="edit" onClick={()=>{history.push(`/editCategory/${item.id}`)}}>
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={()=>{history.push(`/deleteCategory/${item.id}`)}}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    ):null
                  }
                </ListItem>
              </div>
            )
          )}
        </List>
      </Paper>
    </div>
  )
}

export default ListCategoryPage
