const Student = require('../models/Student');

// Admin: can see all; Student: can see only own profile
exports.getAll = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const students = await Student.find().sort({ _id: -1 });
      return res.json(students);
    } else {
      const me = await Student.findOne({ user: req.user.id });
      return res.json(me ? [me] : []);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Student.findById(id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    if (req.user.role !== 'admin' && doc.user?.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return res.json([doc]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, email, course, enrollment_date } = req.body;
    if (!name || name.length < 2) return res.status(400).json({ error: 'Name must be at least 2 chars' });
    if (!email) return res.status(400).json({ error: 'Email is required' });
    if (!course) return res.status(400).json({ error: 'Course is required' });
    if (!enrollment_date) return res.status(400).json({ error: 'Enrollment date is required' });

    const payload = {
      user: req.user.role === 'admin' ? undefined : req.user.id,
      name,
      email,
      course,
      enrollment_date,
    };
    const created = await Student.create(payload);
    return res.json(created);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Email must be unique' });
    return res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Student.findById(id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    if (req.user.role !== 'admin' && doc.user?.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { name, email, course, enrollment_date } = req.body;
    if (name !== undefined) doc.name = name;
    if (email !== undefined) doc.email = email;
    if (course !== undefined) doc.course = course;
    if (enrollment_date !== undefined) doc.enrollment_date = enrollment_date;
    await doc.save();
    return res.json({ updated: 1 });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Student.findById(id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    if (req.user.role !== 'admin' && doc.user?.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await Student.deleteOne({ _id: id });
    return res.json({ deleted: 1 });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

