const mongoose = require("mongoose");
const { DEFAULT_PREFERENCES } = require("../utils/preferences");

const preferencesSchema = new mongoose.Schema(
  {
    watchlistSymbols: {
      type: [String],
      default: DEFAULT_PREFERENCES.watchlistSymbols,
    },
    defaultSymbol: {
      type: String,
      default: DEFAULT_PREFERENCES.defaultSymbol,
    },
    defaultInterval: {
      type: String,
      default: DEFAULT_PREFERENCES.defaultInterval,
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    preferences: {
      type: preferencesSchema,
      default: DEFAULT_PREFERENCES,
    },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
