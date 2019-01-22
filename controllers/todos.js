const boom = require('boom');
const Todo = require('../models/todos');
const User = require('../models/user');
const firebase = require('../send');

async function routes (fastify, option) {

    fastify.get('/getTodos', async (req, reply) => {
        const todos = await Todo.find({});
        reply.send(todos);
    
    })
    
    fastify.get('/getTodos/:type', { beforeHandler: async (req, reply, next) => {
        const token = req.headers['authorization'];
        if(!token) reply.status(401).send('Access Denied. No token Provided');
        const decoded = await fastify.jwt.verify(token);
        req.user = decoded;
    }} ,async(req, reply) => {
        const todos = await Todo.find({ type: req.params.type })
                                .or([ { _id: req.user._id }, { user: req.user._id } ])
        reply.send(todos);
    })
    
    fastify.post('/addTodos', { beforeHandler: async (req, reply, next) => {
        const token = req.headers['authorization'];
        if(!token) reply.status(401).send('Access Denied. No token Provided');
        const decoded = await fastify.jwt.verify(token);
        req.user = decoded;
    }}, async (req, reply) => {
        console.log('req.user value is ', req.user);
        const user = await User.findById({ _id: req.user._id });
        if(!user) return reply.status(401).send('Unauthorized User');

        const user_id = req.body.user ? req.body.user : req.user._id;
        const todo = new Todo({
            task: req.body.task,
            user: user_id,
            type: req.body.type
        });
        await todo.save();
        reply.send(todo);
    })
    
    fastify.delete('/deleteTodo/:id', { beforeHandler: async (req, reply, next) => {
        const token = req.headers['authorization'];
        if(!token) reply.status(401).send('Access Denied. No token Provided');
        const decoded = await fastify.jwt.verify(token);
        req.user = decoded;
    }}, async (req, reply) => {
       //console.log('params id is ', req.params.id);
       const user = await User.findById({ _id: req.user._id });
       if(!user) return reply.status(401).send('Unauthorized User');
       
       const todoUser = await Todo.findOne({ user : req.user._id });
       if(!todoUser) return reply.status(404).send('No user found related to this task');

       const todo = await Todo.findOneAndRemove({ _id : req.params.id });
       var payload = {
        notification: {
          title: "Task Deleted",
          body: todoUser.task + "is deleted"
        }
      };
       firebase.sendMessage(payload);
       reply.send(todo);
    })
    
    fastify.put('/updateTodo/:id', { beforeHandler: async (req, reply, next) => {
        const token = req.headers['authorization'];
        if(!token) reply.status(401).send('Access Denied. No token Provided');
        const decoded = await fastify.jwt.verify(token);
        req.user = decoded;
    }}, async (req, reply) => {

        const user = await User.findById({ _id: req.user._id });
        if(!user) return reply.status(401).send('Unauthorized User');

        const todoUser = await Todo.findOne({ user : req.user._id });
        if(!todoUser) return reply.status(404).send('No user found related to this task');

        const todo = await Todo.findOneAndUpdate({ _id : req.params.id }, { task: req.body.task});
        var payload = {
            notification: {
              title: "Task Deleted",
              body: todoUser.task + "is deleted"
            }
          };
        firebase.sendMessage(payload);
        reply.send(todo);
    })
}

module.exports = routes;