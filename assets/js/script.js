//define global variables used throughout application

var unsplashAccessKey = "vXHZomtCWCOuPpNZLkKKA_A972YCk2cVE0WwcSb4-_s"
var unsplashSecretKey = "4sp7ZTBI_rSj6a_uhsEL1sWwNOYEMeWoFiRNvAWQWfU"

var unsplashCongratsUrl = "https://api.unsplash.com/photos/random?query=victory&client_id=" + unsplashAccessKey
var unsplashCondolenceUrl = "https://api.unsplash.com/photos/random?query=defeat&client_id=" + unsplashAccessKey


//var startButtonEl = $('#start-button');
var startButtonEl = document.querySelector("#start-button");
var pastScoresEl = $("#high-score-box");


var wrongLettersEl = $("#wrong-letters-p");
var rightLettersEl = $("#right-letters");
var wordLength = 5;

var hangmanImageEl = $("#hangman-image");
//var hangmanImageEl = document.getElementById("hangman-image");
var hangmanImageName = "hangman-0";

var congratsImageEl = $("#congrats-image");
var congratsImageName = ""

var condolenceImageEl = $("#condolence-image");
var condolenceImageName = ""


// Get the dialog element
//var gameResultsDialog = $("#gameResultsDialog");
var gameResultsDialog= document.getElementById("gameResultsDialog");
var closeDialogBtn = document.getElementById("closeGameResultsDialogBtn");
var gameResultsHeader = document.getElementById("gameResultsHeader");
var resultsImageName = "";
var resultsMessage = "";

var errorMessageDialog= document.getElementById("errorMessageDialog");
var errorMessageForm= document.getElementById("errorMessageForm");
var errorMessageDialogBtn = document.getElementById("errorMessageDialogBtn");
var errorMessage = document.getElementById("errorMessage");

var userName = document.getElementById("userName");

var gameResultsForm = document.getElementById("gameResultsForm");

var gameResultsImageEl = document.getElementById("gameResults-image");
var gameResultsImageName = ""


var isDone = false;
var isWin = false;
var isLoss = false;

var gblPlayerName = "Player X"
var gblPlayerScore = 0;
var gblPlayerResult = ""
var numberOfWrongGuesses = 0;
var fullHangManLength = 6;

var timerElement = document.querySelector("#timer-span");
var timerCount = 50;


var wrongLettersStr = ""

var arrayOfLetterObj = [];
var arrayOfWrongLettersObj = [];
var arrayOfScoresObj = [];
var arrayOfStoredScoresOBJ = [];




var todaysDate = dayjs().format("MMM D, YYYY");

var randomWordUrl = "https://random-word-api.vercel.app/api?words=1&length=" + wordLength;
var randomWord = ""
var guessedWord = ["*", "*", "*", "*", "*"]


function getCongratsPic() {
  fetch(unsplashCongratsUrl)
  .then(function (response) {
    //console.log("randomword response: " + response)
    if (response.status !== 200){
      errorMessage.textContent = "Bad URL fetch call: " + response.status;
      openErrorMessageDialog();
      return;
    }
    return response.json();
  })
  // if successful, set the global randomWord to the retrieved value
  .then(function (data) {
    //console.log(data[0]);
    if (!data || data.length == 0){
      errorMessage.textContent = "Bad random word!";
      openErrorMessageDialog();
        return;
    } else {
      console.log(data)
      resultsImageName = data.urls.small
      resultsMessage = "Congratulations!!  Winner!! " + gblPlayerScore
      openGameResultsDialog();
      //$(congratsImageEl).attr("src", congratsImageName);
   
    }
    
    
  });

}

function getCondolencePic() {
  fetch(unsplashCondolenceUrl)
  .then(function (response) {
    //console.log("randomword response: " + response)
    if (response.status !== 200){
      errorMessage.textContent = "Bad URL fetch call: " + response.status;
      openErrorMessageDialog();
      return;
    }
    return response.json();
  })
  // if successful, set the global randomWord to the retrieved value
  .then(function (data) {
    //console.log(data[0]);
    if (!data || data.length == 0){
      errorMessage.textContent = "Bad random word!";
      openErrorMessageDialog();
        return;
    } else {
      console.log(data)

      console.log(data)
      resultsImageName = data.urls.small
      resultsMessage = "Sorry  you lost!! " + gblPlayerScore
      openGameResultsDialog();

      //condolenceImageName = data.urls.small
      //$(condolenceImageEl).attr("src", condolenceImageName);
   
    }
    
    
  });

}

