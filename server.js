let express = require("express"),
    app = express(),
    moment = require("moment")
    millionaire = require("./app/millionaire"),
    

app.set("port", (process.env.PORT || 9280));

console.log(`${moment().format("MMMM D")} at ${moment().format("h:mm A")} (PDT)`);
console.log(`${moment().format('l')} ${moment().format('LT')}`)


millionaire({
  millionaire_victims_already_emailed: []
 })
