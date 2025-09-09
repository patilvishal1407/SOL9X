 const Student = require('../models/Student');

exports.analytics = async (req, res) => {
    try {
        const total = await Student.countDocuments();

        // Group by course and count
        const group = await Student.aggregate([
            { $group: { _id: '$course', count: { $sum: 1 } } },
            { $project: { course: '$_id', count: 1, _id: 0 } },
            { $sort: { count: -1 } }
        ]);

        const recentDocs = await Student.find({}).sort({ createdAt: -1 }).limit(5);
        const recent = recentDocs.map(s => ({
            id: s._id.toString(),
            name: s.name,
            course: s.course,
            enrollment_date: s.enrollment_date,
        }));

        return res.json({ total, byCourse: group, recent });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to load analytics', error: err.message });
    }
};

