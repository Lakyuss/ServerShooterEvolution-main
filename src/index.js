const path = require('path');
const express = require('../node_modules/express');
const app = express();

const swaggerUi = require('../node_modules/swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const bodyParser = require("../node_modules/body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var apijs = require('./Api.js');

////////////BUY REQUIRES///////////
var{ buyDiamonds1 } = require('./Api.js');
var{ buyDiamonds2 } = require('./Api.js');
var{ buyCoins1 } = require('./Api.js');
var{ buyCoins2 } = require('./Api.js');
var{ buySkill1 } = require('./Api.js');
var{ buySkill2 } = require('./Api.js');
var{ buySkill3 } = require('./Api.js');
var{ buySkill4 } = require('./Api.js');
var{ buySkill5 } = require('./Api.js');
var{ buySkill6 } = require('./Api.js');

//Settings
const port = process.env.PORT || 2000; 

//Static files
app.use('/', apijs);
app.use(express.urlencoded({extended: false}))

//Start the server
const server = app.listen(port, () => { 
    console.log('Server on port: ',port);
});

//WebSockets
const SocketIO = require('../node_modules/socket.io');
const io = SocketIO(server); 
 
  io.on('connection', (socket) => {
    console.log('new connection', socket.id)
    socket.on('buycoins1', (data) =>{
        var coins1 = buyCoins1(data)
        if(coins1 != 'Error'){
          socket.emit('playerdata', coins1)
        }
    });
    socket.on('buycoins2', (data) =>{
      var coins2 = buyCoins2(data)
      if(coins2 != 'Error'){
        socket.emit('playerdata', coins2)
      }
    });
    socket.on('buydiamonds2', (data) =>{
      var diamonds2 = buyDiamonds2(data)
      if(diamonds2 != 'Error'){
        socket.emit('playerdata', diamonds2)
      }
    });
    socket.on('buydiamonds1', (data) =>{
      var diamonds1 = buyDiamonds1(data)
      if(diamonds1 != 'Error'){
        socket.emit('playerdata', diamonds1)
      }
    });
    socket.on('buySkill1', (data) =>{
      var skill1 = buySkill1(data)
      if(skill1 != 'Error'){
        socket.emit('playerdata', skill1)
      }
    });
    socket.on('buySkill2', (data) =>{
      var skill2 = buySkill2(data)
      if(skill2 != 'Error'){
        socket.emit('playerdata', skill2)
      }
    });
    socket.on('buySkill3', (data) =>{
      var skill3 = buySkill3(data)
      if(skill3 != 'Error'){
        socket.emit('playerdata', skill3)
      }
    });
    socket.on('buySkill4', (data) =>{
      var skill4 = buySkill4(data)
      if(skill4 != 'Error'){
        socket.emit('playerdata', skill4)
      }
    });
    socket.on('buySkill5', (data) =>{
      var skill5 = buySkill5(data)
      if(skill5 != 'Error'){
        socket.emit('playerdata', skill5)
      }
    });
    socket.on('buySkill6', (data) =>{
      var skill6 = buySkill6(data)
      if(skill6 != 'Error'){
        socket.emit('playerdata', skill6)
      }
    });   
});
  
module.exports = app;