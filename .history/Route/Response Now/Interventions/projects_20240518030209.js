import {getFilteredProjects,
    createProject,
    updateProject,
    deleteProject,
    countTotalDonationAmount} from '../../../Controller/Response Now/Interventions/projects_api_controller.js';

import { Router } from 'express';
const router = Router();


// Get a list of projects from the DB
router.get('/project', getProject);

// Add new project to the DB
router.post('/project', createProject);

// Update a project in the DB
router.put('/project/id/:id', updateProject);

router.put('/project/projectName/:projectName', updateProject);


// Delete a project from the DB
router.delete('/project/id/:id', deleteProject);

router.delete('/project/projectName/:projectName', deleteProject);

// Filter Projects based on themes
router.get('/project/filter/theme/:theme', getFilteredProjects);

router.get('/project/theme/R_C', getFilteredProjects);

router.get('/project/theme/E_E', getFilteredProjects);

router.get('/project/theme/D_E', getFilteredProjects);

router.get('/project/theme/H_D', getFilteredProjects);

router.get('/project/theme/I_D', getFilteredProjects);

router.get('/project/theme/P_S', getFilteredProjects);

// Filter projects based on themes and City

// Count total donated amount
router.get('/project/totalDonatedAmount/:projectName', countTotalDonationAmount);

router.get('/project/totalDonatedAmount', countTotalDonationAmount);

export default router;