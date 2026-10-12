const fs = require("fs");

const data = fs.readFileSync("words.txt", "utf8");

const words = data
    .split("\n")
    .map(word => word.trim().toUpperCase())
    .filter(word => word !== "");


const wordSet = new Set(words);

const wordGraph = {};

function findNeighbours(word){
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const neighbours = [];

    for (let i = 0; i < word.length; i++) {
        for (let q = 0; q < alphabet.length; q++) {
            let tempWord = word.slice(0, i) + alphabet[q] + word.slice(i + 1);
            if (wordSet.has(tempWord)){
                neighbours.push(tempWord);
            }
        }
    }

    return neighbours;
}

for(const word of words){
    wordGraph[word] = findNeighbours(word);
}

fs.writeFileSync("wordGraph.json", JSON.stringify(wordGraph, null, 2));