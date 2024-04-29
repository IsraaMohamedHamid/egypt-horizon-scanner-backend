const  { 
    getEmergingIssues,
    getEmergingIssueByName,
  createEmergingIssue,
  updateEmergingIssueByID,
  updateEmergingIssueByEmergingIssueName,
  deleteEmergingIssueByID,
  deleteEmergingIssueByEmergingIssueName

} = require('../../Controller/Emergence Issue Of The Month/emergence_issue_of_the_month_api_controller')

const express = require('express');
const router = express.Router();


// Get a list of cities from the DB
router.get('/emergingIssueOfTheMonth', getEmergingIssues);

router.get('/emergingIssueOfTheMonth/findbyname/:emergingIssue', getEmergingIssueByName);

// Add new emergingIssueOfTheMonth to the DB
router.post('/emergingIssueOfTheMonth', createEmergingIssue);

// Update a emergingIssueOfTheMonth in the DB
router.put('/emergingIssueOfTheMonth/emergingIssueOfTheMonthid/:id', updateEmergingIssueByID);

router.put('/emergingIssueOfTheMonth/emergingIssueOfTheMonthnameen/:emergingIssue', updateEmergingIssueByEmergingIssueName);

// Delete a emergingIssueOfTheMonth from the DB
router.delete('/emergingIssueOfTheMonth/emergingIssueOfTheMonthid/:id', deleteEmergingIssueByID);

router.delete('/emergingIssueOfTheMonth/emergingIssueOfTheMonthnameen/:politicalMappingEventName', deleteEmergingIssueByEmergingIssueName);


module.exports = router;