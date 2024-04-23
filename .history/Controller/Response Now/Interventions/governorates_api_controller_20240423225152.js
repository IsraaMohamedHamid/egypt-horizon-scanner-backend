const {
  governoratesModel,
  GovernorateSchema
} = require('');

const {
  projectsModel,
  ProjectSchema
} = require('../../../Model/Response Now/Interventions/projects_model');

// Get a list of governorates from the DB
const getGovernorates = async (req, res, next) => {
  try {
    const governorates = await governoratesModel.find();

    const tasks = governorates.map(async (governorate) => {
      const projects = await projectsModel.find({
        Governorate_Name_EN: governorate.Governorate_Name_EN
      });

      if (projects.length > 0) {
        const themes = ['R_C', 'E_E', 'D_E', 'I_D', 'H_D', 'P_S'];
        let themeCounts = {};

        for (let theme of themes) {
          themeCounts[theme] = await projectsModel.countDocuments({
            Governorate_Name_EN: governorate.Governorate_Name_EN,
            theme: { $in: [theme] }
          });
        }

        const sortableCounts = Object.entries(themeCounts).sort(([, a], [, b]) => b - a);
        const maxCount = sortableCounts[0][1];
        const minCount = sortableCounts[sortableCounts.length - 1][1];

        const mostProjects = sortableCounts.filter(([ , value]) => value === maxCount).map(([key]) => key);
        const leastProjects = sortableCounts.filter(([ , value]) => value === minCount).map(([key]) => key);
        const noProjects = themes.filter(theme => !themeCounts[theme] || themeCounts[theme] === 0);

        return governoratesModel.findOneAndUpdate({
          Governorate_Name_EN: governorate.Governorate_Name_EN
        }, {
          $set: {
            "Most_Intervention_Type": mostProjects,
            "Least_Intervention_Type": leastProjects,
            "No_Intervention_Type": noProjects,
            "ThemeCounts": themeCounts // Saving the map of theme counts
          }
        }, { new: true }); // Optionally add { new: true } to return the document after update
      } else {
        return governoratesModel.findOneAndUpdate({
          Governorate_Name_EN: governorate.Governorate_Name_EN
        }, {
          $set: {
            "Most_Intervention_Type": [],
            "Least_Intervention_Type": [],
            "No_Intervention_Type": [],
            "ThemeCounts": {} // Ensuring the map is empty if there are no projects
          }
        }, { new: true });
      }
    });

    await Promise.all(tasks);
    res.send(governorates);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

// Add new governorate to the DB
const createGovernorate = ((req, res, next) => {
  governoratesModel.create(req.body).then(function (governorate) {
    res.send(governorate);
  }).catch(next);

})

// Update a governorate in the DB
const updateGovernorateByID = ((req, res, next) => {
  //to access :id ---> req.params.id
  governoratesModel.findByIdAndUpdate({
    _id: req.params.id
  }, {
    $set: req.body
  }).then(function () {
    governoratesModel.findOne({
      _id: req.params.id
    }).then(function (governorate) {
      res.send(governorate);
    });
  });
})

const updateGovernorateByGovernorateNameEN = ((req, res, next) => {
  //to access :id ---> req.params.id
  governoratesModel.findOneAndUpdate({
    Governorate_Name_EN: req.params.governorateNameEN
  }, {
    $set: req.body
  }).then(function () {
    governoratesModel.findOne({
      Governorate_Name_EN: req.params.governorateNameEN
    }).then(function (governorate) {
      res.send(governorate);
    });
  });
})

// Delete a governorate from the DB
const deleteGovernorateByID = ((req, res, next) => {
  //to access :id ---> req.params.id
  governoratesModel.findByIdAndRemove({
    _id: req.params.id
  }).then(function (governorate) {
    res.send(governorate);
  });
})

const deleteGovernorateByGovernorateNameEN = ((req, res, next) => {
  //to access :id ---> req.params.id
  governoratesModel.findOneAndRemove({
    Governorate_Name_EN: req.params.governorateNameEN
  }).then(function (governorate) {
    res.send(governorate);
  });
})

const countMostInterventionTypePerGovernorate = ((req, res) => {
  // Count number of projects per theme for each governorate
  governoratesModel.find().then(function (governorate) {
    for (let i = 0; i < governorate.length; i++) {
      console.log(governorate[i].Governorate_Name_EN);
      let map = new Map();
      // Get all data
      projectsModel.find({
        Governorate_Name_EN: governorate[i].Governorate_Name_EN
      }).then(function (governorates) {
        if (governorates.length > 0) {

          async function countProjectsBasedonTheme() {
            try {
              // Find the number of documents that match the specified query, and print out the count.
              map['R_C'] = await projectsModel.countDocuments({
                $and: [{
                    Governorate_Name_EN: {
                      $eq: governorate[i].Governorate_Name_EN
                    }
                  },
                  {
                    theme: {
                      $in: ['R_C']
                    }
                  }
                ]
              });
              map['E_E'] = await projectsModel.countDocuments({
                $and: [{
                    Governorate_Name_EN: {
                      $eq: governorate[i].Governorate_Name_EN
                    }
                  },
                  {
                    theme: {
                      $in: ['E_E']
                    }
                  }
                ]
              });
              map['D_E'] = await projectsModel.countDocuments({
                $and: [{
                    Governorate_Name_EN: {
                      $eq: governorate[i].Governorate_Name_EN
                    }
                  },
                  {
                    theme: {
                      $in: ['D_E']
                    }
                  }
                ]
              });
              map['I_D'] = await projectsModel.countDocuments({
                $and: [{
                    Governorate_Name_EN: {
                      $eq: governorate[i].Governorate_Name_EN
                    }
                  },
                  {
                    theme: {
                      $in: ['I_D']
                    }
                  }
                ]
              });
              map['H_D'] = await projectsModel.countDocuments({
                $and: [{
                    Governorate_Name_EN: {
                      $eq: governorate[i].Governorate_Name_EN
                    }
                  },
                  {
                    theme: {
                      $in: ['H_D']
                    }
                  }
                ]
              });
              map['P_S'] = await projectsModel.countDocuments({
                $and: [{
                    Governorate_Name_EN: {
                      $eq: governorate[i].Governorate_Name_EN
                    }
                  },
                  {
                    theme: {
                      $in: ['P_S']
                    }
                  }
                ]
              });
              ///console.log(map);

              // Sort Keys from map and save them arrays
              let sortable = Object.keys(map).sort((a, b) => {
                return map[b] - map[a];
              });
              ///console.log(sortable);


              // Check to see if map contains 0 then save value before
              ///console.log(Object.values(map).includes(0));
              var noProjects;
              var leastProjects;
              var mostProjects;

              if (await Object.values(map).includes(0)) {
                //console.log(Object.values(map).includes(0));
                noProjects = sortable[sortable.length - 1];
                leastProjects = sortable[sortable.length - 2];
                mostProjects = sortable[0];
              } else {
                {
                  noProjects = "";
                  leastProjects = sortable[sortable.length - 1];
                  mostProjects = sortable[0];
                }
              }

              await governoratesModel.findOneAndUpdate({
                Governorate_Name_EN: governorate[i].Governorate_Name_EN
              }, {
                $set: {
                  "Most_Intervention_Type": mostProjects,
                  "Least_Intervention_Type": leastProjects,
                  "No_Intervention_Type": noProjects,
                }
              }).then(function () {
                governoratesModel.findOne({
                  Governorate_Name_EN: governorate[i].Governorate_Name_EN
                }).then(function (governorate) {
                  //res.send(governorate);
                });
              });


              console.log(`${governorate[i].Governorate_Name_EN}:\n map: ${Object.values(map)}, Conatins zero: ${Object.values(map).includes(0)}, no Projects: ${noProjects}, least Projects: ${leastProjects}, most Projects: ${mostProjects}`);

            } catch (err) {
              res.send('Error: ' + err);
            }

          }
          countProjectsBasedonTheme().catch(console.dir);

        } else {
          governoratesModel.findOneAndUpdate({
            Governorate_Name_EN: governorate[i].Governorate_Name_EN
          }, {
            $set: {
              "Most_Intervention_Type": "",
              "Least_Intervention_Type": "",
              "No_Intervention_Type": "",
            }
          }).then(function () {
            governoratesModel.findOne({
              Governorate_Name_EN: req.params.Governorate_Name_EN
            }).then(function (governorate) {
              //res.send(governorate);
            });
          });
        }
        //res.send(governorates);
      });
    }
    res.send("Done");

  });


})


module.exports = {
  getGovernorates: getGovernorates,
  createGovernorate: createGovernorate,
  updateGovernorateByID: updateGovernorateByID,
  updateGovernorateByGovernorateNameEN: updateGovernorateByGovernorateNameEN,
  deleteGovernorateByID: deleteGovernorateByID,
  deleteGovernorateByGovernorateNameEN: deleteGovernorateByGovernorateNameEN,
  countMostInterventionTypePerGovernorate: countMostInterventionTypePerGovernorate
}