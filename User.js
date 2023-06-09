const mongoose=require('mongoose')
require('./Department.js')
require('./Position.js')
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema(
    {
      username: {
        type: String,
        required: true,
        unique: true,
        maxLength: 256,
      },
      password: {
        type: String,
        required: true,
        maxLength: 256,
      },
      fullname: {
        type: String,
        required: true,
        maxLength: 100,
      },
      dob: {
          type: Date,
        },
      address: {
          type: String,
          maxLength: 100,
        },
      phonenumber: {
          type: String,
          required: true,
          unique: true,
          maxLength: 12,
        },
      email: {
          type: String,
          required: true,
          unique: true,
          maxLength: 100,
        },
      gender: {
          type: String,
          enum : ['male','female','other'],
          default: 'male',
        },
      role: {
          type: String,
          enum : ['user','admin'],
          default: 'user',
        },
      department: { 
        type: Schema.Types.ObjectId, ref: 'Department' 
      },

      position: { 
        type: Schema.Types.ObjectId, ref: 'Position' 
      },
      salaryID: {
          type: String,
        },
      image: {
          type: String,
          default: 'no image',
        },
    }
)

mongoose.model("User",UserSchema)
module.exports = {UserSchema}