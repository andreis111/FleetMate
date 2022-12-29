const passport = require("passport");
const validator = require("validator");
const Admin = require("../models/Admin");
const Driver = require("../models/Driver");

exports.getLogin = (req, res) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      return res.redirect("/admin");
    } else {
      return res.redirect("/driver")
    }
  }
  res.render("login", {
    title: "Login",
  });
};

exports.postLogin = (req, res, next) => {
  
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/login");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate(['admin', 'driver'], (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", { msg: "Success! You are logged in." });
      res.redirect(req.user.role === 'admin' ? '/admin' : '/driver');
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => {
    console.log('User has logged out.')
  })
  req.session.destroy((err) => {
    if (err)
      console.log("Error : Failed to destroy the session during logout.", err);
    req.user = null;
    res.redirect("/");
  });
};

exports.getSignup = (req, res) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      return res.redirect("/admin");
    } else {
      return res.redirect("/driver")
    }
  }
  res.render("signup", {
    title: "Create Account",
  });
};

exports.postSignup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 6 }))
    validationErrors.push({
      msg: "Password must be at least 6 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("../signup");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = new Admin({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    role: 'admin'
  });

  Admin.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
    (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists.",
        });
        return res.redirect("../signup");
      }
      user.save((err) => {
        if (err) {
          return next(err);
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          } else {
            return res.redirect("/admin")
          }
        });
      });
    }
  );
};

exports.postSignupDriver = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 6 }))
    validationErrors.push({
      msg: "Password must be at least 6 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("../signup");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = new Driver({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    idCard: req.body.idCard,
    expireLicense: req.body.expireLicense,
    expirePermit: req.body.expirePermit,
    expireAdr: req.body.expireAdr,
    adminId: req.user.id
  });

  Driver.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
    (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists.",
        });
        return res.redirect("../signup");
      }
      user.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/admin/drivers')
      });
    }
  );
};
