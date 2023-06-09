const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const DepartmentSchema = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      required: true,
    },
    description: {
        type: String,
    },
  }
);

mongoose.model("Department",DepartmentSchema)
module.exports = {DepartmentSchema}