// initialize html page, load score history from local storage
// display scores on screen, load array of scores with score history
function init(){

  // dayjs object for today
  //console.log(todaysDate);



  // retrieve any stored players, scores
  arrayOfStoredScoresOBJ = JSON.parse(localStorage.getItem("arrayOfScores"));

 
 //for each stored score, display on page and add to scores array
 if (arrayOfStoredScoresOBJ !== null) {

     for (i = 0; i <= arrayOfStoredScoresOBJ.length -1; i++){

       // BEGIN ---  THIS IS AN EXAMPLE OF THE JAVASCRIPT PORTION WE NEED TO UPDATE TO RETRO-FIT WITH FINAL HTML
       var pastScoresList = "<p>" + arrayOfStoredScoresOBJ[i].playerName + "   " + arrayOfStoredScoresOBJ[i].playerScore + "  " + arrayOfStoredScoresOBJ[i].playerWord + " " + arrayOfStoredScoresOBJ[i].playerResult + "</p>"
       pastScoresEl.append(pastScoresList);
       // END ---  THIS IS AN EXAMPLE OF THE JAVASCRIPT PORTION WE NEED TO UPDATE TO RETRO-FIT WITH FINAL HTML
      
      
      
       // add score history to current scores array
       var newScoreObj = {
        playerName: arrayOfStoredScoresOBJ[i].playerName,
        playerScore: arrayOfStoredScoresOBJ[i].playerScore,
        playerWord: arrayOfStoredScoresOBJ[i].playerWord,
        playerResult: arrayOfStoredScoresOBJ[i].playerResult
      }
    
      arrayOfScoresObj.push(newScoreObj);

     }
}
 
// reset globals   

  isWin = false; 
  isLoss = false;
  isDone = false;
  wrongLettersStr = "";

}

// begin a new game of hangman
function beginNewGame(){

  //console.log("getRadonWord");

  //fetch the random word
  fetch(randomWordUrl)
  .then(function (response) {
    //console.log("randomword response: " + response)
    if (response.status !== 200){
      errorMessage.textContent = "Bad URL fetch call: " + response.status;
      openErrorMessageDialog();
      return; 
    }
    return response.json();
  })
  // if successful, set the global randomWord to the retrieved value
  .then(function (data) {
    //console.log(data[0]);
    if (!data || data.length == 0){
      errorMessage.textContent = "Bad random word!";
      openErrorMessageDialog();
        return;
    } else {
      randomWord = data[0].toUpperCase();
      document.querySelector("#random-word").textContent = randomWord;
    
    }
    
    
  });

}


// if game is won, add score to array of scores, push to local storage, and display on page
// we will also need to add code here to call 2nd 3-rd party api to retrieve prize
function winGame(){

  gblPlayerResult = "Winner!";

  // ADD CODE to retrieve prize
  getCongratsPic();

}
// if 
function loseGame(){

  gblPlayerResult = "Loser!";

 getCondolencePic();
  // END ---  THIS IS AN EXAMPLE OF THE JAVASCRIPT PORTION WE NEED TO UPDATE TO RETRO-FIT WITH FINAL HTML

}


// code for score saving dialog processing


// Function to open the dialog
function openGameResultsDialog(){
  gameResultsHeader.textContent = resultsMessage;
  gameResultsImageEl.src = resultsImageName;
  gameResultsDialog.showModal();
  //$(gameResultsImageEl).attr("src", resultsImageName);
}


// Function to close the dialog
function closeResultsDialog() {


    //console.log("user initials " + userinitials.value)

  if (userName.value.length > 0)
  {
     gblPlayerName = userName.value;
     var newScoreObj = {
      playerName: gblPlayerName,
      playerScore: gblPlayerScore,
      playerWord: randomWord,
      playerResult: gblPlayerResult
    }
  
    arrayOfScoresObj.push(newScoreObj);
    localStorage.setItem("arrayOfScores", JSON.stringify(arrayOfScoresObj));
  
  
    // BEGIN ---  THIS IS AN EXAMPLE OF THE JAVASCRIPT PORTION WE NEED TO UPDATE TO RETRO-FIT WITH FINAL HTML
    var pastScoresList = "<p>" + newScoreObj.playerName + "   " + newScoreObj.playerScore + "  " + newScoreObj.playerWord + " " + newScoreObj.playerResult + "</p>"
    pastScoresEl.append(pastScoresList);
  
  
    // END ---  THIS IS AN EXAMPLE OF THE JAVASCRIPT PORTION WE NEED TO UPDATE TO RETRO-FIT WITH FINAL HTML
  
  
  } else {
          errorMessage.textContent = "Please enter user name!!";
          openErrorMessageDialog();
          return; 
          }
          
  
  //myForm.reset();
  gameResultsForm.reset();
  gameResultsHeader.textContent = "";
  gameResultsImageEl.src = "";
  gameResultsDialog.close();

}

// Function to open the dialog
function openErrorMessageDialog(){
  //errorMessage.textContent = currentErrorMessage;
  
  errorMessageDialog.showModal();
  //$(gameResultsImageEl).attr("src", resultsImageName);
}

function closeErrorMessageDialog() {
errorMessageForm.reset();

errorMessageDialog.close();

}
      
        
// end code for dialog processing



// The setTimer function starts and stops the timer and triggers winGame() and loseGame()
function startTimer() {
  // Sets timer
  timer = setInterval(function() {
    timerCount--;
    timerElement.textContent = timerCount;
    if (timerCount >= 0) {
      // Tests if isdone condition is met
      if (isDone && isWin && timerCount > 0) {
        // Clears interval and stops timer
          clearInterval(timer);
          winGame();
          startButtonEl.disabled = false;
          document.removeEventListener("keydown", keydownAction);
      }
    }
    // Tests if time has run out
    if (timerCount <= 0 || isLoss) {
      // Clears interval
       clearInterval(timer);
       loseGame();
       timerCount = 0;
       startButtonEl.disabled = false;
       document.removeEventListener("keydown", keydownAction);
      //stopQuiz();
    }
  }, 1000);
}

