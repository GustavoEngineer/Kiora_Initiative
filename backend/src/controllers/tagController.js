const TagModel = require('../models/tagModel');

class TagController {
    static async getAll(req, res) {
        try {
            const tags = await TagModel.getAll();
            res.json(tags);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const tag = await TagModel.getById(req.params.id);
            if (!tag) return res.status(404).json({ message: 'Tag not found' });
            res.json(tag);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const { name, importance_level } = req.body;
            const tag = await TagModel.create(name, importance_level);
            res.status(201).json(tag);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { name, importance_level } = req.body;
            const tag = await TagModel.update(req.params.id, name, importance_level);
            if (!tag) return res.status(404).json({ message: 'Tag not found' });
            res.json(tag);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const tag = await TagModel.delete(req.params.id);
            if (!tag) return res.status(404).json({ message: 'Tag not found' });
            res.json({ message: 'Tag deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = TagController;
