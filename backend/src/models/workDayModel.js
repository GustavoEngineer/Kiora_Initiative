const db = require('../config/supabase');

class WorkDayModel {
    static async getAll() {
        const query = 'SELECT * FROM work_day';
        const { rows } = await db.query(query);
        return rows;
    }

    static async getById(id) {
        const query = 'SELECT * FROM work_day WHERE id = $1';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async create(available_hours) {
        const query = 'INSERT INTO work_day (available_hours) VALUES ($1) RETURNING *';
        const { rows } = await db.query(query, [available_hours]);
        return rows[0];
    }

    static async update(id, available_hours) {
        const query = 'UPDATE work_day SET available_hours = $1 WHERE id = $2 RETURNING *';
        const { rows } = await db.query(query, [available_hours, id]);
        return rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM work_day WHERE id = $1 RETURNING *';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }
}

module.exports = WorkDayModel;
