const database = require('../database/connect');
const { validId } = require('./utils');

const getUserFavorites = async (req, res) => {
  try {
    // console.log(req.oidc.user.sid);
    const user_sid = req.oidc.user.sid;
    const response = await database
      .getDb()
      .db()
      .collection('user_favorites')
      .find({ sid: user_sid }, { _id: 0 });
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
    const user_sid = req.oidc.user.sid;
    // return res.status(200).json('Createdd');
    const response = await database
      .getDb()
      .db()
      .collection('user_favorites')
      .findOneAndUpdate(
        { sid: user_sid },
        {
          $set: {
            sid: user_sid,
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
    const user_sid = req.oidc.user.sid;

    const response = await database
      .getDb()
      .db()
      .collection('user_favorites')
      .findOneAndUpdate(
        { sid: user_sid },
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

module.exports = { getUserFavorites, addUserFavorite, removeUserFavorite };
