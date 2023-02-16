
export async function fetchLists( apiCred) {
    let response = await fetch('https://api.trello.com/1/boards/kO5kbMNf/lists?' + apiCred);
    if (response.status === 401) throw new Error("Not authorized");
    let lists = await response.json();     
    return lists;
}

export async function fetchCases(listId, apiCred) {
    let response = await fetch('https://api.trello.com/1/lists/'+ listId + '/cards?' + apiCred);
    let cards = await response.json();     
    return cards;
}


export  function authorize(apiKey, appName) {
    const host = window.location.protocol + "//" + window.location.host;
    
    window.location.href= 'https://api.trello.com/1/authorize/?expiration=1day&name=' + appName + 
        '&return_url=' + host + 
        '&scope=read&response_type=token&key=' + apiKey;
}

  
export async function fetchCustomFields(cardId, apiCred) {
    let response = await fetch('https://api.trello.com/1/cards/'+ cardId + '/customFieldItems?' + apiCred);
    let cards = await response.json();     
    return cards;
}
