const pool = require('../db/db');

const testConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Conexão bem-sucedida:', res.rows[0]);
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } finally {
        pool.end();
    }
};

testConnection();
