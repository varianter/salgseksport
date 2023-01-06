export async function fetchCorporates(apiCred) {
    let result =  await fetch('https://api.trello.com/1/organizations/variantsstyrerom/boards?' + apiCred);
    let boards = await result.json();
    const corps = [];
    for (let board of boards){
      let mResult = await fetch('https://api.trello.com/1/boards/' + board.id + '/lists?' + apiCred);
      let meetings = await mResult.json();
      board.meetings = meetings;
      corps.push(board);
    } 
    return corps;
}
  
export async function fetchMeetingMatters(listId, apiCred) {
    let response = await fetch('https://api.trello.com/1/lists/'+ listId + '/cards?' + apiCred);
    let cards = await response.json();     
    for( const card of cards ){
         card.attachments = await fetchMeetingMattersAttacments(card.id, apiCred);
    }
    return cards;
}
  
async function fetchMeetingMattersAttacments(cardId, apiCred) {
    let response = await fetch('https://api.trello.com/1/cards/'+ cardId + '/attachments?' + apiCred);
    let json = await response.json(); 
    return json;
}
