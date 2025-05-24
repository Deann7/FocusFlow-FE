const express = require('express');
require('dotenv').config();
const db = require('./src/database/pg.database'); 
const cors = require('cors'); 

const app = express();
const PORT = process.env.PORT || 3000; 

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        try {
            const parsedOrigin = new URL(origin);
            
            // Daftar hostname yang diizinkan
            const allowedDomains = [
                'localhost', 
                'focus-flow-fe.vercel.app',
                '0f5a-2001-448a-2075-1fcd-e8fe-8b6d-fee0-69a7.ngrok-free.app'
            ];
            

            if (allowedDomains.includes(parsedOrigin.hostname) || 
                (parsedOrigin.hostname === 'localhost' && 
                 ['4105', '5173'].includes(parsedOrigin.port))) {
                callback(null, true);
            } else {
                callback(new Error('Blocked by CORS: Domain tidak diizinkan'));
            }
        } catch (err) {
            callback(new Error('Invalid origin'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE']
};


app.use(cors(corsOptions));

app.use(express.json());
app.use('/user', require('./src/routes/user.route'));
app.use('/card', require('./src/routes/card.route'));
app.use('/pomodoro', require('./src/routes/pomodoro.route')); // Add this line
app.use("/flashcard", require("./src/routes/flashcard.route.js"));

// Import routes
const dailyStreakRoutes = require("./src/routes/daily.streak.route.js");

// Use routes
app.use("/api/streak", dailyStreakRoutes);

app.post('/validate-password', (req, res) => {
    const {password} = req.body;
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:";'<>,.?/~\\-]).{8,}$/;
    if (passwordRegex.test(password)){
        return res.status(200).json({message: "Valid password"});
    } else {
        return res.status(400).json({message: "Invalid password"});
    }
}
);

app.get('/', (req, res) => {
    res.send('Welcome to the API!');
}
);


app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});