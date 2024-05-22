import mongoose from 'mongoose';
import { projectsModel } from '../../../Model/Response Now/Interventions/projects_model.js';

// Get a list of all projects and optionally filter by theme or city
export const getFilteredProjects = async (req, res) => {
  try {
    const { theme, cityNameEN } = req.params;
    const query = {};
    if (theme) query.theme = { $in: [theme] };
    if (cityNameEN) query.City_Name_EN = cityNameEN;

    const projects = await projectsModel.find(query);
    res.send(projects);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getProject = async (req, res) => {
  try {
    const projects = await projectsModel.find({});
    res.send(projects);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Add a new project to the DB
export const createProject = async (req, res) => {
  try {
    const project = await projectsModel.create(req.body);
    res.send(project);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update a project in the DB
export const updateProject = async (req, res) => {
  try {
    const { id, projectName } = req.params;
    const query = id ? { _id: id } : { projectName: projectName };
    await projectsModel.findOneAndUpdate(query, { $set: req.body });
    const updatedProject = await projectsModel.findOne(query);
    res.send(updatedProject);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Delete a project from the DB
export const deleteProject = async (req, res) => {
  try {
    const { id, projectName } = req.params;
    const query = id ? { _id: id } : { projectName: projectName };
    const deletedProject = await projectsModel.findOneAndRemove(query);
    res.send(deletedProject);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Count total donated amount for a specific project
export const countTotalDonationAmount = async (req, res) => {
  try {
    const { projectName } = req.params;
    const project = await projectsModel.findOne({ projectName }).populate('donor');
    const totalDonatedAmount = project.donor.reduce((sum, donor) => sum + donor.donationAmount, 0);

    await projectsModel.findOneAndUpdate({ projectName }, { $set: { totalDonatedAmount } });
    res.send(`Total donated amount updated for ${projectName}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export default {
  getFilteredProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  countTotalDonationAmount
};