import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  field: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  institution: { type: String, required: true }
});

const experienceSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: Date,
  currentJob: Boolean,
  description: String
});

const workPreferencesSchema = new mongoose.Schema({
  environment: { type: String, enum: ['remote', 'hybrid', 'onsite'] },
  companySize: { type: String, enum: ['startup', 'midsize', 'enterprise'] },
  careerLevel: { type: String, enum: ['entry', 'mid', 'senior'] }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skills: [{ type: String, required: true }],
  education: [educationSchema],
  experience: [experienceSchema],
  interests: {
  
    workPreferences: workPreferencesSchema
  },
  createdAt: { type: Date, default: Date.now }
});


userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
};


userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid login credentials');
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid login credentials');
  
  return user;
};
// Add async/await to token generation
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign(
        { _id: user._id.toString() }, 
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Add expiration
    );
    return token;
};



const User = mongoose.model('User', userSchema);
export default User;
