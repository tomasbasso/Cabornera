
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

const menuRoutes = require('./routes/menuRoutes');
const tablesRoutes = require('./routes/tablesRoutes');

app.use(cors());
app.use(express.json());

app.use('/api', menuRoutes);
app.use('/api', tablesRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
    res.send('API REST Restaurante Cabornera Running');
});

const { getConnection } = require('./config/db');

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await getConnection();
});
