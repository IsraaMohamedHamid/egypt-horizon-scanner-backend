const NodeCache from 'node-cache');
const cron from 'node-cron');
const myCache = new NodeCache({ stdTTL: 21600 }); // Cache with a TTL of 6 hours

const {
  citiessModel,
  CitySchema
} from '../../../Model/Response Now/Interventions/city_model.js');

const {
  projectsModel,
  ProjectSchema
} from '../../../Model/Response Now/Interventions/projects_model.js');


// Helper function to count projects by theme for a municipal division
async function countProjectsByTheme(cityName) {
  const themes = ['R_C', 'E_E', 'D_E', 'I_D', 'H_D', 'P_S'];
  const themeCounts = {};
  for (const theme of themes) {
    themeCounts[theme] = await projectsModel.countDocuments({
      Municipal_Division_Name_EN: cityName,
      theme: { $in: [theme] }
    });
  }
  return themeCounts;
}

// Helper function to hash themeCounts for comparison
function hashThemeCounts(themeCounts) {
  return JSON.stringify(themeCounts);
}

// Function to update municipal division with project count data
async function updateCityData(cityName, themeCounts) {
  const lastData = myCache.get(cityName);
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

    await citiessModel.findOneAndUpdate({
      Municipal_Division_Name_EN: cityName
    }, {
      $set: updateData
    }, { new: true });

    // Update cache with new hash and set next update time for 6 hours later
    myCache.set(cityName, { hash: currentHash, nextUpdateTime: Date.now() + 21600000 });
  }
}

// Scheduled task to force an update every 6 hours
// cron.schedule('0 */6 * * *', async () => {
//   console.log('Running a task every 6 hours');
//   const citiess = await citiessModel.find();
//   for (const division of citiess) {
//     const themeCounts = await countProjectsByTheme(division.Municipal_Division_Name_EN);
//     await updateCityData(division.Municipal_Division_Name_EN, themeCounts, true);
//   }
// });

// API to get a list of municipal divisions and count projects per theme
const getCities = async (req, res) => {
  try {
    const citiess = await citiessModel.find();
    await Promise.all(citiess.map(async division => {
      const themeCounts = await countProjectsByTheme(division.Municipal_Division_Name_EN);
      await updateCityData(division.Municipal_Division_Name_EN, themeCounts);
    }));
    res.send(citiess);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

// API to add a new municipal division
const createCity = async (req, res) => {
  try {
    const newDivision = await citiessModel.create(req.body);
    res.send(newDivision);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create municipal division', error: error.message });
  }
};

// API to update a municipal division by ID
const updateCityByID = async (req, res) => {
  try {
    const updatedDivision = await citiessModel.findByIdAndUpdate(
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
const updateCityByCityNameEN = async (req, res) => {
  try {
    const updatedDivision = await citiessModel.findOneAndUpdate(
      { Municipal_Division_Name_EN: req.params.cityNameEN },
      { $set: req.body },
      { new: true }
    );
    res.send(updatedDivision);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update municipal division', error: error.message });
  }
};

// API to delete a municipal division by ID
const deleteCityByID = async (req, res) => {
  try {
    const deletedDivision = await citiessModel.findByIdAndRemove(req.params.id);
    res.send(deletedDivision);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete municipal division', error: error.message });
  }
};

// API to delete a municipal division by name
const deleteCityByCityNameEN = async (req, res) => {
  try {
    const deletedDivision = await citiessModel.findOneAndRemove({
      Municipal_Division_Name_EN: req.params.cityNameEN
    });
    res.send(deletedDivision);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete municipal division', error: error.message });
  }
};

export default  {
  getCities,
  createCity,
  updateCityByID,
  updateCityByCityNameEN,
  deleteCityByID,
  deleteCityByCityNameEN
};
