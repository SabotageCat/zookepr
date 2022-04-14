const fs = require('fs');
const path = require('path');

// filter by multiple selections or one, returns an array for multiple
function filterByQuery(query, zookeepers) {

    let filteredResults = zookeepers;

    if(query.age) {
        filteredResults = filteredResults.filter(zookeeper => zookeeper.age === Number(query.age));
    }
    if(query.favoriteAnimal) {
        filteredResults = filteredResults.filter(zookeeper => zookeeper.favoriteAnimal === query.favoriteAnimal);
    }
    if(query.name) {
        filteredResults = filteredResults.filter(zookeeper => zookeeper.name === query.name);
    }

    return filteredResults
}

// filter by specific id, returns one(1) result
function findById(id, zookeepers) {

    const result = zookeepers.filter(zookeeper => zookeeper.id === id)[0];

    return result;
}

// creates new data for zookeepers.json
function createNewZookeeper(body, zookeepers) {

    const zookeeper = body;

    zookeepers.push(zookeeper);

    fs.writeFileSync(
        path.join(__dirname, '../data/zookeepers.json'),
        JSON.stringify({ zookeepers }, null, 2)
    );
    
    return zookeeper
}

// validate correct data input
function validateZookeeper(zookeeper) {

    if (!zookeeper.name || typeof zookeeper.name !== "string") {
      return false;
    }
    if (!zookeeper.age || typeof zookeeper.age !== "number") {
      return false;
    }
    if (!zookeeper.favoriteAnimal || typeof zookeeper.favoriteAnimal !== "string") {
      return false;
    }
    return true;
}

module.exports = {
    filterByQuery,
    findById,
    createNewZookeeper,
    validateZookeeper,
};