const User = require("../models/User");
const { parsePreferencesPatch } = require("../utils/preferences");

const getPreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth.userId).select("preferences");

    if (!user) {
      return next({ status: 404, message: "User not found." });
    }

    return res.json({
      success: true,
      data: {
        preferences: user.preferences,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const updatePreferences = async (req, res, next) => {
  try {
    const { error, update } = parsePreferencesPatch(req.body);

    if (error) {
      return next({ status: 400, message: error });
    }

    const user = await User.findById(req.auth.userId);

    if (!user) {
      return next({ status: 404, message: "User not found." });
    }

    user.preferences = {
      ...user.preferences.toObject(),
      ...update,
    };

    if (user.preferences.defaultSymbol && !user.preferences.watchlistSymbols.includes(user.preferences.defaultSymbol)) {
      user.preferences.watchlistSymbols = [
        user.preferences.defaultSymbol,
        ...user.preferences.watchlistSymbols,
      ].slice(0, 20);
    }

    await user.save();

    return res.json({
      success: true,
      data: {
        preferences: user.preferences,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getPreferences,
  updatePreferences,
};
