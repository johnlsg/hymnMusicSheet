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
import "@fontsource/source-serif-pro";
import DBMigration from "./DBMigration";

const useStyles = makeStyles((theme) => ({
    appBar: {
      display: "flex"
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      cursor: "pointer"
    },
    spacer: {
      flexGrow: 1,
    },
    footer: {
      width: "100%",
      textAlign: "center",
      backgroundColor: "#C5CAE9",
      paddingTop: "15px",
      paddingBottom: "15px"
    },
    contentFooterContainer: {
      display: "flex",
      flexDirection: "column",
      height: "100%"
    },
    contentContainer:{
      flexGrow:1
    },

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
    firebase.auth().signOut()
    setGlobalState({...globalState, user: undefined})
  }


  useEffect(() => {
      const unregisterAuthStateListener = firebase.auth().onAuthStateChanged(function (user) {
        if (!!user) {
          setGlobalState({
            ...globalState,
            user: user
          })
        } else {
          // User is signed out.
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

      firebase.analytics().logEvent('page_load')
    }, []
  )

  return (
    <React.Fragment>
      <Provider store={store}>
        <GlobalContext.Provider value={{globalState: globalState, setGlobalState: setGlobalState}}>

          <div className={classes.contentFooterContainer}>
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
            <AppNavDrawer drawerOpen={drawerOpen} closeDrawer={closeDrawer} isLoggedIn={isLoggedIn}/>

            <div className={classes.contentContainer}>

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
                <Route path="/version">
                  Release 1015 15Jan22
                </Route>
                <Route path="/migrate">
                  <DBMigration/>
                </Route>
                <Route path="/">
                  <ListCategoryPage/>
                </Route>
              </Switch>
            </div>
            <div className={classes.footer}>
              <Typography>
                © 2021-2022 Hymn Sheet Music. All rights reserved.
              </Typography>
            </div>
          </div>
        </GlobalContext.Provider>
      </Provider>
    </React.Fragment>
  );
}

export default App;
