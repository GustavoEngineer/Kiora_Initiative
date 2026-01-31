const express = require('express');
const router = express.Router();
const TagController = require('../controllers/tagController');

router.get('/', TagController.getAll);
router.get('/:id', TagController.getById);
router.post('/', TagController.create);
router.put('/:id', TagController.update);
router.delete('/:id', TagController.delete);

module.exports = router;
