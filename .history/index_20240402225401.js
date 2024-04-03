const express = require('express');
const app = express();
const port = 3000;

// Data
const data = {
  "Dimensions": [
    {
      "Dimension": "Gross written premium (GWP)",
      "Pillars": "Economic development",
      "Indicators": "GDP, current prices",
      "Type": "Quantitative",
      "Data Visualization": "Timeline, bar chart",
      "Source": "IMF"
    }
  ],
  "DimensionsDefinitions": [
    {
      "Term": "Dimensions",
      "Definition": "The matrix is comprised of 3 dimensions/categories: Economic, Social & Environmental. These are the main umbrellas on which the assessment is based."
    }
  ],
  "Issues": [
    {
      "Dimension": "Economic Dimension",
      "Pillars": "Economic development",
      "IssuesTitle": "Egypt's neighbouring countries and partners",
      "IssuesMainSource": "Atlantic Council",
      "SourceCategory": "Think Tank",
      "Link": "https://www.atlanticcouncil.org/in-depth-research-reports/report/egypt-stability-gcc-priority/",
      "NotesForDataAcquisitionProtocol": "Text/PDF",
      "WordDictionarySearchTerms": "Include Linkedin, Facebook and Instagram: #Egypt'sneighbouringcountriesandpartners, #securityinegypt, #egyptianneighbours #egyptianpartners #egyptiansecurity #egyptgeopoliticaltensions",
      "OtherSourcesThatCouldBeHelpful": "https://www.10tooba.org/en/"
    }
  ],
  "IssuesSourcesCategories": [
    {
      "SourceCategory": "Academic Institution",
      "Examples": "American University in Cairo and University of California"
    }
  ],
  "IssuesDefinitions": [
    {
      "Term": "Dimensions",
      "Definition": "The matrix is comprised of 3 dimensions/categories: Economic, Social & Environmental. These are the main umbrellas on which the assessment is based."
    }
  ]
};

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
