import mongoose from 'mongoose'

const Schema = mongoose.Schema

const companySchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  location: {
    q: String,
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }
})

const Company = mongoose.model('Company', companySchema)

export default Company
