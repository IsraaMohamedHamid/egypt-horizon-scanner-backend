const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const port = process.env.port || 3000;


// Set up Express app
const egyptHorizonScanner = express();

// Middleware
egyptHorizonScanner.use(express.json());

// Connect to mongodb
// mongoose.connect(
//     // 'mongodb://localhost/egypt_horizon_scanner',
//     'mongodb+srv://doadmin:3SPyA6U2Q901Ot75@dbaas-db-5626135-310aba91.mongo.ondigitalocean.com/egypt-horizon-scanner?tls=true&authSource=admin&replicaSet=dbaas-db-5626135',
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     }
// );

// username = doadmin
// password = hP87169GS025UVwJ
// host = mongodb+srv://dbaas-db-5626135-310aba91.mongo.ondigitalocean.com
// database = egypt-horizon-scanner

const dbURI = 'mongodb+srv://doadmin:73Le6F4d2hZ9K8Y0@dbaas-db-5626135-310aba91.mongo.ondigitalocean.com/egypt-horizon-scanner?replicaSet=dbaas-db-5626135&tls=true&authSource=admin';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, tls: true, authSource: 'admin' })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

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
egyptHorizonScanner.use('/digital-avatar/dimension', require('./Route/Digital Avatar/dimensionRoutes'));
egyptHorizonScanner.use('/digital-avatar/dimension-definition',  require('./Route/Digital Avatar/dimensiondefinitionRoutes'));
egyptHorizonScanner.use('/digital-avatar/issue-definition',  require('./Route/Digital Avatar/issuedefinitionRoutes'));
egyptHorizonScanner.use('/digital-avatar/issue',  require('./Route/Digital Avatar/issueRoutes'));
egyptHorizonScanner.use('/digital-avatar/issue-source-category',  require('./Route/Digital Avatar/issuesourcecategoryRoutes'));


// Response Now
egy

//---------- INTERVENTIONS
egyptHorizonScanner.use('/response-now/interventions', require('./Route/Response Now/Interventions/projects'))
egyptHorizonScanner.use('/response-now/interventions', require('./Route/Response Now/Interventions/districts'))
egyptHorizonScanner.use('/response-now/interventions', require('./Route/Response Now/Interventions/cities'))
egyptHorizonScanner.use('/response-now/interventions', require('./Route/Response Now/Interventions/governorate'))
egyptHorizonScanner.use('/response-now/interventions', require('./Route/Response Now/Interventions/municipal_divisions'))

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