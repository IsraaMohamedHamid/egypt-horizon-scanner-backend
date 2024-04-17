const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const port = process.env.port || 3000;


// Set up Express app
const egyptHorizonScanner = express();

// Middleware
egyptHorizonScanner.use(express.json());

// Connect to mongodb
mongoose.connect(
    'mongodb://localhost/egypt_horizon_scanner',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
mongoose.Promise = global.Promise;

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDb connected");
});

// Middleware to allow users to input output image
egyptHorizonScanner.use(express.static('public'))

// Body Parse Middleware 
egyptHorizonScanner.use(bodyParser.json());

// Initialize routes
data = {
    msg: "Welcome on DevStack Blog App development YouTube video series",
    info: "This is a root endpoint",
    Working: "Documentations of other endpoints will be release soon :)",
    request:
        "Hey if you did'nt subscribed my YouTube channle please subscribe it",
};

egyptHorizonScanner.route("/").get((req, res) => res.json(data));

// CORS
const cors = require('cors');
egyptHorizonScanner.use(cors({
    origin: '*',
    credentials: true,

}));

// Middleware
egyptHorizonScanner.use("/uploads", express.static("uploads"));
egyptHorizonScanner.use(express.json());

// Initialize routes
// Digital Avatar
egyptHorizonScanner.use('/digital-avater/dimensions', require('./Route/Digital Avatar/dimensionRoutes'));
egyptHorizonScanner.use('/digital-avater/dimensions-definitions',  require('./Route/Digital Avatar/dimensiondefinitionRoutes'));
egyptHorizonScanner.use('/digital-avater/issue-defenition',  require('./Route/Digital Avatar/issuedefinitionRoutes'));
egyptHorizonScanner.use('/digital-avater/issue-routes',  require('./Route/Digital Avatar/issueRoutes'));
egyptHorizonScanner.use('/digital-avater/issue-source-category-routes',  require('./Route/Digital Avatar/issuesourcecategoryRoutes'));


// Response Now

//---------- INTERVENTIONS
egyptHorizonScanner.use('/response-now/interventions', require('./Route/Response Now/Interventions/projects'))
egyptHorizonScanner.use('/response-now/interventions', require('./Route/Response Now/Interventions/localities'))
egyptHorizonScanner.use('/response-now/interventions', require('./Route/Response Now/Interventions/states'))

//---------- EMERGENCE ISSUE OF THE MONTH
egyptHorizonScanner.use('/response-now/emergence-issue-of-the-month', require('./Route/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month'))
egyptHorizonScanner.use('/response-now/emergence-issue-of-the-month', require('./Route/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_data'))


// USERS
egyptHorizonScanner.use("/user", require("./Route/Users/user"))
//parallelMarketsApp.use("/api", require("./routes/profile"))

// Error handling Middleware
egyptHorizonScanner.use(function (err, req, res, next) {
    //console.log(err);
    res.status(422).send({ error: err.message });
});

// Listen for requests
egyptHorizonScanner.listen(port, function () {
    console.log('now listening for requests');
});