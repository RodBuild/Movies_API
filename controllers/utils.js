const ObjectId = require('mongodb').ObjectId;
const database = require('../database/connect');
const { check, validationResult } = require('express-validator');

// Const variables
const movie_categories = ['sci-fi', 'action', 'family', 'comedy', 'fantasy', 'adventure'];
const motion_picture_ratings = ['G', 'PG', 'PG-13', 'R'];

const validId = (id) => {
  if (!ObjectId.isValid(id)) {
    return false;
  } else {
    return true;
  }
};

const isValidMovieId = async (req, res, next) => {
  if (!validId(req.params.movie)) {
    return res.status(500).json(`Invalid id`);
  }
  const id = new ObjectId(req.params.movie);
  const response = await database.getDb().db().collection('movies').find({ _id: id });
  await response.toArray().then((entries) => {
    if (entries.length > 0) {
      next();
    } else {
      return res.status(404).json(`Movie with id ${id} does not exist`);
    }
  });
};

const isAuthenticated = async (req, res, next) => {
  if ((await req.oidc.isAuthenticated()) === false) {
    const url = req.hostname;
    return res.status(401).json(`User needs to be logged in. Go to ${url}/login`);
  } else next();
};

validateMovie = [
  check('title')
    .exists()
    .withMessage('Title field is required')
    .notEmpty()
    .withMessage('Title field cannot be empty'),

  check('category')
    .exists()
    .withMessage('Category field is required')
    .notEmpty()
    .withMessage('Category field cannot be empty')
    .custom((value) => {
      for (i in value) {
        if (movie_categories.includes(value[i]) === false) {
          return false;
        }
      }
      return true;
    })
    .withMessage('Category field has one or more invalid value(s)'),

  check('motion_picture_rating')
    .exists()
    .withMessage('Motion picture rating field is required')
    .notEmpty()
    .withMessage('Motion picture rating field cannot be empty')
    .isIn(motion_picture_ratings)
    .withMessage('Motion picture rating field has an invalid value'),

  check('duration')
    .exists()
    .withMessage('Duration field is required')
    .notEmpty()
    .withMessage('Duration field cannot be empty')
    .matches(/^(0[0-9]|1[0-9]|2[0-3])h\s(0[0-9]|[1-5][0-9])m$/)
    .withMessage('Duration field needs the following format 00h 00m'),

  check('plot')
    .exists()
    .withMessage('Plot field is required')
    .notEmpty()
    .withMessage('Plot field cannot be empty'),

  check('release_date')
    .exists()
    .withMessage('Release date field is required')
    .notEmpty()
    .withMessage('Release date field cannot be empty')
    .matches(/^[A-Z][a-z]+\s(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/)
    .withMessage('Release date needs the following format Month 01'),

  check('release_year')
    .exists()
    .withMessage('Release year field is required')
    .notEmpty()
    .withMessage('Release year field cannot be empty')
    .isInt({ min: 1895 })
    .withMessage('Release year field needs to be greater than 1895'),

  check('rating')
    .exists()
    .withMessage('Rating field is required')
    .isFloat({ min: 1.0, max: 5.0 })
    .withMessage('Rating must be between 1.0 and 5.0'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // console.log(errors.mapped());
      return res.status(422).json({ errors: errors.mapped() });
    }
    next();
  },
];

module.exports = { validId, validateMovie, isAuthenticated, isValidMovieId };
