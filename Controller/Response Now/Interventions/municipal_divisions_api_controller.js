import NodeCache from 'node-cache';
import { schedule } from 'node-cron';
const myCache = new NodeCache({ stdTTL: 21600 }); // Cache with a TTL of 6 hours

import { municipalDivisionsModel } from '../../../Model/Response Now/Interventions/municipal_divisions_model.js';
import { projectsModel } from '../../../Model/Response Now/Interventions/projects_model.js';

// Helper function to count projects by theme for a municipal division
export async function countProjectsByTheme(municipalDivisionName) {
  const themes = ['R_C', 'E_E', 'D_E', 'I_D', 'H_D', 'P_S'];
  const themeCounts = {};
  for (const theme of themes) {
    themeCounts[theme] = await projectsModel.countDocuments({
      Municipal_Division_Name_EN: municipalDivisionName,
      theme: { $in: [theme] }
    });
  }
  return themeCounts;
}

// Helper function to count projects by UN Agencies for a governorate and extract unique UN agencies
export async function countProjectsByUNAgencies(municipalDivisionName) {
  const unAgenciesList = ['UNICEF', 'UNDP', 'UNHCR', 'WFP', 'UN Women', 'FAO', 'WHO', 'ILO'];
  const unAgenciesCounts = {};

  try {
    // Use MongoDB distinct to get unique unAgencies for the governorate
    const uniqueUnAgencies = await projectsModel.distinct('unAgencies', {
      Municipal_Division_Name_EN: municipalDivisionName,
      unAgencies: { $in: unAgenciesList }  // Only check for valid UN agencies
    });

    // Count the occurrences of each UN agency
    for (const unAgency of unAgenciesList) {
      unAgenciesCounts[unAgency] = await projectsModel.countDocuments({
        Municipal_Division_Name_EN: municipalDivisionName,
        unAgencies: { $in: [unAgency] }
      });
    }

    return { unAgenciesCounts, uniqueUnAgencies };
  } catch (error) {
    console.error(`Error fetching unique UN agencies for ${municipalDivisionName}:`, error);
    return { unAgenciesCounts, uniqueUnAgencies: [] };
  }
}

// Helper function to hash themeCounts and unAgenciesCounts for comparison
export function hashData(themeCounts, unAgenciesCounts) {
  return JSON.stringify({ themeCounts, unAgenciesCounts });
}

// Function to update municipal division with project count data
export async function updateMunicipalDivisionData(municipalDivisionName, themeCounts, unAgenciesCounts, uniqueUnAgencies) {
  const lastData = myCache.get(municipalDivisionName);
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

    await municipalDivisionsModel.findOneAndUpdate({
      Municipal_Division_Name_EN: municipalDivisionName
    }, {
      $set: updateData
    }, { new: true });

    // Update cache with new hash and set next update time for 6 hours later
    myCache.set(municipalDivisionName, { hash: currentHash, nextUpdateTime: Date.now() + 21600000 });
  }
}

// Scheduled task to force an update every 6 hours
schedule('0 */6 * * *', async () => {
  console.log('Running a task every 6 hours');
  const municipalDivisions = await municipalDivisionsModel.find();
  for (const division of municipalDivisions) {
    const themeCounts = await countProjectsByTheme(division.Municipal_Division_Name_EN);
    const { unAgenciesCounts, uniqueUnAgencies } = await countProjectsByUNAgencies(division.Municipal_Division_Name_EN);
    await updateMunicipalDivisionData(division.Municipal_Division_Name_EN, themeCounts, unAgenciesCounts, uniqueUnAgencies);
  }
});

// API to get a list of municipal divisions and count projects per theme and UN agencies
export const getMunicipalDivisions = async (req, res) => {
  try {
    const municipalDivisions = await municipalDivisionsModel.find();
    await Promise.all(municipalDivisions.map(async division => {
      const themeCounts = await countProjectsByTheme(division.Municipal_Division_Name_EN);
      const { unAgenciesCounts, uniqueUnAgencies } =  await countProjectsByUNAgencies(division.Municipal_Division_Name_EN);
      await updateMunicipalDivisionData(division.Municipal_Division_Name_EN, themeCounts, unAgenciesCounts, uniqueUnAgencies);
    }));
    res.send(municipalDivisions);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

// API to add a new municipal division
export const createMunicipalDivision = async (req, res) => {
  try {
    const newDivision = await municipalDivisionsModel.create(req.body);
    res.send(newDivision);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create municipal division', error: error.message });
  }
};

// API to update a municipal division by ID
export const updateMunicipalDivisionByID = async (req, res) => {
  try {
    const updatedDivision = await municipalDivisionsModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.send(updatedDivision);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update municipal division', error: error.message });
  }
};

// API to update a municipal division by name
export const updateMunicipalDivisionByMunicipalDivisionNameEN = async (req, res) => {
  try {
    const updatedDivision = await municipalDivisionsModel.findOneAndUpdate(
      { Municipal_Division_Name_EN: req.params.municipalDivisionNameEN },
      { $set: req.body },
      { new: true }
    );
    res.send(updatedDivision);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update municipal division', error: error.message });
  }
};

// API to delete a municipal division by ID
export const deleteMunicipalDivisionByID = async (req, res) => {
  try {
    const deletedDivision = await municipalDivisionsModel.findByIdAndRemove(req.params.id);
    res.send(deletedDivision);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete municipal division', error: error.message });
  }
};

// API to delete a municipal division by name
export const deleteMunicipalDivisionByMunicipalDivisionNameEN = async (req, res) => {
  try {
    const deletedDivision = await municipalDivisionsModel.findOneAndRemove({
      Municipal_Division_Name_EN: req.params.municipalDivisionNameEN
    });
    res.send(deletedDivision);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete municipal division', error: error.message });
  }
};

export default {
  getMunicipalDivisions,
  createMunicipalDivision,
  updateMunicipalDivisionByID,
  updateMunicipalDivisionByMunicipalDivisionNameEN,
  deleteMunicipalDivisionByID,
  deleteMunicipalDivisionByMunicipalDivisionNameEN
};