const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunityController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', opportunityController.getAllOpportunities);
router.get('/:id', opportunityController.getOpportunityById);
router.post('/', authenticate, authorizeAdmin, upload.single('image'), opportunityController.createOpportunity);
router.put('/:id', authenticate, authorizeAdmin, upload.single('image'), opportunityController.updateOpportunity);
router.delete('/:id', authenticate, authorizeAdmin, opportunityController.deleteOpportunity);

module.exports = router;
