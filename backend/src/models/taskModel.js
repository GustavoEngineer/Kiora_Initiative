const db = require('../config/supabase');

class TaskModel {
    static async getAll() {
        const query = `
            SELECT t.*, 
            (SELECT COUNT(*)::int FROM subtask s WHERE s.task_id = t.id) as subtask_count,
            (SELECT COUNT(*)::int FROM subtask s WHERE s.task_id = t.id AND s.completed = TRUE) as completed_subtask_count
            FROM task t
        `;
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
        const fields = Object.keys(data);
        if (fields.length === 0) return null;

        const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
        const values = fields.map(field => data[field]);
        values.push(id);

        const query = `
            UPDATE task
            SET ${setClause}
            WHERE id = $${values.length}
            RETURNING *
        `;

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
