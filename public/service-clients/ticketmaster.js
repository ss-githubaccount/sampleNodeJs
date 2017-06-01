let tm = require('ticketmaster');
let request = require('request');

let consumerKey = "l55GBuqsoVbARtukGUqDln99Eiyx00VD";
let consumerSecret = "WoWRSOBy5GPNfMAh";
let apiKey = consumerSecret;
let baseUri = "https://app.ticketmaster.com/discovery/v2/events.json";

var GetAllEventsFcn = () => {
    request.get(`{baseUri}?apikey={apiKey}`, (error, response, body) => {
        console.log("error", error);
        console.log("response", response);
        console.log("body", body);
    });
    // tm(apiKey).discovery.v2.event.all()
    //     .then(result => {
    //         console.log("Ticketmaster get all events", result);
    //     })
    //     .catch(error => {
    //         console.log("ERROR", error);
    //     });
};

module.exports = {
    GetAllEvents: GetAllEventsFcn
};