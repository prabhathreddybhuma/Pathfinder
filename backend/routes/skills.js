import express from 'express';
const router = express.Router();

const technicalSkills = {
  webDevelopment: ["HTML5", "CSS3", "React", "Angular", "Vue.js", "Node.js"],
  database: ["SQL", "MySQL", "PostgreSQL", "MongoDB"],
  cloudServices: ["AWS", "Azure", "Google Cloud", "Docker"],
  dataScience: ["Machine Learning", "Data Analysis", "TensorFlow", "PyTorch"],
  mobileDevelopment: ["iOS Development", "Android Development", "React Native"],
  security: ["Cybersecurity", "Network Security", "Encryption"]
};

router.get('/categories', (req, res) => {
  res.json(technicalSkills);
});

export default router;
