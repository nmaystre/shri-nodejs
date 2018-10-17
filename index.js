const express = require('express');
const fs = require("fs");
const app = express();
const port = 8000;

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err)
    }
    console.log(`Server is listening on ${port}`)
});

app.get('/', (request, response) => {
    response.send(`<h1>Hello World!</h1>`);
});

// check start time

const convertTime = function (input) {
    var pad = function(input) {return input < 10 ? "0" + input : input;};
    return [
        pad(Math.floor(input / 3600)),
        pad(Math.floor(input % 3600 / 60)),
        pad(Math.floor(input % 60)),
    ].join(':');
}
    
const timeStart = new Date();
  
// get status

app.get('/status', (request, response) => {
    const timeEstimate = (new Date() - timeStart) / 1000;
    const timeDiff = convertTime(timeEstimate);
    response.send(`<h1>server uptime: ${timeDiff}</h1>`);
});

// check json

const getEventsData = () => {
    try {
        const json = fs.readFileSync("events.json", 'utf8');
        const content = JSON.parse(json);
        return content
    } catch (error) {
        console.log("Sorry no data found");
        return false
    }
};

//  check events types and display events 

app.get('/api/events', function (request, response) {
    const eventsData = getEventsData();
    let correctTypes = [];
    
    eventsData.events.forEach(function (item) {
      if (correctTypes.indexOf(item.type) === -1) {
        correctTypes.push(item.type);
      }
    });
  
    const type = request.query.type;
  
    if (type) {
      const typeArray = type.split(':');
      let isCorrect = false;
  
      for (let item of typeArray) {
        if (correctTypes.indexOf(item) !== -1) {
          isCorrect = true;
          break;
        }
      }
  
      if (isCorrect) {
        const filteredData = eventsData.events.filter(function (item) {
          return typeArray.indexOf(item.type) !== -1;
        });
        response.send(filteredData);
      } else {
        response.status(400).send('Incorrect type');
      }

    } else {
      response.send(eventsData);
    }
  });

// 404

app.get('*', function (request, response) {
    response.status(404).send('<h1>Page not found</h1>');
});

