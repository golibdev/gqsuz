const router = require('express').Router();
const { adminController } = require('../controllers')
const { isAuth } = require('../middlewares/auth')

router.get('/login', isAuth, adminController.loginPage) 
router.post('/login', adminController.login)

module.exports = router;