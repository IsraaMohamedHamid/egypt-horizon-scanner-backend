const {
  governoratesModel,
  GovernorateSchema
} = require('../../../Model/Response Now/Interventions/governorate_model');

const {
  projectsModel,
  ProjectSchema
} = require('../../../Model/Response Now/Interventions/projects_model');


// Helper function to count projects by theme for a given governorate
async function countProjectsByTheme(governorateName) {
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

// Function to update governorate with project count data
async function updateGovernorateData(governorateName, themeCounts) {
  const sortedThemes = Object.entries(themeCounts).sort(([, a], [, b]) => b - a);
  const themesWithProjects = sortedThemes.filter(([, value]) => value > 0);

  const updateData = {
    Most_Intervention_Type: themesWithProjects[0] ? [themesWithProjects[0][0]] : [],
    Least_Intervention_Type: themesWithProjects.length ? [themesWithProjects[themesWithProjects.length - 1][0]] : [],
    No_Intervention_Type: Object.keys(themeCounts).filter(key => themeCounts[key] === 0),
    ThemeCounts: themeCounts
  };

  await governoratesModel.findOneAndUpdate({
    Governorate_Name_EN: governorateName
  }, {
    $set: updateData
  }, { new: true });
}

// API to get a list of governorates and count projects per theme
const getGovernorates = async (req, res) => {
  try {
    const governorates = await governoratesModel.find();
    await Promise.all(governorates.map(async governorate => {
      const themeCounts = await countProjectsByTheme(governorate.Governorate_Name_EN);
      await updateGovernorateData(governorate.Governorate_Name_EN, themeCounts);
    }));
    res.send(governorates);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

// API to add a new governorate
const createGovernorate = async (req, res) => {
  try {
    const newGovernorate = await governoratesModel.create(req.body);
    res.send(newGovernorate);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create governorate', error: error.message });
  }
};

// API to update a governorate by ID
const updateGovernorateByID = async (req, res) => {
  try {
    const updatedGovernorate = await governoratesModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.send(updatedGovernorate);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update governorate', error: error.message });
  }
};

// API to update a governorate by name
const updateGovernorateByGovernorateNameEN = async (req, res) => {
  try {
    const updatedGovernorate = await governoratesModel.findOneAndUpdate(
      { Governorate_Name_EN: req.params.governorateNameEN },
      { $set: req.body },
      { new: true }
    );
    res.send(updatedGovernorate);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update governorate', error: error.message });
  }
};

// API to delete a governorate by ID
const deleteGovernorateByID = async (req, res) => {
  try {
    const deletedGovernorate = await governoratesModel.findByIdAndRemove(req.params.id);
    res.send(deletedGovernorate);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete governorate', error: error.message });
  }
};

// API to delete a governorate by name
const deleteGovernorateByGovernorateNameEN = async (req, res) => {
  try {
    const deletedGovernorate = await governoratesModel.findOneAndRemove({
      Governorate_Name_EN: req.params.governorateNameEN
    });
    res.send(deletedGovernorate);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete governorate', error: error.message });
  }
};

module.exports = {
  getGovernorates,
  createGovernorate,
  updateGovernorateByID,
  updateGovernorateByGovernorateNameEN,
  deleteGovernorateByID,
  deleteGovernorateByGovernorateNameEN
};
