///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
import {
  EHSTeamSchema,
  EHSTeamModel
} from '../../Model/Users/ehs_team_model.js';

///---------------------- CONTROLLERS ----------------------///

// Create a new EHSTeamMember
export async function createEHSTeamMember(req, res) {
  const newEHSTeamMember = new EHSTeamModel(req.body);
  try {
    await newEHSTeamMember.save();
    res.status(201).json(newEHSTeamMember);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
}

// Get all EHSTeamMembers
export async function getAllEHSTeamMembers(req, res) {
  try {
    const userHistories = await EHSTeamModel.find();
    res.json(userHistories);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

// Get a single EHSTeamMember by ID
export async function getEHSTeamMemberById(req, res) {
  try {
    const userHistories = await EHSTeamModel.findById(req.params.id);
    if (!userHistories) return res.status(404).json({
      message: 'EHSTeamMember not found'
    });
    res.json(userHistories);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

// Update a EHSTeamMember by ID
export async function updateEHSTeamMember(req, res) {
  try {
    const updatedEHSTeamMember = await EHSTeamModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(updatedEHSTeamMember);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
}

// Update an EHSTeamMember by Name
export async function updateEHSTeamMemberByName(req, res) {
  try {
    const updatedEHSTeamMember = await EHSTeamModel.findOneAndUpdate(
      {
        username: req.params.userHistoryName,
        email: req.params.userHistoryEmail,
      }, // Use an object to specify the query criteria
      req.body, // Update document
      { new: true, upsert: true } // Options including upsert
    );

    res.json(updatedEHSTeamMember);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
}

// Delete a EHSTeamMember by ID
export async function deleteEHSTeamMember(req, res) {
  try {
    await EHSTeamModel.findByIdAndDelete(req.params.id);
    res.json({
      message: 'EHSTeamMember deleted'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

// Update an EHSTeamMember by Name
export async function deleteEHSTeamMemberByName(req, res) {
  try {
    const deletedEHSTeamMember = await EHSTeamModel.findOneAndDelete(
      {
        userHistoryName: req.params.userHistoryName,
        userHistoryEmail: req.params.userHistoryEmail
      }, // Use an object to specify the query criteria
    );

    if (!deletedEHSTeamMember) {
      return res.status(404).json({ message: "EHSTeamMember not found" });
    }

    res.json(deletedEHSTeamMember);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
}

// export default { createEHSTeamMember, getAllEHSTeamMembers, getEHSTeamMemberById, updateEHSTeamMember, deleteEHSTeamMember };
export default {
  createEHSTeamMember,
  getAllEHSTeamMembers,
  getEHSTeamMemberById,
  updateEHSTeamMember,
  updateEHSTeamMemberByName,
  deleteEHSTeamMember,
  deleteEHSTeamMemberByName
};