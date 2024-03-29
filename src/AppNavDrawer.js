import {Drawer, IconButton, ListItem} from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {GlobalContext} from "./App";
import db from "./firebase.config";

function ListItemLink(props) {
  return <ListItem button component={Link} {...props} />;
}

const useStyles = makeStyles((theme) => ({

  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    //...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  drawerPaper:{
    maxWidth:"75%"
  },
  drawerContainer: {
    // minWidth: "300px",
  }
}))

const AppNavDrawer = (props)=>{
  const classes = useStyles()
  const {drawerOpen, closeDrawer, isLoggedIn} = props
  const [hymnCategoryList, setHymnCategoryList] = useState([])
  const {globalState, setGlobalState} = React.useContext(GlobalContext);

  useEffect(() => {
    let unsub
    const fetchHymnCategory = async () => {
      unsub = db.collection("hymnCategory").doc('categories').onSnapshot((doc)=> {
        let categoryMap = doc.data().categoryMap
        let tmpArr = []
        for (let key of Object.keys(categoryMap)) {
          tmpArr.push({
            categoryName: categoryMap[key].categoryName,
            categorySlug:categoryMap[key].categorySlug,
            id: key
          })
        }
        tmpArr.sort((a,b)=>{
          if(a.categoryName > b.categoryName){
            return 1
          }else{
            return -1
          }
        })
        setHymnCategoryList(tmpArr)
      })
    }
    fetchHymnCategory()
    return ()=>{
      if(unsub!==undefined){
        unsub()
      }
    }

  }, [])

  return (
    <Drawer anchor={"left"} open={drawerOpen} onClose={closeDrawer} classes={{paper:classes.drawerPaper}}>
      <div className={classes.drawerContainer}>
        <div className={classes.drawerHeader}>
          <IconButton onClick={closeDrawer}>
            <ChevronLeftIcon/>
          </IconButton>
        </div>
        <Divider/>
        <List>
          <ListItemLink to="/" onClick={closeDrawer}>
            <ListItemText primary="Home"/>
          </ListItemLink>
          <ListItemLink to="/search" onClick={closeDrawer}>
            <ListItemText primary="Search"/>
          </ListItemLink>
          {
            isLoggedIn(globalState) ? (
              <React.Fragment>
                <Divider/>
                <ListItemLink to="/add" onClick={closeDrawer}>
                  <ListItemText primary="Add Hymn"/>
                </ListItemLink>
                <ListItemLink to="/addCategory" onClick={closeDrawer}>
                  <ListItemText primary="Add Category"/>
                </ListItemLink>
              </React.Fragment>
            ):null
          }
          {hymnCategoryList.length>0?(<Divider/>):null}
          {hymnCategoryList.length>0?(hymnCategoryList.map((category)=>{
            return(
              <ListItemLink key={category.id} to={`/category/${category.categorySlug}`} onClick={closeDrawer}>
                <ListItemText primary={category.categoryName}/>
              </ListItemLink>
              )
          })):null}
        </List>
      </div>
    </Drawer>
  )
}

export default AppNavDrawer
