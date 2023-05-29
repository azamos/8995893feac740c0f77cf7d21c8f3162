const GAME_MODE = 'GAME_MODE';
const REG_MODE = 'REG_MODE';
const DEFAULT_CARD_NUM = 10;
const DEFAULT_REMAINING_TIME = 60;
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
    cards:[]
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
    const  n = 2*numOfPairs;
    const availableImages = new Array(numOfImages);
    for(let j = 0; j < numOfImages; j++){
        availableImages[j] = 1;//Initially, all images may be used
    }
    gameState.cards = new Array(n);
    for(let i = 0; i< numOfPairs; i++){
        let rndFloat = Math.random();
        let randomlyChosenImage = Math.floor(rndFloat*numOfImages);//0-29
        while(availableImages[randomlyChosenImage]==0){
            randomlyChosenImage++;
            randomlyChosenImage%=numOfImages;
        }
        //If got here -> we found an available image!
        availableImages[randomlyChosenImage] = 0;
        let rndFloat2 = Math.random();
        let randomlyChosenIndex = Math.floor(rndFloat2*numOfPairs)+numOfPairs;
        while(gameState.cards[randomlyChosenIndex]){
            randomlyChosenIndex++;
            randomlyChosenIndex%=numOfPairs;
        }
        //If we got here, we found a free index for a partner
        gameState.cards[i] = {otherCardIndex:randomlyChosenIndex,value:randomlyChosenImage+1};
        gameState.cards[randomlyChosenIndex]={otherCardIndex:i,value:randomlyChosenImage+1};
    }
    populateHTML(document.getElementById("gameBoard"));
}

function populateHTML(anchor){
    gameState.cards.map(cardData=> {
        const newCard = document.createElement('div');
        newCard.innerHTML = `OTHER CARD: ${cardData.otherCardIndex}`;
        newCard.classList.add("grid-item");
        newCard.style = `background-image: url('./images/image${cardData.value}.jpg');background-size: cover;height:10vh;color:white`;
        anchor.appendChild(newCard);
    });
}