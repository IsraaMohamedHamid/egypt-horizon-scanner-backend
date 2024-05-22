const {
  governoratesModel,
  MunicipalDivisionSchema
} from '../../../Model/Response Now/Interventions/municipal_divisions_model.js');

const {
  projectsModel,
  ProjectSchema
} from '../../../Model/Response Now/Interventions/projects_model.js');

// Get a list of governorates from the DB
const getMunicipalDivisions = async (req, res, next) => {
  try {
    const governorates = await governoratesModel.find();

    const tasks = governorates.map(async (governorate) => {
      const projects = await projectsModel.find({
        MunicipalDivision_Name_EN: governorate.MunicipalDivision_Name_EN
      });

      if (projects.length > 0) {
        const themes = ['R_C', 'E_E', 'D_E', 'I_D', 'H_D', 'P_S'];
        let map = {};

        for (let theme of themes) {
          map[theme] = await projectsModel.countDocuments({
            MunicipalDivision_Name_EN: governorate.MunicipalDivision_Name_EN,
            theme: { $in: [theme] }
          });
        }

        const sortable = Object.entries(map).sort(([, a], [, b]) => b - a);
        const noProjects = sortable.some(([ , value]) => value === 0) ? sortable.pop()[0] : "";
        const leastProjects = sortable.pop()[0];
        const mostProjects = sortable[0][0];

        console.log(`${governorate.MunicipalDivision_Name_EN}: map: ${Object.values(map)}, Contains zero: ${Object.values(map).includes(0)}, no Projects: ${noProjects}, least Projects: ${leastProjects}, most Projects: ${mostProjects}`);

        return governoratesModel.findOneAndUpdate({
          MunicipalDivision_Name_EN: governorate.MunicipalDivision_Name_EN
        }, {
          $set: {
            "Most_Intervention_Type": mostProjects,
            "Least_Intervention_Type": leastProjects,
            "No_Intervention_Type": noProjects,
          }
        });
      } else {
        return governoratesModel.findOneAndUpdate({
          MunicipalDivision_Name_EN: governorate.MunicipalDivision_Name_EN
        }, {
          $set: {
            "Most_Intervention_Type": "",
            "Least_Intervention_Type": "",
            "No_Intervention_Type": "",
          }
        });
      }
    });

    await Promise.all(tasks);
    // res.send(governorates);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};


// Add new governorate to the DB
const createMunicipalDivision = ((req, res, next) => {
  governoratesModel.create(req.body).then(function (governorate) {
    res.send(governorate);
  }).catch(next);

})

// Update a governorate in the DB
const updateMunicipalDivisionByID = ((req, res, next) => {
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

const updateMunicipalDivisionByMunicipalDivisionNameEN = ((req, res, next) => {
  //to access :id ---> req.params.id
  governoratesModel.findOneAndUpdate({
    MunicipalDivision_Name_EN: req.params.governorateNameEN
  }, {
    $set: req.body
  }).then(function () {
    governoratesModel.findOne({
      MunicipalDivision_Name_EN: req.params.governorateNameEN
    }).then(function (governorate) {
      res.send(governorate);
    });
  });
})

// Delete a governorate from the DB
const deleteMunicipalDivisionByID = ((req, res, next) => {
  //to access :id ---> req.params.id
  governoratesModel.findByIdAndRemove({
    _id: req.params.id
  }).then(function (governorate) {
    res.send(governorate);
  });
})

const deleteMunicipalDivisionByMunicipalDivisionNameEN = ((req, res, next) => {
  //to access :id ---> req.params.id
  governoratesModel.findOneAndRemove({
    MunicipalDivision_Name_EN: req.params.governorateNameEN
  }).then(function (governorate) {
    res.send(governorate);
  });
})

const countMostInterventionTypePerMunicipalDivision = ((req, res) => {
  // Count number of projects per theme for each governorate
  governoratesModel.find().then(function (governorate) {
    for (let i = 0; i < governorate.length; i++) {
      console.log(governorate[i].MunicipalDivision_Name_EN);
      let map = new Map();
      // Get all data
      projectsModel.find({
        MunicipalDivision_Name_EN: governorate[i].MunicipalDivision_Name_EN
      }).then(function (governorates) {
        if (governorates.length > 0) {

          async function countProjectsBasedonTheme() {
            try {
              // Find the number of documents that match the specified query, and print out the count.
              map['R_C'] = await projectsModel.countDocuments({
                $and: [{
                    MunicipalDivision_Name_EN: {
                      $eq: governorate[i].MunicipalDivision_Name_EN
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
                    MunicipalDivision_Name_EN: {
                      $eq: governorate[i].MunicipalDivision_Name_EN
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
                    MunicipalDivision_Name_EN: {
                      $eq: governorate[i].MunicipalDivision_Name_EN
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
                    MunicipalDivision_Name_EN: {
                      $eq: governorate[i].MunicipalDivision_Name_EN
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
                    MunicipalDivision_Name_EN: {
                      $eq: governorate[i].MunicipalDivision_Name_EN
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
                    MunicipalDivision_Name_EN: {
                      $eq: governorate[i].MunicipalDivision_Name_EN
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
                MunicipalDivision_Name_EN: governorate[i].MunicipalDivision_Name_EN
              }, {
                $set: {
                  "Most_Intervention_Type": mostProjects,
                  "Least_Intervention_Type": leastProjects,
                  "No_Intervention_Type": noProjects,
                }
              }).then(function () {
                governoratesModel.findOne({
                  MunicipalDivision_Name_EN: governorate[i].MunicipalDivision_Name_EN
                }).then(function (governorate) {
                  //res.send(governorate);
                });
              });


              console.log(`${governorate[i].MunicipalDivision_Name_EN}:\n map: ${Object.values(map)}, Conatins zero: ${Object.values(map).includes(0)}, no Projects: ${noProjects}, least Projects: ${leastProjects}, most Projects: ${mostProjects}`);

            } catch (err) {
              res.send('Error: ' + err);
            }

          }
          countProjectsBasedonTheme().catch(console.dir);

        } else {
          governoratesModel.findOneAndUpdate({
            MunicipalDivision_Name_EN: governorate[i].MunicipalDivision_Name_EN
          }, {
            $set: {
              "Most_Intervention_Type": "",
              "Least_Intervention_Type": "",
              "No_Intervention_Type": "",
            }
          }).then(function () {
            governoratesModel.findOne({
              MunicipalDivision_Name_EN: req.params.MunicipalDivision_Name_EN
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


export default  {
  getMunicipalDivisions: getMunicipalDivisions,
  createMunicipalDivision: createMunicipalDivision,
  updateMunicipalDivisionByID: updateMunicipalDivisionByID,
  updateMunicipalDivisionByMunicipalDivisionNameEN: updateMunicipalDivisionByMunicipalDivisionNameEN,
  deleteMunicipalDivisionByID: deleteMunicipalDivisionByID,
  deleteMunicipalDivisionByMunicipalDivisionNameEN: deleteMunicipalDivisionByMunicipalDivisionNameEN,
  countMostInterventionTypePerMunicipalDivision: countMostInterventionTypePerMunicipalDivision
}