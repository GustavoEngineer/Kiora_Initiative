const db = require('../config/supabase');

class TagModel {
    static async getAll() {
        const query = 'SELECT * FROM tag';
        const { rows } = await db.query(query);
        return rows;
    }

    static async getById(id) {
        const query = 'SELECT * FROM tag WHERE id = $1';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async create(name, importance_level) {
        const query = 'INSERT INTO tag (name, importance_level) VALUES ($1, $2) RETURNING *';
        const { rows } = await db.query(query, [name, importance_level]);
        return rows[0];
    }

    static async update(id, name, importance_level) {
        const query = 'UPDATE tag SET name = $1, importance_level = $2 WHERE id = $3 RETURNING *';
        const { rows } = await db.query(query, [name, importance_level, id]);
        return rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM tag WHERE id = $1 RETURNING *';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }
}

module.exports = TagModel;
