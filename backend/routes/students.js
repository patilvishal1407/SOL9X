const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const studentCtrl = require('../controller/studentController');

router.get('/', auth, studentCtrl.getAll);
router.get('/getbyid/:id', auth, studentCtrl.getById);
router.post('/', auth, studentCtrl.create);
router.put('/:id', auth, studentCtrl.update);
router.delete('/:id', auth, studentCtrl.remove);

module.exports = router;
