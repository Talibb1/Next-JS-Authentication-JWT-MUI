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
    // match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
  roles: {
    type: [String],
    enum: ["user", "admin", "moderator"],
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
  is_verified: {
    type: Boolean,
    default: false,
  },
  // Uncomment the fields below if needed
  // profile_image: { type: String },
  // email_verified: { type: Boolean, default: false },
  // email_verified_at: { type: Date },
  // reset_password_token: { type: String },
  // reset_password_token_expires_at: { type: Date },
  // isActive: { type: Boolean, default: true },
  // resetPasswordToken: { type: String },
  // resetPasswordTokenExpiresAt: { type: Date },
});

UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
