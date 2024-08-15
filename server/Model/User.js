import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true,
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true,
  },
  authProvider: {
    type: [String], // Change from String to [String]
    enum: ["google", "github", "facebook", "local"],
    required: true,
  },
  isAuth: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  roles: {
    type: [String],
    enum: ["superadmin", "admin", "user", "moderator"],
    default: ["user"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for Performance
UserSchema.index({ email: 1 });

const UserModel = mongoose.model("UserInformation", UserSchema);

export default UserModel;
