import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import db from "./firebase.config";
import {List, ListItem, ListItemSecondaryAction, ListItemText, Paper} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {GlobalContext} from "./App";
import abcjs from "abcjs";
import {isLoggedIn} from "./utils";

const useStyles = makeStyles((theme) => ({
  homeRoot: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  listContainer: {
    backgroundColor: "#f5f5f5",
    maxWidth: "800px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    alignItems: "center",
    padding: "20px",
    marginTop: "30px"
  },
  list: {
    maxWidth: "500px",
    width: "100%",
  },
  titleContainer: {
    marginTop: "30px"
  },
  title: {
    textAlign: "center",
    fontFamily: "Source Serif Pro"
  }
}))


function ListHymnPage(props) {
  const classes = useStyles()
  const history = useHistory()
  const [hymnList, setHymnList] = useState([])
  const [categoryName, setCategoryName] = useState()
  const [loading, setLoading] = useState(true)
  const {globalState, setGlobalState} = React.useContext(GlobalContext);
  const {filterCategory} = props

  useEffect(() => {
    const fetchHymns = async () => {
      let querySnapshot
      let tmpArr = []
      // filterCategory is the slug of the category
      if (!!filterCategory) {
        let categoryMap = (await db.collection("hymnCategory").doc('categories').get()).data().categoryMap
        let found = false
        let foundID = ""
        for (let categoryID of Object.keys(categoryMap)){
          if(categoryMap[categoryID].categorySlug === filterCategory){
            found = true
            foundID = categoryID
            break
          }
        }
        if (categoryMap[foundID] === undefined) {
          history.push('/')
        } else {
          setCategoryName(categoryMap[foundID].categoryName)
        }
        categoryMap[foundID].categoryContent.forEach((hymn) => {
          tmpArr.push({
            id:hymn.hymnID,
            name: hymn.hymnName,
            slug:hymn.slug
          })
        })
      } else {
        querySnapshot = await db.collection("hymns").get()
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          tmpArr.push({
            id:doc.id,
            name: data.hymnName,
            slug:data.slug
          })
        })
      }
      tmpArr.sort((a,b)=>{
        if(a.name > b.name){
          return 1
        }else{
          return -1
        }
      })
      setHymnList(tmpArr)
      setLoading(false)
    }
    fetchHymns()
  }, [filterCategory])
  return (
    <div className={classes.homeRoot}>
      {loading ? ("Loading") : (
        <React.Fragment>
          <div className={classes.titleContainer}>
            <Typography variant={"h5"} className={classes.title}>{(!!categoryName) ? categoryName : ""}</Typography>
          </div>
          <Paper className={classes.listContainer}>
            <List className={classes.list}>
              {hymnList.length === 0 ? "It is empty here" : null}
              {hymnList.map((item, index) => (
                  <div key={item.slug}>
                    <ListItem button divider={hymnList[index + 1] !== undefined} onClick={() => {
                      history.push(`/hymn/${item.slug}`)
                    }}>
                      <ListItemText primary={item.name}/>
                      {
                        isLoggedIn(globalState) ? (
                          <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="edit" onClick={() => {
                              history.push(`/edit/${item.id}`)
                            }}>
                              <EditIcon/>
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => {
                              history.push(`/delete/${item.id}`)
                            }}>
                              <DeleteIcon/>
                            </IconButton>
                          </ListItemSecondaryAction>
                        ) : null
                      }
                    </ListItem>
                  </div>
                )
              )}
            </List>
          </Paper>
        </React.Fragment>
      )}
    </div>
  )
}

export default ListHymnPage
