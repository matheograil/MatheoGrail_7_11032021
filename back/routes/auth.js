const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth');

// POST : api/auth/signup.
router.post('/signup', authCtrl.register);

module.exports = router;