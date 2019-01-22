const fastify = require('fastify')();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
var server;

mongoose.connect('mongodb://localhost:27017/assesment', { useNewUrlParser: true })
    .then(() => console.log('Connected to Database'))
    .catch((err) => console.log('Could not connect to MongoDB... ', err));

fastify.register(require('fastify-jwt'), {
  secret: 'supersecret'
})

fastify.register(require('./controllers/user'), { prefix: '/api/user' });
fastify.register(require('./controllers/todos'), { prefix: '/api/todos'})

console.log('userEmail is ', process.env.userEmail);

// Run the server!
const start = async () => {
    try {
      server = await fastify.listen(PORT)
      console.log(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  }
  start()

  module.exports = server;