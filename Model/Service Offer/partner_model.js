import mongoose from 'mongoose';

// Define the contact schema
export const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true }
});

// Define the history of work with UNDP schema
export const HistoryOfWorkSchema = new mongoose.Schema({
  project_title: { type: String, required: true },
  duration: { type: String, required: true },
  key_achievements: { type: String, required: true }
});

// Define the EHS team data schema
export const EHSTeamDataSchema = new mongoose.Schema({
  latest_report: { type: String, required: true },
  findings: { type: String, required: true }
});

// Define the partnership prioritization schema
export const PartnershipPrioritizationSchema = new mongoose.Schema({
  priority_level: { type: String, required: true },
  rationale: { type: String, required: true }
});

// Define the meeting log schema
export const MeetingLogSchema = new mongoose.Schema({
  meeting_date: { type: Date, required: true },
  attendees: [{ type: String, required: true }],
  key_notes: { type: String, required: true },
  outcomes: { type: String, required: true },
  action_items: { type: String, required: true }
});

// Define the press release schema
export const PressReleaseSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  link: { type: String, required: true }
});

// Define the main partner schema
export const PartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  official_website: { type: String, required: true },
  commitment_of_funding: { type: String, required: true },
  priority_areas: [{ type: String, required: true }],
  contacts: [ContactSchema],
  history_of_work_with_UNDP_CO: HistoryOfWorkSchema,
  EHS_team_data: EHSTeamDataSchema,
  partnership_prioritization: PartnershipPrioritizationSchema,
  meeting_log: [MeetingLogSchema],
  press_releases: [PressReleaseSchema]
});

// Create the model from the schema
export const PartnerModel = mongoose.model('partners_data', PartnerSchema, 'partners_data');

export default {
    PartnerSchema,
    PartnerModel
};