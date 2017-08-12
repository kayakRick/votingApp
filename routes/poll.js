var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var pollModel = require("../model/poll");

function getPoll(pollId, req, res){
    mongoose.Promise = global.Promise;
    let prom = pollModel.findOne({"_id": pollId});

    prom
        .then(polls => {
        res.send(polls);
    })

        .catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
}


router.get('/:id', function(req, res, next) {
    getPoll(req.params.id, req, res);
});

router.put('/', function(req, res, next) {

    newPollModel = new pollModel({
        owner: req.body.owner,
        question: req.body.question,
        response: req.body.response
    });

    mongoose.Promise = global.Promise;
    let prom = newPollModel.save();

    prom
        .then(poll => res.sendStatus(200))

        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });

});

router.post('/:id/:resp', function(req, res, next) {
    mongoose.Promise = global.Promise;
    let fieldObj = {};
    fieldObj["response." + req.params.resp + ".votes"] = 1;
    let prom = pollModel.findOneAndUpdate({"_id": req.params.id},
        {$inc: fieldObj},
        {upsert: true, strict: false, returnNewDocument: true});

    prom.then(poll => {
        getPoll(req.params.id, req, res);
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    });

});


router.post('/newResp/:id/:num/:resp', function(req, res, next) {
    mongoose.Promise = global.Promise;
    let fieldObj = {};
    fieldObj["response." + req.params.num + ".votes"] = 0;
    fieldObj["response." + req.params.num + ".response"] = req.params.resp;
    console.log(fieldObj)
    let prom = pollModel.findOneAndUpdate({"_id": req.params.id},
        {$set: fieldObj},
        {upsert: true, strict: false, returnNewDocument: true});

    prom.then(poll => {
        getPoll(req.params.id, req, res);
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    });

});

router.delete('/:id', function(req, res, next) {
    mongoose.Promise = global.Promise;
    let prom = pollModel.remove({"_id": req.params.id});

    prom.then(poll => {
       res.sendStatus(200);
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
});


module.exports = router;