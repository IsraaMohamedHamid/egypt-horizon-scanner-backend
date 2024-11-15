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