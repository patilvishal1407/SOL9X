const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  course: { type: String, required: true },
  enrollment_date: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);


