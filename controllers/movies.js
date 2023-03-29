const database = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;
const { validId, isAdmin } = require('./utils');

const getAll = async (req, res) => {
  try {
    const response = await database.getDb().db().collection('movies').find();
    response.toArray().then((entries) => {
      res.status(200).json(entries);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(`Something went wrong.`);
  }
};

const getOne = async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(500).json(`Invalid id`);
    }
    const id = new ObjectId(req.params.id);
    const response = await database.getDb().db().collection('movies').find({ _id: id });
    response.toArray().then((entries) => {
      if (entries.length > 0) {
        return res.status(200).json(entries);
      }
      return res.status(404).json(`Nothing was found`);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(`Something went wrong.`);
  }
};

const createOne = async (req, res) => {
  try {
    if ((await isAdmin(req.oidc.user)) === false) {
      return res.status(405).json('That request is not possible.');
    }
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

    // console.log(newMovie);
    // return res.status(200).json('CREATED');
    const response = await database.getDb().db().collection('movies').insertOne(newMovie);
    console.log(response);
    if (response.acknowledged) {
      return res.status(200).json(response);
    }
    throw response;
  } catch (err) {
    console.log(err);
    res.status(500).json(`Something went wrong.`);
  }
};

const updateOne = async (req, res) => {
  try {
    if ((await isAdmin(req.oidc.user)) === false) {
      return res.status(405).json('That request is not possible.');
    }
    if (!validId(req.params.id)) {
      return res.status(500).json(`Invalid id`);
    }

    const id = new ObjectId(req.params.id);
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

    const response = await database
      .getDb()
      .db()
      .collection('movies')
      .replaceOne({ _id: id }, newMovie);

    if (response.modifiedCount > 0) {
      return res.status(200).json('Movie updated.');
    } else {
      res.status(404).json('Nothing was found');
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(`Something went wrong.`);
  }
};

const deleteOne = async (req, res) => {
  try {
    if ((await isAdmin(req.oidc.user)) === false) {
      return res.status(405).json('That request is not possible.');
    }
    if (!validId(req.params.id)) {
      return res.status(500).json(`Invalid id`);
    }

    const id = new ObjectId(req.params.id);
    const response = await database.getDb().db().collection('movies').deleteOne({ _id: id }, true);
    if (response.deletedCount > 0) {
      res.status(200).send('Movie deleted.');
    } else {
      res.status(404).json('Nothing was found');
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(`Something went wrong.`);
  }
};

module.exports = { getAll, getOne, createOne, updateOne, deleteOne };
