module.exports = {
    checkAdmin: function (req, res, next) {
      if (req.user.role == 'Admin') {
        return next();
      } else {
        res.redirect("/driver");
      }
    },
    checkDriver: function (req, res, next) {
        if (req.user.role == 'Driver') {
          return next();
        } else {
          res.redirect("/admin");
        }
      },
  };