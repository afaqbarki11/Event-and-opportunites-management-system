const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', authenticate, authorizeAdmin, upload.single('image'), eventController.createEvent);
router.put('/:id', authenticate, authorizeAdmin, upload.single('image'), eventController.updateEvent);
router.delete('/:id', authenticate, authorizeAdmin, eventController.deleteEvent);

module.exports = router;
