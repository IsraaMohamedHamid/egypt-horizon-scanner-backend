import {getFilteredProjects,
    createProject,
    updateProject,
    deleteProject,
    countTotalDonationAmount} from '../../../Controller/Response Now/Interventions/projects_api_controller.js';

import { Router } from 'express';
const router = Router();


// Get a list of projects from the DB
router.get('/project', getProjects);

// Add new project to the DB
router.post('/project', createProject);

// Update a project in the DB
router.put('/project/id/:id', updateProjectByID);

router.put('/project/projectName/:projectName', updateProjectByProjectName);


// Delete a project from the DB
router.delete('/project/id/:id', deleteProjectByID);

router.delete('/project/projectName/:projectName', deleteProjectByProjectName);

// Filter Projects based on themes
router.get('/project/theme/:theme', getFilteredProjects);

// Filter Projects based on city
router.get('/project/city/:cityNameEN', getFilteredProjects);

// Count total donated amount
router.get('/project/totalDonatedAmount/:projectName', countTotalDonationAmountBasedOnProjectName);

router.get('/project/totalDonatedAmount', countTotalDonationAmount);

export default router;