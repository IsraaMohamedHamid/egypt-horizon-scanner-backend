///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
import {
  createEHSTeamMember,
  getAllEHSTeamMembers,
  getEHSTeamMemberById,
  updateEHSTeamMember,
  updateEHSTeamMemberByName,
  deleteEHSTeamMember,
  deleteEHSTeamMemberByName
} from "../../Controller/Users/ehs_team_api_controller.js";

///---------------------- LIBRARIES ----------------------///
import {
  Router
} from "express";
const router = Router();

///------------------------------------------ ROUTES ------------------------------------------///
// Create a new EHSTeamMember
router.post('/createEHSTeamMember/', createEHSTeamMember);

// Get all EHSTeamMembers
router.get('/getAllEHSTeamMembers/', getAllEHSTeamMembers);

// Get a EHSTeamMember by ID
router.get('/getEHSTeamMemberById/:id', getEHSTeamMemberById);

// Update a EHSTeamMember by ID
router.post('/updateEHSTeamMember/:id/', updateEHSTeamMember);

// Update a EHSTeamMember by Name
router.post('/updateEHSTeamMemberByName/:userHistoryName/:userHistoryEmail', updateEHSTeamMemberByName);

// Delete a EHSTeamMember by ID
router.delete('/deleteEHSTeamMember/:id/', deleteEHSTeamMember);

// Delete a EHSTeamMember by Name
router.delete('/deleteEHSTeamMemberByName/:userHistoryName/:userHistoryEmail', deleteEHSTeamMemberByName);

///------------------------------------------ EXPORTS ------------------------------------------///
export default router;