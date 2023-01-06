import React , {useState, useEffect} from "react";
import { fetchCorporates } from "./TrelloService";
import './MeetingPicker.css';


const MeetingPicker = ({apiCred, handeMeetingPicked}) => {
    const [corporates, setCorporates] = useState([]);
    const [waitingForData, setWaitingForData] = useState(true);
      
    function handleSummit(meetingId){
      handeMeetingPicked(meetingId, false)
    }
  
    function handleMinutes(meetingId){
      handeMeetingPicked(meetingId, true)
    }
  
    useEffect (() => {
      async function getData(){
        setWaitingForData(true);
        let json = await fetchCorporates(apiCred);   
        setCorporates(json);
        setWaitingForData(false);
      };
          getData();
    }, [apiCred])


    if (!apiCred) {
        return (
        <div>        
          <h2>Oversikt over møter</h2>
          <div>          
              Du må legge inn api-nøkkel og token under instillinger
          </div>
        </div>        
        )
    }

    if (waitingForData) {
        return (
            <div>        
            <h2>Oversikt over møter</h2>
            <div>          
                Venter på data...
            </div>
          </div>        
  
        )
    }

    let corporateList = corporates
        .filter( corporate => corporate.name !== "Maler")
        .map((corporate) => {
            let meetingList = corporate.meetings.filter(meeting => (meeting.name !== "Todo" && meeting.name !== "Done" && meeting.name !== "Doing"))
                .map((meeting) => {
                return(
                    <tr key={meeting.id}>
                        <td className="meeting-name">{meeting.name}  </td>
                        <td><span className="link" id={meeting.id} onClick={(e) => handleSummit(e.target.id)}>Innkalling</span>  </td>
                        <td><span className="link" id={meeting.id} onClick={(e) => handleMinutes(e.target.id)}>Referat</span></td>
                    </tr>
                )
        });
  
      return (
        <div key={corporate.id}>
          <h3 > <a href={corporate.shortUrl}>{corporate.name}</a></h3>
          <table>
              <tbody>

                {meetingList}
              </tbody>

          </table>
        </div>
      )}
    )
     
    return (
        <div>        
          <h2>Oversikt over møter</h2>
          <div>          
              {corporateList}          
          </div>
        </div>
    );
  }

  export default MeetingPicker;