import { Database } from './database.js';
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {

      const { search } = request.query

      const tasks = database.select('tasks', null, search ? {
        title: search,
        description: search,
      } : null)

      return response
        .end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      let task = {}
      const title = request.body.title ? request.body.title : null
      const description = request.body.description ? request.body.description : null

      console.log(title)
      console.log(description)

      if (title && description) {
        task = {
          id: randomUUID(),
          title,
          description,
          completed_at: null,
          created_at: new Date(),
          updated_at: new Date()
        }
      } else {
        return response.writeHead(404).end()
      }

      database.insert('tasks', task)

      return response.writeHead(201).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {

      const { id } = request.params

      database.delete('tasks', id)

      return response.writeHead(204).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {

      let taskUpdates = {}
      const { id } = request.params
      const title = request.body.title ? request.body.title : null
      const description = request.body.description ? request.body.description : null

      console.log(title)
      console.log(description)

      if (title && description) {
        taskUpdates = {
          title,
          description,
          updated_at: new Date()
        }
      }

      if (title === null && description === null) {
        return response.writeHead(404).end()
      }

      if (title === null) {
        taskUpdates = {
          description,
          updated_at: new Date()
        }
      }

      if (description === null) {
        taskUpdates = {
          title,
          updated_at: new Date()
        }
      }

      const task = database.select('tasks', id, null)

      if (task) {
        database.update('tasks', id, taskUpdates)
      } else {
        return response.writeHead(404).end()
      }

      return response.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (request, response) => {

      let taskUpdates = {}
      const { id } = request.params

      const task = database.select('tasks', id, null)

      if (task) {
        if (task.completed_at === null) {
          taskUpdates = {
            completed_at: new Date()
          }
        } else {
          taskUpdates = {
            completed_at: null
          }
        }
        database.update('tasks', id, taskUpdates)
      } else {
        return response.writeHead(404).end()
      }

      return response.writeHead(204).end()
    }
  }
]