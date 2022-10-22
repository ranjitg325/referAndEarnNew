const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.post('/userCreate', userController.userCreate);
 router.post('/userLogin', userController.userLogin);
router.post('/applyRefCode', userController.applyReferalCode);
router.get('/getRefCode', userController.getReferalCode);
router.get('/getRefPoint', userController.getReferalPoint);
router.put('/redeemReferalPoint', userController.redeemReferalPoint);

module.exports = router;

