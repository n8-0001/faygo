// gets files
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const log = require('./structs/log.js');
const error = require('./structs/error.js');
const functions = require('./structs/functions.js');
//makes the env available
dotenv.config();

if (!fs.existsSync("./ClientSettings")) fs.mkdirSync("./ClientSettings");
global.JWT_SECRET = functions.MakeID();
// port
const port = 8080;
const tokens = JSON.parse(fs.readFileSync("./tokenManager/tokens.json").toString());
for (let tokenType in tokens) {
    for (let tokenIndex of tokens[tokenType]) {
        let decodedToken = jwt.decode(tokens[tokenType][tokenIndex].token.replace("eg1~", ""));
        if (DateAddHours(new Date(decodedToken.creation_date), decodedToken.hours_expire).getTime() < new Date().getTime()) {
        }
    }
}
fs.writeFileSync("./tokenManager/tokens.json", JSON.stringify(tokens, null, 2));
global.accessTokens = tokens.accessTokens;
global.refreshTokens = tokens.refreshTokens;
global.clientTokens = tokens.clientTokens;
global.exchangeCodes = [];

// connect to mongoDB
mongoose.connect(process.env.MONGODB_URI, () => {
    log.backend("Connected to MongoDB!");
});
// failed to connect to mongoDB
mongoose.connection.on("error", (err) => {
    log.backend("Failed to connect to MongoDB! Look down below for error");
    log.backend(err);
})

app.use(rateLimit({ windowMs: 0.5 * 60 * 1000, max: 45 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

fs.readorSync("./routes").forEach(fileName => {
    app.use(require(`./routes/${fileName}`));
})

//checks for port and discordbot
app.listen(port, () => {
    log.backend(`Server running on port ${port}`);
    require("./xmpp/xmpp.js");
    require("./Bot");
}).on("error", async (err) => {
    if (err.code === "EADDRINUSE") {
        log.backend(`Port ${port} is already in use!`);
        await functions.sleep(3000)
        process.exit(0);
    } else throw err;
});
// if endpoing not found
app.use((req, res, next) => {
    error.createError(
        "errors.com.epicgames.common.not_found", 
        "Sorry the resource you were trying to find could not be found", 
        undefined, 1004, undefined, 404, res
    );
});

function DateAddHours(pdate, number) {
    let date = pdate;
    date.setHours(date.getHours() + number);

    return date;
}

// this should be finished add what ever you want