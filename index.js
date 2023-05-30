const GAME_MODE = 'GAME_MODE';
const REG_MODE = 'REG_MODE';
const DEFAULT_CARD_NUM = 10;
const DEFAULT_REMAINING_TIME = 60;//seconds
const DEFAULT_OBSERVANCE_PREIOD = 2;//seconds
const milisecToSecond = 1000;
const numOfImages = 30;
const setTimeForInterval = timeInSec => timeInSec*milisecToSecond;

const regState = {
    nameInput:"",
    cardsInput: DEFAULT_CARD_NUM,
    redirected: false
};

const gameState = {
    remainingSeconds: DEFAULT_REMAINING_TIME,
    cards:[],
    selectedMode:0,
    selectedCard1:null,
    selectedCard2:null
}

const appMod = {
    gameState: REG_MODE
}

function setVisible(){
    const register = document.getElementById("register");
    const gameBoard = document.getElementById("gameBoard");
    const {gameState} = appMod;
    if(gameState == REG_MODE){
        register.classList.remove("invisible");
        gameBoard.classList.add("invisible");
    }
    else{
        if(gameState == GAME_MODE){
            gameBoard.classList.remove("invisible");
            register.classList.add("invisible");
        }
    }
}

function startGame(){
    appMod.gameState = GAME_MODE;
    pupulateBoard(regState.cardsInput);
    setVisible();
}

function main(){
    const nameInputRef = document.getElementById("name");
    nameInputRef.value = "";
    nameInputRef.addEventListener('input',e=>{
        if(e.target.value.trim()!=""){
            regState.nameInput = e.target.value;
        }
        e.target.value = regState.nameInput;
    });
    const cardInputRef = document.getElementById("cards");
    
    cardInputRef.value = 10;
    cardInputRef.addEventListener('input',e=>{
        if(1<=e.target.value && e.target.value<=30){
            regState.cardsInput = e.target.value;
        }
        e.target.value = regState.cardsInput;
    });
}

function pupulateBoard(numOfPairs){
    const { cards } = gameState;
    const unAssignedImages = new Set();//So that we could get a random image from a pool of images previousely NOT selected.
    let i;
    const n = 2*numOfPairs;
    //Populating the set with all of the images
    for(i=0;i<numOfImages;i++){
        unAssignedImages.add(i);
    }

    const unAssingedIndexes = new Set();//To be able to pick available indexes
    //Populating the set with all the indexes
    for(i=0;i<2*numOfPairs;i++){
        unAssingedIndexes.add(i);
    }
    let assignedAmount = 0;//We need to asign numOfPairs pairs, meaning we need to roll 2 random indexes to be pair partners, and 1 additional number
    //for an image.
    while(assignedAmount<numOfPairs){
        let index1 = findAvailableRandomIndex(unAssingedIndexes);
        let index2 = findAvailableRandomIndex(unAssingedIndexes);
        let image = findAvailableRandomIndex(unAssignedImages);
        cards[index1] = {otherCardIndex:index2,value:image+1};
        cards[index2] = {otherCardIndex:index1,value:image+1};
        assignedAmount++;
    }
    const counterDiv = document.createElement('div');
    counterDiv.setAttribute('id','remaining-time');
    counterDiv.innerHTML=`Remaining Time${gameState.remainingSeconds}`;
    gameBoard.appendChild(counterDiv);
    populateHTML(document.getElementById("gameBoard"));
    setTimeout(()=>initiateGameplay(counterDiv),setTimeForInterval(DEFAULT_OBSERVANCE_PREIOD));
    /*
    *const sortedIndexes =[];
    cards.map(card=>sortedIndexes.push(card.otherCardIndex));
    sortedIndexes.sort((a,b)=>a>b);
    console.log(sortedIndexes);
    */
}
function initiateGameplay(counterDiv){
    const { cards } = gameState;
    cards.forEach(card=> { 
        card.htmlRef.style="";
        card.htmlRef.addEventListener('click',cardClick);});
    setInterval(()=>{
        gameState.remainingSeconds = gameState.remainingSeconds>0? gameState.remainingSeconds-1:0;
        counterDiv.innerHTML=`Remaining Time${gameState.remainingSeconds}`;
    },setTimeForInterval(1));
}

function findAvailableRandomIndex(set){
    const arr = Array.from(set);
    let ranomIndex = Math.floor(Math.random()*arr.length);
    set.delete(arr[ranomIndex]);
    return arr[ranomIndex]; 
}


function populateHTML(anchor){
    gameState.cards.map((cardData,index)=> {
        const newCard = document.createElement('div');
        //newCard.innerHTML = `OTHER CARD: ${cardData.otherCardIndex}`;
        newCard.classList.add("grid-item");
        newCard.classList.add("card");
        newCard.style = `background-image: url('./images/image${cardData.value}.jpg');`;
        newCard.setAttribute('id',`card-index ${index}`);
        //newCard.addEventListener('click',cardClick);
        anchor.appendChild(newCard);
        cardData.htmlRef = newCard;
    });
}

function cardClick(e){
    const { cards } = gameState;
    const cardHTMLref = e.target;
    const index = parseInt(cardHTMLref.id.split(" ")[1]);
    let card = cards[index];
    showCardForAwhile(card);
    
    let {selectedMode} = gameState;//Either a first card was picked already, or not.
    if(selectedMode==0){
        gameState.selectedCard1 = card;
    }
    if(selectedMode==1){//Means, a first card was picked previously
        gameState.selectedCard2 = card;
        const {cards,selectedCard1,selectedCard2} = gameState;
        if(cards[selectedCard1.otherCardIndex] == selectedCard2){
            alert("SUCCESS! + points!");
            card.htmlRef.parentElement.removeChild(selectedCard1.htmlRef);
            card.htmlRef.parentElement.removeChild(selectedCard2.htmlRef);
        }
    }
    gameState.selectedMode = (selectedMode+1)%2;
}

function showCardForAwhile(card){
    card.htmlRef.style = `background-image: url('./images/image${card.value}.jpg');`;
    setTimeout(()=>{
        card.htmlRef.style="";
    },setTimeForInterval(DEFAULT_OBSERVANCE_PREIOD));
}