////////////////////////////////////////////// IMPORTS //////////////////////////////////////////////

// Single import line for the model
import { EmergenceIssueOfTheMonthDataSchema,  EmergenceIssueOfTheMonthDataModel } from '../../../Model/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_data_model.js';

////////////////////////////////////////////// API CONTROLLER //////////////////////////////////////////////

// Common sorting order
const sortCriteria = { source: 1, sourceCategory: 1, emergenceIssue: 1 };

// Get a list of all emerging issues from the DB
export const getEmergingIssuesData = async (req, res, next) => {
  try {
    const issues = await EmergenceIssueOfTheMonthDataModel.find({}).sort(sortCriteria);
    // res.send(issues);
    const results = await emergingIssueDataSummary(issues);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

// Get data for one emerging issue by name
export const getEmergingIssueDataByName = async (req, res, next) => {
  try {
    const issue = await EmergenceIssueOfTheMonthDataModel.find({ emergingIssue: req.params.emergingIssue }).sort(sortCriteria);
    res.send(issue);
  } catch (error) {
    next(error);
  }
};

// Add a new emerging issue to the DB
export const createEmergingIssueData = async (req, res, next) => {
  try {
    const newIssue = await EmergenceIssueOfTheMonthDataModel.create(req.body);
    res.send(newIssue);
  } catch (error) {
    next(error);
  }
};

// Update an emerging issue in the DB by ID
export const updateEmergingIssueDataByID = async (req, res, next) => {
  try {
    await findByIdAndUpdate(req.params.id, { $set: req.body });
    const updatedIssue = await EmergenceIssueOfTheMonthDataModel.findById(req.params.id);
    res.send(updatedIssue);
  } catch (error) {
    next(error);
  }
};

// Update an emerging issue by name
export const updateEmergingIssueDataByEmergingIssueName = async (req, res, next) => {
  try {
    await findOneAndUpdate({ emergingIssue: req.params.emergingIssue }, { $set: req.body });
    const updatedIssue = await EmergenceIssueOfTheMonthDataModel.findOne({ emergingIssue: req.params.emergingIssue });
    res.send(updatedIssue);
  } catch (error) {
    next(error);
  }
};

// Delete an emerging issue from the DB by ID
export const deleteEmergingIssueDataByID = async (req, res, next) => {
  try {
    const deletedIssue = await EmergenceIssueOfTheMonthDataModel.findByIdAndRemove(req.params.id);
    res.send(deletedIssue);
  } catch (error) {
    next(error);
  }
};

// Delete an emerging issue by name
export const deleteEmergingIssueDataByEmergingIssueName = async (req, res, next) => {
  try {
    const deletedIssue = await EmergenceIssueOfTheMonthDataModel.findOneAndRemove({ emergingIssue: req.params.emergingIssue });
    res.send(deletedIssue);
  } catch (error) {
    next(error);
  }
};

export default {
  getEmergingIssuesData,
  getEmergingIssueDataByName,
  createEmergingIssueData,
  updateEmergingIssueDataByID,
  updateEmergingIssueDataByEmergingIssueName,
  deleteEmergingIssueDataByID,
  deleteEmergingIssueDataByEmergingIssueName
};