///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
import {
  userHistorySchema,
  UserHistoryhModel
} from '../../Model/Users/user_history_model.js';

///---------------------- CONTROLLERS ----------------------///

// Create a new UserHistory
export async function createUserHistory(req, res) {
  const newUserHistory = new userHistorySchema(req.body);
  try {
    await newUserHistory.save();
    res.status(201).json(newUserHistory);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
}

// Get all UserHistories
export async function getAllUserHistories(req, res) {
  try {
    const userHistories = await UserHistoryhModel.find();
    res.json(userHistories);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

// Get a single UserHistory by ID
export async function getUserHistoryById(req, res) {
  try {
    const userHistories = await UserHistoryhModel.findById(req.params.id);
    if (!userHistories) return res.status(404).json({
      message: 'UserHistory not found'
    });
    res.json(userHistories);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

// Update a UserHistory by ID
export async function updateUserHistory(req, res) {
  try {
    const updatedUserHistory = await UserHistoryhModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(updatedUserHistory);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
}

// Update an UserHistory by Name
export async function updateUserHistoryByName(req, res) {
  try {
    const updatedUserHistory = await UserHistoryhModel.findOneAndUpdate(
      {
        userHistoryName: req.params.userHistoryName,
        userHistoryEmail: req.params.userHistoryEmail,
      }, // Use an object to specify the query criteria
      req.body, // Update document
      { new: true } // Options
    );

    if (!updatedUserHistory) {
      return res.status(404).json({ message: "UserHistory not found" });
    }

    res.json(updatedUserHistory);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
}

// Delete a UserHistory by ID
export async function deleteUserHistory(req, res) {
  try {
    await UserHistoryhModel.findByIdAndDelete(req.params.id);
    res.json({
      message: 'UserHistory deleted'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

// Update an UserHistory by Name
export async function deleteUserHistoryByName(req, res) {
  try {
    const deletedUserHistory = await UserHistoryhModel.findOneAndDelete(
      {
        userHistoryName: req.params.userHistoryName,
        userHistoryEmail: req.params.userHistoryEmail
      }, // Use an object to specify the query criteria
    );

    if (!deletedUserHistory) {
      return res.status(404).json({ message: "UserHistory not found" });
    }

    res.json(deletedUserHistory);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
}

// export default { createUserHistory, getAllUserHistories, getUserHistoryById, updateUserHistory, deleteUserHistory };
export default {
  createUserHistory,
  getAllUserHistories,
  getUserHistoryById,
  updateUserHistory,
  updateUserHistoryByName,
  deleteUserHistory,
  deleteUserHistoryByName
};