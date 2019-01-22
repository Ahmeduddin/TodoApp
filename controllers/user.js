const boom = require('boom');
const User = require('../models/user');
//const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// fastify.register(require('fastify-nodemailer'), {
//   pool: true,
//   port: 465,
//   secure: true, // use TLS
//   auth: {
//       user: process.env.userEmail,
//       pass: process.env.userPassword
//   }
// })


async function routes (fastify, options) {
    fastify.post('/signUp', async (req, reply) => {
        try {
            let user = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            user = await user.save();
            reply.send(user);
        }
        catch (err) {
            reply.send(err);
        }
     
    })
    
    fastify.post('/signIn', async (req, reply) => {
        const user = await User.findOne({email: req.body.email, password: req.body.password})
        console.log(user);
        if(!user) return reply.status(404).send('Invalid Email or Password');
        const token = fastify.jwt.sign({ _id: user._id });
        reply.send(token);
    })
    
    fastify.get('/changePassword/:email', async (req, reply) => {
        try {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.userEmail, // generated ethereal user
                  pass: process.env.userPassword // generated ethereal password
                }
            })

            const user = await User.findOne({ email: req.params.email });
            if(!user) return reply.status(404).send('Email not exist');
            console.log('params email is ', req.params.email);
            let mailOptions = {
                from: '"Ahmed Uddin 👻" <ahmeduddinusama@gmail.com>', // sender address
                to: req.params.email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "This is Your password ", // plain text body
                html: "<b>This is your password "+ user.password +"</b>" // html body
              };
            let info = await transporter.sendMail(mailOptions);
            console.log(info);
            reply.send('change password');
        } catch (err) {
            reply.status(500).send('Something went wrong!!');
        }
       
    })
}

module.exports = routes;