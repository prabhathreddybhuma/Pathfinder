import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { validateRegistration, validateEducation } from '../middleware/validation.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
  try { 
   
    const { email, password } = req.body; 
    const user = await User.findOne({ email });
    if (!(email && password)) {
      return res.status(400).send('Send all data');
    }

      if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "2y" }
      );

      user.token = token;
      user.password = undefined;
const options={
    expires:new Date(Date.now()+3*24*60*60*1000), 
    httpOnly:true
}; res.status(200).cookie("token",token,options)
.json({
        success: true,
        token,
        user,
      });
    } else {
      res.status(400).send('Invalid credentials');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}); 
  
  // Registration route
  router.post('/register', validateRegistration, async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      const token = user.generateAuthToken();
  
      // Set cookie for new registrations
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    };
  
      res.status(201).cookie("authToken",token,cookieOptions).json({ user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Logout route
  router.post('/logout', auth, (req, res) => {
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        expires: new Date(0)
    });
    res.json({ message: 'Logged out successfully' });
});
  
router.post('/experience', auth, async (req, res) => {
  try {
      const experiences = req.body.map(exp => ({
          jobTitle: exp.jobTitle,
          company: exp.company,
          startDate: exp.startDate,
          endDate: exp.currentJob ? null : exp.endDate,
          description: exp.jobDescription
      }));

      req.user.experience = experiences;
      await req.user.save();
      
      res.status(200).json(req.user.experience);
  } catch (error) {
      res.status(400).json({ error: 'Experience update failed' });
  }
});

  // Preferences Route
  router.patch('/preferences', auth, async (req, res) => {
    try {
      const { environment, companySize, careerLevel } = req.body;
  
      // Validate if all three preferences are provided
      if (!environment || !companySize || !careerLevel) {
        return res.status(400).json({ message: "All preferences (environment, companySize, careerLevel) must be selected." });
      }
  
      // Allowed values for each preference
      const validValues = {
        environment: ['remote', 'hybrid', 'onsite'],
        companySize: ['startup', 'midsize', 'enterprise'],
        careerLevel: ['entry', 'mid', 'senior']
      };
  
      // Check if provided values are valid
      if (
        !validValues.environment.includes(environment) ||
        !validValues.companySize.includes(companySize) ||
        !validValues.careerLevel.includes(careerLevel)
      ) {
        return res.status(400).json({ message: "Invalid preference values provided." });
      }
  
      // Update user preferences
      req.user.interests.workPreferences = { environment, companySize, careerLevel };
      await req.user.save();
  
      res.status(200).json({
        message: "Preferences updated successfully.",
        preferences: req.user.interests.workPreferences
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});
router.patch('/skills', auth, async (req, res) => {
  try {
      // Validate request format
      if (!req.body.skills || !Array.isArray(req.body.skills)) {
          return res.status(400).json({ error: "Invalid skills format. Use { skills: [] } structure" });
      }

      // Directly assign the flat array to user skills
      req.user.skills = req.body.skills.filter(skill => skill !== null); // Remove null values
      await req.user.save();

      res.status(200).json({ skills: req.user.skills });

  } catch (error) {
      console.error('Skills update error:', error);
      res.status(500).json({ error: 'Skill update failed' });
  }
});


router.patch('/education', auth, async (req, res) => {
  try {
    const { degree, field, graduationYear, institution } = req.body;

    if (!degree && !field && !graduationYear && !institution) {
      return res.status(400).json({ error: "At least one field is required for update" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the first education entry and update only provided fields
    if (user.education.length === 0) {
      return res.status(404).json({ error: "No education record found to update" });
    }

    let educationEntry = user.education[0]; // Update the first entry (modify this logic as needed)
    if (degree) educationEntry.degree = degree;
    if (field) educationEntry.field = field;
    if (graduationYear) educationEntry.graduationYear = graduationYear;
    if (institution) educationEntry.institution = institution;

    await user.save();
    res.status(200).json(user.education);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.get('/dashboard',auth,async(req,res)=>{
  try{
      console.log(req.user);
  const userId=req.user.id 
  const userDetails=await User.findById(userId).select('-password');   
  
  res.json({
  success:true,
  userDetails,
  }
  );
  }
  catch(err){
      console.log(err)
  }
  });
  router.get('/checkfortoken',(req,res)=>{
  if(req.cookies.token){
    res.status(200).json({message:"Token Found"});
  
  }
  else{
    res.status(401).json({message:"Token not found"});
  }
  
  });

export default router;
