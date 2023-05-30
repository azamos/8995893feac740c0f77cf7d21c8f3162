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
    populateHTML(document.getElementById("gameBoard"));
}

function findAvailableRandomIndex(set){
    const arr = Array.from(set);
    let ranomIndex = Math.floor(Math.random()*arr.length);
    set.delete(arr[ranomIndex]);
    return arr[ranomIndex]; 
}

/**
 * function pupulateBoard(numOfPairs){
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
 */

function populateHTML(anchor){
    gameState.cards.map(cardData=> {
        const newCard = document.createElement('div');
        newCard.innerHTML = `OTHER CARD: ${cardData.otherCardIndex}`;
        newCard.classList.add("grid-item");
        newCard.style = `background-image: url('./images/image${cardData.value}.jpg');background-size: cover;height:10vh;color:white`;
        anchor.appendChild(newCard);
    });
}