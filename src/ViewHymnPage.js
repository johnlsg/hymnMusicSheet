import {makeStyles, useTheme} from "@material-ui/core/styles";
import abcjs from "abcjs";
import React, {useEffect, useState} from "react";
import db from "./firebase.config"
import {useHistory, useParams} from "react-router-dom";
import 'abcjs/abcjs-audio.css';
import {Button, useMediaQuery} from "@material-ui/core";
import {isLoggedIn} from "./utils";
import {GlobalContext} from "./App";

const useStyles = makeStyles((theme) => ({
    hymnPageRoot: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: "50px",
      overflow: "auto",
    },
    playerContainer: {
      minWidth: "70%"
    },
    sheetContainerWideScreen: {
      maxWidth: "70%"
    },
    sheetContainerNarrowScreen: {
      maxWidth:"95%"
    },
    editDiv:{
      display:"flex",
      width:"70%",
      flexDirection:"row-reverse",
      marginBottom:"25px"
    }
  })
)

const ViewHymnPage = () => {
  const classes = useStyles()
  let {id: paramSlug} = useParams();
  const [hymn, setHymn] = useState()
  const history = useHistory()
  const { globalState, setGlobalState } = React.useContext(GlobalContext);
  const theme = useTheme();
  const isNarrowScreen = useMediaQuery(theme.breakpoints.down('sm'));
  useEffect(() => {
    const fetchHymn = async () => {
      let querySnapshot = await db.collection("hymns").where("slug","==",paramSlug).get()
      let data
      if(querySnapshot.size>1){
        throw "duplicate slug"
      }else if(querySnapshot.empty){
        throw 'Hymn not found'
      }
      querySnapshot.forEach((doc)=>{
        data = {...doc.data(), id:doc.id}
      })
      if(data===undefined){
        throw 'Hymn not found'
      }
      setHymn({
        id:data.id,
        name: data.hymnName,
        musicABC: data.musicABC
      })
      document.title = data.hymnName
    }
    fetchHymn().catch((e)=>{
      console.error(e)
      console.error(paramSlug)
      history.push('/')
    })
  }, [paramSlug])

  useEffect(() => {
    if (hymn !== undefined) {
      let visualObj = abcjs.renderAbc("musicSheet", hymn.musicABC, {responsive: "resize"});
      //player control
      const synthControl = new abcjs.synth.SynthController();
      let cursorControl = {}
      synthControl.load("#player",
        cursorControl,
        {
          // displayLoop: true,
          displayRestart: true,
          displayPlay: true,
          displayProgress: true,
          // displayWarp: true
        }
      );

      //create synthesizer
      let synth = new abcjs.synth.CreateSynth();
      let myContext = new AudioContext();
      synth.init({visualObj: visualObj[0]}).then(function () {
        synthControl.setTune(visualObj[0], false, {}).then(function () {
        }).catch(function (error) {
          console.warn("Audio problem:", error);
        });
      }).catch(function (error) {
        console.warn("Audio problem:", error);
      });
    }
  }, [hymn])
  return (
    <div className={classes.hymnPageRoot}>
      {!!hymn ? null : <span>Loading....</span>}
      {
        isLoggedIn(globalState)?(
          <div id={"editDiv"} className={classes.editDiv}>
            <Button variant={"contained"} onClick={()=>{history.push(`/edit/${hymn.id}`)}}>Edit</Button>
          </div>
        ):null
      }
      <div id={"player"} className={classes.playerContainer}></div>
      <div id={"musicSheet"} className={isNarrowScreen?classes.sheetContainerNarrowScreen:classes.sheetContainerWideScreen}></div>
    </div>
  )
}
export default ViewHymnPage
