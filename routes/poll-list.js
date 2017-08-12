var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var pollModel = require("../model/poll");


router.get('/', function(req, res, next) {
    mongoose.Promise = global.Promise;
    let prom = pollModel.find();

    prom.then(polls => {
        res.send(polls);
    });

    prom.catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
});

router.get('/userList/:user', function(req, res, next) {
    mongoose.Promise = global.Promise;
    let prom = pollModel.find({"owner": req.params.user});

    prom.then(polls => {
        res.send(polls);
    });

    prom.catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
});

module.exports = router;