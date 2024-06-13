////////////////////////////////////////////// IMPORTS //////////////////////////////////////////////

// Functions
import {
  ProgrammaticSimulation
} from '../../../Function/Response Now/Programmatic Simulation/programmatic_simulation_functions.js';

////////////////////////////////////////////// API CONTROLLER //////////////////////////////////////////////


// Async handler to simplify try/catch blocks
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Route to receive requests from Flutter
export const getProgrammaticSimulationsWithUpdate = async (req, res, next) => {
  console.log('START: CALL PROGRAMMATIC SIMULATION.');

  var data = req.body;

  try {
    console.log('START: Proceesing programmatic simulation.');
    const pythonOutput = await ProgrammaticSimulation(data);

    console.log('Data retrieval and processing completed.');
    res.send(pythonOutput);
  } catch (error) {
    console.error('Error retrieving and processing data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default {
  getProgrammaticSimulationsWithUpdate
};
