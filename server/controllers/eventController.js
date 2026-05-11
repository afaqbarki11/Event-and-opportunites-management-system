const pool = require('../config/db');

exports.getAllEvents = async (req, res) => {
  try {
    const { search, category, status, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT e.*, u.full_name AS organizer_name FROM events e JOIN users u ON e.created_by = u.id WHERE e.is_published = 1';
    const params = [];

    if (search) {
      query += ' AND (e.title LIKE ? OR e.description LIKE ? OR e.venue LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    if (category) {
      query += ' AND e.category = ?';
      params.push(category);
    }
    if (status) {
      query += ' AND e.status = ?';
      params.push(status);
    }

    const countQuery = query.replace('SELECT e.*, u.full_name AS organizer_name', 'SELECT COUNT(*) AS total');
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    query += ' ORDER BY e.event_date ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [events] = await pool.query(query, params);

    // Get registration counts for each event
    for (const event of events) {
      const [regCount] = await pool.query(
        'SELECT COUNT(*) AS count FROM registrations WHERE event_id = ? AND status != ?',
        [event.id, 'cancelled']
      );
      event.registration_count = regCount[0].count;
    }

    res.json({
      events,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const [events] = await pool.query(
      'SELECT e.*, u.full_name AS organizer_name FROM events e JOIN users u ON e.created_by = u.id WHERE e.id = ?',
      [req.params.id]
    );

    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const [regCount] = await pool.query(
      'SELECT COUNT(*) AS count FROM registrations WHERE event_id = ? AND status != ?',
      [req.params.id, 'cancelled']
    );
    events[0].registration_count = regCount[0].count;

    res.json({ event: events[0] });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, category, event_date, event_time, end_date, end_time, venue, max_participants } = req.body;

    if (!title || !description || !event_date || !event_time || !venue) {
      return res.status(400).json({ message: 'Title, description, date, time, and venue are required.' });
    }

    const image = req.file ? req.file.filename : null;

    const [result] = await pool.query(
      `INSERT INTO events (title, description, category, event_date, event_time, end_date, end_time, venue, max_participants, image, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, category || 'other', event_date, event_time, end_date || null, end_time || null, venue, max_participants || null, image, req.user.id]
    );

    const [event] = await pool.query('SELECT * FROM events WHERE id = ?', [result.insertId]);

    res.status(201).json({ message: 'Event created successfully.', event: event[0] });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { title, description, category, event_date, event_time, end_date, end_time, venue, max_participants, status } = req.body;
    const image = req.file ? req.file.filename : undefined;

    let query = `UPDATE events SET title = COALESCE(?, title), description = COALESCE(?, description), 
      category = COALESCE(?, category), event_date = COALESCE(?, event_date), event_time = COALESCE(?, event_time),
      end_date = COALESCE(?, end_date), end_time = COALESCE(?, end_time), venue = COALESCE(?, venue), 
      max_participants = COALESCE(?, max_participants), status = COALESCE(?, status)`;
    const params = [title, description, category, event_date, event_time, end_date, end_time, venue, max_participants, status];

    if (image !== undefined) {
      query += ', image = ?';
      params.push(image);
    }

    query += ' WHERE id = ?';
    params.push(req.params.id);

    await pool.query(query, params);

    const [event] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    res.json({ message: 'Event updated successfully.', event: event[0] });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM events WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    res.json({ message: 'Event deleted successfully.' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
