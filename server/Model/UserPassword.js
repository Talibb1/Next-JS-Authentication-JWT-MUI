import mongoose from "mongoose";

const UserPasswordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserInformation",
    required: true,
  },
  password: {
    type: String,
    required: function () {
      return !(this.googleId || this.githubId || this.facebookId);
    },
    minlength: [6, "Password must be at least 6 characters long"],
    trim: true,
  },
  oldPasswords: [
    {
      password: { type: String, select: false },
      changedAt: { type: Date, default: Date.now },
    },
  ],
  passwordChangedAt: {
    type: Date,
    default: Date.now,
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

// Middleware to handle password changes and update relevant fields
UserPasswordSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    // Save the current password in oldPasswords before updating
    this.oldPasswords.push({
      password: this.password,
      changedAt: this.passwordChangedAt,
    });
    // Update the passwordChangedAt field with the current date
    this.passwordChangedAt = Date.now();
  }
  // Update the updatedAt field with the current date
  this.updatedAt = Date.now();
  next();
});

// Create and export the UserPassword model
const UserPasswordModel = mongoose.model("UserPassword", UserPasswordSchema);
export default UserPasswordModel;
