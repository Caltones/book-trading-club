import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
});
module.exports = mongoose.models.users || mongoose.model('users', UserSchema);
