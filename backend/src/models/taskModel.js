const db = require('../config/supabase');

class TaskModel {
    static async getAll() {
        const query = 'SELECT * FROM task';
        const { rows } = await db.query(query);
        return rows;
    }

    static async getById(id) {
        const query = 'SELECT * FROM task WHERE id = $1';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async create(data) {
        const { title, description, due_date, completed, estimated_hours, bloc_id, tag_id } = data;
        const query = `
      INSERT INTO task (title, description, due_date, completed, estimated_hours, bloc_id, tag_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
        const values = [
            title,
            description,
            due_date,
            completed || false,
            estimated_hours,
            bloc_id,
            tag_id
        ].map(v => v === undefined ? null : v);

        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async update(id, data) {
        const { title, description, due_date, completed, estimated_hours, bloc_id, tag_id } = data;
        const query = `
      UPDATE task
      SET title = $1, description = $2, due_date = $3, completed = $4, estimated_hours = $5, bloc_id = $6, tag_id = $7
      WHERE id = $8
      RETURNING *
    `;
        const values = [
            title,
            description,
            due_date,
            completed,
            estimated_hours,
            bloc_id,
            tag_id,
            id
        ].map(v => v === undefined ? null : v);

        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM task WHERE id = $1 RETURNING *';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }
}

module.exports = TaskModel;
