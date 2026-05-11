const pool = require('../config/db');

exports.registerForEvent = async (req, res) => {
  try {
    const { event_id } = req.body;
    const user_id = req.user.id;

    if (!event_id) {
      return res.status(400).json({ message: 'Event ID is required.' });
    }

    const [events] = await pool.query('SELECT * FROM events WHERE id = ?', [event_id]);
    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const event = events[0];
    if (event.status === 'cancelled' || event.status === 'completed') {
      return res.status(400).json({ message: 'Cannot register for a cancelled or completed event.' });
    }

    const [existing] = await pool.query(
      'SELECT * FROM registrations WHERE event_id = ? AND user_id = ?',
      [event_id, user_id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Already registered for this event.' });
    }

    let status = 'registered';
    if (event.max_participants) {
      const [regCount] = await pool.query(
        'SELECT COUNT(*) AS count FROM registrations WHERE event_id = ? AND status = ?',
        [event_id, 'registered']
      );
      if (regCount[0].count >= event.max_participants) {
        status = 'waitlisted';
      }
    }

    await pool.query(
      'INSERT INTO registrations (event_id, user_id, status) VALUES (?, ?, ?)',
      [event_id, user_id, status]
    );

    await pool.query(
      'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
      [user_id, `Registration ${status === 'registered' ? 'Confirmed' : 'Waitlisted'}`,
       `You have been ${status} for "${event.title}".`, 'registration']
    );

    res.status(201).json({ message: `Successfully ${status} for the event.`, status });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.cancelRegistration = async (req, res) => {
  try {
    const { event_id } = req.params;
    const user_id = req.user.id;

    const [result] = await pool.query(
      'UPDATE registrations SET status = ? WHERE event_id = ? AND user_id = ? AND status != ?',
      ['cancelled', event_id, user_id, 'cancelled']
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Registration not found.' });
    }

    res.json({ message: 'Registration cancelled successfully.' });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getMyRegistrations = async (req, res) => {
  try {
    const [registrations] = await pool.query(
      `SELECT r.*, e.title, e.event_date, e.event_time, e.venue, e.category, e.status AS event_status, e.image
       FROM registrations r JOIN events e ON r.event_id = e.id 
       WHERE r.user_id = ? ORDER BY e.event_date ASC`,
      [req.user.id]
    );

    res.json({ registrations });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getEventRegistrations = async (req, res) => {
  try {
    const [registrations] = await pool.query(
      `SELECT r.*, u.full_name, u.email, u.department
       FROM registrations r JOIN users u ON r.user_id = u.id 
       WHERE r.event_id = ? ORDER BY r.registered_at ASC`,
      [req.params.event_id]
    );

    res.json({ registrations });
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.checkRegistration = async (req, res) => {
  try {
    const [registrations] = await pool.query(
      'SELECT * FROM registrations WHERE event_id = ? AND user_id = ? AND status != ?',
      [req.params.event_id, req.user.id, 'cancelled']
    );

    res.json({ registered: registrations.length > 0, registration: registrations[0] || null });
  } catch (error) {
    console.error('Check registration error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
