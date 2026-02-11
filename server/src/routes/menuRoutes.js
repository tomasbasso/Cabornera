
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const upload = require('../config/multer');

router.get('/categories', menuController.getCategories);

router.get('/products', menuController.getProducts);
router.post('/products', upload.single('image'), menuController.createProduct);
router.put('/products/:id', upload.single('image'), menuController.updateProduct);

module.exports = router;
