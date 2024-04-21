const generateRandomProject = () => {
    // Basic implementation of generating random values for demonstration.
    // Consider using libraries like faker.js for more realistic data generation.
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const getRandomArrayElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const themes = ['Education', 'Healthcare', 'Infrastructure', 'Technology'];
    const status = ['Planning', 'Executing', 'Completed', 'Paused'];

    return {
        id: `proj-${getRandomInt(1000, 9999)}`, // Simple ID generation, consider UUIDs for real use cases.
        projectNo: getRandomInt(1, 100),
        projectName: `Project ${getRandomInt(1, 100)}`,
        projectDetail: `Detail of project ${getRandomInt(1, 100)}`,
        photoURL: `https://example.com/photo${getRandomInt(1, 100)}.jpg`,
        executingAgency: [], // Populate according to ExecutingAgencySchema
        status: getRandomArrayElement(status),
        theme: [getRandomArrayElement(themes)],
        estimatedCost: getRandomInt(10000, 50000),
        budget: getRandomInt(5000, 15000),
        totalDonatedAmount: getRandomInt(0, 5000),
        startDate: getRandomDate(new Date(2015, 0, 1), new Date(2020, 0, 1)),
        endDate: getRandomDate(new Date(2021, 0, 1), new Date(2025, 0, 1)),
        Latitude: parseFloat((Math.random() * (180 - (-180)) + (-180)).toFixed(6)),
        Longitude: parseFloat((Math.random() * (180 - (-180)) + (-180)).toFixed(6)),
        Locality_Name_EN: 'Locality EN',
        Locality_Name_AR: 'المحلية',
        Locality_PCODE: `LPC${getRandomInt(100, 999)}`,
        City_Name_EN: 'City EN',
        City_Name_AR: 'المدينة',
        City_PCODE: `CPC${getRandomInt(100, 999)}`,
        District_Name_EN: 'District EN',
        District_Name_AR: 'المنطقة',
        District_PCODE: `DPC${getRandomInt(100, 999)}`,
        Governorate_Name_EN: 'Governorate EN',
        Governorate_Name_AR: 'المحافظة',
        Governorate_PCODE: `GPC${getRandomInt(100, 999)}`,
        State_Name_EN: 'State EN',
        State_Name_AR: 'الدولة',
        State_PCODE: `SPC${getRandomInt(100, 999)}`,
        Province_Name_EN: 'Province EN',
        Province_Name_AR: 'المقاطعة',
        Province_PCODE: `PPC${getRandomInt(100, 999)}`,
        Region_Name_EN: 'Region EN',
        Region_Name_AR: 'المنطقة',
        Region_PCODE: `RPC${getRandomInt(100, 999)}`,
        Country_EN: 'Country EN',
        Country_AR: 'البلد',
        Country_PCODE: `CPC${getRandomInt(100, 999)}`,
        donor: [], // Populate according to DonorSchema
        contribution: `Contribution details ${getRandomInt(1, 100)}`,
        dataReliability: 'High' // Example static value, adjust as necessary
    };
};

// Generate a dummy project
const dummyProject = generateRandomProject();
console.log(dummyProject);
