const mongoose = require('mongoose')

const PositionSchema = new mongoose.Schema(
  {
    positionName: {
      type: String,
      required: true,
    },
    description: {
        type: String,
    },
  }
);

mongoose.model("Position",PositionSchema)
module.exports = {PositionSchema}