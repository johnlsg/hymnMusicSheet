import './App.css';
import {Route, Switch, useHistory} from "react-router-dom";
import {Button, IconButton} from "@material-ui/core";
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import React, {useEffect, useState} from "react";
import ViewHymnPage from "./ViewHymnPage";
import EditAddHymnPage from "./EditAddHymnPage";
import DeleteHymnPage from "./DeleteHymnPage";
import AuthPage from "./AuthPage";
import firebase from "firebase";
import EditAddCategoryPage from "./EditAddCategoryPage";
import AppNavDrawer from "./AppNavDrawer";
import ListCategoryPage from "./ListCategoryPage";
import DeleteCategoryPage from "./DeleteCategoryPage";
import {isLoggedIn} from "./utils";
import ViewCategoryPage from "./ViewCategoryPage";
import {Provider} from "react-redux";
import store from "./store";
import ListHymnPage from "./ListHymnPage";

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
      cursor: "pointer"
    },
    spacer: {
      flexGrow: 1,
    }

  })
)


const initialGlobalState = {user: "loading", categoryMap: "loading"}
export const GlobalContext = React.createContext(initialGlobalState);


function App() {
  const classes = useStyles()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [globalState, setGlobalState] = useState(initialGlobalState)
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
  const handleLogoutBtn = () => {
    console.log('log out clicked')
    firebase.auth().signOut()
    setGlobalState({...globalState, user: undefined})
  }


  useEffect(() => {
      console.log('register auth listen')
      const unregisterAuthStateListener = firebase.auth().onAuthStateChanged(function (user) {
        // console.log(user)
        if (!!user) {
          console.log("logged in")
          setGlobalState({
            ...globalState,
            user: user
          })
        } else {
          // User is signed out.
          console.log("logged out")
          setGlobalState({
            ...globalState,
            user: "logged out"
          })
        }
      }, function (error) {
        console.error(error);
      });
      // return ()=>{
      //   console.log('unregister')
      //   unregisterAuthStateListener()
      // }
    }, []
  )

  return (
    <div>
      <Provider store={store}>
        <GlobalContext.Provider value={{globalState: globalState, setGlobalState: setGlobalState}}>

          <div className={classes.appBarDiv}>
            <AppBar position={"static"} className={classes.appBar}>
              <Toolbar>

                <IconButton edge="start" color="inherit" aria-label="menu" onClick={openDrawer}>
                  <MenuIcon/>
                </IconButton>
                <Typography variant="h6" className={classes.title} onClick={() => {
                  history.push('/')
                }}>
                  Hymn Music Sheet
                </Typography>
                <div className={classes.spacer}></div>
                {isLoggedIn(globalState) ? (
                  <Button color="inherit" onClick={handleLogoutBtn}>Sign Out</Button>
                ) : (
                  <Button color="inherit" onClick={handleLoginBtn}>Sign In</Button>
                )}
              </Toolbar>
            </AppBar>
          </div>
          <AppNavDrawer drawerOpen={drawerOpen} closeDrawer={closeDrawer} isLoggedIn={isLoggedIn}/>
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/hymn/:id">
              <ViewHymnPage/>
            </Route>
            <Route path="/hymns">
              <ListHymnPage/>
            </Route>
            <Route path="/add">
              <EditAddHymnPage/>
            </Route>
            <Route path="/category/:id">
              <ViewCategoryPage/>
            </Route>
            <Route path="/categories">
              <ListCategoryPage/>
            </Route>
            <Route path="/addCategory">
              <EditAddCategoryPage/>
            </Route>
            <Route path="/editCategory/:id">
              <EditAddCategoryPage/>
            </Route>
            <Route path="/deleteCategory/:id">
              <DeleteCategoryPage/>
            </Route>
            <Route path="/edit/:id">
              <EditAddHymnPage/>
            </Route>
            <Route path="/delete/:id">
              <DeleteHymnPage/>
            </Route>
            <Route path="/login">
              <AuthPage/>
            </Route>
            <Route path="/">
              <ListCategoryPage/>
            </Route>
          </Switch>
        </GlobalContext.Provider>
      </Provider>
    </div>
  );
}

export default App;
