var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

    if(!req.session.hasOwnProperty("loggedIn")) {
        req.session.loggedIn = false;
        req.session.httpOnly = false;
    }

    let loggedIn = false;
    let name = "";

    if(req.session.hasOwnProperty("loggedIn")) {
        loggedIn = req.session.loggedIn;
        name = req.session.name;
    }

    res.cookie("loggedIn", loggedIn);
    res.cookie("name", name);
    console.log(loggedIn)
    console.log(name)
    res.render('index');
});

module.exports = router;
