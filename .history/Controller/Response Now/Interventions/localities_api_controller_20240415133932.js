const {
  cityModel,
  CitySchema
} from '../../../Model/Response Now/Interventions/city_model.js');

const {
  projectsModel,
  ProjectSchema
} from '../../../Model/Response Now/Interventions/projects_model.js');

// Get a list of cities from the DB
const getCities = ((req, res, next) => {
  
   // Count number of projects per theme for each City
   cityModel.find({}, {
    City_Name_EN: 1,
    _id: 0
  }).then(function (city) {
    for (let i = 0; i < city.length; i++) {
      let map = new Map();
      // Get all data
      projectsModel.find({
        City_Name_EN: city[i].City_Name_EN
      }).then(function (cities) {
        if (cities.length > 0) {

          async function countProjectsBasedonTheme() {
            try {
              // Find the number of documents that match the specified query, and print out the count.
              map['R_C'] = await projectsModel.countDocuments({
                $and: [{City_Name_EN: {
                  $eq: city[i].City_Name_EN
                }},
                {theme: {
                  $in: ['R_C']
                }}]
              });
              map['E_E'] = await projectsModel.countDocuments({
                $and: [{City_Name_EN: {
                  $eq: city[i].City_Name_EN
                }},
                {theme: {
                  $in: ['E_E']
                }}]
              });
              map['D_E'] = await projectsModel.countDocuments({
                $and: [{City_Name_EN: {
                  $eq: city[i].City_Name_EN
                }},
                {theme: {
                  $in: ['D_E']
                }}]
              });
              map['I_D'] = await projectsModel.countDocuments({
                $and: [{City_Name_EN: {
                  $eq: city[i].City_Name_EN
                }},
                {theme: {
                  $in: ['I_D']
                }}]
              });
              map['H_D'] = await projectsModel.countDocuments({
                $and: [{City_Name_EN: {
                  $eq: city[i].City_Name_EN
                }},
                {theme: {
                  $in: ['H_D']
                }}]
              });
              map['P_S'] = await projectsModel.countDocuments({
                $and: [{City_Name_EN: {
                  $eq: city[i].City_Name_EN
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

              cityModel.findOneAndUpdate({
                City_Name_EN: city[i].City_Name_EN
              }, {
                $set: {
                  "Most_Intervention_Type": mostProjects,
                  "Least_Intervention_Type": leastProjects,
                  "No_Intervention_Type": noProjects,
                }
              }).then(function () {
                cityModel.findOne({
                  City_Name_EN: city[i].City_Name_EN
                }).then(function (city) {
                  //res.send(city);
                });
              });
              
              
              console.log(`${city[i].City_Name_EN}:\n map: ${Object.values(map)}, Conatins zero: ${Object.values(map).includes(0)}, no Projects: ${noProjects}, least Projects: ${leastProjects}, most Projects: ${mostProjects}`);
            
            } catch (err) {
              res.send('Error: ' + err);
            }

          }
          countProjectsBasedonTheme().catch(console.dir);

        } else {
          cityModel.findOneAndUpdate({
            City_Name_EN: city[i].City_Name_EN
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
    res.send("Done");

  });

  // Get all data
  cityModel.find({}).then(function (cities) {
    res.send(cities);
  });
})

// Add new city to the DB
const createCity = ((req, res, next) => {
  cityModel.create(req.body).then(function (city) {
    res.send(city);
  }).catch(next);

})

// Update a city in the DB
const updateCityByID = ((req, res, next) => {
  //to access :id ---> req.params.id
  cityModel.findByIdAndUpdate({
    _id: req.params.id
  }, {
    $set: req.body
  }).then(function () {
    cityModel.findOne({
      _id: req.params.id
    }).then(function (city) {
      res.send(city);
    });
  });
})

const updateCityByCityName = ((req, res, next) => {
  //to access :id ---> req.params.id
  cityModel.findOneAndUpdate({
    City_Name_EN: req.params.cityNameEN
  }, {
    $set: req.body
  }).then(function () {
    cityModel.findOne({
      City_Name_EN: req.params.City_Name_EN
    }).then(function (city) {
      res.send(city);
    });
  });
})


// Delete a city from the DB
const deleteCityByID = ((req, res, next) => {
  //to access :id ---> req.params.id
  cityModel.findByIdAndRemove({
    _id: req.params.id
  }).then(function (city) {
    res.send(city);
  });
})

const deleteCityByCityName = ((req, res, next) => {
  //to access :id ---> req.params.id
  cityModel.findOneAndRemove({
    City_Name_EN: req.params.cityNameEN
  }).then(function (city) {
    res.send(city);
  });
})

// Count projects based on themes and City

const countMostInterventionTypePerCity = ((req, res) => {
  

  /// Count number of projects per theme for each City
  cityModel.find({}, {
    City_Name_EN: 1,
    _id: 0
  }).then(function (city) {
    for (let i = 0; i < city.length; i++) {
      let map = new Map();
      // Get all data
      projectsModel.find({
        City_Name_EN: city[i].City_Name_EN
      }).then(function (cities) {
        if (cities.length > 0) {

          async function countProjectsBasedonTheme() {
            try {
              // Find the number of documents that match the specified query, and print out the count.
              map['R_C'] = await projectsModel.countDocuments({
                $and: [{City_Name_EN: {
                  $eq: city[i].City_Name_EN
                }},
                {theme: {
                  $in: ['R_C']
                }}]
              });
              map['E_E'] = await projectsModel.countDocuments({
                $and: [{City_Name_EN: {
                  $eq: city[i].City_Name_EN
                }},
                {theme: {
                  $in: ['E_E']
                }}]
              });
              map['D_E'] = await projectsModel.countDocuments({
                $and: [{City_Name_EN: {
                  $eq: city[i].City_Name_EN
                }},
                {theme: {
                  $in: ['D_E']
                }}]
              });
              map['I_D'] = await projectsModel.countDocuments({
                $and: [{City_Name_EN: {
                  $eq: city[i].City_Name_EN
                }},
                {theme: {
                  $in: ['I_D']
                }}]
              });
              map['H_D'] = await projectsModel.countDocuments({
                $and: [{City_Name_EN: {
                  $eq: city[i].City_Name_EN
                }},
                {theme: {
                  $in: ['H_D']
                }}]
              });
              map['P_S'] = await projectsModel.countDocuments({
                $and: [{City_Name_EN: {
                  $eq: city[i].City_Name_EN
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

              cityModel.findOneAndUpdate({
                City_Name_EN: city[i].City_Name_EN
              }, {
                $set: {
                  "Most_Intervention_Type": mostProjects,
                  "Least_Intervention_Type": leastProjects,
                  "No_Intervention_Type": noProjects,
                }
              }).then(function () {
                cityModel.findOne({
                  City_Name_EN: city[i].City_Name_EN
                }).then(function (city) {
                  //res.send(city);
                });
              });
              
              
              console.log(`${city[i].City_Name_EN}:\n map: ${Object.values(map)}, Conatins zero: ${Object.values(map).includes(0)}, no Projects: ${noProjects}, least Projects: ${leastProjects}, most Projects: ${mostProjects}`);
            
            } catch (err) {
              res.send('Error: ' + err);
            }

          }
          countProjectsBasedonTheme().catch(console.dir);

        } else {
          cityModel.findOneAndUpdate({
            City_Name_EN: city[i].City_Name_EN
          }, {
            $set: {
              "Most_Intervention_Type": "",
              "Least_Intervention_Type": "",
              "No_Intervention_Type": "",
            }
          }).then(function () {
            cityModel.findOne({
              City_Name_EN: req.params.City_Name_EN
            }).then(function (city) {
              //res.send(city);
            });
          });
        }
        //res.send(cities);
      });
    }
    res.send("Done");

  });


})

export default  {
  getCities: getCities,
  createCity: createCity,
  updateCityByID: updateCityByID,
  updateCityByCityName: updateCityByCityName,
  deleteCityByID: deleteCityByID,
  deleteCityByCityName: deleteCityByCityName,
  countMostInterventionTypePerCity: countMostInterventionTypePerCity
}