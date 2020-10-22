const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const url = 'mongodb+srv://HappyRogue:Daniel1804@cluster0.8hfri.mongodb.net/test?retryWrites=true&w=majority'

const placesRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);

app.use('/api/users', userRoutes);

app.use(() => {
    throw new HttpError('Could not find this route.', 404);
})

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});
});

mongoose.connect(url)
    .then(() => {
        app.listen(5000);
    })
    .catch(err => {
        console.error(err);
    });