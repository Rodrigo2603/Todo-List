import './App.css';
import React, { useState, useEffect } from 'react';
import ToDoList from './ToDoList';
import AddTodo from './AddTodo';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (userId) {
      fetch(`https://todo-list-v547.onrender.com/todos?userId=${userId}`)
        .then(response => response.json())
        .then(data => setTodos(data))
        .catch(error => console.error('Erro ao buscar tarefas:', error));
    } else {
      console.error('Nenhum userId encontrado no localStorage.');
    }
  }, []);

  // Add a new task
  const addTodo = async (todoTitle) => {
    const userId = localStorage.getItem('userId');
    const newTodo = { title: todoTitle, completed: false, userId: userId };

    try {
      const response = await fetch('http://localhost:5000/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (response.ok) {
        const data = await response.json();
        setTodos(prevTodos => [...prevTodos, data]);
      } else {
        console.error('Erro ao adicionar tarefa:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  // Delete a task
  const deleteTodo = (id) => {
    fetch(`http://localhost:5000/todos/${id}`, { method: 'DELETE' })
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(error => console.error('Erro ao excluir tarefa:', error));
  };

  // Update if the task is completed
  const toggleTodo = (id) => {
    const todoToToggle = todos.find(todo => todo.id === id);

    if (!todoToToggle) {
      console.error('Tarefa não encontrada');
      return;
    }

    const updatedCompletedState = !todoToToggle.completed;

    fetch(`http://localhost:5000/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: updatedCompletedState }),
    })
      .then(response => response.json())
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id ? updatedTodo : todo
          )
        );
      })
      .catch(error => console.error('Erro ao alternar tarefa:', error));
  };

  // Logout user
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <AddTodo onAdd={addTodo} />
      <ToDoList todos={todos} onDelete={deleteTodo} onToggle={toggleTodo} />
    </div>
  );
};

export default App;
