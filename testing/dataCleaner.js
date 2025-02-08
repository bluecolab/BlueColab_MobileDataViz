const axios = require('axios');
const fs = require('fs');

// how to run:
// cd into this folder:
// cd testing
// then do:
// npm i
// then do:
// node dataCleaner.js
// make sure to put link first

axios.get('<put link here>')
  .then((response) => {
    const processedData = response.data;

    const newData = processedData; // change this 
    
    // do something with processedData here
    // for loops are good
    // if you wanna be fancy take a look at 
    // map()
    // reduce()
    // filter()
    // forEach()
    // flat()
    // flatMap()
    // concat()
    // join()
    // slice()
    // etc.




    // output
    fs.writeFile('processedData.json', JSON.stringify(newData, null, 2), (err) => {
      if (err) {
        console.error('Error writing file', err);
      } else {
        console.log('File has been saved!');
      }
    });
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });
