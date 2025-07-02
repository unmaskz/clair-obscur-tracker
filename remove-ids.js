const fs = require('fs');
const path = require('path');

// Read the locations.json file
const filePath = path.join(__dirname, 'data', 'locations.json');
const outputFilePath = path.join(__dirname, 'data', 'locations_no_id.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Remove only the top-level "id" property from each object in the array
const cleanedData = data.map(obj => {
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        const { id, ...rest } = obj;
        return rest;
    }
    return obj;
});

// Write the cleaned data to a new file
fs.writeFileSync(outputFilePath, JSON.stringify(cleanedData, null, 4), 'utf8');

console.log('Successfully wrote locations_no_id.json with top-level "id" properties removed.'); 