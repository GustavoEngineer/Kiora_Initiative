const BlocModel = require('../models/blocModel');

class BlocController {
    static async getAll(req, res) {
        try {
            const blocs = await BlocModel.getAll();
            res.json(blocs);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const bloc = await BlocModel.getById(req.params.id);
            if (!bloc) return res.status(404).json({ message: 'Bloc not found' });
            res.json(bloc);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const { name } = req.body;
            const bloc = await BlocModel.create(name);
            res.status(201).json(bloc);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { name } = req.body;
            const bloc = await BlocModel.update(req.params.id, name);
            if (!bloc) return res.status(404).json({ message: 'Bloc not found' });
            res.json(bloc);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const bloc = await BlocModel.delete(req.params.id);
            if (!bloc) return res.status(404).json({ message: 'Bloc not found' });
            res.json({ message: 'Bloc deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = BlocController;
