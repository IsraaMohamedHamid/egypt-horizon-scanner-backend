const  { 
    getEmergingIssuesData,
    getEmergingIssueDataByName,
  createEmergingIssueData,
  updateEmergingIssueDataByID,
  updateEmergingIssueDataByEmergingIssueName,
  deleteEmergingIssueDataByID,
  deleteEmergingIssueDataByEmergingIssueName

} = require('../../Controller/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_data_api_controller')

const express = require('express');
const router = express.Router();


// Get a list of cities from the DB
router.get('/emergingIssueOfTheMonthData', getEmergingIssuesData);

router.get('/emergingIssueOfTheMonthData/findbyname/:emergingIssue', getEmergingIssueDataByName);

// Add new emergingIssueOfTheMonth to the DB
router.post('/emergingIssueOfTheMonthData', createEmergingIssueData);

// Update a emergingIssueOfTheMonth in the DB
router.put('/emergingIssueOfTheMonthData/emergingIssueOfTheMonthid/:id', updateEmergingIssueDataByID);

router.put('/emergingIssueOfTheMonthData/emergingIssueOfTheMonthnameen/:emergingIssue', updateEmergingIssueDataByEmergingIssueName);

// Delete a emergingIssueOfTheMonth from the DB
router.delete('/emergingIssueOfTheMonthData/emergingIssueOfTheMonthid/:id', deleteEmergingIssueDataByID);

router.delete('/emergingIssueOfTheMonth/emergingIssueOfTheMonthnameenData/:politicalMappingEventName', deleteEmergingIssueDataByEmergingIssueName);


module.exports = router;