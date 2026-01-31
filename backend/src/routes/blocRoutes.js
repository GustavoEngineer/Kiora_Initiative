const express = require('express');
const router = express.Router();
const BlocController = require('../controllers/blocController');

router.get('/', BlocController.getAll);
router.get('/:id', BlocController.getById);
router.post('/', BlocController.create);
router.put('/:id', BlocController.update);
router.delete('/:id', BlocController.delete);

module.exports = router;
