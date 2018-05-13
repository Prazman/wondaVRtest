var fs = require('fs');

function readJSONFile(path) {
    let fs = require("fs");
    const content = fs.readFileSync(path);
    const result = JSON.parse(content);
    return result;
}

let users = readJSONFile('./data/users.json');
let projects = readJSONFile('./data/projects.json');
let visits = readJSONFile('./data/visits.json');
console.log(visits);