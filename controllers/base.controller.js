const getIndex = (req, res) => {
  res.render("index");
};

const getHome = (req, res) => {
  res.render("customer/home-page");
};

module.exports = {
  getIndex: getIndex,
  getHome: getHome,
};
