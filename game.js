const submitButton = document.getElementById("submit-button"); // creates a new variable named button and sets it as the documents button with the id testButton
const wordInput = document.getElementById("word-input"); // a constant variable is NEVER changed and only used for refrencing objects like buttons and texts
const wordContainer = document.getElementById("word-container");
const errorText = document.getElementById("error-text");
const targetWordText = document.getElementById("target-word");
const gameContainer = document.getElementById("game-container");
const menuContainer = document.getElementById("menu-container");
const shortestPathText = document.getElementById("shortest-path");
const movesNeededText = document.getElementById("moves-required");
const startContainer = document.getElementById("start-menu");
const easyButton = document.getElementById("easy-button");
const mediumButton = document.getElementById("medium-button");
const hardButton = document.getElementById("hard-button");
const hardestButton = document.getElementById("hardest-button");
const restartButton = document.getElementById("restart-button");
const giveupButton = document.getElementById("giveup-button");
const newgameButton = document.getElementById("newgame-button");

let currentWord;
let oldWord;
let targetWord;
let onlyOneLetterDifferent = false;
let multipleLettersDifferent = false;
let words = [];
let wordGraph = {};
let wordIndex;
let isANeighbour;
let path = [];
let movesRequired;
let movesTaken = 0;
let difficultyFloor;
let difficultyCeiling;
let wordsPrinted = [];


function IntializeGame(){
    wordsPrinted.forEach(function(word) {
        word.remove();
    });

    wordsPrinted = [];
    menuContainer.classList.add("hidden");
    gameContainer.classList.add("hidden");
    startContainer.classList.remove("hidden");      
}

function oneLetterDifferent(word1, word2){
    if(words.includes(currentWord)){
        if(word1.length === word2.length){ // make sure both words are equal in length
            onlyOneLetterDifferent = false;
            multipleLettersDifferent = false;
            isANeighbour = false;

            for (let i = 0; i < word1.length; i++) { // loop through each word to check which letters are different
                if ((word1[i] != word2[i]) && !onlyOneLetterDifferent){ // if a letter is different
                    onlyOneLetterDifferent = true;
                } else if ((word1[i] != word2[i]) && onlyOneLetterDifferent){ // if more than one letter is different
                    onlyOneLetterDifferent = false;
                    multipleLettersDifferent = true;
                    break;
                }
            }

            if (onlyOneLetterDifferent){ // if only one letter in each word is different
                console.log("Only One Letter Different!");
                oldWord = currentWord;
                printWord(currentWord);
                movesTaken++;

                if(word1 === targetWord){
                    EndGame();
                }
            } else if (!onlyOneLetterDifferent && !multipleLettersDifferent){ // if no letters in each word were different
                errorText.textContent = "you had one job";
                setTimeout(function() {
                    errorText.textContent = "";
                }, 2000);

            } else if (multipleLettersDifferent){ // if more than one letter was different
                errorText.textContent = "Too Many Letters Are Different!";
                setTimeout(function() {
                    errorText.textContent = "";
                }, 2000);
            }
         }
    } else {
        errorText.textContent = "That's Not Even A Word!";
        setTimeout(function() {
                        errorText.textContent = "";
        }, 2000);
    }
}

function printWord(wordToprint){
    // create the element on the webpage
    const newWord = document.createElement("div");
    newWord.classList.add("word");

    for (let i = 0; i < wordToprint.length; i++){
        const newLetter = document.createElement("div");
        newLetter.classList.add("letter");
        newLetter.textContent = wordToprint[i];

        if(newLetter.textContent === targetWord[i]){
            newLetter.classList.add("correct");
        } else {
           newLetter.classList.add("wrong"); 
        }

        newWord.appendChild(newLetter);
    }
    wordContainer.appendChild(newWord);
    wordsPrinted.push(newWord);
}

function findTargetWord(start,iterations){
    console.time("BFS");
        path = [];
        let possibleWords = [];
        let queue = [start];
        const parent = {};
        const visited = new Set([start]); // create a set containing the starting word and keeps track of words we've already checked that way we dont get caught in a loop

        while (queue.length > 0 && possibleWords.length < iterations){
            let layer = [];
            let layerSize = queue.length;

            for(let i = 0; i < layerSize; i++){
                const neighbours = getNeighbours(queue[0]).filter(word => !visited.has(word));
                layer.push(...neighbours);
                queue.push(...neighbours); // adds each individual element of neighbours to the queue to be checked
                for(const neighbour of neighbours){
                     visited.add(neighbour);
                     parent[neighbour] = queue[0];
                }
                queue.shift();
            }
            possibleWords.push(layer);
        }

   console.timeEnd("BFS");
   const targetLayer = possibleWords[iterations - 1];

   if (!targetLayer || targetLayer.length === 0) {
        return false;
   }

    const randomIndex = Math.floor(Math.random() * targetLayer.length);
    targetWord = targetLayer[randomIndex];
    let current = targetWord;
    path = [];

    while (current !== start) {
        path.push(current);
        current = parent[current];
    }

    path.push(start);
    path.reverse();

    console.log(path);
    movesRequired = path.length - 1;
    return true;
}

