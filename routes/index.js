const express = require('express');
const homeController = require('../controllers/homeController');
const router = express.Router();
const os = require('os')
const multer  = require('multer')
const upload = multer({ dest: os.tmpdir() })

router.get('/' , homeController.home);
router.post('/uploadfile/csv', upload.single('file'), homeController.UploadCsv);
router.get('/file/:fileId' , homeController.showCSV);

module.exports = router;