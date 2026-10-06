const button = document.getElementById("testButton"); // creates a new variable named button and sets it as the documents button with the id testButton
const pageTitle = document.getElementById("Title"); // a constant variable is NEVER changed and only used for refrencing objects like buttons and texts
let clicks = 1; // let is used for dyanmic variables

button.addEventListener("click", function() { // adds an event trigger for the button being clicked, and then adds a function to be executed whenever the button is clicked
    pageTitle.textContent = clicks // changes the text content property of the title heading 
    clicks += 1;
});