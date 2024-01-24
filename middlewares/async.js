const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.log(
        error,
        "\n",
        `Error source { METHOD: ${req.method},  URL: ${req.originalUrl}}`
      );
      res.failResponse(error.message);
    }
  };
};

module.exports = asyncWrapper;
