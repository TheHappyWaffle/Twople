const submitButton = document.getElementById("submit-button"); // creates a new variable named button and sets it as the documents button with the id testButton
const wordInput = document.getElementById("word-input"); // a constant variable is NEVER changed and only used for refrencing objects like buttons and texts
const wordContainer = document.getElementById("word-container");

let currentWord;
let oldWord;
let onlyOneLetterDifferent = false;
let firstGuess = true;
let multipleLettersDifferent = false;

function oneLetterDifferent(word1, word2){
    if(word1.length = word2.length){ // make sure both words are equal in length
        onlyOneLetterDifferent = false;
        multipleLettersDifferent = false;

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

            // create the element on the webpage
            const newWord = document.createElement("div");
            newWord.classList.add("word");

            for (let i = 0; i < currentWord.length; i++){
                const newLetter = document.createElement("div");
                newLetter.classList.add("letter");
                newLetter.textContent = currentWord[i];
                newWord.appendChild(newLetter);
            }
            wordContainer.appendChild(newWord);

        } else if (!onlyOneLetterDifferent && !multipleLettersDifferent){ // if no letters in each word were different
            console.log("you had one fucking job");

        } else if (multipleLettersDifferent){ // if more than one letter was different
            console.log("Too many letters are different!");
        }
    }
}

wordInput.addEventListener("input", function() { // executes whenever something is put into the submission box
    wordInput.value = wordInput.value.replace(/[^a-zA-Z]/g, "").toUpperCase(); // changes everything to be only uppercase letters
});

submitButton.addEventListener("click", function() { // adds an event trigger for the button being clicked, and then adds a function to be executed whenever the button is clicked
    currentWord = wordInput.value;

    if(firstGuess){
        firstGuess = false;
        oldWord = "COLD";
    }

    oneLetterDifferent(currentWord,oldWord);
});

fetch("words.txt")
    .then(response => response.text())
    .then(data => {
        const words = data.split("\n");
        console.log(words);
    });