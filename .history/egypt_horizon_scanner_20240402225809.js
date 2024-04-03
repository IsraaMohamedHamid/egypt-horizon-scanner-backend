const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const port = process.env.port || 6600;


// Set up Express app
const parallelMarketsApp = express();

// Connect to mongodb
mongoose.connect(
    'mongodb://localhost/parallel_markets',
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
parallelMarketsApp.use(express.static('public'))

// Body Parse Middleware 
parallelMarketsApp.use(bodyParser.json());

// Initialize routes
data = {
    msg: "Welcome on DevStack Blog App development YouTube video series",
    info: "This is a root endpoint",
    Working: "Documentations of other endpoints will be release soon :)",
    request:
        "Hey if you did'nt subscribed my YouTube channle please subscribe it",
};

parallelMarketsApp.route("/").get((req, res) => res.json(data));

// CORS
const cors = require('cors');
parallelMarketsApp.use(cors({
    origin: '*',
    credentials: true,

}));

// Middleware
parallelMarketsApp.use("/uploads", express.static("uploads"));
parallelMarketsApp.use(express.json());

// Initialize routes
// PARALLEL MARKETS
parallelMarketsApp.use('/parallel-markets', require('./Routes/Parallel Markets/parallel_markets'))


// PARALLEL MARKETS MAPPER
parallelMarketsApp.use('/parallel-markets-mapper', require('./Routes/Parallel Markets Mapper/parallel_markets_mapper'))

// USERS
parallelMarketsApp.use("/user", require("./Routes/Users/user"))
//parallelMarketsApp.use("/api", require("./routes/profile"))

// Error handling Middleware
parallelMarketsApp.use(function (err, req, res, next) {
    //console.log(err);
    res.status(422).send({ error: err.message });
});

// Listen for requests
parallelMarketsApp.listen(port, function () {
    console.log('now listening for requests');
});