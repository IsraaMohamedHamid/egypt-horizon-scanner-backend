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
egyptHorizonScanner.use('/digital-avater/dimensions', require('./'));
egyptHorizonScanner.use('/digital-avater/dimensions-definitions',  require('./Route/Digital Avatar/dimensionRoutes'));
egyptHorizonScanner.use('/digital-avater/issue-defenition-routes',  require('./Route/Digital Avatar/issueDefinitionRoutes'));
egyptHorizonScanner.use('/digital-avater/issue-routes',  require('./Route/Digital Avatar/issuesRoutes'));
egyptHorizonScanner.use('/digital-avater/issue-source-category-routes',  require('./Route/Digital Avatar/issueSourceCategoryRoutes'));

// USERS
egyptHorizonScanner.use("/user", require("./Routes/Users/user"))
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