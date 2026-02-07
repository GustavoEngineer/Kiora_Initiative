const SubtaskModel = require('../models/subtaskModel');

class SubtaskController {
    static async getByTask(req, res) {
        try {
            const taskId = req.params.taskId;
            if (!taskId) return res.status(400).json({ error: 'Task ID is required' });

            const subtasks = await SubtaskModel.getAllByTaskId(taskId);
            res.json(subtasks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const { task_id, title } = req.body;
            if (!task_id || !title) {
                return res.status(400).json({ error: 'Task ID and Title are required' });
            }

            const subtask = await SubtaskModel.create(req.body);
            res.status(201).json(subtask);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const subtask = await SubtaskModel.update(id, req.body);
            if (!subtask) return res.status(404).json({ message: 'Subtask not found' });
            res.json(subtask);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const subtask = await SubtaskModel.delete(id);
            if (!subtask) return res.status(404).json({ message: 'Subtask not found' });
            res.json({ message: 'Subtask deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = SubtaskController;
