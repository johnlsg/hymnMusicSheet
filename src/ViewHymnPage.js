import {makeStyles} from "@material-ui/core/styles";
import abcjs from "abcjs";
import {useEffect, useState} from "react";
import db from "./firebase.config"
import {useParams} from "react-router-dom";
import 'abcjs/abcjs-audio.css';

const useStyles = makeStyles((theme) => ({
    hymnPageRoot: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop:"50px",
      overflow:"auto",

    },
    playerContainer:{
      minWidth:"70%"
    },
  sheetContainer:{
      maxWidth:"70%"
  }
  })
)

const ViewHymnPage = () => {
  const classes = useStyles()
  let { id } = useParams();
  const [hymn, setHymn] = useState()
  // let abcString = "X:1\nT:Example\nK:Bb\nBcde|\n";
  useEffect(() => {
    console.log(id)
    const fetchHymn = async ()=>{
      let ref = await db.collection("hymns").doc(id).get()
      const data = ref.data()
      setHymn({
        name:data.name,
        musicABC:data.musicABC.replaceAll("\\n","\n")
      })
    }
    fetchHymn()
  }, [id])

  useEffect(() => {
    if(hymn !== undefined) {
      let visualObj = abcjs.renderAbc("musicSheet", hymn.musicABC, {responsive:"resize"});
      console.log(visualObj[0])
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
      synth.init({ visualObj: visualObj[0] }).then(function () {
        synthControl.setTune(visualObj[0], false, {}).then(function () {
          console.log("Audio successfully loaded.")
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
      {!!hymn?null:<span>Loading....</span>}
      <div id={"player"} className={classes.playerContainer}></div>
      <div id={"musicSheet"} className={classes.sheetContainer}></div>
    </div>
  )
}
export default ViewHymnPage
