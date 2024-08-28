const express = require('express')
const app = express()
const { Sequelize } = require('sequelize')
const userModel = require('./models/user')
const PORT = 8080
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
        const { userName, email } = req.body;
        const user = await User.create({ userName, email });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: '서버에서 몬가가 잘못됐음' });
    }
})

sequelize.sync({ force: false }).then(() => {
    console.log('database connection');

    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);

    })
})