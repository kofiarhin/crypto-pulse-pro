const sanitizeUser = (user) => ({
  id: String(user._id),
  fullName: user.fullName,
  email: user.email,
  preferences: user.preferences,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

module.exports = {
  sanitizeUser,
};
