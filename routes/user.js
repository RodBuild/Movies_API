const router = require('express').Router();
const { isAuthenticated, isValidMovieId, validateMovie, isAdmin } = require('../controllers/utils');
const controller = require('../controllers/user');

router.get('/', isAuthenticated, async (req, res) => {
  const hasPermission = await isAdmin(req.oidc.user);
  // console.log(req.oidc.user.sid);
  res.render('pages/user', {
    isLoggedIn: `${req.oidc.isAuthenticated()}`,
    isAdmin: `${hasPermission}`,
  });
  // res.send(JSON.stringify(req.oidc.user));
});
router.get('/profile', isAuthenticated, async (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// For movies that already exist in the database (verified movies)
router.get('/favorites', isAuthenticated, controller.getUserFavorites);
router.put('/favorites/:movie', isAuthenticated, isValidMovieId, controller.addUserFavorite);
router.delete('/favorites/:movie', isAuthenticated, isValidMovieId, controller.removeUserFavorite);
// For user's own movies
router.get('/favorites-custom', isAuthenticated, validateMovie, controller.getUserFavoritesCustom);
router.post('/favorites-custom', isAuthenticated, validateMovie, controller.addUserFavoriteCustom);
router.put(
  '/favorites-custom',
  isAuthenticated,
  validateMovie,
  controller.updateUserFavoriteCustom
);
router.delete(
  '/favorites-custom',
  isAuthenticated,
  validateMovie,
  controller.deleteUserFavoriteCustom
);
// router.get('/reviews', requiresAuth(), controller.getUserFavorites);

module.exports = router;
