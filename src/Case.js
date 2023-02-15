
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './Case.css';
import { fetchCustomFields } from './TrelloService';

const Label = ({label}) => {
  return (
    <span className={label.color}>{label.name}</span>  
  );
}

const Candidates = ({cardId, apiCred}) => {
  const [customFields, setCustomFields] = useState([]);

  useEffect (() => {
    async function getData(){
      let json =  await fetchCustomFields( cardId, apiCred);
      setCustomFields(json.map(v => v.value.text))
    }
    getData()
  },[apiCred,cardId])

  if (customFields.length>0) {
    return (
      <div className="candidates"><span className='candidate-legend' >{"Kandidater: "}</span>{customFields}</div>  
    );
  }
  return (
    <span></span>  
  )
}



const Case = ({ tCase, apiCred }) => {
  const labels = []
  for (const label of tCase.labels){
    labels.push(<Label label={label} />)
  }
  let desc = tCase.desc.substring(0,700).replace(/\n\s*\n/g, '\n\n');
  if (tCase.desc.length>700) desc = desc + "..."
  console.log(desc);
  return (
    <div >
      <div className='heading' >
        <div className='case-heading'> <h3><a href={tCase.url}>{tCase.name}</a></h3></div>
        <div className='labels'> {labels} </div>  
      </div>
      <div className='description'>  
        <ReactMarkdown children={desc} />
        <Candidates apiCred={apiCred} cardId ={tCase.id}/>
      </div> 
    </div>  
  );
}

export default Case;
  