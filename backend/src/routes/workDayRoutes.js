const express = require('express');
const router = express.Router();
const WorkDayController = require('../controllers/workDayController');

router.get('/', WorkDayController.getAll);
router.get('/:id', WorkDayController.getById);
router.post('/', WorkDayController.create);
router.put('/:id', WorkDayController.update);
router.delete('/:id', WorkDayController.delete);

module.exports = router;
