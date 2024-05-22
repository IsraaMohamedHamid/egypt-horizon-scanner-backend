const mongoose from "mongoose");
const Schema = mongoose.Schema;

const Profile = Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    profession: String,
    DOB: String,
    titleline: String,
    about: String,
    img: {
      type: String,
      default: "",
    },
  },
  {
    timestamp: true,
  }
);

export default  mongoose.model("Profile", Profile, "Profile",);