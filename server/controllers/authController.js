const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sanitizeUser } = require("../utils/sanitizeUser");
const {
  createAccessToken,
  createRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
  verifyRefreshToken,
} = require("../utils/tokens");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const validateAuthInput = ({ email, password, fullName, isRegister }) => {
  if (!EMAIL_REGEX.test(normalizeEmail(email))) {
    return "A valid email is required.";
  }

  if (typeof password !== "string" || password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (isRegister) {
    if (typeof fullName !== "string" || fullName.trim().length < 2) {
      return "Full name is required.";
    }
  }

  return null;
};

const register = (env) => async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body || {};
    const inputError = validateAuthInput({ fullName, email, password, isRegister: true });

    if (inputError) {
      return next({ status: 400, message: inputError });
    }

    const normalizedEmail = normalizeEmail(email);

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return next({ status: 409, message: "Email is already in use." });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    const refreshToken = createRefreshToken({ userId: user.id, env });
    const accessToken = createAccessToken({ userId: user.id, env });

    setRefreshCookie({ res, token: refreshToken, env });

    return res.status(201).json({
      success: true,
      data: {
        user: sanitizeUser(user),
        accessToken,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return next({ status: 409, message: "Email is already in use." });
    }
    return next(error);
  }
};

const login = (env) => async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const inputError = validateAuthInput({ email, password, isRegister: false });

    if (inputError) {
      return next({ status: 400, message: inputError });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return next({ status: 401, message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return next({ status: 401, message: "Invalid email or password." });
    }

    const refreshToken = createRefreshToken({ userId: user.id, env });
    const accessToken = createAccessToken({ userId: user.id, env });

    setRefreshCookie({ res, token: refreshToken, env });

    return res.json({
      success: true,
      data: {
        user: sanitizeUser(user),
        accessToken,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const refresh = (env) => async (req, res, next) => {
  try {
    const token = req.cookies?.[env.refreshCookieName];

    if (!token) {
      return next({ status: 401, message: "Refresh token is missing." });
    }

    let payload;

    try {
      payload = verifyRefreshToken({ token, env });
    } catch (_error) {
      clearRefreshCookie({ res, env });
      return next({ status: 401, message: "Invalid or expired refresh token." });
    }

    const user = await User.findById(payload.sub);

    if (!user) {
      clearRefreshCookie({ res, env });
      return next({ status: 401, message: "User not found for refresh token." });
    }

    const nextRefreshToken = createRefreshToken({ userId: user.id, env });
    const accessToken = createAccessToken({ userId: user.id, env });

    setRefreshCookie({ res, token: nextRefreshToken, env });

    return res.json({
      success: true,
      data: {
        user: sanitizeUser(user),
        accessToken,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const me = () => async (req, res, next) => {
  try {
    const user = await User.findById(req.auth.userId);

    if (!user) {
      return next({ status: 404, message: "User not found." });
    }

    return res.json({
      success: true,
      data: {
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    return next(error);
  }
};

const logout = (env) => (_req, res) => {
  clearRefreshCookie({ res, env });
  return res.json({
    success: true,
    data: {
      message: "Logged out successfully.",
    },
  });
};

module.exports = {
  register,
  login,
  refresh,
  me,
  logout,
};
