///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///


///---------------------- LIBRARIES ----------------------///
import mongoose from 'mongoose';

export var EHSTeamSchema = new mongoose.Schema({
    "teamMemberName": {
        type: String,
    },
    "teamMemberImage": {
        type: String,
    },
    "teamMemberBio": {
        type: String,
    },
});

///------------------------------------------ MODEL ------------------------------------------///
export var EHSTeamModel = mongoose.model('ehs_team', EHSTeamSchema, 'ehs_team');

///------------------------------------------ EXPORT ------------------------------------------///
export default {
    EHSTeamSchema,
    EHSTeamModel
};