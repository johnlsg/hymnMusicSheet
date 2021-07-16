import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import db from "./firebase.config";
import {List, ListItem, ListItemSecondaryAction, ListItemText, Paper} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import {Link, useHistory} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {GlobalContext} from "./App";
import abcjs from "abcjs";

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


function ListHymnPage(props) {
  const classes = useStyles()
  const history = useHistory()
  const [hymnList, setHymnList] = useState([])
  const [categoryName, setCategoryName] = useState()
  const { globalState, setGlobalState } = React.useContext(GlobalContext);
  const {filterCategory} = props

  useEffect(() => {
    const fetchHymns = async () => {
      let querySnapshot
      if(!!filterCategory){
        querySnapshot = await db.collection('hymns').where("category","==",filterCategory).get()
        let categoryMap = (await db.collection("hymnCategory").doc('categories').get()).data().categoryMap
        setCategoryName(categoryMap[filterCategory].categoryName)
      }else{
        querySnapshot = await db.collection("hymns").get()
      }
      let tmpArr = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        const parsed = abcjs.renderAbc("*", data.musicABC);
        if(!!parsed && !!parsed[0]){
          tmpArr.push({
            musicABC:data.musicABC,
            id:doc.id,
            name:!!parsed[0].metaText&&!!parsed[0].metaText.title?parsed[0].metaText.title:doc.id
          })
        }
      })
      setHymnList(tmpArr)
    }
    fetchHymns()
  }, [])
  return (
    <div className={classes.homeRoot}>
        <div className={classes.titleContainer}>
          <Typography variant={"h3"}>{(!!categoryName)?`Category - ${categoryName}`:"Hymn List"}</Typography>
        </div>
        <Paper className={classes.listContainer}>
          <List className={classes.list}>
            {hymnList.map((item,index) => (
              <div key={item.id}>
                <ListItem button divider={hymnList[index+1]!== undefined} onClick={()=>{history.push(`/hymn/${item.id}`)}}>
                  <ListItemText primary={item.name}/>
                  {
                    globalState.user!==undefined?(
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="edit" onClick={()=>{history.push(`/edit/${item.id}`)}}>
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={()=>{history.push(`/delete/${item.id}`)}}>
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

export default ListHymnPage
