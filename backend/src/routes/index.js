const express = require('express');
const router = express.Router();

const blocRoutes = require('./blocRoutes');
const tagRoutes = require('./tagRoutes');
const taskRoutes = require('./taskRoutes');
const workDayRoutes = require('./workDayRoutes');

router.use('/blocs', blocRoutes);
router.use('/tags', tagRoutes);
router.use('/tasks', taskRoutes);
router.use('/workdays', workDayRoutes);

module.exports = router;
