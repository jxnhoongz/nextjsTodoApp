/**
 *@author Vatana_Han
 *Est. Time Spent: 3Days
 * (Sat.Sun: Framework research),(Mon.afternoon,Tue.morning : implementation)
 *Implemented functions:
 * - Todo Validation: no empty data and no duplicate data
 * - Removable todos: clicking the delete button will remove an item
 * - Editable todos: clicking the edit button will allow the user to edit the item
 * - Todos filtering
 * - Mark as Complete: clicking on a todo item will display a strike through text
 *
 * The CRUD apis are implemented in /api/todo.js 
 * 
 * Know bug:
 *  Adding a todo item require a refesh to load
 * Fix: adding a line of code to refresh the page
 *  Pros: fix the problem
 *  Cons: Not UX Friendly
 *
 *Note: Please use localhost3000 to test this project. the built-in stackblitz view doesn't work
 */

import React, { useState, useEffect } from "react";

const Todo = () => {

  const [todos, setTodos] = useState([]);
  const [editTodo, setEditTodo] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [filteredTodos,setFilteredTodos] = useState([]);


  useEffect(() => {
    fetch("/api/todo", { method: "GET" })
      .then(response => response.json())
      .then(data => setTodos(data.map(item => ({
        id: item.ref["@ref"].id,
        todo: item.data.todo,
        isCompleted: item.data.isCompleted,
        createdAt: item.data.createdAt
      }))))
      .catch(error => console.error(error));
  }, []);

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      handleAdd();
      console.log('enter pressed, value is ' + inputValue);
    }

  }

  const updateTodo = (updatedTodo) => {
    fetch("api/todo", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedTodo)
    })
      .then(response => response.json())
      .then(data => {
        console.log("Success:", data);
        setTodos(
          todos.map(item => {
            if (item.id === updatedTodo.id) {
              return updatedTodo;
            }
            return item;
          })
        );
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }

  const sortTodos=todo=>{
      console.log(todo);

      const sorted_td=todo.sort(function(a,b){
        const dateObj1=new Date(a.createdAt).getTime();
        const dateObj2=new Date(b.createdAt).getTime();
        return dateObj2-dateObj1;
      })
      // console.log(sorted_td)
      return sorted_td;
  }

  const handleAdd = () => {
    if (inputValue) {
      const existingTodo = todos.find(todo => todo.todo === inputValue);
      if (!existingTodo) {
        const newTodo = {
          todo: inputValue,
          isCompleted: false,
          createdAt: new Date().toString()
        };
        console.log(newTodo);
        fetch("/api/todo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newTodo)
        })
          .then(response =>
            response.json())
          .then(data => {
            setTodos([...todos, {
              id: data.response.ref["@ref"].id,
              todo: data.todo,
              isCompleted: data.isCompleted,
              createdAt: data.createdAt
            }]);
            setInputValue("");
          })
          .catch(error => console.error(error));
          window.location.reload();

      } else {
        alert("Todo already exists");
      }
    }
  };



  const handleEditClick = todo => {
    console.log("Edit button clicked for To-do:", todo);
    setEditTodo(todo);
    setInputValue(todo.todo);
  };


  const handleUpdate = todo => {
    console.log("todo update clicked", todo);
    const updatedTodo = { ...todo, todo: inputValue };
    console.log("updated todo", updatedTodo);
    updateTodo(updatedTodo);
    setInputValue("");
    setEditTodo(null);
  };

  const handleDelete = id => {
    setTodos(todos.filter(item => item.id !== id));
    fetch("api/todo", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(id)
    })
      .then(response => response.json())
      .then(data => {
        console.log("Success:", data);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  };

  const handleInput = event => {
    const inputValue = event.target.value;
    setInputValue(inputValue);

    if (inputValue) {
      setFilteredTodos(todos.filter(item => item.todo.includes(inputValue)));
      console.log(inputValue);
      console.log(filteredTodos);
      console.log(inputValue.length)
    } else {
      setFilteredTodos([]);
    }
  };

  const handleTodoClick = todo => {
    console.log("Todo clicked", todo);
    const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
    console.log(updatedTodo);
    updateTodo(updatedTodo);
  };

  return (<>
    <h1>Todo</h1>
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
      />
      {(editTodo ? <>
        <button onClick={() => handleUpdate(editTodo)}>Update Todo</button>
      </> : <><button onClick={handleAdd}>Add Todo</button></>)}
    </div>
    <div>
      {(filteredTodos.length!=0 || inputValue.length!=0)?sortTodos(filteredTodos).map(todo => (
        <li key={todo.id} style={{ textDecoration: todo.isCompleted ? "line-through" : "none" }}>
          <span onClick={() => handleTodoClick(todo)}>{todo.todo}</span>
          <span >{todo.createdAt}</span>
          <button onClick={() => handleEditClick(todo)}>Edit</button>
          <button onClick={() => handleDelete(todo.id)}>Delete</button>
        </li>
      )):sortTodos(todos).map(todo => (
        <li key={todo.id} style={{ textDecoration: todo.isCompleted ? "line-through" : "none" }}>
          <span onClick={() => handleTodoClick(todo)}>{todo.todo}</span>
          <span >{todo.createdAt}</span>
          <button onClick={() => handleEditClick(todo)}>Edit</button>
          <button onClick={() => handleDelete(todo.id)}>Delete</button>
        </li>
      ))}

      <button onClick={()=>sortTodos(todos)}>test sort</button>
    </div>
  </>)
}

export default Todo;