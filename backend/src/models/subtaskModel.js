const db = require('../config/supabase');

class SubtaskModel {
    static async getAllByTaskId(taskId) {
        const query = 'SELECT * FROM subtask WHERE task_id = $1 ORDER BY id ASC';
        const { rows } = await db.query(query, [taskId]);
        return rows;
    }

    static async getById(id) {
        const query = 'SELECT * FROM subtask WHERE id = $1';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async create(data) {
        const { task_id, title, description, completed } = data;
        const query = `
      INSERT INTO subtask (task_id, title, description, completed)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
        const values = [
            task_id,
            title,
            description,
            completed || false
        ].map(v => v === undefined ? null : v);

        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async update(id, data) {
        const { title, description, completed } = data;

        // Dynamic update query builder could be better, but fixed for now based on typical usage
        // Note: keeping it simple as we usually update all or specific fields passed.
        // For partial updates, standard pattern is to fetch first or coalesce in SQL.
        // Here we assume full object or handle undefined carefully if we want COALESCE

        const query = `
      UPDATE subtask
      SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        completed = COALESCE($3, completed)
      WHERE id = $4
      RETURNING *
    `;
        const values = [title, description, completed, id];

        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM subtask WHERE id = $1 RETURNING *';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }
}

module.exports = SubtaskModel;
