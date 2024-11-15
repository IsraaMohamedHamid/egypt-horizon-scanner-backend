///------------------------------------------ IMPORT ------------------------------------------///


///---------------------- FILES ----------------------///
import { addAndUpdateProfileImage, getUsers, getUserUsingUsername, getUserUsingEmail, checkUsernameExists, checkEmailExists, logIn, register, updateUserInformationByID, updateUserInformationByUsername, updateUserInformationByEmail, updateUserPasswordByUsername, updateUserPasswordByEmail, deleteUserByID, deleteUserByUsername, deleteUserByEmail } from "../../Controller/Users/user_api_controller";

///---------------------- LIBRARIES ----------------------///
import config from "../../config";
import middleware from "../../middleware";

import { Router } from "express";
const router = Router();
import jwt from "jsonwebtoken";

import multer, { diskStorage } from "multer";
import path from "path";

///------------------------------------------ ROUTES ------------------------------------------///
const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../Profile Picture Uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.params.email + ".jpg");
    //cb(null, new Date().toISOString()+file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 6,
  },
  // fileFilter: fileFilter,
});

///------ Adding and update user image ------///
router.post("/add/image/:email", upload.single("myFile"), addAndUpdateProfileImage);


///------ Get a list of Locations from the DB ------///
router.get('/', getUsers);

router.get("/getUserUsingUsername/:username", getUserUsingUsername);

router.get("/getUserUsingEmail/:email", getUserUsingEmail);

///------ Check to see if user exists ------///
router.route("/checkusername/:username").get(checkUsernameExists);

router.route("/checkemail/:email").get(checkEmailExists);

///------ Login User ------///
router.route("/login").post(logIn);

///------ Register User ------///
router.route("/register").post(register);

///------ Update user information in the DB ------///
router.put("/update/id/:id", updateUserInformationByID);

router.put("/update/username/:username", updateUserInformationByUsername);

router.put("/update/email/:email", updateUserInformationByEmail);

///------ Update user password in the DB ------///
router.put("/update/forgetPassword/username/:username", updateUserPasswordByUsername);

router.put("/update/forgetPassword/email/:email", updateUserPasswordByEmail);

///------ Delete a user from the DB ------///
router.delete("/delete/id/:id", deleteUserByID);

router.delete("/delete/username/:username", deleteUserByUsername);

router.delete("/delete/email/:email", deleteUserByEmail);

///------------------------------------------ EXPORTS ------------------------------------------///
export default router;