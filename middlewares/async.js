const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.log("Error: ", error);
      return res.fail(error.message);
    }
  };
};

module.exports = asyncWrapper;
