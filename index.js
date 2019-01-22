const fastify = require('fastify')();
const routes = require('./routes/index');
const mongoose = require('mongoose');
//const fp = require("fastify-plugin")

// fastify.get('/', async (request, reply) => {
//     reply.send('HELLO WORLD');
// })

// fastify.register(require('fastify-nodemailer'), {
//   pool: true,
//   auth: {
//       user: process.env.userEmail,
//       pass: process.env.userPassword
//   }
// })

// fastify.register(require('fastify-nodemailer'), {
//   pool: true,
//   host: 'smtp.example.com',
//   port: 465,
//   secure: true, // use TLS
//   auth: {
//       user: 'username',
//       pass: 'password'
//   }
// })

mongoose.connect('mongodb://localhost:27017/assesment', { useNewUrlParser: true })
    .then(() => console.log('Connected to Database'))
    .catch((err) => console.log('Could not connect to MongoDB... ', err));

// routes.forEach((route, index) => {
//     fastify.route(route);
// })

// fastify.register(fp(async function(fastify, opts) {
//   fastify.register(require("fastify-jwt"), {
//     secret: "jwtPrivateKey"
//   })

//   fastify.decorate("authenticate", async function(request, reply) {
//     try {
//       const token = request.header('Authorization');
//       console.log('token value is ', token);
//       if(!token) reply.status(401).send('Access Denied No token provided');
//       const decoded = await request.jwtVerify(token);
//       console.log('decode value is ', decoded);
//       request.user = decoded;
//     } catch (err) {
//       reply.send(err)
//     }
//   })
// }))

fastify.register(require('fastify-jwt'), {
  secret: 'supersecret'
})

//fastify.register(require('./plugins/auth'));
fastify.register(require('./controllers/user'), { prefix: '/api/user' });
fastify.register(require('./controllers/todos'), { prefix: '/api/todos'})

console.log('userEmail is ', process.env.userEmail);

// Run the server!
const start = async () => {
    try {
      await fastify.listen(3000)
      console.log(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  }
  start()