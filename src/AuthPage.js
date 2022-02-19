import React, {useEffect} from "react";
import firebase from "firebase";
import * as firebaseui from "firebaseui";
import {makeStyles} from "@material-ui/core/styles";
import 'firebaseui/dist/firebaseui.css'
import {GlobalContext} from "./App";

const useStyles = makeStyles((theme) => ({
  authContainerRoot: {
    marginTop: "30px"
  }
}))

const AuthPage = (props) => {
  const { globalState, setGlobalState } = React.useContext(GlobalContext);
  const classes = useStyles()
  useEffect(() => {
      const unregisterAuthStateListener = firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          setGlobalState({
            user:user
          })
        } else {
          // User is signed out.
          setGlobalState({
            user:undefined
          })
        }
      }, function (error) {
        console.error(error);
      });

      let ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#firebaseui-auth-container', {
        signInOptions: [{

          provider:firebase.auth.EmailAuthProvider.PROVIDER_ID,
          disableSignUp: {status: true, adminEmail: "esmondelwc@gmail.com", helpLink: "New user registration is disabled"}

        }],
        signInSuccessUrl: "/",
      });
      return ()=>{unregisterAuthStateListener()}
    }, []
  )
  return (
    <div id="firebaseui-auth-container" className={classes.authContainerRoot}>

    </div>
  )
}

export default AuthPage
