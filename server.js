const fs = require('fs');
const path = require('path');
const { animals } = require('./data/animals');
const express = require('express');
const PORT = process.env.PORT || 3001;

const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));

// parse incoming JSON data
app.use(express.json());

// makes resources in 'public' directory static so that our front end can use them
app.use(express.static('public'));

// filter by multiple selections or one, returns an array for multiple
function filterByQuery(query, animalsArray) {

    let personalityTraitsArray = [];

    let filteredResults = animalsArray;

    if (query.personalityTraits) {

        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }

        // loop thru traits in array
        personalityTraitsArray.forEach(trait => {
            // check the trait against each animal in the filteredResults array
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }

    if(query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if(query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if(query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }

    return filteredResults
}

// filter by specific id, returns one(1) result
function findById(id, animalsArray) {

    const result = animalsArray.filter(animal => animal.id === id)[0];

    return result;
}

// creates new data for animals.json
function createNewAnimal(body, animalsArray) {

    const animal = body;

    animalsArray.push(animal);

    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    
    return animal
}

// validate correct data input
function validateAnimal(animal) {

    if (!animal.name || typeof animal.name !== 'string') {
        return false
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false
    }

    return true
}

// get request returns json with results
app.get('/api/animals', (req, res) => {
    let results = animals;

    if (req.query) {
        results = filterByQuery(req.query, results);
    }

    res.json(results);
});

// get request returns json with result or 404
app.get('/api/animals/:id', (req, res) => {

    const result = findById(req.params.id, animals);

    if (result) {
        res.json(result);
    } else {
        res.sendStatus(404);
    }

});

// get request route to html homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// get request route to animals.html
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

// get request route to zookeepers.html
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// Wildcard route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// creates id for new data entry, returns animal.json
app.post('/api/animals', (req, res) => {

    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted!');
    } else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);

        res.json(animal);
    }
    
});

// app listening on port 3001
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});