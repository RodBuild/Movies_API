const router = require('express').Router();
const controller = require('../controllers/movies');
const { validateMovie } = require('../controllers/utils');

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', validateMovie, controller.createOne);
router.put('/:id', validateMovie, controller.updateOne);
router.delete('/:id', controller.deleteOne);

module.exports = router;
