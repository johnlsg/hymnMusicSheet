import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import db from "./firebase.config";
import {List, ListItem, ListItemSecondaryAction, ListItemText, Paper} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import {Link} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

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

const EditLinkBtn =React.forwardRef((props, ref) => (
    <IconButton edge="end" aria-label="edit" ref={ref} {...props}>
      <EditIcon />
    </IconButton>
))
const DeleteLinkBtn =React.forwardRef((props, ref) => (
  <IconButton edge="end" aria-label="delete" ref={ref} {...props}>
    <DeleteIcon />
  </IconButton>
))
function Home() {
  const classes = useStyles()
  const [hymnList, setHymnList] = useState([])
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
                <ListItem button component={Link} divider={hymnList[index+1]!== undefined} to={`/hymn/${item.id}`}>
                  <ListItemText primary={item.name}/>
                  <ListItemSecondaryAction>
                    <Link to={`/edit/${item.id}`} component={EditLinkBtn} />
                    <Link to={`/delete/${item.id}`} component={DeleteLinkBtn} />
                  </ListItemSecondaryAction>
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
