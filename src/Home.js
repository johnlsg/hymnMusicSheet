import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import db from "./firebase.config";
import {List, ListItem, ListItemText, Paper} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import {Link} from "react-router-dom";

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
    zIndex:"3"
  },
  list:{
    maxWidth:"500px",
    width:"100%",
  }
}))

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
              <div>
                <ListItem button component={Link} divider={hymnList[index+1]!== undefined} to={"/hymn"}>
                  <ListItemText primary={item.name}/>
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
