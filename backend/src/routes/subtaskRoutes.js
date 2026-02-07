const express = require('express');
const router = express.Router();
const SubtaskController = require('../controllers/subtaskController');

// Get all subtasks for a specific task
router.get('/task/:taskId', SubtaskController.getByTask);

// Create a new subtask
router.post('/', SubtaskController.create);

// Update a subtask (including toggle complete)
router.put('/:id', SubtaskController.update);

// Delete a subtask
router.delete('/:id', SubtaskController.delete);

module.exports = router;
