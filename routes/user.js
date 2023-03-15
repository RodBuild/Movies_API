const router = require('express').Router();
const { isAuthenticated, isValidMovieId } = require('../controllers/utils');
const controller = require('../controllers/user');

router.get('/', isAuthenticated, (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

router.get('/favorites', isAuthenticated, controller.getUserFavorites);
router.put('/favorites/:movie', isAuthenticated, isValidMovieId, controller.addUserFavorite);
router.delete('/favorites/:movie', isAuthenticated, isValidMovieId, controller.removeUserFavorite);
// router.get('/reviews', requiresAuth(), controller.getUserFavorites);

module.exports = router;
