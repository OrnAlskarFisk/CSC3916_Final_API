var express = require('express');
const http = require('http');
var bodyParser = require('body-parser');
const passport = require('passport');
var cors = require("cors");

var app = express();
module.exports = app; // for testing

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());

var router = express.Router();

var temp = {
    A: 70,
    B: 70,
    C: 75,
    D: 72,
    E: 65
};

// This is just test stuff for WebAPI class
var actions_test = {
    input: "666",
    toggle: true,
    high: true
};

function getBadRouteJSON(req, res, route) {
    res.json({success: false, msg: req.method + " requests are not supported by " + route});
}

function getTempJSONObject(req, msg) {
    var json = {
        highlevel: {
            value: msg
        },
        monitors: {
            MasterBedroom: temp.A,
            GuestBedroom: temp.B,
            Kitchen: temp.C,
            LivingRoom: temp.D,
            Basement: temp.E
        },
        actions: {
            test_input_number: actions_test.input, test_toggle: actions_test.toggle
        }
    };
    res.send(json);
}

router.route('/temp')
    .get(
        function (req, res) {
            res.json(getTempJSONObject(req, "GET temp"));
        })
    .post(
        function (req, res) {
            res.json(getTempJSONObject(req, "temp saved"));
        })
    .put(
        function (req, res) {
            res.json(getTempJSONObject(req, "temp updated"));
        })
    .all(function (req, res) {
        getBadRouteJSON(req, res, "/temp");
    });

app.use('/', router);
app.use(function (req, res) {
    getBadRouteJSON(req, res, "this URL path");
});
app.listen(process.env.PORT || 8080);

module.exports = app;