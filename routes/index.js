const router = require('express').Router();

// router.get('/', (req, res) => {
//   res.status(200).json('allgood');
// });
router.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
router.use('/movies', require('./movies'));
router.use('/user', require('./user'));

module.exports = router;
