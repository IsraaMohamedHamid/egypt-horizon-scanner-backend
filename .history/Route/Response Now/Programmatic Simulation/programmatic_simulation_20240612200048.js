import {
    getEmergingIssues,
    getEmergingIssuesWithUpdate,
    getEmergingIssueByName,
    createEmergingIssue,
    updateEmergingIssueByID,
    updateEmergingIssueByEmergingIssueName,
    deleteEmergingIssueByID,
    deleteEmergingIssueByEmergingIssueName
} from '../../../Controller/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_api_controller.js';

import {
    Router
} from 'express';
const router = Router();


// Get a list of cities from the DB
router.get('/programmaticSimulation', getEmergingIssues);

router.get('/programmaticSimulation/update', getEmergingIssuesWithUpdate);

router.get('/programmaticSimulation/findbyname/:programmaticSimulation', getEmergingIssueByName);

// Add new programmaticSimulation to the DB
router.post('/programmaticSimulation', createEmergingIssue);

// Update a programmaticSimulation in the DB
router.put('/programmaticSimulation/programmaticSimulationid/:id', updateEmergingIssueByID);

router.put('/programmaticSimulation/programmaticSimulationnameen/:emergingIssue', updateEmergingIssueByEmergingIssueName);

// Delete a programmaticSimulation from the DB
router.delete('/programmaticSimulation/programmaticSimulationid/:id', deleteEmergingIssueByID);

router.delete('/programmaticSimulation/programmaticSimulationnameen/:politicalMappingEventName', deleteEmergingIssueByEmergingIssueName);


export default router;