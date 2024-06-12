import {
    getProgrammaticSimulations,
    getProgrammaticSimulationsWithUpdate,
    getProgrammaticSimulationByName,
    createProgrammaticSimulation,
    updateProgrammaticSimulationByID,
    updateProgrammaticSimulationByProgrammaticSimulationName,
    deleteProgrammaticSimulationByID,
    deleteProgrammaticSimulationByProgrammaticSimulationName
} from '../../../Controller/Response Now/Programmatic Simulation/programmatic_simulation_api_controller.js';

import {
    Router
} from 'express';
const router = Router();


// Get a list of cities from the DB
router.get('/programmaticSimulation', getProgrammaticSimulations);

router.get('/programmaticSimulation/update', getProgrammaticSimulationsWithUpdate);

router.get('/programmaticSimulation/findbyname/:programmaticSimulation', getProgrammaticSimulationByName);

// Add new programmaticSimulation to the DB
router.post('/programmaticSimulation', createProgrammaticSimulation);

// Update a programmaticSimulation in the DB
router.put('/programmaticSimulation/programmaticSimulationid/:id', updateProgrammaticSimulationByID);

router.put('/programmaticSimulation/programmaticSimulationnameen/:emergingIssue', updateProgrammaticSimulationByProgrammaticSimulationName);

// Delete a programmaticSimulation from the DB
router.delete('/programmaticSimulation/programmaticSimulationid/:id', deleteProgrammaticSimulationByID);

router.delete('/programmaticSimulation/programmaticSimulationnameen/:programmaticSimulationName', deleteProgrammaticSimulationByProgrammaticSimulationName);


export default router;