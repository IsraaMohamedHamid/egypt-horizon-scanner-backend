///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///


///---------------------- LIBRARIES ----------------------///
import mongoose from 'mongoose';

///------------------------------------------ SCHEMA ------------------------------------------///
var loginUserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
});

var registerUserSchema = new mongoose.Schema({
     prefix: {
        type: String,
    },
     username: {
        type: String,
        unique: true
    },
     fullName: {
        type: String,
    },
     firstName: {
        type: String,
    },
     lastName: {
        type: String,
    },
     userPhotoURL: {
        type: String,
    },
     userPhotoName: {
        type: String,
    },
     userPhotoFile: {
        type: String,
    },
     nationality: {
        type: String,
    },
     occupation: {
        type: String,
    },
     email: {
        type: String,
        unique: true
    },
     password: {
        type: String,
    },
     confirmedPassword: {
        type: String,
    },
     userLanguage: {
        type: String,
    },
     userPhoneNumber: {
        type: String,
    },
     optionalPhoneNumber: {
        type: String,
    },
     userGender: {
        type: String,
    },
     userDateOfBirth: {
        type: String,
    },
     phoneNumber: {
        type: String,
    },
     dateUpdated:  {
        type: Date
    },
     dateCreate:  {
        type: Date
    },
});



///------------------------------------------ MODEL ------------------------------------------///
// This two schemas will save on the 'users' collection.
export var User = mongoose.model('User', loginUserSchema, 'user_data');
export var registerUser = mongoose.model('Registered', registerUserSchema, 'user_data');

///------------------------------------------ EXPORT ------------------------------------------///
export default  {
    User,
    registerUser
};