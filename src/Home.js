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
import {AuthContext} from "./App";

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
  }
}))


function Home() {
  const classes = useStyles()
  const history = useHistory()
  const [hymnList, setHymnList] = useState([])
  const { globalState, setGlobalState } = React.useContext(AuthContext);

  useEffect(() => {
    const fetchHymns = async () => {
      let querySnapchot = await db.collection("hymns").orderBy('name').limit(25).get()
      let tmpArr = []
      querySnapchot.forEach((doc) => {
        tmpArr.push({...doc.data(), id:doc.id})
      })
      setHymnList(tmpArr)
    }
    fetchHymns()
  }, [])
  return (
    <div className={classes.homeRoot}>
        <div>
          <Typography variant={"h3"}>Hymn List</Typography>
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

export default Home
