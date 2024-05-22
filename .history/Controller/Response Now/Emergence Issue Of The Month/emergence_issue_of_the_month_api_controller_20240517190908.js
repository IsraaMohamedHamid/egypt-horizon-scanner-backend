////////////////////////////////////////////// IMPORTS //////////////////////////////////////////////

// Consolidate model imports into a single line per model
const EmergenceIssueOfTheMonthModel from '../../../Model/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_model.js');
const EmergenceIssueOfTheMonthDataModel from '../../../Model/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_data_model.js');

// Functions
const {
  watchEmergingIssues,
  emergingIssueDataUpdate,
  emergingIssueComponentsCalculation
} from '../../../Function/Response Now/Emergence Issue Of The Month/emergence_issue_of_month_functions');

////////////////////////////////////////////// API CONTROLLER //////////////////////////////////////////////

// Common sort order
const commonSort = { repetition: -1, time: -1, emergingIssue: -1 };

// Async handler to simplify try/catch blocks
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);



// Get a list of all emerging issues from the DB
const getEmergingIssues = asyncHandler(async (req, res) => {
  console.log(`START: Retrieving and processing emerging issues.`);
  const emergingIssues = await EmergenceIssueOfTheMonthModel.find({}).sort(commonSort);
  console.log(`END: Retrieving and processing emerging issues.`);
  res.send(emergingIssues.length ? emergingIssues : 'No emerging issues found.');
});

// To start watching for changes
watchEmergingIssues().catch(console.error);

// Get data for one emerging issue by name
const getEmergingIssueByName = asyncHandler(async (req, res) => {
  await emergingIssueComponentsCalculation();
  const issue = await EmergenceIssueOfTheMonthModel.find({ emergingIssue: req.params.emergingIssue }).sort(commonSort);
  res.send(issue);
});

// Add a new emerging issue to the DB
const createEmergingIssue = asyncHandler(async (req, res) => {
  const newIssue = await EmergenceIssueOfTheMonthModel.create(req.body);
  res.send(newIssue);
});

// Update an emerging issue in the DB by ID
const updateEmergingIssueByID = asyncHandler(async (req, res) => {
  await EmergenceIssueOfTheMonthModel.findByIdAndUpdate(req.params.id, { $set: req.body });
  const updatedIssue = await EmergenceIssueOfTheMonthModel.findById(req.params.id);
  res.send(updatedIssue);
});

// Update an emerging issue by name
const updateEmergingIssueByEmergingIssueName = asyncHandler(async (req, res) => {
  await EmergenceIssueOfTheMonthModel.findOneAndUpdate({ emergingIssue: req.params.emergingIssue }, { $set: req.body });
  const updatedIssue = await EmergenceIssueOfTheMonthModel.findOne({ emergingIssue: req.params.emergingIssue });
  res.send(updatedIssue);
});

// Delete an emerging issue from the DB by ID
const deleteEmergingIssueByID = asyncHandler(async (req, res) => {
  const deletedIssue = await EmergenceIssueOfTheMonthModel.findByIdAndRemove(req.params.id);
  res.send(deletedIssue);
});

// Delete an emerging issue by name
const deleteEmergingIssueByEmergingIssueName = asyncHandler(async (req, res) => {
  const deletedIssue = await EmergenceIssueOfTheMonthModel.findOneAndRemove({ emergingIssue: req.params.emergingIssue });
  res.send(deletedIssue);
});

export default  {
  getEmergingIssues,
  getEmergingIssueByName,
  createEmergingIssue,
  updateEmergingIssueByID,
  updateEmergingIssueByEmergingIssueName,
  deleteEmergingIssueByID,
  deleteEmergingIssueByEmergingIssueName
};