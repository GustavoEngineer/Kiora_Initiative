require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Al final de index.js
module.exports = app;