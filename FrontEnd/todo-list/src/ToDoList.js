import React from 'react';
import TodoItem from './TodoItem';

const ToDoList = ({ todos, onDelete, onToggle }) => {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
};

export default ToDoList;

