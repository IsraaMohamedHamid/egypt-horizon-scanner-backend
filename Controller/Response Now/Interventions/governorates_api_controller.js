import NodeCache from 'node-cache';
import { schedule } from 'node-cron';
const myCache = new NodeCache({ stdTTL: 21600 }); // Cache with a TTL of 6 hours

import { governoratesModel } from '../../../Model/Response Now/Interventions/governorate_model.js';
import { projectsModel } from '../../../Model/Response Now/Interventions/projects_model.js';

// Helper function to count projects by theme for a governorate
export async function countProjectsByTheme(governorateName) {
  const themes = ['R_C', 'E_E', 'D_E', 'I_D', 'H_D', 'P_S'];
  const themeCounts = {};
  for (const theme of themes) {
    themeCounts[theme] = await projectsModel.countDocuments({
      Governorate_Name_EN: governorateName,
      theme: { $in: [theme] }
    });
  }
  return themeCounts;
}

// Helper function to count projects by UN Agencies for a governorate and extract unique UN agencies
export async function countProjectsByUNAgencies(governorateName) {
  const unAgenciesList = ['UNICEF', 'UNDP', 'UNHCR', 'WFP', 'UN Women', 'FAO', 'WHO', 'ILO'];
  const unAgenciesCounts = {};

  try {
    // Use MongoDB distinct to get unique unAgencies for the governorate
    const uniqueUnAgencies = await projectsModel.distinct('unAgencies', {
      Governorate_Name_EN: governorateName,
      unAgencies: { $in: unAgenciesList }  // Only check for valid UN agencies
    });

    // Count the occurrences of each UN agency
    for (const unAgency of unAgenciesList) {
      unAgenciesCounts[unAgency] = await projectsModel.countDocuments({
        Governorate_Name_EN: governorateName,
        unAgencies: { $in: [unAgency] }
      });
    }

    return { unAgenciesCounts, uniqueUnAgencies };
  } catch (error) {
    console.error(`Error fetching unique UN agencies for ${governorateName}:`, error);
    return { unAgenciesCounts, uniqueUnAgencies: [] };
  }
}

// Helper function to hash themeCounts and unAgenciesCounts for comparison
export function hashData(themeCounts, unAgenciesCounts) {
  return JSON.stringify({ themeCounts, unAgenciesCounts });
}

// Function to update governorate with project count data and unique UN agencies
export async function updateGovernorateData(governorateName, themeCounts, unAgenciesCounts, uniqueUnAgencies) {
  const lastData = myCache.get(governorateName);
  const currentHash = hashData(themeCounts, unAgenciesCounts);

  if (!lastData || lastData.hash !== currentHash || Date.now() > lastData.nextUpdateTime) {
    const sortedThemes = Object.entries(themeCounts).sort(([, a], [, b]) => b - a);
    const themesWithProjects = sortedThemes.filter(([, value]) => value > 0);

    const updateData = {
      Most_Intervention_Type: themesWithProjects[0] ? [themesWithProjects[0][0]] : [],
      Least_Intervention_Type: themesWithProjects.length ? [themesWithProjects[themesWithProjects.length - 1][0]] : [],
      No_Intervention_Type: Object.keys(themeCounts).filter(key => themeCounts[key] === 0),
      ThemeCounts: themeCounts,
      UNAgenciesCounts: unAgenciesCounts,
      unAgencies: uniqueUnAgencies // Add the unique UN agencies to the update data
    };

    await governoratesModel.findOneAndUpdate({
      Governorate_Name_EN: governorateName
    }, {
      $set: updateData
    }, { new: true });

    // Update cache with new hash and set next update time for 6 hours later
    myCache.set(governorateName, { hash: currentHash, nextUpdateTime: Date.now() + 21600000 });
  }
}

// Scheduled task to force an update every 6 hours
schedule('0 */6 * * *', async () => {
  console.log('Running a task every 6 hours');
  const governorates = await governoratesModel.find();
  for (const division of governorates) {
    const themeCounts = await countProjectsByTheme(division.Governorate_Name_EN);
    const { unAgenciesCounts, uniqueUnAgencies } = await countProjectsByUNAgencies(division.Governorate_Name_EN);
    await updateGovernorateData(division.Governorate_Name_EN, themeCounts, unAgenciesCounts, uniqueUnAgencies);
  }
});

// API to get a list of governorates and count projects per theme and UN agencies
export const getGovernorates = async (req, res) => {
  try {
    const governorates = await governoratesModel.find();
    await Promise.all(governorates.map(async division => {
      const themeCounts = await countProjectsByTheme(division.Governorate_Name_EN);
      const { unAgenciesCounts, uniqueUnAgencies } = await countProjectsByUNAgencies(division.Governorate_Name_EN);
      await updateGovernorateData(division.Governorate_Name_EN, themeCounts, unAgenciesCounts, uniqueUnAgencies);
    }));
    res.send(governorates);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

// API to add a new governorate
export const createGovernorate = async (req, res) => {
  try {
    const newDivision = await governoratesModel.create(req.body);
    res.send(newDivision);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create governorate', error: error.message });
  }
};

// API to update a governorate by ID
export const updateGovernorateByID = async (req, res) => {
  try {
    const updatedDivision = await governoratesModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.send(updatedDivision);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update governorate', error: error.message });
  }
};

// API to update a governorate by name
export const updateGovernorateByGovernorateNameEN = async (req, res) => {
  try {
    const updatedDivision = await governoratesModel.findOneAndUpdate(
      { Governorate_Name_EN: req.params.governorateNameEN },
      { $set: req.body },
      { new: true }
    );
    res.send(updatedDivision);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update governorate', error: error.message });
  }
};

// API to delete a governorate by ID
export const deleteGovernorateByID = async (req, res) => {
  try {
    const deletedDivision = await governoratesModel.findByIdAndRemove(req.params.id);
    res.send(deletedDivision);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete governorate', error: error.message });
  }
};

// API to delete a governorate by name
export const deleteGovernorateByGovernorateNameEN = async (req, res) => {
  try {
    const deletedDivision = await governoratesModel.findOneAndRemove({
      Governorate_Name_EN: req.params.governorateNameEN
    });
    res.send(deletedDivision);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete governorate', error: error.message });
  }
};

export default {
  getGovernorates,
  createGovernorate,
  updateGovernorateByID,
  updateGovernorateByGovernorateNameEN,
  deleteGovernorateByID,
  deleteGovernorateByGovernorateNameEN
};