import {useParams} from "react-router-dom";
import ListHymnPage from "./ListHymnPage";


const ViewCategoryPage = (props) =>{
  let {id} = useParams();

  return (
    <ListHymnPage filterCategory={id}/>
  )

}

export default ViewCategoryPage
