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
  is_auth: {
    type: Boolean,
    default: false,
  },
  is_verified: {
    type: Boolean,
    default: false,
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
  // Uncomment the fields below if needed
  // profile_image: { type: String },
  // email_verified: { type: Boolean, default: false },
  // email_verified_at: { type: Date },
  // reset_password_token: { type: String },
  // reset_password_token_expires_at: { type: Date },
  // isActive: { type: Boolean, default: true },
  // resetPasswordToken: { type: String },
  // resetPasswordTokenExpiresAt: { type: Date },
  // otp: { type: String },
  // otp_expiry: { type: Date },
  // refresh_token: { type: String },
  // refresh_token_expiry: { type: Date },
  // password_reset_token: { type: String },
  // password_reset_token_expires_at: { type: Date },
  // password_reset_token_last_used_at: { type: Date },
  // password_reset_token_last_used_ip: { type: String },
  // password_reset_token_last_used_device: { type: String },
  // password_reset_token_last_used_browser: { type: String },
  // password_reset_token_last_used_os: { type: String },
  // password_reset_token_last_used_location: { type: String },
  // password_reset_token_last_used_country: { type: String },
  // password_reset_token_last_used_continent: { type: String },
  // password_reset_token_last_used_timezone: { type: String },
  // password_reset_token_last_used_latitude: { type: Number },
  // password_reset_token_last_used_longitude: { type: Number },
  // password_reset_token_last_used_altitude: { type: Number },
  // password_reset_token_last_used_accuracy: { type: Number },
  // password_reset_token_last_used_device_id: { type: String },
  // password_reset_token_last_used_device_type: { type: String },
  // password_reset_token_last_used_device_model: { type: String },
});

UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const UserModel = mongoose.model("UserInformation", UserSchema);

export default UserModel;
