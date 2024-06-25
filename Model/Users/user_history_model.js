import { Timestamp } from 'mongodb';
import mongoose from 'mongoose';

// Create UserExperiences Schema and Model
export const userHistorySchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    selectedDimension: {
      type: String,
  
    },
    selectedPillars: {
      type: String,
  
    },
    selectedIndicators: {
      type: [String],
  
    },
    Timestamp: {
      type: String,
  
    },
})

export const UserHistoryhModel = mongoose.model('user_history', userHistorySchema, 'user_history');

export default {
    userHistorySchema,
    UserHistoryhModel
};