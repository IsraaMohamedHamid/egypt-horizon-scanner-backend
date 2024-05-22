const {
  municipalDivisionsModel,
  MunicipalDivisionSchema
} from '../../../Model/Response Now/Interventions/municipal_divisions_model.js');

const {
  projectsModel,
  ProjectSchema
} from '../../../Model/Response Now/Interventions/projects_model.js');

// Get a list of municipalDivisions from the DB
const getMunicipalDivisions = async (req, res, next) => {
  try {
    const municipalDivisions = await municipalDivisionsModel.find();

    const tasks = municipalDivisions.map(async (municipalDivision) => {
      const projects = await projectsModel.find({
        municipal_divisions_name_EN: municipalDivision.municipal_divisions_name_EN
      });

      if (projects.length > 0) {
        const themes = ['R_C', 'E_E', 'D_E', 'I_D', 'H_D', 'P_S'];
        let map = {};

        for (let theme of themes) {
          map[theme] = await projectsModel.countDocuments({
            municipal_divisions_name_EN: municipalDivision.municipal_divisions_name_EN,
            theme: { $in: [theme] }
          });
        }

        const sortable = Object.entries(map).sort(([, a], [, b]) => b - a);
        const noProjects = sortable.some(([ , value]) => value === 0) ? sortable.pop()[0] : "";
        const leastProjects = sortable.pop()[0];
        const mostProjects = sortable[0][0];

        console.log(`${municipalDivision.municipal_divisions_name_EN}: map: ${Object.values(map)}, Contains zero: ${Object.values(map).includes(0)}, no Projects: ${noProjects}, least Projects: ${leastProjects}, most Projects: ${mostProjects}`);

        return municipalDivisionsModel.findOneAndUpdate({
          municipal_divisions_name_EN: municipalDivision.municipal_divisions_name_EN
        }, {
          $set: {
            "Most_Intervention_Type": mostProjects,
            "Least_Intervention_Type": leastProjects,
            "No_Intervention_Type": noProjects,
          }
        });
      } else {
        return municipalDivisionsModel.findOneAndUpdate({
          municipal_divisions_name_EN: municipalDivision.municipal_divisions_name_EN
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
    // res.send(municipalDivisions);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};


// Add new municipalDivision to the DB
const createMunicipalDivision = ((req, res, next) => {
  municipalDivisionsModel.create(req.body).then(function (municipalDivision) {
    res.send(municipalDivision);
  }).catch(next);

})

// Update a municipalDivision in the DB
const updateMunicipalDivisionByID = ((req, res, next) => {
  //to access :id ---> req.params.id
  municipalDivisionsModel.findByIdAndUpdate({
    _id: req.params.id
  }, {
    $set: req.body
  }).then(function () {
    municipalDivisionsModel.findOne({
      _id: req.params.id
    }).then(function (municipalDivision) {
      res.send(municipalDivision);
    });
  });
})

const updateMunicipalDivisionByMunicipalDivisionNameEN = ((req, res, next) => {
  //to access :id ---> req.params.id
  municipalDivisionsModel.findOneAndUpdate({
    MunicipalDivision_Name_EN: req.params.municipalDivisionNameEN
  }, {
    $set: req.body
  }).then(function () {
    municipalDivisionsModel.findOne({
      MunicipalDivision_Name_EN: req.params.municipalDivisionNameEN
    }).then(function (municipalDivision) {
      res.send(municipalDivision);
    });
  });
})

// Delete a municipalDivision from the DB
const deleteMunicipalDivisionByID = ((req, res, next) => {
  //to access :id ---> req.params.id
  municipalDivisionsModel.findByIdAndRemove({
    _id: req.params.id
  }).then(function (municipalDivision) {
    res.send(municipalDivision);
  });
})

const deleteMunicipalDivisionByMunicipalDivisionNameEN = ((req, res, next) => {
  //to access :id ---> req.params.id
  municipalDivisionsModel.findOneAndRemove({
    MunicipalDivision_Name_EN: req.params.municipalDivisionNameEN
  }).then(function (municipalDivision) {
    res.send(municipalDivision);
  });
})

const countMostInterventionTypePerMunicipalDivision = ((req, res) => {
  // Count number of projects per theme for each municipalDivision
  municipalDivisionsModel.find().then(function (municipalDivision) {
    for (let i = 0; i < municipalDivision.length; i++) {
      console.log(municipalDivision[i].MunicipalDivision_Name_EN);
      let map = new Map();
      // Get all data
      projectsModel.find({
        MunicipalDivision_Name_EN: municipalDivision[i].MunicipalDivision_Name_EN
      }).then(function (municipalDivisions) {
        if (municipalDivisions.length > 0) {

          async function countProjectsBasedonTheme() {
            try {
              // Find the number of documents that match the specified query, and print out the count.
              map['R_C'] = await projectsModel.countDocuments({
                $and: [{
                    MunicipalDivision_Name_EN: {
                      $eq: municipalDivision[i].MunicipalDivision_Name_EN
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
                      $eq: municipalDivision[i].MunicipalDivision_Name_EN
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
                      $eq: municipalDivision[i].MunicipalDivision_Name_EN
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
                      $eq: municipalDivision[i].MunicipalDivision_Name_EN
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
                      $eq: municipalDivision[i].MunicipalDivision_Name_EN
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
                      $eq: municipalDivision[i].MunicipalDivision_Name_EN
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

              await municipalDivisionsModel.findOneAndUpdate({
                MunicipalDivision_Name_EN: municipalDivision[i].MunicipalDivision_Name_EN
              }, {
                $set: {
                  "Most_Intervention_Type": mostProjects,
                  "Least_Intervention_Type": leastProjects,
                  "No_Intervention_Type": noProjects,
                }
              }).then(function () {
                municipalDivisionsModel.findOne({
                  MunicipalDivision_Name_EN: municipalDivision[i].MunicipalDivision_Name_EN
                }).then(function (municipalDivision) {
                  //res.send(municipalDivision);
                });
              });


              console.log(`${municipalDivision[i].MunicipalDivision_Name_EN}:\n map: ${Object.values(map)}, Conatins zero: ${Object.values(map).includes(0)}, no Projects: ${noProjects}, least Projects: ${leastProjects}, most Projects: ${mostProjects}`);

            } catch (err) {
              res.send('Error: ' + err);
            }

          }
          countProjectsBasedonTheme().catch(console.dir);

        } else {
          municipalDivisionsModel.findOneAndUpdate({
            MunicipalDivision_Name_EN: municipalDivision[i].MunicipalDivision_Name_EN
          }, {
            $set: {
              "Most_Intervention_Type": "",
              "Least_Intervention_Type": "",
              "No_Intervention_Type": "",
            }
          }).then(function () {
            municipalDivisionsModel.findOne({
              MunicipalDivision_Name_EN: req.params.MunicipalDivision_Name_EN
            }).then(function (municipalDivision) {
              //res.send(municipalDivision);
            });
          });
        }
        //res.send(municipalDivisions);
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