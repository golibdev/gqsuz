const router = require('express').Router();
const { homeController } = require('../controllers')
const { redirectToAuth, protected, isAuth } = require('../middlewares/auth')

router.get('/', homeController.home)
router.get('/change', homeController.change) 
router.get('/admin', isAuth, redirectToAuth)
router.get('/dashboard', protected, homeController.dashboard)
router.post('/addNews', protected, homeController.addNews)
router.get('/news/:slugUrl', homeController.newsDetail)
router.post('/delete/:id', protected, homeController.deleteNews)
router.post('/update/:id', protected, homeController.editNews)
router.get('/dashboard/products', protected, homeController.productPage)
router.post('/addProduct', protected, homeController.addProduct)
router.get('/products', homeController.products)
router.get('/news', homeController.allNews)
router.get('/logout', protected, homeController.logout)

module.exports = router;