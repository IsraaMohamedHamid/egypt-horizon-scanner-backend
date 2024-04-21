const {
  districtModel,
  DistrictSchema
} = require('../../../Model/Response Now/interventions/district_model');

const {
  projectsModel,
  ProjectSchema
} = require('../../../Model/Response Now/interventions/projects_model');

// Get a list of cities from the DB
const getDistricts = ((req, res, next) => {
  
   // Count number of projects per theme for each District
   districtModel.find({}, {
    District_Name_EN: 1,
    _id: 0
  }).then(function (district) {
    for (let i = 0; i < district.length; i++) {
      let map = new Map();
      // Get all data
      projectsModel.find({
        District_Name_EN: district[i].District_Name_EN
      }).then(function (cities) {
        if (cities.length > 0) {

          async function countProjectsBasedonTheme() {
            try {
              // Find the number of documents that match the specified query, and print out the count.
              map['R_C'] = await projectsModel.countDocuments({
                $and: [{District_Name_EN: {
                  $eq: district[i].District_Name_EN
                }},
                {theme: {
                  $in: ['R_C']
                }}]
              });
              map['E_E'] = await projectsModel.countDocuments({
                $and: [{District_Name_EN: {
                  $eq: district[i].District_Name_EN
                }},
                {theme: {
                  $in: ['E_E']
                }}]
              });
              map['D_E'] = await projectsModel.countDocuments({
                $and: [{District_Name_EN: {
                  $eq: district[i].District_Name_EN
                }},
                {theme: {
                  $in: ['D_E']
                }}]
              });
              map['I_D'] = await projectsModel.countDocuments({
                $and: [{District_Name_EN: {
                  $eq: district[i].District_Name_EN
                }},
                {theme: {
                  $in: ['I_D']
                }}]
              });
              map['H_D'] = await projectsModel.countDocuments({
                $and: [{District_Name_EN: {
                  $eq: district[i].District_Name_EN
                }},
                {theme: {
                  $in: ['H_D']
                }}]
              });
              map['P_S'] = await projectsModel.countDocuments({
                $and: [{District_Name_EN: {
                  $eq: district[i].District_Name_EN
                }},
                {theme: {
                  $in: ['P_S']
                }}]
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

              if (Object.values(map).includes(0)) {
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

              districtModel.findOneAndUpdate({
                District_Name_EN: district[i].District_Name_EN
              }, {
                $set: {
                  "Most_Intervention_Type": mostProjects,
                  "Least_Intervention_Type": leastProjects,
                  "No_Intervention_Type": noProjects,
                }
              }).then(function () {
                districtModel.findOne({
                  District_Name_EN: district[i].District_Name_EN
                }).then(function (district) {
                  //res.send(district);
                });
              });
              
              
              console.log(`${district[i].District_Name_EN}:\n map: ${Object.values(map)}, Conatins zero: ${Object.values(map).includes(0)}, no Projects: ${noProjects}, least Projects: ${leastProjects}, most Projects: ${mostProjects}`);
            
            } catch (err) {
              res.send('Error: ' + err);
            }

          }
          countProjectsBasedonTheme().catch(console.dir);

        } else {
          districtModel.findOneAndUpdate({
            District_Name_EN: district[i].District_Name_EN
          }, {
            $set: {
              "Most_Intervention_Type": "",
              "Least_Intervention_Type": "",
              "No_Intervention_Type": "",
            }
          });
        }
      });
    }
    // res.send("Done");

  });

  // Get all data
  districtModel.find({}).then(function (cities) {
    res.send(cities);
  });
})

// Add new district to the DB
const createDistrict = ((req, res, next) => {
  districtModel.create(req.body).then(function (district) {
    res.send(district);
  }).catch(next);

})

// Update a district in the DB
const updateDistrictByID = ((req, res, next) => {
  //to access :id ---> req.params.id
  districtModel.findByIdAndUpdate({
    _id: req.params.id
  }, {
    $set: req.body
  }).then(function () {
    districtModel.findOne({
      _id: req.params.id
    }).then(function (district) {
      res.send(district);
    });
  });
})

const updateDistrictByDistrictName = ((req, res, next) => {
  //to access :id ---> req.params.id
  districtModel.findOneAndUpdate({
    District_Name_EN: req.params.districtNameEN
  }, {
    $set: req.body
  }).then(function () {
    districtModel.findOne({
      District_Name_EN: req.params.District_Name_EN
    }).then(function (district) {
      res.send(district);
    });
  });
})


// Delete a district from the DB
const deleteDistrictByID = ((req, res, next) => {
  //to access :id ---> req.params.id
  districtModel.findByIdAndRemove({
    _id: req.params.id
  }).then(function (district) {
    res.send(district);
  });
})

const deleteDistrictByDistrictName = ((req, res, next) => {
  //to access :id ---> req.params.id
  districtModel.findOneAndRemove({
    District_Name_EN: req.params.districtNameEN
  }).then(function (district) {
    res.send(district);
  });
})

// Count projects based on themes and District

const countMostInterventionTypePerDistrict = ((req, res) => {
  

  /// Count number of projects per theme for each District
  districtModel.find({}, {
    District_Name_EN: 1,
    _id: 0
  }).then(function (district) {
    for (let i = 0; i < district.length; i++) {
      let map = new Map();
      // Get all data
      projectsModel.find({
        District_Name_EN: district[i].District_Name_EN
      }).then(function (cities) {
        if (cities.length > 0) {

          async function countProjectsBasedonTheme() {
            try {
              // Find the number of documents that match the specified query, and print out the count.
              map['R_C'] = await projectsModel.countDocuments({
                $and: [{District_Name_EN: {
                  $eq: district[i].District_Name_EN
                }},
                {theme: {
                  $in: ['R_C']
                }}]
              });
              map['E_E'] = await projectsModel.countDocuments({
                $and: [{District_Name_EN: {
                  $eq: district[i].District_Name_EN
                }},
                {theme: {
                  $in: ['E_E']
                }}]
              });
              map['D_E'] = await projectsModel.countDocuments({
                $and: [{District_Name_EN: {
                  $eq: district[i].District_Name_EN
                }},
                {theme: {
                  $in: ['D_E']
                }}]
              });
              map['I_D'] = await projectsModel.countDocuments({
                $and: [{District_Name_EN: {
                  $eq: district[i].District_Name_EN
                }},
                {theme: {
                  $in: ['I_D']
                }}]
              });
              map['H_D'] = await projectsModel.countDocuments({
                $and: [{District_Name_EN: {
                  $eq: district[i].District_Name_EN
                }},
                {theme: {
                  $in: ['H_D']
                }}]
              });
              map['P_S'] = await projectsModel.countDocuments({
                $and: [{District_Name_EN: {
                  $eq: district[i].District_Name_EN
                }},
                {theme: {
                  $in: ['P_S']
                }}]
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

              if (Object.values(map).includes(0)) {
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

              districtModel.findOneAndUpdate({
                District_Name_EN: district[i].District_Name_EN
              }, {
                $set: {
                  "Most_Intervention_Type": mostProjects,
                  "Least_Intervention_Type": leastProjects,
                  "No_Intervention_Type": noProjects,
                }
              }).then(function () {
                districtModel.findOne({
                  District_Name_EN: district[i].District_Name_EN
                }).then(function (district) {
                  //res.send(district);
                });
              });
              
              
              console.log(`${district[i].District_Name_EN}:\n map: ${Object.values(map)}, Conatins zero: ${Object.values(map).includes(0)}, no Projects: ${noProjects}, least Projects: ${leastProjects}, most Projects: ${mostProjects}`);
            
            } catch (err) {
              res.send('Error: ' + err);
            }

          }
          countProjectsBasedonTheme().catch(console.dir);

        } else {
          districtModel.findOneAndUpdate({
            District_Name_EN: district[i].District_Name_EN
          }, {
            $set: {
              "Most_Intervention_Type": "",
              "Least_Intervention_Type": "",
              "No_Intervention_Type": "",
            }
          }).then(function () {
            districtModel.findOne({
              District_Name_EN: req.params.District_Name_EN
            }).then(function (district) {
              //res.send(district);
            });
          });
        }
        //res.send(cities);
      });
    }
    res.send("Done");

  });


})

module.exports = {
  getDistricts: getDistricts,
  createDistrict: createDistrict,
  updateDistrictByID: updateDistrictByID,
  updateDistrictByDistrictName: updateDistrictByDistrictName,
  deleteDistrictByID: deleteDistrictByID,
  deleteDistrictByDistrictName: deleteDistrictByDistrictName,
  countMostInterventionTypePerDistrict: countMostInterventionTypePerDistrict
}