function getNeighbours(origin){
    return(wordGraph[origin]);
}

function startGame(){
    startContainer.classList.add("hidden");
    wordIndex = Math.floor(Math.random() * words.length);
    oldWord = words[wordIndex];
    const difficulty = Math.floor(Math.random() * (difficultyCeiling - difficultyFloor + 1)) + difficultyFloor; 
    movesTaken = 0;

    const targetFound = findTargetWord(oldWord, difficulty);
    if (!targetFound) {
        startGame();
        return;
    } else {
        printWord(oldWord);
        targetWordText.innerHTML = `Target Word: <span class="highlight">${targetWord}</span> in ${movesRequired}`;
        menuContainer.classList.add("hidden");
        gameContainer.classList.remove("hidden");   
    }
}

function EndGame(){
    gameContainer.classList.add("hidden");

    shortestPathText.innerHTML = "Shortest Path: " + path.map(word => `<span class="highlight">${word}</span>`).join(" → ");
    
    if (movesTaken == movesRequired)
    {
        movesNeededText.innerHTML = `Moves Required: <span class="highlight">${movesTaken}</span> / ${movesRequired}`;
    } else if (movesTaken < (movesRequired + 3)){
        movesNeededText.innerHTML = `Moves Required: <span class="yellow">${movesTaken}</span> / ${movesRequired}`;
    } else if (movesTaken < (movesRequired + 6)){
        movesNeededText.innerHTML = `Moves Required: <span class="orange">${movesTaken}</span> / ${movesRequired}`;
    } else {
        movesNeededText.innerHTML = `Moves Required: <span class="red">${movesTaken}</span> / ${movesRequired}`;
    }
    


    menuContainer.classList.remove("hidden");
}

wordInput.addEventListener("input", function() { // executes whenever something is put into the submission box
    wordInput.value = wordInput.value.replace(/[^a-zA-Z]/g, "").toUpperCase(); // changes everything to be only uppercase letters
});

wordInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        submitButton.click();
    }
});

easyButton.addEventListener("click", function() { // adds an event trigger for the button being clicked, and then adds a function to be executed whenever the button is clicked
    difficultyFloor = 4;
    difficultyCeiling = 6;
    startGame();
});

mediumButton.addEventListener("click", function() { // adds an event trigger for the button being clicked, and then adds a function to be executed whenever the button is clicked
    difficultyFloor = 7;
    difficultyCeiling = 9;
    startGame();
});

hardButton.addEventListener("click", function() { // adds an event trigger for the button being clicked, and then adds a function to be executed whenever the button is clicked
    difficultyFloor = 10;
    difficultyCeiling = 14;
    startGame();
});

hardestButton.addEventListener("click", function() { // adds an event trigger for the button being clicked, and then adds a function to be executed whenever the button is clicked
    difficultyFloor = 18;
    difficultyCeiling = 18;
    startGame();
});

submitButton.addEventListener("click", function() { // adds an event trigger for the button being clicked, and then adds a function to be executed whenever the button is clicked
    currentWord = wordInput.value;
    oneLetterDifferent(currentWord,oldWord);
    wordInput.value = "";
});

giveupButton.addEventListener("click", function(){
    IntializeGame();
});

newgameButton.addEventListener("click", function(){
    IntializeGame();
});

restartButton.addEventListener("click", function(){
    wordsPrinted.forEach(function(word, index) {
        if (index !== 0) {
            word.remove();
        }
    });

    oldWord = path[0];
});



Promise.all([
    fetch("wordGraph.json").then(response => response.json()),
    fetch("words.txt").then(response => response.text())
])
.then(([graphData, wordsData]) => {
    wordGraph = graphData;

    words = wordsData
        .split("\n")
        .map(word => word.trim().toUpperCase())
        .filter(word => word !== "");

    IntializeGame();
})
.catch(error => {
    console.error("Failed to load game data:", error);
});