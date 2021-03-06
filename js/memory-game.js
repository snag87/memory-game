var cardsCurrentlyTurned = [];
var pairsFound = 0;
var wrongGuesses = 0;
var NUM_PAIRS = 4;
var cardBack = "./images/texture.jpg";
var screenBackground = "./images/simpleBg.jpg";
var cardTheme = "animals";
var username = "";

function personalisedGreeting(){
    if (username === ""){
        return "Well done!";
    } else {
        return "Well done " + username + "!";
    }
}

function numErrorsFeedback(){
    //function that handles grammatical issues in English depending on if it is 1 error or multiple errorS
    var numErrorsOutput = "";
    if (wrongGuesses === 1){
        numErrorsOutput = wrongGuesses + " error.";
    }else{
        numErrorsOutput = wrongGuesses + " errors.";
    }
    return " You guessed all of the pairs correctly with only " + numErrorsOutput;
}

function checkAllMatched() {
    //if the user has found all the pairs, show a modal with an appropriate message
    if (pairsFound === NUM_PAIRS) {
        document.getElementById("closeMessage").textContent = personalisedGreeting() + numErrorsFeedback();
        $('#endMessage').modal('show');
    }
}

function checkTwoCardsEqual(clickEvent) {
    if (cardsCurrentlyTurned[0].getAttribute("front_src") === cardsCurrentlyTurned[1].getAttribute("front_src")) {
        pairsFound++; //global variable
        checkAllMatched();
        cardsCurrentlyTurned = [];
    } else { //if they don't match reset cardsCurrentlyTurned, and turn the cards back over after one second
        setTimeout(function () {
            for (var i = 0; i < cardsCurrentlyTurned.length; i++) {
                cardsCurrentlyTurned[i].style.backgroundImage = "url(" + clickEvent.target.getAttribute("back_src") + ")";
            }
            wrongGuesses++;
            cardsCurrentlyTurned = [];
        }, 500);
    }
}

function handleClickOnCard(clickEvent) {
    //flip the card over for a second by changing the background image
    if (cardsCurrentlyTurned.length < 2 && clickEvent.target.style.backgroundImage === "url(\"" + clickEvent.target.getAttribute("back_src") + "\")") {
        //that if statement guarantees that a) won't show more than two cards, even if user can click quickly
        // b) doesn't do anything if the card was already flipped over

        //flip over the card:
        clickEvent.target.style.backgroundImage = "url(" + clickEvent.target.getAttribute("front_src") + ")";
        //add card to list of currently turned over
        cardsCurrentlyTurned.push(clickEvent.target);
        if (cardsCurrentlyTurned.length === 2) { //2 cards flipped, let's see if they match
            //if they match, increment the pairsFound count and reset the cards currently flipped
            checkTwoCardsEqual(clickEvent);
        }
    }
}

function shuffleNumbers(n) {
    //this function creates a list of 2*n numbers in a shuffled order
    //where each number (1 through to N) appears exactly twice
    //agreed that it can be written WAY more efficiently
    var output = [];
    while (output.length < n * 2) {
        var ranNum = Math.floor(Math.random() * NUM_PAIRS) + 1;
        while (output.lastIndexOf(ranNum) !== -1 && output.lastIndexOf(ranNum) !== output.indexOf(ranNum)) {
            ranNum = Math.floor(Math.random() * NUM_PAIRS) + 1;
        }
        output.push(ranNum);
    }
    return output;
}

function clearBoard() {
    //clears the board in case there was a previous game
    var rowsOfCards = document.getElementsByClassName("row-div");
    for (var i = 0; i < rowsOfCards.length; i++) {
        rowsOfCards[i].parentElement.removeChild(rowsOfCards[i]);
    }
}

function createBoard() {
    document.body.style.backgroundImage = "url(" + screenBackground + ")";
    document.body.style.backgroundSize = "cover";
    //clear board of any previous cards in case user was already playing game
    clearBoard();
    //reset some global variables in case this is not first game
    cardsCurrentlyTurned = [];
    wrongGuesses = 0;
    pairsFound = 0;
    var randOrder = shuffleNumbers(NUM_PAIRS);

    var rowDiv = document.createElement("div");
    rowDiv.classList.add("row-div");
    //go through the cards in the random order and add them to the html
    for (var i = 0; i < randOrder.length; i++) {
        var div = document.createElement("div");
        console.log("./images/" + cardTheme + "/" + randOrder[i] + ".jpg");
        div.setAttribute("front_src", "./images/" + cardTheme + "/" + randOrder[i] + ".jpg");
        div.setAttribute("back_src", cardBack);
        div.style.backgroundImage = "url(" + div.getAttribute("back_src") + ")";
        div.classList.add("memory-card");
        div.addEventListener("click", handleClickOnCard);
        rowDiv.appendChild(div);
    }
    document.body.appendChild(rowDiv);
}

function getDifficultyLevel() {
    //gets the user's selection for difficulty level
    if (document.getElementById("difficultyEasy").checked){
        return 2;
    } else if (document.getElementById("difficultyMedium").checked){
        return 6;
    } else if (document.getElementById("difficultyHard").checked){
        return 12;
    }
}

function getCardTheme() {
    //gets the user's selection for card theme
    if (document.getElementById("animals").checked){
        return "animals";
    } else if (document.getElementById("fruit").checked){
        return "fruit";
    }
}

function getCardTexture() {
    //gets the user's selection for back of card
    if (document.getElementById("texture1").checked){
        return "./images/rubiks.png";
    } else if (document.getElementById("texture2").checked){
        return "./images/texture.jpg";
    } else if (document.getElementById("texture3").checked){
        return "./images/escher.png";
    }
}

function getScreenBackground() {
    //gets the user's selection for a screen background
    if (document.getElementById("bgOption1").checked){
        return "./images/simpleBg.jpg";
    } else if (document.getElementById("bgOption2").checked){
        return "./images/footprints.jpg";
    } else if (document.getElementById("bgOption3").checked){
        return "./images/wolf.jpg";
    }
}

function submitSettings() {
    //get the user name from their input
    username = document.getElementById("userName").value;
    //set NUM_PAIRS based on difficulty selected
    NUM_PAIRS = getDifficultyLevel();
    //get the card theme based on selection
    cardTheme = getCardTheme();
    //get the card texture based on selection
    cardBack = getCardTexture();
    //get the screen background based on the user's selection
    screenBackground = getScreenBackground();
    createBoard();
}

function quickStart(){
    //quickStart starts a game using the settings of the previous game
    //if this is the first game then it uses the default settings
    createBoard();
}


function generateGame(){
    //shows the form that asks user questions about settings they want to select
    $('#settingsGame').modal('show');
}

