const  { 
    getProjects,
    createProject,
    updateProjectByID,
    updateProjectByProjectName,
    deleteProjectByID,
    deleteProjectByProjectName,
    filterProjectsBasedOnTheme,
    filterProjectsBasedOnRCTheme,
    filterProjectsBasedOnEETheme,
    filterProjectsBasedOnDETheme,
    filterProjectsBasedOnIDTheme,
    filterProjectsBasedOnHDTheme,
    filterProjectsBasedOnPSTheme,
    filterProjectsBasedOnThemeandCity,
    filterProjectsBasedOnRCThemeandCity,
    filterProjectsBasedOnEEThemeandCity,
    filterProjectsBasedOnDEThemeandCity,
    filterProjectsBasedOnIDThemeandCity,
    filterProjectsBasedOnHDThemeandCity,
    filterProjectsBasedOnPSThemeandCity,
    countTotalDonationAmountBasedOnProjectName,
    countTotalDonationAmount
} = require('../../Controller/Interventions/projects_api_controller')

const express = require('express');
const router = express.Router();


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
router.get('/project/filter/theme&city/:cityNameEN&:theme', filterProjectsBasedOnThemeandCity);

router.get('/project/theme&city/:cityNameEN&:theme', filterProjectsBasedOnRCThemeandCity);

router.get('/project/theme&city/:cityNameEN&:theme', filterProjectsBasedOnEEThemeandCity);

router.get('/project/theme&city/:cityNameEN&:theme', filterProjectsBasedOnDEThemeandCity);

router.get('/project/theme&city/:cityNameEN&:theme', filterProjectsBasedOnHDThemeandCity);

router.get('/project/theme&city/:cityNameEN&:theme', filterProjectsBasedOnIDThemeandCity);

router.get('/project/theme&city/:cityNameEN&:theme', filterProjectsBasedOnPSThemeandCity);

// Count total donated amount
router.get('/project/totalDonatedAmount/:projectName', countTotalDonationAmountBasedOnProjectName);

router.get('/project/totalDonatedAmount', countTotalDonationAmount);

module.exports = router;