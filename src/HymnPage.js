import {makeStyles} from "@material-ui/core/styles";
import abcjs from "abcjs";
import {useEffect, useState} from "react";
import db from "./firebase.config"

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
  const [hymn, setHymn] = useState()
  // let abcString = "X:1\nT:Example\nK:Bb\nBcde|\n";
  useEffect(() => {
    const fetchHymn = async ()=>{
      let querySnapchot = await db.collection("hymns").get()
      querySnapchot.forEach((doc) => {
        console.log(doc.data())
        let formattedDoc = {...doc.data(), musicABC:doc.data().musicABC.replaceAll("\\n","\n")}
        setHymn(formattedDoc)
      })
    }
    fetchHymn()
  }, [])

  useEffect(() => {
    if(hymn !== undefined) {
      console.log(hymn)
      let a = abcjs.renderAbc("musicSheet", hymn.musicABC);
      if (!!a) {
        console.log(a[0])
      }
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
