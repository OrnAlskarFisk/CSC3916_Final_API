const express = require("express");
const http = require('http');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const router = express.Router();

const actions_test = {
    input: "666",
    toggle: true,
    high: true
};
const temp = {
    A: 70,
    B: 70,
    C: 76,
    D: 72,
    E: 65
};

function getBadRouteJSON(req, res, route) {
    res.json({success: false, msg: req.method + " requests are not supported by " + route});
}

function getTempJSONObject(req, msg) {
    const json = {
        highlevel: {
            state: "false"
        },
        monitors: {
            master_bedroom: temp.A,
            guest_bedroom: temp.B,
            kitchen: temp.C,
            living_room: temp.D,
            basement: temp.E
        },
        actions: {
        }
    };

    return (json);
}

router.route('/thermostat')
    .get(
        function (req, res) {
            res.json(getTempJSONObject(req, "GET tempurature"));
        })
    .put(
        function (req, res) {
            const json = {
                highlevel: {
                    state: "false"
                },
                monitors: {
                    master_bedroom: temp.A,
                    guest_bedroom: temp.B,
                    kitchen: 70,
                    living_room: temp.D,
                    basement: temp.E
                },
                actions: {
                }
            };
            res.json(json);
        })
    .all(function (req, res) {
        getBadRouteJSON(req, res, "/thermostat");
    });

router.post('/button', function(req, res) {
    const json = {
        highlevel: {
            state: "false"
        },
        monitors: {
            master_bedroom: 70,
            guest_bedroom: 70,
            kitchen: 70,
            living_room: 70,
            basement: 70
        },
        actions: {
        }
    };
    res.json(json);
}).post('/toggle', function (req, res) {
    var query = Object.keys(req.query).length === 0 ? null : req.query;

    if ( query.hasOwnProperty(("state")) ) {
        actions_test.toggle = query.state === "true";
    }

    res.send({status: 200, message: "Toggle updated"});
}).post('/input', function (req, res) {
    actions_test.input = req.body.value;
    res.json({status: 200, value: req.body.value});
}).post('/high', function (req, res) {
    res.send({status: 200, message: "Button updated"});
});

app.use('/', router);
app.use(function (req, res) {
    getBadRouteJSON(req, res, "this URL path");
});
app.listen(process.env.PORT || 8080);

module.exports = app; // for testing