const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', authenticate, upload.single('cv'), applicationController.applyForOpportunity);
router.get('/my', authenticate, applicationController.getMyApplications);
router.get('/opportunity/:opportunity_id', authenticate, authorizeAdmin, applicationController.getOpportunityApplications);
router.put('/:id/status', authenticate, authorizeAdmin, applicationController.updateApplicationStatus);
router.get('/check/:opportunity_id', authenticate, applicationController.checkApplication);

module.exports = router;
