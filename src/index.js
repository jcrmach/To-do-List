const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];


//Middelware
function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if(!user) {
    return response.status(404).json({ error: "Username not found!"});
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { username, name } = request.body;

  const userAlreadyExists = users.find(user => user.username === username);

  if(userAlreadyExists) {
    return response.status(400).json({ error: "User already exists!"});
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos:[]
  }

  users.push(user);

  return response.status(201).send(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;


  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const checktodo = user.todos.find(todo => todo.id === id);

  if(!checktodo) {
    return response.status(404).json({ error: "Todo not found"});
  }

  checktodo.title = title;
  checktodo.deadline = new Date(deadline);

  return response.json(checktodo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const checktodo = user.todos.find(todo => todo.id === id);

  if(!checktodo) {
    return response.status(404).json({ error: "Todo not found"});
  }

  checktodo.done = true;

  return response.json(checktodo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todoIndex = user.todos.findIndex(todo => todo.id === id);

  if(todoIndex === -1) {
    return response.status(404).json({ error: "Todo not found"});
  }

  user.todos.splice(todoIndex, 1);

  return response.status(204).send();
});

module.exports = app;