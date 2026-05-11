const pool = require('../config/db');

exports.getMyNotifications = async (req, res) => {
  try {
    const [notifications] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );

    const [unreadCount] = await pool.query(
      'SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0',
      [req.user.id]
    );

    res.json({ notifications, unread_count: unreadCount[0].count });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    res.json({ message: 'Notification marked as read.' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
      [req.user.id]
    );

    res.json({ message: 'All notifications marked as read.' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const [eventCount] = await pool.query('SELECT COUNT(*) AS count FROM events WHERE is_published = 1');
    const [oppCount] = await pool.query('SELECT COUNT(*) AS count FROM opportunities WHERE is_published = 1');
    const [userCount] = await pool.query('SELECT COUNT(*) AS count FROM users');
    const [regCount] = await pool.query('SELECT COUNT(*) AS count FROM registrations');
    const [appCount] = await pool.query('SELECT COUNT(*) AS count FROM applications');

    const [upcomingEvents] = await pool.query(
      'SELECT * FROM events WHERE status = ? AND is_published = 1 ORDER BY event_date ASC LIMIT 5',
      ['upcoming']
    );
    const [recentOpportunities] = await pool.query(
      'SELECT * FROM opportunities WHERE status = ? AND is_published = 1 ORDER BY created_at DESC LIMIT 5',
      ['open']
    );

    res.json({
      stats: {
        total_events: eventCount[0].count,
        total_opportunities: oppCount[0].count,
        total_users: userCount[0].count,
        total_registrations: regCount[0].count,
        total_applications: appCount[0].count,
      },
      upcoming_events: upcomingEvents,
      recent_opportunities: recentOpportunities,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
