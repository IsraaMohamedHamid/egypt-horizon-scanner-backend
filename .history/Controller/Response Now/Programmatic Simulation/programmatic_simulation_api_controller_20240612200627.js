////////////////////////////////////////////// IMPORTS //////////////////////////////////////////////

// Consolidate model imports into a single line per model
import {
  ProgrammaticSimulationSchema,
  ProgrammaticSimulationModel
} from '../../../Model/Response Now/Programmatic Simulation/programmatic_simultaion_model.js';

// Functions
import {
  ProgrammaticSimulationDataUpdate
} from '../../../Function/Response Now/Programmatic Simulation/programmatic_simulation_functions.js';

////////////////////////////////////////////// API CONTROLLER //////////////////////////////////////////////


// Async handler to simplify try/catch blocks
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Get a list of all emerging issues from the DB
export const getProgrammaticSimulations = asyncHandler(async (req, res) => {

  const emergingSimulations = await ProgrammaticSimulationModel.find({}).sort(commonSort);
  console.log('Data retrieval and processing completed.');
  res.send(emergingSimulations.length ? emergingSimulations : 'No emerging issues found.');
});

// Get a list of all emerging issues from the DB
export const getProgrammaticSimulationsWithUpdate = asyncHandler(async (req, res) => {
  console.log('START: CALL emerging issues data.');

  const issues = await ProgrammaticSimulationDataModel.find({}).sort(sortCriteria);
  console.log('START: Summary and Sentiment analysis for emerging issues data.');

  // await emergingSimulationDataUpdate();
  console.log('END: Summary and Sentiment analysis for emerging issues data.');

  const emergingSimulations = await ProgrammaticSimulationModel.find({}).sort(commonSort);
  console.log('Data retrieval and processing completed.');
  res.send(emergingSimulations.length ? emergingSimulations : 'No emerging issues found.');
});

// To start watching for changes
// watchProgrammaticSimulations().catch(console.error);

// Get data for one emerging issue by name
export const getProgrammaticSimulationByName = asyncHandler(async (req, res) => {
  await emergingSimulationComponentsCalculation();
  const issue = await ProgrammaticSimulationModel.find({
    emergingSimulation: req.params.emergingSimulation
  }).sort(commonSort);
  res.send(issue);
});

// Add a new emerging issue to the DB
export const createProgrammaticSimulation = asyncHandler(async (req, res) => {
  const newSimulation = await ProgrammaticSimulationModel.create(req.body);
  res.send(newSimulation);
});

// Update an emerging issue in the DB by ID
export const updateProgrammaticSimulationByID = asyncHandler(async (req, res) => {
  await findByIdAndUpdate(req.params.id, {
    $set: req.body
  });
  const updatedSimulation = await ProgrammaticSimulationModel.findById(req.params.id);
  res.send(updatedSimulation);
});

// Update an emerging issue by name
export const updateProgrammaticSimulationByProgrammaticSimulationName = asyncHandler(async (req, res) => {
  await findOneAndUpdate({
    emergingSimulation: req.params.emergingSimulation
  }, {
    $set: req.body
  });
  const updatedSimulation = await ProgrammaticSimulationModel.findOne({
    emergingSimulation: req.params.emergingSimulation
  });
  res.send(updatedSimulation);
});

// Delete an emerging issue from the DB by ID
export const deleteProgrammaticSimulationByID = asyncHandler(async (req, res) => {
  const deletedSimulation = await ProgrammaticSimulationModel.findByIdAndRemove(req.params.id);
  res.send(deletedSimulation);
});

// Delete an emerging issue by name
export const deleteProgrammaticSimulationByProgrammaticSimulationName = asyncHandler(async (req, res) => {
  const deletedSimulation = await ProgrammaticSimulationModel.findOneAndRemove({
    emergingSimulation: req.params.emergingSimulation
  });
  res.send(deletedSimulation);
});

export default {
  getProgrammaticSimulations,
  getProgrammaticSimulationsWithUpdate,
  getProgrammaticSimulationByName,
  createProgrammaticSimulation,
  updateProgrammaticSimulationByID,
  updateProgrammaticSimulationByProgrammaticSimulationName,
  deleteProgrammaticSimulationByID,
  deleteProgrammaticSimulationByProgrammaticSimulationName
};
