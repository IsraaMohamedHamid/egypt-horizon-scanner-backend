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
router.get('/project/filter/theme/:theme', filterProjectsBasedOnTheme);

router.get('/project/theme/R_C', filterProjectsBasedOnRCTheme);

router.get('/project/theme/E_E', filterProjectsBasedOnEETheme);

router.get('/project/theme/D_E', filterProjectsBasedOnDETheme);

router.get('/project/theme/H_D', filterProjectsBasedOnHDTheme);

router.get('/project/theme/I_D', filterProjectsBasedOnIDTheme);

router.get('/project/theme/P_S', filterProjectsBasedOnPSTheme);

// Filter projects based on themes and City

// Count total donated amount
router.get('/project/totalDonatedAmount/:projectName', countTotalDonationAmountBasedOnProjectName);

router.get('/project/totalDonatedAmount', countTotalDonationAmount);

export default router;