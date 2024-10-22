require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: 'postgresql://todo_list_cblv_user:1ReduEO1dwhINjNjzTpJ9GloiGLeCXTE@dpg-csbteubtq21c73a860pg-a/todo_list_cblv',
  ssl: {
    rejectUnauthorized: false
  }
});

//const pool = new Pool({
//  user: process.env.DB_USER,
//  host: process.env.DB_HOST,
//  database: process.env.DB_NAME,
//  password: process.env.DB_PASSWORD,
//  port: process.env.DB_PORT,
//});

pool.connect()
  .then(client => {
    console.log('Conexão ao banco de dados bem-sucedida');
    client.release();
  })
  .catch(err => console.error('Erro ao conectar ao banco de dados', err.stack));

const app = express();
const port = 10000;

app.use(cors({
  origin: 'https://todo-list-gray-delta-83.vercel.app/',
  credentials: true,
}));
app.use(bodyParser.json());

// Routes

// Test Route
app.get('/', (req, res) => {
    res.send('API RESTful funcionando!');
});

// Route to get all tasks for one user 
app.get('/todos', async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: 'userId é necessário' });
  }

  try {
    const result = await pool.query('SELECT * FROM todos WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
});

// Route to add a task
app.post('/todos', async (req, res) => {
  try {
    const { title, userId } = req.body;

    const result = await pool.query(
      'INSERT INTO todos (title, user_id) VALUES ($1, $2) RETURNING *', [title, userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error); 
    res.status(500).json({ error: 'Erro ao adicionar tarefa' });
  }
});

// Route to delete a task
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.json({ message: 'Tarefa excluída' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir tarefa' });
  }
});

app.patch('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  try {
    const result = await pool.query(
      'UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *',
      [completed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    const updatedTodo = result.rows[0];
    res.json(updatedTodo);

  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ message: 'Erro ao atualizar tarefa' });
  }
});

// Route to register a new user
app.post('/register', async (req, res) => {
  const { name, email, birthdate, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);;
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO users (name, email, birth_date, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, birthdate, hashedPassword]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// Route to login user
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(senha, user.password);
    

    if (isMatch) {
      res.json({ message: 'Login bem-sucedido', userId: user.id });
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }

    } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});