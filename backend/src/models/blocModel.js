const db = require('../config/supabase');

class BlocModel {
    static async getAll() {
        const query = 'SELECT * FROM bloc';
        const { rows } = await db.query(query);
        return rows;
    }

    static async getById(id) {
        const query = 'SELECT * FROM bloc WHERE id = $1';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async create(name) {
        const query = 'INSERT INTO bloc (name) VALUES ($1) RETURNING *';
        const { rows } = await db.query(query, [name]);
        return rows[0];
    }

    static async update(id, name) {
        const query = 'UPDATE bloc SET name = $1 WHERE id = $2 RETURNING *';
        const { rows } = await db.query(query, [name, id]);
        return rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM bloc WHERE id = $1 RETURNING *';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }
}

module.exports = BlocModel;
