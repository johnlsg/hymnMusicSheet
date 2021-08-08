import {Button} from "@material-ui/core";
import db from "./firebase.config";
import {useState} from "react";
import Typography from "@material-ui/core/Typography";
import slugify from "slugify";

const DBMigration = ()=>{
  const [mode, setMode] = useState("disabled")
  const startMigrate = ()=>{
    const helper = async ()=>{
      let querySnapshot = await db.collection("hymns").get()
      let categoryMapData = (await db.collection('hymnCategory').doc('categories').get()).data().categoryMap
      let hymnMap = {}
      querySnapshot.forEach((hymnDoc)=>{
        console.log("fetching hymn "+hymnDoc.id)

        let hymnData = hymnDoc.data()
        if(!!hymnData.hymnName){
          let slug = slugify(hymnData.hymnName,{strict: true})+"-" + hymnDoc.id.slice(-6)
          hymnMap[hymnDoc.id] = {slug:slug, categoryID:hymnData.category}
        }else{
          console.error('hymn '+hymnDoc.id + " missing name, skipped")
        }
      })
      for (let currentHymnDocID of Object.keys(hymnMap)){
        console.log('processing hymn '+ currentHymnDocID)
        const currentHymnMapValue = hymnMap[currentHymnDocID]
        console.log(currentHymnMapValue)

        await db.collection('hymns').doc(currentHymnDocID).update({slug:currentHymnMapValue.slug})
        console.log('updated hymn '+ currentHymnDocID)
        if(currentHymnMapValue.categoryID !== "" && !!categoryMapData[currentHymnMapValue.categoryID]){
          let currentHymnCatArray = categoryMapData[currentHymnMapValue.categoryID].categoryContent
          for(let i =0 ; i<currentHymnCatArray.length; i++){
            if(currentHymnCatArray[i].hymnID === currentHymnDocID){
              currentHymnCatArray[i].slug = currentHymnMapValue.slug
              break
            }
          }
        }
      }
      console.log('updating cat map')
      await db.collection('hymnCategory').doc('categories').set({categoryMap:categoryMapData})

    }
    if(mode==="init"){
      setMode("migrating")
      // helper().then((d)=>{console.log(d);setMode("finished")}).catch((e)=>{console.error(e)})
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
