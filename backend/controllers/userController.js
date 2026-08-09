const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const userController = {
  signup: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }
      const existUser = await User.findOne({ email: email });
      if (existUser) {
        return res.status(409).json({
          message: "User  in this email already exists",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      return res.status(201).json({
        message: "user signup successfull",
        user,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  signin: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "please enter email and password ",
        });
      }
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(409).json({
          message: "User  in this email does not exist",
        });
      }
      if (user.isBlocked) {
        return res.status(403).json({
          message: "User Blocked",
        });
      }
      const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT, { expiresIn: "1d" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        message: "user sign in successfully",
        user,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  signout: (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  sendOtp: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          message: "Email is required",
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: "Email does not exist",
        });
      }

      // Generate 6 digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      console.log("Generated OTP:", otp);

      // Save OTP and expiry time
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 60 * 1000);

      await user.save();

      // const transporter = nodemailer.createTransport({
      //   service: "gmail",
      //   auth: {
      //     user: process.env.EMAIL_USER,
      //     pass: process.env.EMAIL_PASS,
      //   },
      // });

      // await transporter.sendMail({
      //   from: process.env.EMAIL_USER,
      //   to: email,
      //   subject: "EasyFix OTP Verification",
      //   text: `Your OTP is ${otp}.
      //       It is valid for 1 minute.`,
      // });

      // Resend start

      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const { data, error } = await resend.emails.send({
        from: "EasyFix <onboarding@resend.dev>",
        to: "jamsheenalezin8@gmail.com",
        subject: "EasyFix OTP Verification",
        text: `Your OTP is ${otp}.
  It is valid for 1 minute.`,
      });

      if (error) {
        console.log("Resend Error:", error);

        return res.status(500).json({
          success: false,
          message: "Failed to send OTP",
        });
      }

      console.log("Email sent:", data);
      //resend end
      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
      });
    } catch (error) {
      console.log("Send OTP Error:", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  //   sendOtp: async (req, res) => {
  //     try {
  //       const { email } = req.body;

  //       if (!email) {
  //         return res.status(400).json({
  //           message: "Email is required",
  //         });
  //       }

  //       const user = await User.findOne({ email });

  //       if (!user) {
  //         return res.status(404).json({
  //           message: "Email does not exist",
  //         });
  //       }

  //       // Generate 6 digit OTP
  //       const otp = Math.floor(100000 + Math.random() * 900000).toString();

  //       console.log("Generated OTP:", otp);

  //       // Save OTP and expiry time
  //       user.otp = otp;
  //       user.otpExpires = new Date(Date.now() + 60 * 1000);

  //       await user.save();

  //       // Resend
  //       const { Resend } = await import("resend");
  //       const resend = new Resend(process.env.RESEND_API_KEY);

  //       const { data, error } = await resend.emails.send({
  //         from: "EasyFix <onboarding@resend.dev>",
  //         to: "jamsheenalezin8@gmail.com",
  //         subject: "EasyFix OTP Verification",
  //         text: `Your OTP is ${otp}.
  // It is valid for 1 minute.`,
  //       });

  //       if (error) {
  //         console.log("Resend Error:", error);

  //         return res.status(500).json({
  //           success: false,
  //           message: "Failed to send OTP",
  //         });
  //       }

  //       console.log("Email sent:", data);

  //       return res.status(200).json({
  //         success: true,
  //         message: "OTP sent successfully",
  //       });
  //     } catch (error) {
  //       console.log("Send OTP Error:", error);

  //       return res.status(500).json({
  //         success: false,
  //         message: "Internal server error",
  //       });
  //     }
  //   },

  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (!user.otp || !user.otpExpires) {
        return res.status(400).json({
          message: "Please request a new OTP",
        });
      }

      if (new Date() > user.otpExpires) {
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        return res.status(400).json({
          message: "OTP has expired",
        });
      }

      if (user.otp !== otp) {
        return res.status(400).json({
          message: "Invalid OTP",
        });
      }

      // OTP verified
      user.otp = null;
      user.otpExpires = null;

      await user.save();

      return res.status(200).json({
        message: "OTP verified successfully",
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: "User does not exist",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;

      await user.save();

      return res.status(200).json({
        message: "Password reset successfully",
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  viewAllUsers: async (req, res) => {
    try {
      const users = await User.find({ role: "user" });
      return res.status(200).json({
        mesaage: "success",
        users,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "inernal server error",
      });
    }
  },

  blockUser: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          message: "User ID is required",
        });
      }

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.isBlocked = !user.isBlocked;
      await user.save();

      return res.status(200).json({
        message: user.isBlocked
          ? "User blocked successfully"
          : "User unblocked successfully",
        user,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  uploadPhoto: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select an image",
        });
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          photo: req.file.path,
        },
        {
          new: true,
        },
      ).select("-password");

      res.status(200).json({
        success: true,
        message: "Profile photo updated successfully",
        user,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  removePhoto: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          photo: "",
        },
        {
          new: true,
        },
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Profile photo removed successfully",
        user,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};

module.exports = userController;
