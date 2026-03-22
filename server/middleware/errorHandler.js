const errorHandler = (error, _req, res, _next) => {
  const status = error.status || 500;
  const message = error.message || "Internal server error";

  if (status >= 500) {
    console.error("UNHANDLED SERVER ERROR:", error);
  }

  return res.status(status).json({
    success: false,
    error: {
      message,
    },
  });
};

module.exports = {
  errorHandler,
};
