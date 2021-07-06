import {Button, Paper, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme)=>({
  formContainer:{
    display:"flex",
    flexDirection:"column",
    margin:"50px",
    padding:"30px",
    backgroundColor:"#f5f5f5",
    gap:"50px",
    alignItems:"flex-start"
  }
}))


const AddHymnPage = (props)=>{
  const classes = useStyles()

  return (
    <form autoComplete="off" noValidate>
      <Paper className={classes.formContainer}>
        <TextField id="hymnName" variant="filled" label="Hymn Name"/>
        <TextField id="hymnMusicABC" multiline variant="filled" label="Hymn Music ABC" rows={4}/>
        <Button variant="contained">Submit</Button>
      </Paper>
    </form>
  )
}

export default AddHymnPage
