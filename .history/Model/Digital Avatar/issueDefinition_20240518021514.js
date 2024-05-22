
import mongoose from 'mongoose';

const issueDefinitionSchema = new mongoose.Schema({
  Term: { type: String, required: true },
  Definition: { type: String, required: true }
});

export default  mongoose.model('IssueDefinition', issueDefinitionSchema);


const IssuesModel =  export default  mongoose.model('Issue', issueSchema);

export default {
  issueSchema,
  IssuesModel
}