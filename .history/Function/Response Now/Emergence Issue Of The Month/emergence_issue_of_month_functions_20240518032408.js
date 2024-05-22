// Assuming you've defined ExecutingAgency as a schema
import { ExecutingAgencySchema } from './executing_agency_model.js';

// Correcting Project Schema definition
export const ProjectSchema = new mongoose.Schema({
  ...
  executingAgency: [ExecutingAgencySchema], // Correctly embed as an array of schemas
  ...
});