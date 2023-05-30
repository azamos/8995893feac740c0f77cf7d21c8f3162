const GAME_MODE = 'GAME_MODE';
const REG_MODE = 'REG_MODE';
const DEFAULT_CARD_NUM = 10;
const DEFAULT_REMAINING_TIME = 60;//seconds
const DEFAULT_OBSERVANCE_PREIOD = 2;//seconds
const milisecToSecond = 1000;
const numOfImages = 30;
const setTimeForInterval = timeInSec => timeInSec*milisecToSecond;
let timeOuts = [];

const regState = {
    nameInput:"",
    cardsInput: DEFAULT_CARD_NUM,
    redirected: false
};

function resetRegState(){
    regState.nameInput = "";
    regState.cardsInput = DEFAULT_CARD_NUM;
    regState.redirected = false;
}

const gameState = {
    remainingSeconds: DEFAULT_REMAINING_TIME,
    cards:[],
    selectedMode:0,
    selectedCard1:null,
    selectedCard2:null,
    intervalId: null
}

function resetGameState(){
    gameState.remainingSeconds = DEFAULT_REMAINING_TIME;
    gameState.cards = [];
    gameState.selectedMode = 0;
    gameState.selectedCard1 = null;
    gameState.selectedCard2 = null;
    gameState.intervalId = null;
}

const appMod = {
    gameState: REG_MODE
}

function resetAppMod(){
    appMod.gameState = REG_MODE;
}

function resetGame(nameInputRef,cardInputRef){
    clearInterval(gameState.intervalId);
    timeOuts.map(tiId=>clearTimeout(tiId));
    timeOuts = [];
    resetAppMod();
    resetRegState();
    resetGameState();
    document.getElementById("gameBoard").innerHTML="";//throw away previous game's cards and all
    document.getElementById("counterDiv").innerHTML="<span><h1>Observe the cards before they disappear</h1></span>";
    nameInputRef.value = regState.nameInput;
    cardInputRef.value = regState.cardsInput;
    setVisible();
}

function setVisible(){
    const register = document.getElementById("register");
    const gameContainer = document.getElementById("gameContainer");
    const {gameState} = appMod;
    if(gameState == REG_MODE){
        register.classList.remove("invisible");
        gameContainer.classList.add("invisible");
    }
    else{
        if(gameState == GAME_MODE){
            gameContainer.classList.remove("invisible");
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
    document.getElementById("resetGameBtn").addEventListener('click',e=>resetGame(nameInputRef,cardInputRef));
}

function pupulateBoard(numOfPairs){
    const { cards } = gameState;
    const unAssignedImages = new Set();//So that we could get a random image from a pool of images previousely NOT selected.
    const gameBoard = document.getElementById("gameBoard");
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
        cards[index1] = {otherCardIndex:index2,value:image+1,discovered:false};
        cards[index2] = {otherCardIndex:index1,value:image+1,discovered:false};
        assignedAmount++;
    }
    const counterDiv = document.getElementById('counterDiv');
    populateHTML(gameBoard);
    const tiId = setTimeout(()=>initiateGameplay(counterDiv),setTimeForInterval(DEFAULT_OBSERVANCE_PREIOD));
    timeOuts.push(tiId);
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
    gameState.intervalId = setInterval(()=>{
        gameState.remainingSeconds = gameState.remainingSeconds>0? gameState.remainingSeconds-1:0;
        counterDiv.innerHTML=`<span><h1>Game started. Remaining Time: ${gameState.remainingSeconds} seconds<h1></span>`;
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
            selectedCard1.htmlRef.style = `background-image: url('./images/image${selectedCard1.value}.jpg');`;
            selectedCard2.htmlRef.style = `background-image: url('./images/image${selectedCard2.value}.jpg');`;
            selectedCard1.discovered = true;
            selectedCard2.discovered = true;
        }
    }
    gameState.selectedMode = (selectedMode+1)%2;
}

function showCardForAwhile(card){
    card.htmlRef.style = `background-image: url('./images/image${card.value}.jpg');`;
    const tiId = setTimeout(()=>{
        if(card.discovered==false){
            card.htmlRef.style="";
        }
    },setTimeForInterval(DEFAULT_OBSERVANCE_PREIOD));
    timeOuts.push(tiId);
}