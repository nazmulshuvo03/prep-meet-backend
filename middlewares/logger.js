const requestLogger = (req, res, next) => {
  console.log(
    `-----> ${req.method} request  (${req.protocol})      ${req.originalUrl}`
  );
  next();
};

module.exports = {
  requestLogger,
};
