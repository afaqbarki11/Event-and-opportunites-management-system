const pool = require('../config/db');

exports.applyForOpportunity = async (req, res) => {
  try {
    const { opportunity_id, cover_letter } = req.body;
    const user_id = req.user.id;

    if (!opportunity_id) {
      return res.status(400).json({ message: 'Opportunity ID is required.' });
    }

    const [opportunities] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [opportunity_id]);
    if (opportunities.length === 0) {
      return res.status(404).json({ message: 'Opportunity not found.' });
    }

    const opp = opportunities[0];
    if (opp.status !== 'open') {
      return res.status(400).json({ message: 'This opportunity is no longer accepting applications.' });
    }

    const [existing] = await pool.query(
      'SELECT * FROM applications WHERE opportunity_id = ? AND user_id = ?',
      [opportunity_id, user_id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'You have already applied for this opportunity.' });
    }

    const cv_path = req.file ? req.file.filename : null;

    await pool.query(
      'INSERT INTO applications (opportunity_id, user_id, cover_letter, cv_path) VALUES (?, ?, ?, ?)',
      [opportunity_id, user_id, cover_letter || null, cv_path]
    );

    await pool.query(
      'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
      [user_id, 'Application Submitted', `Your application for "${opp.title}" has been submitted successfully.`, 'application']
    );

    res.status(201).json({ message: 'Application submitted successfully.' });
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const [applications] = await pool.query(
      `SELECT a.*, o.title, o.type, o.company, o.deadline, o.status AS opportunity_status
       FROM applications a JOIN opportunities o ON a.opportunity_id = o.id 
       WHERE a.user_id = ? ORDER BY a.applied_at DESC`,
      [req.user.id]
    );

    res.json({ applications });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getOpportunityApplications = async (req, res) => {
  try {
    const [applications] = await pool.query(
      `SELECT a.*, u.full_name, u.email, u.department
       FROM applications a JOIN users u ON a.user_id = u.id 
       WHERE a.opportunity_id = ? ORDER BY a.applied_at DESC`,
      [req.params.opportunity_id]
    );

    res.json({ applications });
  } catch (error) {
    console.error('Get opportunity applications error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const [app] = await pool.query('SELECT a.*, o.title FROM applications a JOIN opportunities o ON a.opportunity_id = o.id WHERE a.id = ?', [req.params.id]);
    if (app.length === 0) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    await pool.query('UPDATE applications SET status = ? WHERE id = ?', [status, req.params.id]);

    await pool.query(
      'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
      [app[0].user_id, 'Application Update', `Your application for "${app[0].title}" has been ${status}.`, 'application']
    );

    res.json({ message: 'Application status updated.' });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.checkApplication = async (req, res) => {
  try {
    const [applications] = await pool.query(
      'SELECT * FROM applications WHERE opportunity_id = ? AND user_id = ?',
      [req.params.opportunity_id, req.user.id]
    );

    res.json({ applied: applications.length > 0, application: applications[0] || null });
  } catch (error) {
    console.error('Check application error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
