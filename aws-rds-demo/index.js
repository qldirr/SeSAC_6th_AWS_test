const express = require('express')
const app = express()
const { Sequelize } = require('sequelize')
const userModel = require('./models/user')
const PORT = 8000
require('dotenv').config()

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
)

const User = userModel(sequelize)

app.use(express.json())

app.get('/', (req, res) => {
    res.send('hello!!')
})

app.post('/api/users', async (req, res) => {
    try {
        const { username, email } = req.body
        const user = await User.create({ username, email })
        res.json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'server error!!' })
    }
})

sequelize.sync({ force: false }).then(() => {
    console.log('database connection');

    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);

    })
})