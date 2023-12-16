const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users.js');

const app = express();

// all of defrent route handler have the middleware function applied.
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({
    keys: ['lkasld235j']
}));

app.get('/signup', (req, res) => {
    res.send(`
    <div>
        Your id is: ${req.session.userID}
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password"/>
            <input name="passwordConfirmation"placeholder="password confirmation" />
            <button>Sign Up</button>
        </form>
    </div>
    `)
})



app.post('/signup', async (req, res) => {
    const { email, password, passwordConfirmation } = req.body; // destructeur

    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
        return res.send('Email in use')
    }

    if (password !== passwordConfirmation) {
        return res.send('Password must match');
    }

    // Create a user in our user repo to represent this person
    const user = await usersRepo.create({ email, password })

    // Stor the id of that user inside the users cookie 
    //req.session Added by cookie session to req!
    req.session.userID = user.id;

    res.send('Account created!!!')
})

app.get('/signout', (req, res) => {
    // remove authenticated from browser [clear session obj]
    req.session = null;
    res.send('You are logged out')
})

app.get('/signin', (req, res) => {
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password"/>
            <button>Sign In</button>
        </form>
    </div>
    `)
});

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await usersRepo.getOneBy({ email })

    if (!user) {
        return res.send('Emai not found')
    }

    const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
    );
    if (!validPassword) {
        return res.send('Invalid password')
    }

    //make our user authenticated with our app 
    req.session.userID = user.id

    res.send(`You are signed in!!!`)

})

app.listen(3000, () => {
    console.log("Listening ")
})