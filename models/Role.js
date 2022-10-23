// models/User.js

const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name of role is required."]
  },
  date:{
    type: Date,
    default: Date.now
  },
  permission: [{type: mongoose.Types.ObjectId, ref: "permission", required: false}],
},{
  timestamps: true
});

module.exports = Role = mongoose.model('role', RoleSchema);