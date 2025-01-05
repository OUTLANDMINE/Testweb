const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = fs.readFileSync('users.txt', 'utf-8').split('\n');
    const isValidUser = users.some(user => user === `${username}:${password}`);

    if (isValidUser) {
        res.redirect(`/dashboard.html?username=${username}`);
    } else {
        res.status(401).send('Invalid username or password');
    }
});

// Register
app.post('/register', (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    const users = fs.readFileSync('users.txt', 'utf-8').split('\n');
    if (users.some(user => user.startsWith(`${username}:`))) {
        return res.status(400).send('Username already exists');
    }

    fs.appendFileSync('users.txt', `${username}:${password}\n`);
    res.redirect('/index.html');
});

// Start Server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
