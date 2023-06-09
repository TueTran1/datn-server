const mongoose = require('mongoose')
require('./User.js')

const DetectionSchema = new mongoose.Schema(
  {
    user: { 
      type: Schema.Types.ObjectId, ref: 'User' 
    },
    time: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    confidence: {
      type: String,
      required: true,
    },
    captured: {
      type: String,
      required: true,
    },
  }
);

mongoose.model("Detection",DetectionSchema)
module.exports = {DetectionSchema}