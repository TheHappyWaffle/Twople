const submitButton = document.getElementById("submit-button"); // creates a new variable named button and sets it as the documents button with the id testButton
const wordInput = document.getElementById("word-input"); // a constant variable is NEVER changed and only used for refrencing objects like buttons and texts
const wordContainer = document.getElementById("word-container");
const errorText = document.getElementById("error-text");
const targetWordText = document.getElementById("target-word");

let currentWord;
let oldWord;
let targetWord;
let onlyOneLetterDifferent = false;
let multipleLettersDifferent = false;
let words = [];
let wordIndex;
let isANeighbour;
let difficultyFloor = 5;
let difficultyMax = 10;

function oneLetterDifferent(word1, word2, searchingForNeighbours){
    if(searchingForNeighbours || words.includes(currentWord)){
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

            if(!searchingForNeighbours){
                if (onlyOneLetterDifferent){ // if only one letter in each word is different
                    console.log("Only One Letter Different!");
                    oldWord = currentWord;
                    printWord(currentWord);

                } else if (!onlyOneLetterDifferent && !multipleLettersDifferent){ // if no letters in each word were different
                    errorText.textContent = "you had one fucking job";
                    setTimeout(function() {
                        errorText.textContent = "";
                    }, 2000);

                } else if (multipleLettersDifferent){ // if more than one letter was different
                    errorText.textContent = "Too Many Letters Are Different!";
                    setTimeout(function() {
                        errorText.textContent = "";
                    }, 2000);
                }
            } else {
                if(onlyOneLetterDifferent){
                    isANeighbour = true;
                }
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
}

function findTargetWord(start, iterations){
    const visited = new Set([start]); // create a set containing the starting word and keeps track of words we've already checked that way we dont get caught in a loop
    let tempWord = start;

    for(let i = 0; i < iterations; i++){
        const neighbours = getNeighbours(tempWord).filter(word => !visited.has(word));
        if(neighbours.length === 0){
            break;
        }

        let wordHolderIndex = Math.floor(Math.random() * neighbours.length);
        tempWord = neighbours[wordHolderIndex];
        visited.add(tempWord);
    }

    targetWord = tempWord;
    console.log(visited);
    console.log(targetWord);
}

function getNeighbours(origin){
    let neighbours = [];
    for(let i = 0; i < words.length; i++){
        oneLetterDifferent(origin,words[i],true);

        if(isANeighbour){
            neighbours.push(words[i])
        }
    }

    return(neighbours);
}

function startGame(){
    wordIndex = Math.floor(Math.random() * words.length);
    oldWord = words[wordIndex];
    const difficulty = Math.floor(Math.random() * (difficultyMax - difficultyFloor + 1)) + difficultyFloor; 


    findTargetWord(oldWord,difficulty);
    printWord(oldWord);
    targetWordText.textContent = "Target Word: "+targetWord;
}

wordInput.addEventListener("input", function() { // executes whenever something is put into the submission box
    wordInput.value = wordInput.value.replace(/[^a-zA-Z]/g, "").toUpperCase(); // changes everything to be only uppercase letters
});

wordInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        submitButton.click();
    }
});

submitButton.addEventListener("click", function() { // adds an event trigger for the button being clicked, and then adds a function to be executed whenever the button is clicked
    currentWord = wordInput.value;
    oneLetterDifferent(currentWord,oldWord,false);
    wordInput.value = "";
});

fetch("words.txt")
    .then(response => response.text())
    .then(data => {
        words = data.split("\n").map(word => word.trim().toUpperCase()).filter(word => word !== ""); // make the array of words ant make sure it's only 4 letter non-empty strings

        startGame();
    })


    