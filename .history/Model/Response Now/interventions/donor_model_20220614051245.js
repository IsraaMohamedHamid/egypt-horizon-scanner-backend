import mongoose from 'mongoose';

// Create donor Schema
const DonorSigma = new Schema({
    donorName: {
        type: String,
        required: [true]
    },
    donorEmail: {
        type: String,
        unique: true
    },
    donorWebsite: {
        type: String,
        unique: true
    },
    donorPhotoUrl: {
        type: String
    },
    donorProjectList:{
        type:[String]
    },
    donationAmount: {
        type: Number
    }
})

export default  DonorSigma;