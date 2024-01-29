const User = require('../models/user.model');
const authUtil = require('../utils/authentication');
const validation = require('../utils/validation');
const sessionFlash = require('../utils/session-flash');

function getSignup(req, res) {
  const sessionData = sessionFlash.getSessionData(req) || {
    email: '',
    confirmEmail: '',
    password: '',
    fullname: '',
    street: '',
    postal: '',
    city: '',
  };

  res.render('customer/auth/signup', { inputData: sessionData });
}

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body['confirm-email'],
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };

  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body['confirm-email'])
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          'Please check your input. Password must be at least 6 characters long, postal code must be 5 characters long.',
        ...enteredData,
      },
      () => res.redirect('/signup')
    );
    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  try {
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: 'User exists already! Try logging in instead!',
          ...enteredData,
        },
        () => res.redirect('/signup')
      );
      return;
    }

    await user.signup();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/login');
}

function getLogin(req, res) {
  const sessionData = sessionFlash.getSessionData(req) || {
    email: '',
    password: '',
  };

  res.render('customer/auth/login', { inputData: sessionData });
}

async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password);
  let existingUser;
  try {
    existingUser = await user.getUserByEmail();
  } catch (error) {
    next(error);
    return;
  }

  const sessionErrorData = {
    errorMessage:
      'Invalid credentials - please double-check your email and password!',
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, () => res.redirect('/login'));
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, () => res.redirect('/login'));
    return;
  }

  authUtil.createUserSession(req, existingUser, () => res.redirect('/'));
}

function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect('/login');
}

module.exports = {
  getSignup,
  getLogin,
  signup,
  login,
  logout,
};
