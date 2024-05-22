import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const port = process.env.PORT || 3000;
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// CORS configuration
app.use(cors({
    origin: 'http://example.com', // Specify allowed origin for security in production
    credentials: true,
}));

// MongoDB connection setup
const dbURI = process.env.DATABASE_URL; // Use an environment variable for your MongoDB URI
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

mongoose.Promise = global.Promise;

// Static files middleware
app.use(express.static('public'));
app.use("/uploads", express.static("uploads"));

// Route handling
import dimensionRoutes from './Route/Digital%20Avatar/dimensionRoutes.js';
import dimensionDefinitionRoutes from './Route/Digital%20Avatar/dimensiondefinitionRoutes';
import issueDefinitionRoutes from './Route/Digital%20Avatar/issuedefinitionRoutes';
import issueRoutes from './Route/Digital Avatar/issueRoutes';
import issueSourceCategoryRoutes from './Route/Digital Avatar/issuesourcecategoryRoutes';

app.use('/digital-avatar/dimension', dimensionRoutes);
app.use('/digital-avatar/dimension-definition', dimensionDefinitionRoutes);
app.use('/digital-avatar/issue-definition', issueDefinitionRoutes);
app.use('/digital-avatar/issue', issueRoutes);
app.use('/digital-avatar/issue-source-category', issueSourceCategoryRoutes);

// Example endpoint
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Horizon Scanner API!"
    });
});

// Error handling Middleware
app.use(function (err, req, res, next) {
    console.error(err);
    res.status(422).send({ error: err.message });
});

// Server initialization
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});