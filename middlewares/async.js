const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      res.fail(error.message);
    }
  };
};

module.exports = asyncWrapper;
