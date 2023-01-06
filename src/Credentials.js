import React , {useState} from "react";

const  Credentials = ({handleCredChange, defaultOpen}  ) => {
    const [apiKey, setApiKey] = useState("");
    const [apiToken, setApiToken] = useState("");
    const [showCredentials, setShowCredentials] = useState(defaultOpen ? defaultOpen : false);
  
    function  handeKeyChange(value){
      setApiKey(value);
    }
  
    function  handeTokenChange(value){      
      setApiToken(value);
    }
  
    function show() {
      setShowCredentials(true);
    }

    function close() {
        setShowCredentials(false);
        
        if (apiKey.length > 0 && apiToken.length > 0) handleCredChange('key='+apiKey+'&token='+apiToken);
      }
  
    if  (!showCredentials) {
        return (
            <div className="credentialsPlaceholder">
                <span  className="showButton" onClick={show}>⚙︎</span>
            </div>
        )
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          close();
        }
      }
    
    return (
      
      <form className="credentials" onKeyDown={handleKeyDown}>
        <h2>Påloggingsinfo</h2>
        <div className="formElements">
          <label>
            Key:
            <input type="text" 
              value={apiKey} 
              onChange={(e) => handeKeyChange(e.target.value)}
              name="key"
            />
          </label>
          <label>
            Token:
            <input type="text" 
              value={apiToken} 
              onChange={(e) => handeTokenChange(e.target.value)}
              name="token" />
          </label>
        </div>
        <div> <a href="https://trello.com/app-key">Hent API nøkler fra Trello</a></div>
        <span  className="okButton" onClick={close}>✔</span>
    </form>
    );
  }

  export default Credentials;