function countLetterOccurrences(letter, string) {
  var positions = [];
  var count = 0;
  for (var i = 0; i < string.length; i++) {
    if (string[i] === letter) {
      count++;
      positions.push(i);
    }
  }
  return {
    count: count,
    positions: positions
  };
}

function isLetterInString(letter, string) {
  for (var i = 0; i < string.length; i++) {
    if (string[i] === letter) {
      return true;
    }
  }
  return false;
}

function getLetterPosition(letter, string) {
  for (var i = 0; i < string.length; i++) {
    if (string[i] === letter) {
      return i;
    }
  }
  return -1;
}
// this function is called whenever a keyboard key is pressed
function keydownAction(event) {
  // The key property holds the value of the key press
  var keyPress = event.key.toUpperCase();
  
  //is the key we pressed in the randomword
  var isLetterInStringResult = isLetterInString(keyPress, randomWord);

  if (isLetterInStringResult){
    gblPlayerScore = gblPlayerScore + 10;
    // if keyPress is in the random word, see how many times, and at what location in the string
    var letterPositionResult = countLetterOccurrences(keyPress, randomWord)
    // for each letter in the string, update our guessed word array, and display in proper order on the html
    for(i=0; i < letterPositionResult.count; i++){
  
      guessedWord[letterPositionResult.positions[i]] = keyPress
      var solvedWord = guessedWord.join("");
      //check to see if the user has guessed all of the letters in the word
      //if so, set the isDone and isWin flags to true
      if (solvedWord == randomWord) {
          isDone = true;
          isWin = true;
      }
      

      //display the letter on the HTML
      // BEGIN ---  THIS IS AN EXAMPLE OF THE JAVASCRIPT PORTION WE NEED TO UPDATE TO RETRO-FIT WITH FINAL HTML
      var letterPositionEl = $("#letter-" + letterPositionResult.positions[i])
      letterPositionEl.text(keyPress);
      // END ---    THIS IS AN EXAMPLE OF THE JAVASCRIPT PORTION WE NEED TO UPDATE TO RETRO-FIT WITH FINAL HTML
    }

  } else {
    gblPlayerScore = gblPlayerScore - 5;
    var isLetterInStringResult = arrayOfWrongLettersObj.includes(keyPress)
    if(!isLetterInStringResult){

 

      var newLetter = keyPress
      arrayOfWrongLettersObj.push(newLetter);
         
      wrongLettersStr = arrayOfWrongLettersObj.join(" ")
      //wrongLettersEl.append("<p style = 'display: inline-block;'>" +  wrongLettersStr + "</p>");


      // display the wrong letters
      // BEGIN ---  THIS IS AN EXAMPLE OF THE JAVASCRIPT PORTION WE NEED TO UPDATE TO RETRO-FIT WITH FINAL HTML
      var wrongLettersEl = $("#wrong-letters-p");
      wrongLettersEl.text(wrongLettersStr);
      // END ---  THIS IS AN EXAMPLE OF THE JAVASCRIPT PORTION WE NEED TO UPDATE TO RETRO-FIT WITH FINAL HTML

      numberOfWrongGuesses++;

      
      hangmanImageName = "./assets/images/" + "hangman-" +  numberOfWrongGuesses + ".png";
      $(hangmanImageEl).attr("src", hangmanImageName);


      if (numberOfWrongGuesses == fullHangManLength) {
        isDone = true;
        isLoss = true;
      }

      }


  }
  
  
}

// executes when the start button is clicked
// start a new game of hangman
function startButton(){
  //console.log("startButton")

// reset the globals
  isLoss = false;
  isWin = false; 
  isDone = false;
  gblPlayerScore = 0;
  wrongLettersStr = "";
  arrayOfWrongLettersObj = [];
  var wrongLettersEl = $("#wrong-letters-p");
  wrongLettersEl.text(wrongLettersStr);

// reset the answer display to show *'s
  for (i=0; i < wordLength; i++){
    var gameLettersEl = $("#letter-" + i)
    gameLettersEl.text("*");
  }

// reset numberOfWrongGuesses and gallows image
  numberOfWrongGuesses = 0

  hangmanImageName = "./assets/images/" + "hangman-" +  numberOfWrongGuesses + ".png";
  $(hangmanImageEl).attr("src", hangmanImageName);

 
 //start the timer 
timerCount = 15;
startTimer();

//Begin a new hang-man game
beginNewGame();
// disable to start button
 startButtonEl.disabled = true; 
 // Adds listener for keydown event
 document.addEventListener("keydown", keydownAction);
}

//initialize screen
init();

//startButtonEl.on("click", startButton);
startButtonEl.addEventListener("click", startButton);
closeDialogBtn.addEventListener("click", closeResultsDialog);
errorMessageDialogBtn.addEventListener("click", closeErrorMessageDialog);

