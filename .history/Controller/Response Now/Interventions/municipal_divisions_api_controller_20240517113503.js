const NodeCache from 'node-cache');
const cron from 'node-cron');
const myCache = new NodeCache({ stdTTL: 21600 }); // Cache with a TTL of 6 hours

const {
  municipalDivisionsModel,
  MunicipalDivisionSchema
} from '../../../Model/Response Now/Interventions/municipal_divisions_model.js');

const {
  projectsModel,
  ProjectSchema
} from '../../../Model/Response Now/Interventions/projects_model.js');

// Helper function to hash themeCounts for comparison
function hashThemeCounts(themeCounts) {
  return JSON.stringify(themeCounts);
}

// Function to update municipal division with project count data
async function updateMunicipalDivisionData(municipalDivisionName, themeCounts) {
  const lastData = myCache.get(municipalDivisionName);
  const currentHash = hashThemeCounts(themeCounts);

  if (!lastData || lastData.hash !== currentHash || Date.now() > lastData.nextUpdateTime) {
    const sortedThemes = Object.entries(themeCounts).sort(([, a], [, b]) => b - a);
    const themesWithProjects = sortedThemes.filter(([, value]) => value > 0);

    const updateData = {
      Most_Intervention_Type: themesWithProjects[0] ? [themesWithProjects[0][0]] : [],
      Least_Intervention_Type: themesWithProjects.length ? [themesWithProjects[themesWithProjects.length - 1][0]] : [],
      No_Intervention_Type: Object.keys(themeCounts).filter(key => themeCounts[key] === 0),
      ThemeCounts: themeCounts
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
cron.schedule('0 */6 * * *', async () => {
  console.log('Running a task every 6 hours');
  const municipalDivisions = await municipalDivisionsModel.find();
  for (const division of municipalDivisions) {
    const themeCounts = await countProjectsByTheme(division.Municipal_Division_Name_EN);
    await updateMunicipalDivisionData(division.Municipal_Division_Name_EN, themeCounts, true);
  }
});

// API to get a list of municipal divisions and count projects per theme
const getMunicipalDivisions = async (req, res) => {
  try {
    const municipalDivisions = await municipalDivisionsModel.find();
    await Promise.all(municipalDivisions.map(async division => {
      const themeCounts = await countProjectsByTheme(division.Municipal_Division_Name_EN);
      await updateMunicipalDivisionData(division.Municipal_Division_Name_EN, themeCounts);
    }));
    res.send(municipalDivisions);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

// API to add a new municipal division
const createMunicipalDivision = async (req, res) => {
  try {
    const newDivision = await municipalDivisionsModel.create(req.body);
    res.send(newDivision);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create municipal division', error: error.message });
  }
};

// API to update a municipal division by ID
const updateMunicipalDivisionByID = async (req, res) => {
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
const updateMunicipalDivisionByMunicipalDivisionNameEN = async (req, res) => {
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
const deleteMunicipalDivisionByID = async (req, res) => {
  try {
    const deletedDivision = await municipalDivisionsModel.findByIdAndRemove(req.params.id);
    res.send(deletedDivision);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete municipal division', error: error.message });
  }
};

// API to delete a municipal division by name
const deleteMunicipalDivisionByMunicipalDivisionNameEN = async (req, res) => {
  try {
    const deletedDivision = await municipalDivisionsModel.findOneAndRemove({
      Municipal_Division_Name_EN: req.params.municipalDivisionNameEN
    });
    res.send(deletedDivision);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete municipal division', error: error.message });
  }
};

export default  {
  getMunicipalDivisions,
  createMunicipalDivision,
  updateMunicipalDivisionByID,
  updateMunicipalDivisionByMunicipalDivisionNameEN,
  deleteMunicipalDivisionByID,
  deleteMunicipalDivisionByMunicipalDivisionNameEN
};
