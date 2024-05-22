////////////////////////////////////////////// IMPORTS //////////////////////////////////////////////

import {EmergenceIssueOfTheMonthModel} from '../../../Model/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_model.js';
import {EmergenceIssueOfTheMonthDataModel} from '../../../Model/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_data_model.js';
import {
  spawn
} from 'child_process';
import schedule from 'node-schedule';
import {
  MongoClient
} from 'mongodb';

////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////

// URI to your MongoDB, usually from environment variables or directly as a string
const uri = 'mongodb+srv://doadmin:wh37z621PJb850ai@dbaas-db-5626135-310aba91.mongo.ondigitalocean.com/egypt-horizon-scanner?tls=true&authSource=admin&replicaSet=dbaas-db-5626135';

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

export async function watchEmergingIssues() {
    try {
        await client.connect();
        console.log("Connected successfully to server");

        const db = client.db("egypt-horizon-scanner");
        const collection = db.collection('EmergenceIssueOfTheMonthData');

        const changeStream = collection.watch();
        console.log('Watching for changes in Emerging Issues data...');

        changeStream.on('change', async (change) => {
            console.log('Change detected:', change);
            await emergingIssueDataUpdate();
            await emergingIssueComponentsCalculation();
        });

    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
}

export const emergingIssueDataUpdate = () => new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', ['./path_to_script/update_emergence_issue_of_the_month_data.py']);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Python stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data}`);
        reject(new Error(`Python script encountered an error: ${data}`));
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            console.log('Python process exited successfully');
            resolve();
        } else {
            reject(new Error(`Python process exited with code ${code}`));
        }
    });
});

export const scheduleTasks = () => {
    schedule.scheduleJob('0 */6 * * *', async () => {
        console.log('Scheduled job started.');
        try {
            await emergingIssueDataUpdate();
            await emergingIssueComponentsCalculation();
        } catch (error) {
            console.error('Scheduled task failed:', error);
        }
    });
};

// Initialize scheduling
scheduleTasks();