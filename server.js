const express = require('express');
const PORT = process.env.PORT || 3001;

const app = express();

const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));

// parse incoming JSON data
app.use(express.json());

// makes resources in 'public' directory static so that our front end can use them
app.use(express.static('public'));

// routes to api routes
app.use('/api', apiRoutes);

// routes to html routes
app.use('/', htmlRoutes);

// app listening on port 3001
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});