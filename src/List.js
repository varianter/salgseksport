import React , {useState, useEffect} from "react";
import Case from "./Case";
import { fetchCases } from "./TrelloService";



const List = ({apiCred, name, id}) => {
  const [cases, setCases] = useState([]);

  useEffect (() => {
    async function getData(){
      let json =  await fetchCases( id, apiCred);
      setCases(json)
    }
    getData()
  },[apiCred,id, name])


  let content = []
  if (apiCred){
    for (const c of cases){
      if (c.id === "6115101c17223e571dfb6f6d") continue
      //console.log(c);
      content.push(<Case apiCred={apiCred} tCase={c}/>)
    }
  }


  return (
    <div>
      <div className="list-heading"> <h2>{name}</h2> </div> 
      <div className="container"> 
      {content}
      </div>
    </div>  
  );
}
  

  export default List;
  