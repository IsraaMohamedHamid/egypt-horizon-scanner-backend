import express from 'express';
import bodyParser from "body-parser";
import mongoose from 'mongoose';


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

const dbURI = 'mongodb+srv://doadmin:6d30Bi4ec59u7ag1@egypt-horizon-scanner-1948d167.mongo.ondigitalocean.com/egypt-horizon-scanner?tls=true&authSource=admin&replicaSet=egypt-horizon-scanner';
mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        tls: true,
        authSource: 'admin'
    })
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
const data = {
    msg: "Welcome on DevStack Blog App development YouTube video series",
    info: "This is a root endpoint",
    Working: "Documentations of other endpoints will be release soon :)",
    request: "Hey if you did'nt subscribed my YouTube channle please subscribe it",
};

egyptHorizonScanner.route("/").get((req, res) => res.json(data));

// CORS
import cors from 'cors';
egyptHorizonScanner.use(cors({
    origin: '*',
    credentials: true,

}));

// Middleware
egyptHorizonScanner.use("/uploads", express.static("uploads"));
egyptHorizonScanner.use(express.json());

// Initialize routes
// Importing Express routers from different modules
import dimensionRoutes from './Route/Digital Avatar/dimensionRoutes.js';
import dimensionDefinitionRoutes from './Route/Digital Avatar/dimensiondefinitionRoutes.js';
import issueDefinitionRoutes from './Route/Digital Avatar/issuedefinitionRoutes.js';
import issueRoutes from './Route/Digital Avatar/issueRoutes.js';
import issueSourceCategoryRoutes from './Route/Digital Avatar/issuesourcecategoryRoutes.js';
import projects from './Route/Response Now/Interventions/projects.js';
import districts from './Route/Response Now/Interventions/districts.js';
import cities from './Route/Response Now/Interventions/cities.js';
import governorate from './Route/Response Now/Interventions/governorate.js';
import municipalDivisions from './Route/Response Now/Interventions/municipal_divisions.js';
import emergenceIssueOfMonth from './Route/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month.js';
import emergenceIssueOfMonthData from './Route/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_data.js';
import serviceOfferAttendants from './Route/Service Offer/attendantsRoutes.js';
import serviceOfferEvents from './Route/Service Offer/eventsRoutes.js';

// Use the imported routers
egyptHorizonScanner.use('/digital-avatar/dimension', dimensionRoutes);
egyptHorizonScanner.use('/digital-avatar/dimension-definition', dimensionDefinitionRoutes);
egyptHorizonScanner.use('/digital-avatar/issue-definition', issueDefinitionRoutes);
egyptHorizonScanner.use('/digital-avatar/issue', issueRoutes);
egyptHorizonScanner.use('/digital-avatar/issue-source-category', issueSourceCategoryRoutes);

// Response Now Interventions
egyptHorizonScanner.use('/response-now/interventions', projects);
egyptHorizonScanner.use('/response-now/interventions', districts);
egyptHorizonScanner.use('/response-now/interventions', cities);
egyptHorizonScanner.use('/response-now/interventions', governorate);
egyptHorizonScanner.use('/response-now/interventions', municipalDivisions);

// Emergence Issue of the Month
egyptHorizonScanner.use('/response-now/emergence-issue-of-the-month', emergenceIssueOfMonth);
egyptHorizonScanner.use('/response-now/emergence-issue-of-the-month', emergenceIssueOfMonthData);

// Service Offer
egyptHorizonScanner.use('/service-offer/attendant', serviceOfferAttendants);
egyptHorizonScanner.use('/service-offer/events', serviceOfferEvents);

// USERS
// egyptHorizonScanner.use("/user", require("./Route/Users/user").default)
//parallelMarketsApp.use("/api", require("./routes/profile"))

// Error handling Middleware
egyptHorizonScanner.use(function (err, req, res) {
    //console.log(err);
    res.status(422).send({
        error: err.message
    });
});

// Listen for requests
egyptHorizonScanner.listen(port, function () {
    console.log('now listening for requests');
});