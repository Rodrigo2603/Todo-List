import React from 'react';

const ToDoItem = ({ todo, onDelete, onToggle }) => {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed} 
        onChange={() => onToggle(todo.id)}
      />
      {todo.title}
      <button onClick={() => onDelete(todo.id)}>Excluir</button>
    </li>
  );
};

export default ToDoItem;

