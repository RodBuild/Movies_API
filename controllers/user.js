const database = require('../database/connect');
const { validId } = require('./utils');

const getUserFavorites = async (req, res) => {
  try {
    // console.log(req.oidc.user.sid);
    const user_email = req.oidc.user.email;
    const response = await database
      .getDb()
      .db()
      .collection('user_favorites')
      .find({ email: user_email }, { _id: 0 });
    response.toArray().then((entries) => {
      if (entries.length > 0) {
        return res.status(200).json(entries);
      }
      return res.status(404).json(`User has not added any favorite movies.`);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(`Something went wrong.`);
  }
};

const addUserFavorite = async (req, res) => {
  try {
    const movie_id = req.params.movie;
    const user_email = req.oidc.user.email;
    // return res.status(200).json('Createdd');
    const response = await database
      .getDb()
      .db()
      .collection('user_favorites')
      .findOneAndUpdate(
        { email: user_email },
        {
          $set: {
            email: user_email,
          },
          // $set: { last_update: Date.now() },
          $addToSet: { movies: movie_id },
          $currentDate: { lastModified: true },
        },
        { upsert: true }
      );

    // console.log(response);
    if (response.lastErrorObject.updatedExisting === false) {
      return res.status(200).json(`Created a new favorites list for user.`);
    } else if (response.lastErrorObject.updatedExisting === true) {
      return res.status(200).json(`Updated user's favorites list`);
    } else {
      throw response;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(`Something went wrong.`);
  }
};

const removeUserFavorite = async (req, res) => {
  try {
    const movie_id = req.params.movie;
    const user_email = req.oidc.user.email;

    const response = await database
      .getDb()
      .db()
      .collection('user_favorites')
      .findOneAndUpdate(
        { email: user_email },
        { $pull: { movies: movie_id }, $currentDate: { lastModified: true } }
      );

    // console.log(response);
    if (response.lastErrorObject.updatedExisting === false) {
      return res.status(200).json(`User has not added any favorite movies.`);
    } else if (response.lastErrorObject.updatedExisting === true) {
      return res.status(200).json(`Updated user's favorites list`);
    } else {
      throw response;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(`Something went wrong.`);
  }
};

const getUserFavoritesCustom = async (req, res) => {
  try {
    const user_email = req.oidc.user.email;
    const response = await database
      .getDb()
      .db()
      .collection('user_favorites_custom')
      .find({ email: user_email });
    response.toArray().then((entries) => {
      if (entries.length > 0) {
        return res.status(200).json(entries);
      }
      return res.status(404).json(`User has not added any custom favorite movies.`);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(`Something went wrong.`);
  }
};
const addUserFavoriteCustom = async (req, res) => {
  try {
    const user_email = req.oidc.user.email;
    const newMovie = {
      title: req.body.title,
      category: req.body.category,
      motion_picture_rating: req.body.motion_picture_rating,
      duration: req.body.duration,
      plot: req.body.plot,
      release_date: req.body.release_date,
      release_year: req.body.release_year,
      rating: req.body.rating,
    };
    const response = await database.getDb().db().collection('user_favorites_custom').insertOne({});
  } catch (err) {
    console.log(err);
    res.status(500).json(`Something went wrong.`);
  }
};
const updateUserFavoriteCustom = async (req, res) => {};
const deleteUserFavoriteCustom = async (req, res) => {};

module.exports = {
  getUserFavorites,
  addUserFavorite,
  removeUserFavorite,
  getUserFavoritesCustom,
  addUserFavoriteCustom,
  updateUserFavoriteCustom,
  deleteUserFavoriteCustom,
};
