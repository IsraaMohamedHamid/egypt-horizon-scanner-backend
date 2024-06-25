///------------------------------------------ IMPORT ------------------------------------------///

///---------------------- FILES ----------------------///
import { User, registerUser } from '../../Model/Users/user_model.js';

///---------------------- LIBRARIES ----------------------///
import config from "../../config.js";
import jwt from "jsonwebtoken";
import express from "express";
const router = express.Router();
import multer from "multer";
import path from "path";
import fs from "fs";

///---------------------- CONTROLLERS ----------------------///
// Adding and update profile image
export const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../Profile Picture Uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.decoded.username + ".jpg");
  },
});

export const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const uploadImage = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1024 * 1024 * 6,
  },
  fileFilter: fileFilter,
});

// Adding and update profile image
export const addAndUpdateProfileImage = async (req, res, next) => {
  try {
    var userPhotoName = req.body.userPhotoName;
    var userPhotoFile = req.body.userPhotoFile;
    var realFile = Buffer.from(userPhotoFile, "base64");

    fs.writeFile(userPhotoName, realFile, function (err) {
      if (err) console.log(err);
    });

    res.send("OK");

    const profile = await User.findOneAndUpdate(
      { email: req.params.email },
      {
        $set: {
          userPhotoName: req.body.userPhotoName,
          userPhotoFile: req.body.userPhotoFile,
        },
      },
      { new: true }
    );

    const response = {
      message: "Image successfully updated",
      data: profile,
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send(err);
  }
};

// Get a list of users from the DB
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const getUserUsingUsername = async (req, res) => {
  try {
    const result = await User.findOne({ username: req.params.username });
    return res.json({
      data: result,
      username: req.params.username,
    });
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
};

export const getUserUsingEmail = async (req, res) => {
  try {
    const result = await User.findOne({ email: req.params.email });
    return res.json({
      data: result,
      email: req.params.email,
    });
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
};

// Check to see if user exists
export const checkUsernameExists = async (req, res) => {
  try {
    const result = await User.findOne({ username: req.params.username });
    if (result !== null) {
      return res.json({ Status: true });
    } else {
      return res.json({ Status: false });
    }
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
};

export const checkEmailExists = async (req, res) => {
  try {
    const result = await User.findOne({ email: req.params.email });
    if (result !== null) {
      return res.json({ Status: true });
    } else {
      return res.json({ Status: false });
    }
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
};

// Login User
export const logIn = async (req, res) => {
  try {
    const result = await User.findOne({
      $or: [{ email: req.body.email }, { userName: req.body.username }],
    });

    if (result === null) {
      return res.status(404).json("Username or email incorrect");
    }

    // Validate password
    if (result.password === req.body.password) {
      // Implement the JWT token functionality
      let token = jwt.sign(
        { $or: [{ email: req.body.email }, { userName: req.body.username }] },
        config.key,
        {}
      );

      res.json({
        token: token,
        msg: "success",
      });
    } else {
      res.status(403).json("Password is incorrect");
    }
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
};

// Register User
export const register = async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ msg: "Email already in use" });
    }

    // Create new user with hashed password
    const user = new User({

      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      userPhotoName: req.body.userPhotoName,
      userPhotoFile: req.body.userPhotoFile,
      userPhotoURL: req.body.userPhotoURL,
      userLanguage: req.body.userLanguage,
      userPhoneNumber: req.body.userPhoneNumber,
      optionalPhoneNumber: req.body.optionalPhoneNumber,
      userGender: req.body.userGender,
      userDateOfBirth: req.body.userDateOfBirth,
      phoneNumber: req.body.phoneNumber,
      dateUpdated: new Date(),
      dateCreate: new Date(),
      fullName: req.body.fullName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    // Save user and respond
    await user.save();
    res.status(201).json({ msg: "User Successfully Registered" });
  } catch (err) {
    res.status(500).json({ msg: "Server error during registration" });
  }
};

// Update a user information in the DB
export const updateUserInformationByID = async (req, res, next) => {
  try {
    await registerUser.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body });
    const user = await registerUser.findOne({ _id: req.params.id });
    res.send(user);
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const updateUserInformationByUsername = async (req, res, next) => {
  try {
    await registerUser.findOneAndUpdate({ username: req.params.username }, { $set: req.body });
    const user = await registerUser.findOne({ username: req.params.username });
    res.send(user);
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const updateUserInformationByEmail = async (req, res, next) => {
  try {
    await registerUser.findOneAndUpdate({ email: req.params.email }, { $set: req.body });
    const user = await registerUser.findOne({ email: req.params.email });
    res.send(user);
  } catch (err) {
    return res.status(500).send(err);
  }
};

// Update a user password in the DB
export const updateUserPasswordByUsername = async (req, res, next) => {
  try {
    await registerUser.findOneAndUpdate(
      { $or: [{ email: req.body.email }, { userName: req.body.username }] },
      { $set: { password: req.body.password } }
    );
    const msg = {
      msg: "Password successfully updated",
      username: req.params.username,
    };
    return res.json(msg);
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
};

export const updateUserPasswordByEmail = async (req, res, next) => {
  try {
    await registerUser.findOneAndUpdate(
      { $or: [{ email: req.body.email }, { userName: req.body.username }] },
      { $set: { password: req.body.password } }
    );
    const msg = {
      msg: "Password successfully updated",
      email: req.params.email,
    };
    return res.json(msg);
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
};

// Delete a user from the DB
export const deleteUserByID = async (req, res, next) => {
  try {
    const user = await registerUser.findByIdAndRemove({ _id: req.params.id });
    res.send(user);
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const deleteUserByUsername = async (req, res, next) => {
  try {
    await registerUser.findOneAndDelete({
      $or: [{ email: req.body.email }, { userName: req.body.username }],
    });
    const msg = {
      msg: "User deleted",
      username: req.params.username,
    };
    return res.json(msg);
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
};

export const deleteUserByEmail = async (req, res, next) => {
  try {
    await registerUser.findOneAndDelete({
      $or: [{ email: req.body.email }, { userName: req.body.username }],
    });
    const msg = {
      msg: "User deleted",
      email: req.params.email,
    };
    return res.json(msg);
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
};

///---------------------- EXPORTS ----------------------///
export default {
  addAndUpdateProfileImage: addAndUpdateProfileImage,
  getUsers: getUsers,
  getUserUsingUsername: getUserUsingUsername,
  getUserUsingEmail: getUserUsingEmail,
  checkUsernameExists: checkUsernameExists,
  checkEmailExists: checkEmailExists,
  logIn: logIn,
  register: register,
  updateUserInformationByID: updateUserInformationByID,
  updateUserInformationByUsername: updateUserInformationByUsername,
  updateUserInformationByEmail: updateUserInformationByEmail,
  updateUserPasswordByUsername: updateUserPasswordByUsername,
  updateUserPasswordByEmail: updateUserPasswordByEmail,
  deleteUserByID: deleteUserByID,
  deleteUserByUsername: deleteUserByUsername,
  deleteUserByEmail: deleteUserByEmail,
};
