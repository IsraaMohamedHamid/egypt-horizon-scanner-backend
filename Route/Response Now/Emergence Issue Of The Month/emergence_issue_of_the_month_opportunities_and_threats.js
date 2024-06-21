import {
    getEmergingIssuesOpportunityOrThreat,
    getEmergingIssueOpportunityOrThreatByName,
    createEmergingIssueOpportunityOrThreat,
    updateEmergingIssueOpportunityOrThreatByID,
    updateEmergingIssueOpportunityOrThreatByEmergingIssueOpportunityOrThreatName,
    deleteEmergingIssueOpportunityOrThreatByID,
    deleteEmergingIssueOpportunityOrThreatByEmergingIssueOpportunityOrThreatName
} from '../../../Controller/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_opportunity_or_threat_api_controller.js';

import {
    Router
} from 'express';
const router = Router();


// Get a list of cities from the DB
router.get('/emergenceIssueOfTheMonthOpportunityOrThreat', getEmergingIssuesOpportunityOrThreat);

router.get('/emergenceIssueOfTheMonthOpportunityOrThreat/findbyname/:username/:email/:emergingIssueOpportunityOrThreat', getEmergingIssueOpportunityOrThreatByName);

// Add new emergenceIssueOfTheMonthOpportunityOrThreat to the DB
router.post('/emergenceIssueOfTheMonthOpportunityOrThreat', createEmergingIssueOpportunityOrThreat);

// Update a emergenceIssueOfTheMonthOpportunityOrThreat in the DB
router.put('/emergenceIssueOfTheMonthOpportunityOrThreat/emergenceIssueOfTheMonthOpportunityOrThreatid/:id', updateEmergingIssueOpportunityOrThreatByID);

router.put('/emergenceIssueOfTheMonthOpportunityOrThreat/emergenceIssueOfTheMonthOpportunityOrThreatnameen/:username/:email/:emergingIssueOpportunityOrThreat', updateEmergingIssueOpportunityOrThreatByEmergingIssueOpportunityOrThreatName);

// Delete a emergenceIssueOfTheMonthOpportunityOrThreat from the DB
router.delete('/emergenceIssueOfTheMonthOpportunityOrThreat/emergenceIssueOfTheMonthOpportunityOrThreatid/:id', deleteEmergingIssueOpportunityOrThreatByID);

router.delete('/emergenceIssueOfTheMonthOpportunityOrThreat/emergenceIssueOfTheMonthOpportunityOrThreatnameen/:username/:email/:emergingIssueOpportunityOrThreat', deleteEmergingIssueOpportunityOrThreatByEmergingIssueOpportunityOrThreatName);


export default router;