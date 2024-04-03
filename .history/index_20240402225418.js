const express = require('express');
const app = express();
const port = 3000;

// Data


app.use(express.json());

app.get('/dimensions', (req, res) => {
  res.json(data.Dimensions);
});

app.get('/dimensions-definitions', (req, res) => {
  res.json(data.DimensionsDefinitions);
});

app.get('/issues', (req, res) => {
  res.json(data.Issues);
});

app.get('/issues-sources-categories', (req, res) => {
  res.json(data.IssuesSourcesCategories);
});

app.get('/issues-definitions', (req, res) => {
  res.json(data.IssuesDefinitions);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
