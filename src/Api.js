const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const fs = require('fs');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

let code100 = { code: 100, error: false, message: '2-DAMVI Server Up!' };
let code200 = { code: 200, error: false, message: 'Player Exists' };
let code201 = { code: 201, error: false, message: 'Player Created Correctly!'};
let code202 = { code: 202, error: false, message: 'Player Updated Correctly! '};
let code204 = { code: 204, error: false, message: 'Player Deleted Correctly'};
let codeError502 = { code: 503, error: true, message: 'The fields are mandatories' };
let codeError503 = { code: 503, error: true, message: 'Error: Player Exists' };
let codeError504 = { code: 504, error: true, message: 'Error: Player not found'};

var players = [];
let response = {
    error: false,
    code: 200,
    message: ''
};

///////////////////////SAVE AND GET JSON FUNCTIONS/////////////////////////////
function savejson(){
    jsonString = JSON.stringify(players, null, 4);
    fs.writeFileSync('./src/player.json', jsonString,'UTF8', (err) => { 
        if (err){
            console.log("error")
        }
        console.log('The file has been saved!'); 
    });
};
function getjson(){
    var jsonString = fs.readFileSync('./src/player.json', 'UTF8')
    players = JSON.parse(jsonString);
};
 
////////////////UPDATE RANKING FUNCTION///////////////////////////
function UpdateRanking() {
    //Order the ranking
    players.sort((a, b) => (a.score <= b.score) ? 1 : -1);
    //Position Update
    for (var x = 0; x < players.length; x++) {
        players[x].position = x + 1;
    }
    savejson();
    getjson();
};

////////////////////////API GETS/PUTS/POSTS/DELETES//////////////////////////////
router.get('/', function (req, res) {
    res.send(code100);
});
router.get('/ranking', function (req, res) {
    let ranking = { numberplayers: players.length, players: players };
    res.send(ranking);
});
//////////////GET ALL PLAYERS//////////////////////
router.get('/players', function (req, res){
    res.send(players);
});

//////////////GET PLAYER///////////////
router.get('/players/:alias', function (req, res) {
    var index = players.findIndex(j => j.alias === req.params.alias);
    if (index >= 0) {                                                                                                                     
        response = code200;
        response.jugador = players[index];
    } else {
        response = codeError504;
    }
    res.send(response);
});

////////////////////LOGIN USER///////////////////////
router.get('/login/:alias/:password', function(req, res) {
    getjson();
    var paramAlias = req.params.alias || ''
    var paramPassword = req.params.password || ''

    var userFound = players.some(players => players.alias === paramAlias)
    var userFoundPass = players.some(players => players.alias === paramAlias && players.password === paramPassword)

    if(userFound == true && userFoundPass == true){
        response = "Has iniciado sesion";
        index = players.findIndex(j => j.alias === paramAlias)
        res.send(players[index])
    }else if(userFound == true && userFoundPass == false){
        res.send("Error: Player credentials wrong")
    }else{
        res.send('Error: Player not found')
    }
    
});

/////////////ADD PLAYER AND USE UPDATE RANKING///////////////////
router.post('/players/:alias', function (req, res) {
    var paramAlias = req.params.alias || '';
    var paramPassword = req.body.password || '';
    var paramEmail = req.body.email || '';

    if (paramAlias === '' ||  paramEmail === '' || paramPassword === '') {
        response = codeError502;
    } 
    else 
    {
        var index = players.findIndex(j => j.alias === paramAlias)
        if (index != -1) 
        {
            response = codeError503;
        } 
        else 
        {
            players.push({ 
                position: '', 
                alias: paramAlias,
                password: paramPassword, 
                score: 0 ,
                coins: 0,
                diamonds: 0,
                email: paramEmail,
                created: new Date()
            });
            UpdateRanking();
            index = players.findIndex(j => j.alias === paramAlias);
            response = code201;
            response.player = players[index];
        }
    }
    res.send(response);
});


///////////UPDATE PLAYER//////////////////////////
router.put('/players/:alias', function (req, res) {
    getjson()
    var paramalias = req.params.alias || '';
    var paramPassword = req.body.password || '';

    var paramScore = req.body.score || '';
    var paramEmail = req.body.email || '';

    if (paramalias === '' ||  parseInt(paramScore) <= 0 || paramScore === '' || paramEmail === '') 
    {
        response = codeError502;
    } 
    else 
    {
        var index = players.findIndex(j => j.alias === paramalias)
        if (index != -1) 
        {
            //Update Player
            players[index] = { 
                position: '', 
                alias: paramalias,
                password: paramPassword, 
                score: paramScore,
                email: paramEmail,
                created:  players[index].created,
                updated: new Date()
            };
            UpdateRanking();
            index = players.findIndex(j => j.alias === paramalias);
            response = code202;
            response.jugador = players[index];
        }
        else
        {
            response = codeError504;
        }
    }
    res.send(response);
});

////////////////DELETE PLAYER/////////////////////////
router.delete('/players/:email/:password', function(req, res){
    getjson()
    var paramEmail = req.params.email || ''
    var paramPassword = req.params.password || ''
    index = players.findIndex(j => j.email === paramEmail)
    if(index != -1)
    {
        if(players[index].email==paramEmail && players[index].password==paramPassword){

            players.splice(index, 1)
            response = code204;
            UpdateRanking();
        }else{
            ////ERROR ON CREDENTIALS///
            response = 'Credentials Wrong';
        }
    }else
    {
        //PLAYER ERROR -> NOT FOUND///
        response = 'Player not found';       
    }
    res.send(response);
});
function buyCoins1(data){
    getjson()
    var index = players.findIndex(j => j.alias == data)
    if(index != -1){
        players[index].coins += 5000
        players[index].diamonds -= 100
        savejson()
        response = players[index]
    }else{
        response = 'Error'
    }
    return response
}
function buyCoins2(data){
    getjson()
    var index = players.findIndex(j => j.alias == data)
    if(index != -1){
        players[index].coins += 15000
        players[index].diamonds -= 250
        savejson()
        response = players[index]
    }else{
        response = 'Error'
    }
    return response
}
function buyDiamonds1(data){
    getjson()
    var index = players.findIndex(j => j.alias == data)
    if(index != -1){
        players[index].diamonds += 100
        savejson()
        response = players[index]
    }else{
        response = 'Error'
    }
    return response
};
function buyDiamonds2(data){
    getjson()
    var index = players.findIndex(j => j.alias == data)
    if(index != -1){
        players[index].diamonds += 250
        savejson()
        response = players[index]
    }else{
        response = 'Error'
    }
    return response
}

module.exports = router;
module.exports.buyDiamonds1 = buyDiamonds1
module.exports.buyDiamonds2 = buyDiamonds2
module.exports.buyCoins1 = buyCoins1
module.exports.buyCoins2 = buyCoins2


