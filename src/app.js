const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepository(request, response, next) {
  const { id } = request.params

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'invalid project id' })
  }

  const repositoryIndex = repositories.findIndex(r => r.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  request.repositoryIndex = repositoryIndex

  return next()
}

app.use('/repositories/:id', validateRepository)

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository)

  return response.json(repository)

});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body
  const repositoryIndex = request.repositoryIndex

  const repository = {
    id: repositories[repositoryIndex].id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositorys[repositoryIndex] = repository

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const repositoryIndex = request.repositoryIndex

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const repositoryIndex = request.repositoryIndex
  repositories[repositoryIndex].likes ++
  return response.status(204).send() 
});

module.exports = app;
