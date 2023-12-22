const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth')


const app = express();

// make express access for the public 
app.use(express.static('public'))

// all of defrent route handler have the middleware function applied.
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({
    keys: ['lkasld235j']
}));

app.use(authRouter);

app.listen(3000, () => {
    console.log("Listening ")
})