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
          //console.log(user + " has logged in")
          setGlobalState({
            user:user
          })
        } else {
          // User is signed out.
          setGlobalState({
            user: "logged out"
          })
        }
      }, function (error) {
        console.error(error);
      });

      let ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#firebaseui-auth-container', {
        signInOptions: [{

          provider:firebase.auth.EmailAuthProvider.PROVIDER_ID,
          disableSignUp: {
            status: true,
            adminEmail: "esmondelwc@gmail.com",
            helpLink: "Registration for normal user is disabled and not required, it is used for administration purpose only"
          }

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
