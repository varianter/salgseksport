import React , {useState, useEffect} from "react";
import { fetchMeetingMatters } from "./TrelloService";
import ReactMarkdown from 'react-markdown';
import { transposeHeadings, urlToLink, beatifyScienceTerms} from "./MarkDownUtil"


function extractPart(desc, key){

    const m = desc.match(/\S.+?(?=\n###(?!#)|$)/gs);
    if (!m) return null;
    if (m.length===0) return null;
    
    if (key === "Saksgrunnlag") {
      return m[0];
    }
    for (const value of m) {
        const match = value.match(/#+ *(.*?):*\n/)  ;

        if (!match) return;

        const name = match[1]
        if (name === key) return value;
    }

}

const Meeting = ({apiCred, meetingId, minutes, close}) => {
    const [matters, setMatters] = useState([]);
        
    useEffect (() => {
      async function getData(){
        let json =  await fetchMeetingMatters(meetingId, apiCred);
        setMatters(json);
      }
      getData()
    },[apiCred, meetingId])
  
    
    let meetingFormal ;
    let listOfMatters = [];
  
    let mattersList = matters.map((matter) => {
      if (matter.labels.find((label) => (label.name === "Formalia"))){
        const place = matter.desc.match(/sted: *(.*)/i)[1];
        const meetingDate = matter.desc.match(/dato: *(.*)/i)[1];
        const meetingTime = matter.desc.match(/klokken: *(.*)/i)[1];
        const listOfInvites = matter.desc.match(/Innkalt.*\n=*\n(.*)\nForfall/s)[1];
        const absents = matter.desc.match(/Forfall\n=*\n(.*)\nI tillegg møtte/s)[1];
        const alsoMet = matter.desc.match(/I tillegg møtte\n=*\n(.*)/s)[1];
        
        if (minutes) {
          document.title = "Referat " + matter.name;
        } else {
          document.title = "Innkalling " + matter.name;
        }
        
        meetingFormal =  MeetingFormal( matter.name, meetingTime, meetingDate, place, minutes, listOfInvites, absents, alsoMet );
        return null;
      }
      else { 
        listOfMatters.push(<li key={matter.id}><a href={"#" + matter.id}>{matter.name}</a></li>);

        let desc = matter.desc;
        desc = transposeHeadings(desc);
        desc = urlToLink(desc);
        desc = beatifyScienceTerms(desc);
        
        const elements = [];
        const matterCase = extractPart(desc, "Saksgrunnlag");
        elements.push(<ReactMarkdown children={matterCase} />);

        const types = matter.labels.map(label => label.name);
        const attachmentItems = matter.attachments.map((attachment) => {
            return <li key={attachment.id}><a href={attachment.url}>{attachment.name}</a></li>
        })
        
        if (attachmentItems.length > 0) {
            elements.push(<h4>Vedlegg</h4>); 
            elements.push(attachmentItems); 
        }

        const suggestion = extractPart(desc, "Forslag til vedtak");
        elements.push( <ReactMarkdown children={suggestion} />)

        if (minutes) {
            const protocol = extractPart(desc, "Protokoll");
            elements.push( <ReactMarkdown children={protocol} />)
        }
        return(    
          <section className="matter" key={matter.id}>
            <h2 id={matter.id}className="matter-heading"><a href={matter.shortUrl}>{matter.name}</a></h2>
            <div className="matter-type">{types.join(", ")}</div>
            {elements}            
          </section>
        )
      }
    });
  
    return (
      <div>
        
        <span className="closeButton" onClick={close}>ⓧ</span>
        {!minutes && 
        <h1>Møteinnkalling</h1>
        }
        {minutes && 
        <h1>Møtereferat</h1>
        }
  
        <div>
          {meetingFormal}
        </div>
        <div className="list-of-matters">
          <h2>Saksliste</h2>    
          <ul>
            {listOfMatters}
          </ul>
        </div>
        <div>
          {mattersList}
        </div>
      </div>
    );
  }

  function MeetingFormal(meetingTitle, time, date, place, minutes, listOfInvites, absents, alsoMet){  
    let absent = <div>Ingen</div>;
    if (absents && /\S/.test(absents)){
      absent = <ReactMarkdown children={absents} />
    }
  
    return (
      <div key="formal">
        <h2>{meetingTitle}</h2>
        <dl>
          <dt>Dato:</dt>
          <dd>{date}</dd>
        </dl>  
        <dl>  
          <dt>Tid:</dt>
          <dd>{time}</dd>
        </dl>  
        <dl>  
          <dt>Sted:</dt>
          <dd>{place}</dd>
        </dl>
        <h3>Innkalt</h3>
        <ReactMarkdown children={listOfInvites} />
         
        {minutes &&
        <>
          <h3>Forfall</h3>
          {absent}
          {(alsoMet && /\S/.test(alsoMet)) && 
          <>
            <h3>I tillegg møtte</h3>
            <ReactMarkdown children={alsoMet} />
          </>
          }
        </>  
        }      
      </div>
    )
  }
  

  export default Meeting;
  