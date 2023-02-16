import React , {useEffect, useState} from "react";
import './App.css';
import List from "./List";
import { authorize, fetchLists } from "./TrelloService";
import { format } from 'date-fns'


export default function App() {
  const [apiCred, setApiCred] = useState(undefined);
  const [lists, setLists] = useState([]);

  useEffect (() => {
    async function getData(){
      try {
        let json =  await fetchLists( apiCred);
        setLists(json)
      } catch (e)
      {
        console.log(e);
        localStorage.removeItem("api-sales-cred");
        setApiCred(false);
        
      }
    }
    getData()
  },[apiCred])

 
  useEffect (()  => {
    setApiCred(localStorage.getItem("api-sales-cred"));
  },[])
  
  
  async function setCred(cred){
    await setApiCred(cred);
    window.location.hash = "";  
  }

  if (!apiCred){
    let cred = localStorage.getItem("api-sales-cred");
    const apiKey = 'cf063842e14021c0d2d0fdc485794b53'
    if (cred) {
      setCred(cred);
    }
    else if (window.location.hash){
      const token = window.location.hash.substring(1).split('=')[1];
      cred = 'key=' + apiKey + '&token=' + token;
      localStorage.setItem("api-sales-cred", cred);
      setCred(cred);
    } else {
      authorize(apiKey, "Variant Salgseksport")
    }
  }

  let content = []
  if (apiCred){
    for (const list of lists){
      if (list.name.substring(0,5) === "Leads") continue;
      if (list.name === "KAM - ansvar for å legge inn på tavla") continue;
      
      content.push(<List apiCred={apiCred} name={list.name} id={list.id}/>)
    }
  }

  const weeknr = format(new Date(),'I');
  return (
    <div>
      <div className="heading"> <h1>Salgsstatus Uke {weeknr}</h1> </div> 
      <div className="container"> 
        {content}     
      </div>
    </div>  
  );
}





