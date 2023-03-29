const router = require('express').Router();
const { isAdmin } = require('../controllers/utils');

// router.get('/', (req, res) => {
//   res.status(200).json('allgood');
// });
router.get('/', async (req, res) => {
  const hasPermission = await isAdmin(req.oidc.user);
  // if (data === undefined) {
  //   data = false;
  // } else {
  //   data = await isAdmin(req.oidc.user.email);
  // }
  // console.log(req.oidc.user);
  res.render('pages/index', {
    isLoggedIn: `${req.oidc.isAuthenticated()}`,
    isAdmin: `${hasPermission}`,
  });
  // res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
router.get('/admin', async (req, res) => {
  const hasPermission = await isAdmin(req.oidc.user);
  if (!hasPermission) {
    res.redirect('/');
  }
  res.render('pages/admin', {
    isLoggedIn: `${req.oidc.isAuthenticated()}`,
    isAdmin: `${hasPermission}`,
  });
});
router.use('/movies', require('./movies'));
router.use('/user', require('./user'));

module.exports = router;
