
import mongoose from 'mongoose';

// Create donor Schema
export const DonorSchema = new mongoose.Schema({
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


export const DonorSchemaModel = mongoose.model('DonorSigma', DonorSchema, 'donor_sigma');

export default { DonorSchema, DonorSchemaModel };