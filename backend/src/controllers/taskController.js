const TaskModel = require('../models/taskModel');

class TaskController {
    static async getAll(req, res) {
        try {
            const tasks = await TaskModel.getAll();
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const task = await TaskModel.getById(req.params.id);
            if (!task) return res.status(404).json({ message: 'Task not found' });
            res.json(task);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const task = await TaskModel.create(req.body);
            res.status(201).json(task);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const task = await TaskModel.update(req.params.id, req.body);
            if (!task) return res.status(404).json({ message: 'Task not found' });
            res.json(task);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const task = await TaskModel.delete(req.params.id);
            if (!task) return res.status(404).json({ message: 'Task not found' });
            res.json({ message: 'Task deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = TaskController;
