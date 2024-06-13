import {
    getProgrammaticSimulationsWithUpdate
} from '../../../Controller/Response Now/Programmatic Simulation/programmatic_simulation_api_controller.js';

import {
    Router
} from 'express';
const router = Router();

router.post('/programmaticSimulation/update', getProgrammaticSimulationsWithUpdate);

export default router;