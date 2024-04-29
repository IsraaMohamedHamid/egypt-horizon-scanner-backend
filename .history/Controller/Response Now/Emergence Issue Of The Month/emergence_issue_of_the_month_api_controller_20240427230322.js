////////////////////////////////////////////// IMPORTS //////////////////////////////////////////////


///////////////// MODELS /////////////////
const {
  EmergenceIssueOfTheMonthModel,
  EmergenceIssueOfTheMonthSchema
} = require('../../../Model/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_model');

const {
  EmergenceIssueOfTheMonthDataModel,
  EmergenceIssueOfTheMonthDataSchema
} = require('../../../Model/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_data_model');


///////////////// FUNCTIONS /////////////////
const {
  emergingIssueComponentsCalculation
} = require('../../../Function/Response Now/Emergence Issue Of The Month/emergence_issue_of_month_functions');


////////////////////////////////////////////// API CONTROLLER //////////////////////////////////////////////


// Get a list of emergingIssue from the DB
const getEmergingIssues = async (req, res, next) => {
  try {
    // Define the sort order
    const sort = {
      repetition: -1,
      time: -1,
      emergingIssue: -1
    };

    // Get all emerging issues from the database and sort them
    const emergingIssues = await EmergenceIssueOfTheMonthModel.find({}).sort(sort);

    if (!emergingIssues.length) {
      res.status(404).send('No emerging issues found.');
      return;
    }

    // Calculate components for the retrieved emerging issues
    emergingIssueComponentsCalculation().catch(console.error);

    // Send sorted and processed emerging issues as response
    res.send(emergingIssues);

  } catch (error) {
    console.error('Failed to retrieve and process emerging issues:', error);
    res.status(500).send('Error retrieving emerging issues');
  }
};


const getEmergingIssueByName = ((req, res, next) => {

    // 1. Count the number of positive data, neutral data, and negative data

    EmergenceIssueOfTheMonthModel.find({}).then(
      emergingIssueComponentsCalculation
    )
  

  const sort = {
    repetition: -1,
    time: -1,
    emergingIssue: -1
  };

  // Get data for one emergingIssue
  EmergenceIssueOfTheMonthModel.find({
    emergingIssue: req.params.emergingIssue
  }).sort(sort).then(function (emergingIssue) {
    res.send(emergingIssue);
  });
})


// Add new emergingIssue to the DB
const createEmergingIssue = ((req, res, next) => {

  // 1. Count the number of positive data, neutral data, and negative data

  EmergenceIssueOfTheMonthModel.find({}).then(
    emergingIssueComponentsCalculation
  )


  EmergenceIssueOfTheMonthModel.create(req.body).then(function (emergingIssue) {
    res.send(emergingIssue);
  }).catch(next);

})

// Update a emergingIssue in the DB
const updateEmergingIssueByID = ((req, res, next) => {

    // 1. Count the number of positive data, neutral data, and negative data

    EmergenceIssueOfTheMonthModel.find({}).then(
      emergingIssueComponentsCalculation
    )
  

  //to access :id ---> req.params.id
  EmergenceIssueOfTheMonthModel.findByIdAndUpdate({
    _id: req.params.id
  }, {
    $set: req.body
  }).then(function () {
    EmergenceIssueOfTheMonthModel.findOne({
      _id: req.params.id
    }).then(function (emergingIssue) {
      res.send(emergingIssue);
    });
  });
})

const updateEmergingIssueByEmergingIssueName = ((req, res, next) => {

  // 1. Count the number of positive data, neutral data, and negative data

  EmergenceIssueOfTheMonthModel.find({}).then(
    emergingIssueComponentsCalculation
  )


  //to access :id ---> req.params.id
  EmergenceIssueOfTheMonthModel.findOneAndUpdate({
    emergingIssue: req.params.emergingIssue
  }, {
    $set: req.body
  }).then(function () {
    EmergenceIssueOfTheMonthModel.findOne({
      CemergingIssue: req.params.emergingIssue
    }).then(function (emergingIssue) {
      res.send(emergingIssue);
    });
  });
})


// Delete a emergingIssue from the DB
const deleteEmergingIssueByID = ((req, res, next) => {
  //to access :id ---> req.params.id
  EmergenceIssueOfTheMonthModel.findByIdAndRemove({
    _id: req.params.id
  }).then(function (emergingIssue) {
    res.send(emergingIssue);
  });
})

const deleteEmergingIssueByEmergingIssueName = ((req, res, next) => {
  //to access :id ---> req.params.id
  EmergenceIssueOfTheMonthModel.findOneAndRemove({
    emergingIssue: req.params.emergingIssue
  }).then(function (emergingIssue) {
    res.send(emergingIssue);
  });
})


module.exports = {
  getEmergingIssues: getEmergingIssues,
  getEmergingIssueByName: getEmergingIssueByName,
  createEmergingIssue: createEmergingIssue,
  updateEmergingIssueByID: updateEmergingIssueByID,
  updateEmergingIssueByEmergingIssueName: updateEmergingIssueByEmergingIssueName,
  deleteEmergingIssueByID: deleteEmergingIssueByID,
  deleteEmergingIssueByEmergingIssueName: deleteEmergingIssueByEmergingIssueName
}