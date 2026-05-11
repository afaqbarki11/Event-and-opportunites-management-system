const pool = require('../config/db');

exports.getAllOpportunities = async (req, res) => {
  try {
    const { search, type, status, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT o.*, u.full_name AS posted_by_name FROM opportunities o JOIN users u ON o.created_by = u.id WHERE o.is_published = 1';
    const params = [];

    if (search) {
      query += ' AND (o.title LIKE ? OR o.description LIKE ? OR o.company LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    if (type) {
      query += ' AND o.type = ?';
      params.push(type);
    }
    if (status) {
      query += ' AND o.status = ?';
      params.push(status);
    }

    const countQuery = query.replace('SELECT o.*, u.full_name AS posted_by_name', 'SELECT COUNT(*) AS total');
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    query += ' ORDER BY o.deadline ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [opportunities] = await pool.query(query, params);

    for (const opp of opportunities) {
      const [appCount] = await pool.query(
        'SELECT COUNT(*) AS count FROM applications WHERE opportunity_id = ?',
        [opp.id]
      );
      opp.application_count = appCount[0].count;
    }

    res.json({
      opportunities,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get opportunities error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getOpportunityById = async (req, res) => {
  try {
    const [opportunities] = await pool.query(
      'SELECT o.*, u.full_name AS posted_by_name FROM opportunities o JOIN users u ON o.created_by = u.id WHERE o.id = ?',
      [req.params.id]
    );

    if (opportunities.length === 0) {
      return res.status(404).json({ message: 'Opportunity not found.' });
    }

    const [appCount] = await pool.query(
      'SELECT COUNT(*) AS count FROM applications WHERE opportunity_id = ?',
      [req.params.id]
    );
    opportunities[0].application_count = appCount[0].count;

    res.json({ opportunity: opportunities[0] });
  } catch (error) {
    console.error('Get opportunity error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.createOpportunity = async (req, res) => {
  try {
    const { title, description, type, company, location, salary_range, deadline, requirements, contact_email, link } = req.body;

    if (!title || !description || !deadline) {
      return res.status(400).json({ message: 'Title, description, and deadline are required.' });
    }

    const image = req.file ? req.file.filename : null;

    const [result] = await pool.query(
      `INSERT INTO opportunities (title, description, type, company, location, salary_range, deadline, requirements, contact_email, link, image, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, type || 'other', company || null, location || null, salary_range || null, deadline, requirements || null, contact_email || null, link || null, image, req.user.id]
    );

    const [opportunity] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [result.insertId]);

    res.status(201).json({ message: 'Opportunity created successfully.', opportunity: opportunity[0] });
  } catch (error) {
    console.error('Create opportunity error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateOpportunity = async (req, res) => {
  try {
    const { title, description, type, company, location, salary_range, deadline, requirements, contact_email, link, status } = req.body;
    const image = req.file ? req.file.filename : undefined;

    let query = `UPDATE opportunities SET title = COALESCE(?, title), description = COALESCE(?, description),
      type = COALESCE(?, type), company = COALESCE(?, company), location = COALESCE(?, location),
      salary_range = COALESCE(?, salary_range), deadline = COALESCE(?, deadline), requirements = COALESCE(?, requirements),
      contact_email = COALESCE(?, contact_email), link = COALESCE(?, link), status = COALESCE(?, status)`;
    const params = [title, description, type, company, location, salary_range, deadline, requirements, contact_email, link, status];

    if (image !== undefined) {
      query += ', image = ?';
      params.push(image);
    }

    query += ' WHERE id = ?';
    params.push(req.params.id);

    await pool.query(query, params);

    const [opportunity] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [req.params.id]);
    res.json({ message: 'Opportunity updated successfully.', opportunity: opportunity[0] });
  } catch (error) {
    console.error('Update opportunity error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.deleteOpportunity = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM opportunities WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Opportunity not found.' });
    }

    res.json({ message: 'Opportunity deleted successfully.' });
  } catch (error) {
    console.error('Delete opportunity error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
