const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.post('/', authenticate, registrationController.registerForEvent);
router.delete('/:event_id', authenticate, registrationController.cancelRegistration);
router.get('/my', authenticate, registrationController.getMyRegistrations);
router.get('/event/:event_id', authenticate, authorizeAdmin, registrationController.getEventRegistrations);
router.get('/check/:event_id', authenticate, registrationController.checkRegistration);

module.exports = router;
