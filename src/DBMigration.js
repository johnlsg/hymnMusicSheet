import {Button} from "@material-ui/core";
import db from "./firebase.config";
import {useState} from "react";
import Typography from "@material-ui/core/Typography";
import slugify from "slugify";

const DBMigration = ()=>{
  const [mode, setMode] = useState("disabled")
  const startMigrate = ()=>{
    const helper = async ()=>{
      let categoryMapData = (await db.collection('hymnCategory').doc('categories').get()).data().categoryMap

      console.log("generating category slug")
      for(let categoryID of Object.keys(categoryMapData)){
        console.log("processing "+ categoryID)
        const hymnCategoryName = categoryMapData[categoryID].categoryName
        console.log("name: "+ hymnCategoryName)
        let hymnCategorySlug = slugify(hymnCategoryName, {strict: true})
        hymnCategorySlug = hymnCategorySlug+"-"+ categoryID.slice(-6)
        console.log("slug: "+ hymnCategorySlug)

        categoryMapData[categoryID].categorySlug = hymnCategorySlug
      }
      console.log('updating cat map')
      await db.collection('hymnCategory').doc('categories').set({categoryMap:categoryMapData})

    }
    if(mode==="init"){
      setMode("migrating")
      // helper().then((d)=>{console.log(d);setMode("finished")}).catch((e)=>{setMode("Error");console.error(e)})
    }
  }
  return(
    <div>
      <Typography>{mode}</Typography>

      <Button onClick={startMigrate} disabled={mode!=="init"}>Start Migrate</Button>

    </div>
  )
}

export default  DBMigration
