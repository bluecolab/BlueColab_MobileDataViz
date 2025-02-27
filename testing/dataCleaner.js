// const axios = require('axios');
// const fs = require('fs');

// // how to run:
// // cd into this folder:
// // cd testing
// // then do:
// // npm i
// // then do:
// // node dataCleaner.js
// // make sure to put link first

// // axios is the way we do API requests in JS
// axios.get('<put link here>')
//   .then((response) => {
//     const processedData = response.data; // if the request succeeds, the response saved to this variable 

//     const newData = processedData; // change processedData some how to get it in format 
    
//     // do something with processedData here
//     // for loops are good
//     // if you wanna be fancy take a look at 
//     // map()
//     // reduce()
//     // filter()
//     // forEach()
//     // flat()
//     // flatMap()
//     // concat()
//     // join()
//     // slice()
//     // etc.

//     // output to a local file
//     fs.writeFile('processedData.json', JSON.stringify(newData, null, 2), (err) => {
//       if (err) {
//         console.error('Error writing file', err);
//       } else {
//         console.log('File has been saved!');
//       }
//     });
//   })
//   .catch((error) => {
//     console.error('Error fetching data:', error);
//   });


const axios = require('axios');
const fs = require('fs');

const parameterMap = {
  "00010": "Temp",  
  "00300": "DOpct", 
  "90860": "Sal",    
  "00095": "Cond",  
  "63680": "Turb",  
  "00400": "pH"    
};

function cleanHudsonRiverData(rawData) {
  if (!rawData?.value?.timeSeries) {
    console.error("Invalid data format");
    return [];
  }

  const parsedData = {};

  rawData.value.timeSeries.forEach(series => {
    const paramCode = series.variable.variableCode[0].value;
    const paramName = parameterMap[paramCode];

    if (!paramName) return; // Skip unneeded parameters

    series.values[0].value.forEach(entry => {
      const timestamp = entry.dateTime;
      const value = parseFloat(entry.value);

      if (!parsedData[timestamp]) {
        parsedData[timestamp] = { timestamp };
      }
      parsedData[timestamp][paramName] = value;
    });
  });

  return Object.values(parsedData);
}

axios.get('https://nwis.waterservices.usgs.gov/nwis/iv/?sites=01376307&startDT=2023-12-01&endDT=2023-12-31&format=json')
  .then((response) => {
    const processedData = response.data; 
    const newData = cleanHudsonRiverData(processedData); 
    
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
