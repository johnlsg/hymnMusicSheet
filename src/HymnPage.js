import {makeStyles} from "@material-ui/core/styles";
import abcjs from "abcjs";
import {useEffect, useState} from "react";
import db from "./firebase.config"
import {useParams} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    hymnPageRoot: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  })
)

const HymnPage = () => {
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
      abcjs.renderAbc("musicSheet", hymn.musicABC);
    }
  }, [hymn])
  return (
    <div className={classes.hymnPageRoot}>
      <span>{!!hymn?hymn.name:"Loading...."}</span>
      <div id={"musicSheet"}></div>
    </div>
  )
}
export default HymnPage
