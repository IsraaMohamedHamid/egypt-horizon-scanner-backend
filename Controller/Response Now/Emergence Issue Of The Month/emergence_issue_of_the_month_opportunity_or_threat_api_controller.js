////////////////////////////////////////////// IMPORTS //////////////////////////////////////////////

// Consolidate model imports into a single line per model
import {
  EmergenceIssueOfTheMonthOpportunitiesAndThreatsSchema,
  EmergenceIssueOfTheMonthOpportunitiesAndThreatsModel
} from '../../../Model/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_opportunities_and_threats_model.js';

////////////////////////////////////////////// API CONTROLLER //////////////////////////////////////////////

// Common sort order
const commonSort = {
  repetition: -1,
  time: -1,
  emergingIssueOpportunityOrThreat: -1
};

// Async handler to simplify try/catch blocks
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Get a list of all emerging issues from the DB
export const getEmergingIssuesOpportunityOrThreat = asyncHandler(async (req, res) => {

  const emergingIssuesOpportunityOrThreat = await EmergenceIssueOfTheMonthOpportunitiesAndThreatsModel.find({}).sort(commonSort);

  res.send(emergingIssuesOpportunityOrThreat.length ? emergingIssuesOpportunityOrThreat : 'No emerging issues found.');
});

// Get data for one emerging issue by name
export const getEmergingIssueOpportunityOrThreatByName = asyncHandler(async (req, res) => {
  const issue = await EmergenceIssueOfTheMonthOpportunitiesAndThreatsModel.find({
    emergingIssueOpportunityOrThreat: req.params.emergingIssueOpportunityOrThreat
  }).sort(commonSort);
  res.send(issue);
});

// Add a new emerging issue to the DB
export const createEmergingIssueOpportunityOrThreat = asyncHandler(async (req, res) => {
  const newIssue = await EmergenceIssueOfTheMonthOpportunitiesAndThreatsModel.create(req.body);
  res.send(newIssue);
});

// Update an emerging issue in the DB by ID
export const updateEmergingIssueOpportunityOrThreatByID = asyncHandler(async (req, res) => {
  await findByIdAndUpdate(req.params.id, {
    $set: req.body
  });
  const updatedIssue = await EmergenceIssueOfTheMonthOpportunitiesAndThreatsModel.findById(req.params.id);
  res.send(updatedIssue);
});

// Update an emerging issue by name
export const updateEmergingIssueOpportunityOrThreatByEmergingIssueOpportunityOrThreatName = asyncHandler(async (req, res) => {
  await findOneAndUpdate({
    emergingIssueOpportunityOrThreat: req.params.emergingIssueOpportunityOrThreat
  }, {
    $set: req.body
  });
  const updatedIssue = await EmergenceIssueOfTheMonthOpportunitiesAndThreatsModel.findOne({
    emergingIssueOpportunityOrThreat: req.params.emergingIssueOpportunityOrThreat
  });
  res.send(updatedIssue);
});

// Delete an emerging issue from the DB by ID
export const deleteEmergingIssueOpportunityOrThreatByID = asyncHandler(async (req, res) => {
  const deletedIssue = await EmergenceIssueOfTheMonthOpportunitiesAndThreatsModel.findByIdAndRemove(req.params.id);
  res.send(deletedIssue);
});

// Delete an emerging issue by name
export const deleteEmergingIssueOpportunityOrThreatByEmergingIssueOpportunityOrThreatName = asyncHandler(async (req, res) => {
  const deletedIssue = await EmergenceIssueOfTheMonthOpportunitiesAndThreatsModel.findOneAndRemove({
    emergingIssueOpportunityOrThreat: req.params.emergingIssueOpportunityOrThreat
  });
  res.send(deletedIssue);
});

export default {
  getEmergingIssuesOpportunityOrThreat,
  getEmergingIssueOpportunityOrThreatByName,
  createEmergingIssueOpportunityOrThreat,
  updateEmergingIssueOpportunityOrThreatByID,
  updateEmergingIssueOpportunityOrThreatByEmergingIssueOpportunityOrThreatName,
  deleteEmergingIssueOpportunityOrThreatByID,
  deleteEmergingIssueOpportunityOrThreatByEmergingIssueOpportunityOrThreatName
};
