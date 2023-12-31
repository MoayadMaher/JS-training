const express = require('express');
const { check, validationResult } = require('express-validator')

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup.js');
const signinTemplate = require('../../views/admin/auth/signin.js');
const {
    requireEmail,
    requirePassword,
    requirepasswordConfirmation,
    requireEmailExisits,
    requireValidPassword
} = require('./validatos.js')

const router = express.Router()

router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }));
})

router.post('/signup',
    [requireEmail, requirePassword, requirepasswordConfirmation],
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.send(signupTemplate({ req, errors }));
        }

        const { email, password, passwordConfirmation } = req.body; // destructeur

        // Create a user in our user repo to represent this person
        const user = await usersRepo.create({ email, password })

        // Stor the id of that user inside the users cookie 
        //req.session Added by cookie session to req!
        req.session.userID = user.id;

        res.send('Account created!!!')
    })

router.get('/signout', (req, res) => {
    // remove authenticated from browser [clear session obj]
    req.session = null;
    res.send('You are logged out')
})

router.get('/signin', (req, res) => {
    res.send(signinTemplate({}))
});

router.post('/signin',
    [requireEmailExisits, requireValidPassword],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.send(signinTemplate({ errors }));
        }

        const { email } = req.body;

        const user = await usersRepo.getOneBy({ email });

        //make our user authenticated with our app 
        req.session.userID = user.id

        res.send(`You are signed in!!!`)

    })

module.exports = router; 