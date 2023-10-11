import mongoose from 'mongoose'

//  user database model
const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  bio: String,
  //  one user can have references to multiple threads stored in the DB
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thread',
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  //  one user can have multiple communities
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community',
    },
  ],
})

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User
