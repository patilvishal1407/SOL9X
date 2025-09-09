const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const studentCtrl = require('../controller/analyticsController');

router.get('/', auth, studentCtrl.analytics);

module.exports = router;
