const handleError = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).render("shared/500");
};

module.exports = handleError;
