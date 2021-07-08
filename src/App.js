import './App.css';
import {Link, Route, Switch, useHistory} from "react-router-dom";
import Home from "./Home";
import {Button, Drawer, IconButton, ListItem} from "@material-ui/core";
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import React, {useEffect, useState} from "react";
import HymnPage from "./HymnPage";
import AddHymnPage from "./AddHymnPage";
import DeleteHymnPage from "./DeleteHymnPage";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItemText from '@material-ui/core/ListItemText';
import AuthPage from "./AuthPage";
import firebase from "firebase";
import * as firebaseui from "firebaseui";

const useStyles = makeStyles((theme) => ({
    appBar: {
      display: "flex"
    }, appBarDiv: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      //...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    drawerContainer: {
      minWidth: "300px"
    }
  })
)

function ListItemLink(props) {
  return <ListItem button component={Link} {...props} />;
}

export const AuthContext = React.createContext({});


function App() {
  const classes = useStyles()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [globalState, setGlobalState] = useState({
    user:undefined
  })
  const openDrawer = () => {
    setDrawerOpen(true)
  }


  const closeDrawer = () => {
    setDrawerOpen(false)
  }

  const history = useHistory()
  const handleLoginBtn = () => {
    history.push('/login')
  }
  const handleLogoutBtn = ()=>{
    firebase.auth().signOut()
    setGlobalState({user:undefined})
  }

  const isLoggedIn = ()=>{
    return globalState.user !== undefined
  }

  useEffect(() => {
      const unregisterAuthStateListener = firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          console.log("logged in")
          console.log(user)
          setGlobalState({
            user:user
          })
        } else {
          // User is signed out.
          setGlobalState({
            user:undefined
          })
          console.log("logged out")
        }
      }, function (error) {
        console.log(error);
      });
      return ()=>{unregisterAuthStateListener()}
    }, []
  )

  return (
    <div>
      <AuthContext.Provider value={{globalState: globalState, setGlobalState: setGlobalState}}>

        <div className={classes.appBarDiv}>
          <AppBar position={"static"} className={classes.appBar}>
            <Toolbar>

              <IconButton edge="start" color="inherit" aria-label="menu" onClick={openDrawer}>
                <MenuIcon/>
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Hymn Music Sheet
              </Typography>
              {isLoggedIn()?(
                <Button color="inherit" onClick={handleLogoutBtn}>Sign Out</Button>
              ):(
                <Button color="inherit" onClick={handleLoginBtn}>Sign In</Button>
              )}
            </Toolbar>
          </AppBar>
        </div>
        <Drawer anchor={"left"} open={drawerOpen} onClose={closeDrawer}>
          <div className={classes.drawerContainer}>
            <div className={classes.drawerHeader}>
              <IconButton onClick={closeDrawer}>
                <ChevronLeftIcon/>
              </IconButton>
            </div>
            <Divider/>
            <List>
              <ListItemLink to="/">
                <ListItemText primary="Home"/>
              </ListItemLink>
              {
                isLoggedIn()?(
                  <ListItemLink to="/add">
                    <ListItemText primary="Add Hymn"/>
                  </ListItemLink>
                ):null
              }
            </List>
          </div>
        </Drawer>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/hymn/:id">
            <HymnPage/>
          </Route>
          <Route path="/add">
            <AddHymnPage/>
          </Route>
          <Route path="/edit/:id">
            <AddHymnPage/>
          </Route>
          <Route path="/delete/:id">
            <DeleteHymnPage/>
          </Route>
          <Route path="/login">
            <AuthPage/>
          </Route>
          <Route path="/">
            <Home/>
          </Route>
        </Switch>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
