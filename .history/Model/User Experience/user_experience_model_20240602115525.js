import mongoose from 'mongoose';

// Create UserExperiences Schema and Model
export const userExperiencesSchema = new mongoose.Schema({
    userExperienceID: {
        type: String,
    },
    userExperienceName: {
        type: String,
    },
    userExperienceInstitution: {
        type: String,
    },
    userExperienceEmail: {
        type: String,
    },
    userExperiencePhone: {
        type: String,
    },
    userExperienceJobTitle: {
        type: String,
    },
    userExperienceImage: {
        type: String,
    },
    userExperienceBio: {
        type: String,
    },
    userExperienceSource: {
        type: String,
    },
    userExperienceStatus: {
        type: String,
    },
    userExperienceBackground: {
        type: String,
    },
})

export const UserExperienceshModel = mongoose.model('userExperiences', userExperiencesSchema, 'user_experiences');

export default {
    userExperiencesSchema,
    UserExperienceshModel
};