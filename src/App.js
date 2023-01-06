import React , {useEffect, useState} from "react";
import './App.css';
import Credentials from './Credentials';
import Meeting from "./Meeting";
import MeetingPicker from "./MeetingPicker";

export default function App() {
  const [apiCred, setApiCred] = useState(undefined);
  const [meetingId, setMeetingId] = useState();
  const [isMinnutes, setIsMinnutes] = useState(false);
  const [showMeeting, setShowMeeting] = useState();


  function handleCredChange(cred) {
    localStorage.setItem("apiCred", cred);
    setApiCred(cred);
  }

  async function handeMeetingPicked(meetingId, minutes) {
    await setMeetingId(meetingId);
    await setIsMinnutes(minutes);
    setShowMeeting(true);
  }

  function closeMeeting(){
    setShowMeeting(false);
  }

  useEffect (() => {
    setApiCred(localStorage.getItem("apiCred"));
  },[])
  let content;

  if (!apiCred){
    return (
      <div className="heading"> <h1>Variants Styreportal</h1> 
        <Credentials defaultOpen={true} handleCredChange={ handleCredChange} />
      </div> 
    )
  }

  if (apiCred){
    content = <MeetingPicker handeMeetingPicked={handeMeetingPicked} apiCred={apiCred} />
  }

  if (showMeeting) {
    content = <Meeting close={closeMeeting} meetingId={meetingId} minutes={isMinnutes} apiCred={apiCred}/> 
  }

  return (
    <div>
      <div className="heading"> <h1>Variants Styreportal</h1> </div> 
      
      <Credentials handleCredChange={ handleCredChange} />
      <div className="container"> 
        {content}    
            
            
      </div>
    </div>  
  );
}





