import { DataBase } from "./database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new DataBase()

export const routes = [

    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler:(req, res) => {
            const tasks = database.select('tasks')

            console.log(tasks)

            return res.end(JSON.stringify(tasks))
        }
    },

    {
        method: 'GET',
        path: buildRoutePath('/tasks/:id'),
        handler:(req, res) => {
            const { id } = req.params
            const task = database.select('tasks', id)
            

            console.log(id)
            console.log(task)
            return res.end(JSON.stringify(task))
        }
    },

    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler:(req, res) => {
            const {title, description } = req.body

            if(!title){
                return res.writeHead(404).end(
                    JSON.stringify({ message: 'title is required' })
                );
            }

            if(!description){
                return res.writeHead(404).end(
                    JSON.stringify({message: 'description is required'})
                )
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                create_at: new Date(),
                update_at: null,
            }

            database.insert("tasks", task)

            console.log(task)
            return res.writeHead(202).end()

            
        }
    },

    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id'),
        handler: async(req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            if(!id){
                return res.writeHead(404).end(
                    JSON.stringify({message: 'id is required'})
                )
            }

            database.update('tasks', id, {
                title,
                description,
                update_at: new Date(),
            })

            console.log(id)
            console.log(title, description)
            
            return res.writeHead(204).end()
        }
    },

    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler:(req, res) => {
            const { id } = req.params

            if(!id){
                return res.writeHead(404).end(
                    JSON.stringify({message: 'id is required'})
                )
            }


            database.update('tasks', id, {
                completed_at: new Date()
            })

            return res.writeHead(200).end()
        }
    },

    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler:(req, res) => {
            const { id } = req.params

            if(!id){
                return res.writeHead(404).end(
                    JSON.stringify({message: 'id is required'})
                )
            }

            database.delete('tasks',id)

            return res.writeHead(204).end()
        }
    }

]


