const WorkDayModel = require('../models/workDayModel');

class WorkDayController {
    static async getAll(req, res) {
        try {
            const workDays = await WorkDayModel.getAll();
            res.json(workDays);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const workDay = await WorkDayModel.getById(req.params.id);
            if (!workDay) return res.status(404).json({ message: 'WorkDay not found' });
            res.json(workDay);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const { available_hours } = req.body;
            const workDay = await WorkDayModel.create(available_hours);
            res.status(201).json(workDay);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { available_hours } = req.body;
            const workDay = await WorkDayModel.update(req.params.id, available_hours);
            if (!workDay) return res.status(404).json({ message: 'WorkDay not found' });
            res.json(workDay);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const workDay = await WorkDayModel.delete(req.params.id);
            if (!workDay) return res.status(404).json({ message: 'WorkDay not found' });
            res.json({ message: 'WorkDay deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = WorkDayController;
