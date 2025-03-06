/******************************************
 * CONSTANTS & DATA STRUCTURES
 ******************************************/

// Technical Skills Data
const technicalSkills = {
    programming: [
        "Python", "JavaScript", "Java", "C++", "C#", "Ruby", "PHP", "Swift", 
        "Kotlin", "Go", "Rust", "TypeScript", "Scala", "R"
    ],
    webDevelopment: [
        "HTML5", "CSS3", "React", "Angular", "Vue.js", "Node.js", "Express.js", 
        "Django", "Flask", "Spring Boot", "ASP.NET", "Laravel", "WordPress", 
        "GraphQL", "REST APIs"
    ],
    database: [
        "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Oracle", "Firebase",
        "Elasticsearch", "DynamoDB", "Cassandra"
    ],
    cloudServices: [
        "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins",
        "Terraform", "Ansible", "CI/CD", "Serverless"
    ],
    dataScience: [
        "Machine Learning", "Deep Learning", "Data Analysis", "NLP", 
        "Computer Vision", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas",
        "NumPy", "Data Visualization", "Big Data", "Hadoop", "Spark"
    ],
    mobileDevelopment: [
        "iOS Development", "Android Development", "React Native", "Flutter",
        "Xamarin", "Mobile UI Design", "App Testing"
    ],
    security: [
        "Cybersecurity", "Network Security", "Penetration Testing", "Encryption",
        "Security Auditing", "OAuth", "JWT"
    ]
};

// Career Interests Data
const careerInterests = {
    technicalRoles: [
        "Software Engineer", "Full Stack Developer", "Data Scientist",
        "Machine Learning Engineer", "DevOps Engineer", "Cloud Architect",
        "Mobile Developer", "Security Engineer", "Blockchain Developer"
    ],
    specializationAreas: [
        "Artificial Intelligence", "Cybersecurity", "Cloud Computing",
        "Data Engineering", "IoT Development", "Quantum Computing",
        "AR/VR Development", "Robotics Software"
    ],
    industryFocus: [
        "FinTech", "HealthTech", "E-commerce", "EdTech", "Gaming Industry",
        "Automotive Software", "Aerospace Technology", "Green Technology"
    ]
};

// Application Constants
const MAX_SKILLS = 16;
const MAX_INTERESTS = 10;

// Global State


let userProfile = {
    education: {
        degree: null,
        field: null,
        graduationYear: null,
        institution: null
    },
    skills: {
        technical: [],
        soft: [],
        business: []
    },
    experience: [],
    interests: {
        careerInterests: [],
        workPreferences: {
            environment: null,
            companySize: null,
            careerLevel: null
        }
    },
    lastUpdated: null
};

// Selected Items State
let selectedSkills = new Set();
let selectedInterests = new Set();

/******************************************
 * INITIALIZATION
 ******************************************/

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    if (!checkAuthentication()) return;
    
    initializeUI();
    initializeNavigation();
    loadSavedData();
    attachEventListeners();
    populateSkillsModal();
    populateInterestsModal();
}

function checkAuthentication() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

function initializeUI() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('userName').textContent = user.fullName || 'User';
        document.getElementById('userEmail').textContent = user.email || '';
    }
}

function initializeNavigation() {
    const initialSection = window.location.hash.slice(1) || 'education';
    showSection(initialSection);

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.currentTarget.getAttribute('data-section');
            if (validateCurrentSection()) {
                showSection(section);
            }
        });
    });

    // Add event listener for recommendations link
    const recommendationsLink = document.getElementById('recommendationsLink');
    if (recommendationsLink) {
        recommendationsLink.addEventListener('click', function(e) {
            const userProfile = JSON.parse(localStorage.getItem('userProfile'));
            if (!userProfile || !userProfile.metadata || !userProfile.metadata.isComplete) {
                e.preventDefault();
                showNotification('Please complete your profile first', 'error');
            }
        });
    }
}


function attachEventListeners() {
    // Form submissions
    const educationForm = document.getElementById('educationForm');
    if (educationForm) {
        educationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateEducation()) {
                saveEducation();
                nextSection();
            }
        });
    }

    const experienceForm = document.getElementById('experienceForm');
    if (experienceForm) {
        experienceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateExperience()) {
                saveExperience();
                nextSection();
            }
        });
    }

    // Modal close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.add('hidden');
        });
    });
}

/******************************************
 * NAVIGATION & SECTION MANAGEMENT
 ******************************************/

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        updateNavigationState(sectionId);
    }
}

function updateNavigationState(sectionId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        const section = link.getAttribute('data-section');
        link.classList.toggle('active', section === sectionId);
    });
    updatePageTitle(sectionId);
}

function updatePageTitle(sectionId) {
    const titles = {
        education: 'Educational Background',
        skills: 'Skills & Expertise',
        experience: 'Work Experience',
        interests: 'Career Interests',
        recommendations: 'Career Recommendations'
    };
    document.getElementById('sectionTitle').textContent = titles[sectionId] || 'Dashboard';
}

function nextSection() {
    const sections = ['education', 'skills', 'experience', 'interests'];
    const currentSection = document.querySelector('.content-section.active');
    const currentIndex = sections.indexOf(currentSection.id);
    
    if (currentIndex < sections.length - 1 && validateCurrentSection()) {
        showSection(sections[currentIndex + 1]);
    }
}

function prevSection() {
    const sections = ['education', 'skills', 'experience', 'interests'];
    const currentSection = document.querySelector('.content-section.active');
    const currentIndex = sections.indexOf(currentSection.id);
    
    if (currentIndex > 0) {
        showSection(sections[currentIndex - 1]);
    }
}

/******************************************
 * FORM VALIDATION
 ******************************************/

function validateCurrentSection() {
    const currentSection = document.querySelector('.content-section.active');
    if (!currentSection) return true;

    switch (currentSection.id) {
        case 'education':
            return validateEducation();
        case 'skills':
            return validateSkills();
        case 'experience':
            return validateExperience();
        case 'interests':
            return validateInterests();
        default:
            return true;
    }
}
// Education Form Submission
document.getElementById('educationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const educationData = {
      degree: document.getElementById('highestDegree').value,
      field: document.getElementById('fieldOfStudy').value,
      graduationYear: document.getElementById('graduationYear').value,
      institution: document.getElementById('institution').value
    };
  
    try {
      const response = await fetch('/api/users/education', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(educationData)
      });
  
      if (!response.ok) throw new Error('Failed to save education');
      
      const savedEducation = await response.json();
      updateEducationUI(savedEducation);
      showNotification('Education saved successfully!', 'success');
      
    } catch (error) {
      showNotification(error.message, 'error');
    }
  });
  
  // Update education display
  function updateEducationUI(education) {
    const educationSection = document.querySelector('#education .selected-items');
    educationSection.innerHTML = education.map(edu => `
      <div class="education-item">
        <h4>${edu.degree} in ${edu.field}</h4>
        <p>${edu.institution} • ${edu.graduationYear}</p>
      </div>
    `).join('');
  }
  

function validateEducation() {
    const requiredFields = ['highestDegree', 'fieldOfStudy', 'graduationYear', 'institution'];
    const isValid = requiredFields.every(field => {
        const element = document.getElementById(field);
        return element && element.value.trim() !== '';
    });

    if (!isValid) {
        showNotification('Please fill in all required education fields', 'error');
    }
    return isValid;
}
// Save skills to backend
async function saveSkillsToBackend(skills) {
    try {
      const response = await fetch('/api/users/skills', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ skills })
      });
  
      if (!response.ok) throw new Error('Failed to save skills');
      
      const updatedSkills = await response.json();
      updateSkillsUI(updatedSkills);
      showNotification('Skills updated successfully!', 'success');
      
    } catch (error) {
      showNotification(error.message, 'error');
    }
  }
  
  // Update skills display
  function updateSkillsUI(skills) {
    const skillsList = document.getElementById('selectedSkillsList');
    const skillsCount = document.querySelector('.skills-count');
    
    skillsList.innerHTML = skills.map(skillCategory => `
      <div class="skill-category">
        <h5>${skillCategory.category}</h5>
        ${skillCategory.skills.map(skill => `
          <div class="skill-chip">${skill}</div>
        `).join('')}
      </div>
    `).join('');
    
    skillsCount.textContent = `${skills.flatMap(c => c.skills).length}/16 skills added`;
  }
  


function validateSkills() {
    if (selectedSkills.size === 0) {
        showNotification('Please select at least one skill', 'error');
        return false;
    }
    return true;
}

function validateExperience() {
    const experienceEntries = document.querySelectorAll('.experience-entry');
    if (experienceEntries.length === 0) {
        showNotification('Please add at least one experience entry', 'error');
        alert('Please fill in all required experience fields');
        return false;
    }

    let isValid = true;
    experienceEntries.forEach(entry => {
        const requiredFields = ['jobTitle', 'company', 'startDate'];
        const entryValid = requiredFields.every(field => {
            const element = entry.querySelector(`#${field}`);
            return element && element.value.trim() !== '';
        });
        if (!entryValid) isValid = false;
    });

    if (!isValid) {
        showNotification('Please fill in all required experience fields', 'error');
        alert('Please fill in all required experience fields');
    }
    return isValid;
}

function validateInterests() {
    if (selectedInterests.size === 0) {
        showNotification('Please select at least one career interest', 'error');
        return false;
    }

    const { workPreferences } = userProfile.interests;
    if (!workPreferences.environment || !workPreferences.companySize || !workPreferences.careerLevel) {
        showNotification('Please select all work preferences', 'error');
        return false;
    }

    return true;
}

function validateAllSections() {
    return validateEducation() && 
           validateSkills() && 
           validateExperience() && 
           validateInterests();
}

/******************************************
 * SKILLS MANAGEMENT
 ******************************************/

function populateSkillsModal() {
    const skillsContainer = document.querySelector('.skill-suggestions');
    if (!skillsContainer) {
        console.error('Skills container not found');
        return;
    }

    // Clear existing skills first
    skillsContainer.innerHTML = '';

    // Add skills by category
    Object.entries(technicalSkills).forEach(([category, skills]) => {
        // Create category header
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'skill-category-header';
        categoryHeader.textContent = category
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
        skillsContainer.appendChild(categoryHeader);

        // Add skills for this category
        skills.forEach(skill => {
            const skillButton = document.createElement('button');
            skillButton.className = 'skill-suggestion-btn';
            skillButton.setAttribute('data-category', category);
            skillButton.setAttribute('data-skill', skill);
            
            // Check if skill is already selected
            const isSelected = selectedSkills.has(skill);
            if (isSelected) {
                skillButton.classList.add('selected');
            }

            skillButton.innerHTML = `
                <span class="skill-name">${skill}</span>
                <span class="add-icon">${isSelected ? '✓' : '+'}</span>
            `;
            
            // Add click event listener
            skillButton.addEventListener('click', () => addSkill(skill, category));
            
            skillsContainer.appendChild(skillButton);
        });
    });
}

function addSkill(skill, category) {
    if (selectedSkills.size >= MAX_SKILLS && !selectedSkills.has(skill)) {
        showNotification('Maximum skills limit reached', 'error');
        return;
    }

    const btn = document.querySelector(`[data-skill="${skill}"]`);
    
    if (selectedSkills.has(skill)) {
        selectedSkills.delete(skill);
        btn?.classList.remove('selected');
        if (btn) {
            btn.querySelector('.add-icon').textContent = '+';
        }
    } else {
        selectedSkills.add(skill);
        btn?.classList.add('selected');
        if (btn) {
            btn.querySelector('.add-icon').textContent = '✓';
        }
    }
    
    displaySelectedSkills();
    updateSkillsCount();
}

function displaySelectedSkills() {
    const skillsList = document.getElementById('selectedSkillsList');
    const skillsCount = document.querySelector('.skills-count');
    
    if (!skillsList || !skillsCount) return;

    skillsList.innerHTML = '';
    skillsCount.textContent = `${selectedSkills.size}/16 skills added`;
    
    if (selectedSkills.size === 0) {
        skillsList.innerHTML = '<div class="empty-state">No skills selected yet</div>';
        return;
    }
    
    selectedSkills.forEach(skill => {
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `
            ${skill}
            <span class="remove-skill" onclick="removeSkill('${skill}')">×</span>
        `;
        skillsList.appendChild(skillTag);
    });
}

function removeSkill(skill) {
    selectedSkills.delete(skill);
    const btn = document.querySelector(`[data-skill="${skill}"]`);
    if (btn) {
        btn.classList.remove('selected');
        btn.querySelector('.add-icon').textContent = '+';
    }
    displaySelectedSkills();
    updateSkillsCount();
}
function filterSkillsByCategory(category) {
    const skillsContainer = document.querySelector('.skill-suggestions');
    skillsContainer.innerHTML = ''; // Clear existing content

    // Get the skills array for the selected category
    const categorySkills = technicalSkills[category] || [];

    // Create skill buttons for each skill in the category
    categorySkills.forEach(skill => {
        const isSelected = selectedSkills.has(skill);
        const skillButton = document.createElement('button');
        skillButton.className = `skill-suggestion-btn ${isSelected ? 'selected' : ''}`;
        skillButton.innerHTML = `
            <span class="skill-name">${skill}</span>
            <span class="add-icon">${isSelected ? '✓' : '+'}</span>
        `;
        
        // Add click handler
        skillButton.addEventListener('click', () => addSkill(skill, category));
        
        skillsContainer.appendChild(skillButton);
    });

    // Update category pill states
    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.category === category);
    });
}

// Modified populateSkillsModal to handle initial load
function populateSkillsModal() {
    const skillsContainer = document.querySelector('.skill-suggestions');
    skillsContainer.innerHTML = '';
    
    // Create category sections
    Object.entries(technicalSkills).forEach(([category, skills]) => {
        // Create category header
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'skill-category-header';
        categoryHeader.textContent = category
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
        
        skillsContainer.appendChild(categoryHeader);

        // Create skill buttons
        skills.forEach(skill => {
            const isSelected = selectedSkills.has(skill);
            const skillButton = document.createElement('button');
            skillButton.className = `skill-suggestion-btn ${isSelected ? 'selected' : ''}`;
            skillButton.innerHTML = `
                <span class="skill-name">${skill}</span>
                <span class="add-icon">${isSelected ? '✓' : '+'}</span>
            `;
            skillButton.addEventListener('click', () => addSkill(skill, category));
            skillsContainer.appendChild(skillButton);
        });
    });
}


function searchSkills(searchTerm) {
    const normalizedTerm = searchTerm.toLowerCase().trim();
    const buttons = document.querySelectorAll('.skill-suggestion-btn');
    const headers = document.querySelectorAll('.skill-category-header');
    
    // Reset category pills if search is cleared
    if (normalizedTerm === '') {
        document.querySelector('.category-pill[data-category="all"]')?.click();
        return;
    }

    buttons.forEach(btn => {
        const skillName = btn.querySelector('.skill-name').textContent.toLowerCase();
        const matches = skillName.includes(normalizedTerm);
        btn.style.display = matches ? 'flex' : 'none';

        // Highlight matching text if there's a search term
        if (matches && normalizedTerm) {
            const regex = new RegExp(`(${normalizedTerm})`, 'gi');
            const highlightedText = btn.querySelector('.skill-name').textContent
                .replace(regex, '<mark>$1</mark>');
            btn.querySelector('.skill-name').innerHTML = highlightedText;
        }
    });

    // Show/hide category headers based on visible skills
    headers.forEach(header => {
        const category = header.textContent.toLowerCase();
        const hasVisibleSkills = Array.from(buttons).some(btn => 
            btn.getAttribute('data-category').toLowerCase() === category &&
            btn.style.display !== 'none'
        );
        header.style.display = hasVisibleSkills ? 'block' : 'none';
    });
}

// Helper functions for updating the UI
function updateSkillsCount() {
    const remaining = MAX_SKILLS - selectedSkills.size;
    const remainingText = document.querySelector('.skills-remaining');
    if (remainingText) {
        remainingText.textContent = 
            `You can add ${remaining} more skill${remaining !== 1 ? 's' : ''}`;
    }
}

function openSkillModal() {
    const modal = document.getElementById('skillModal');
    if (modal) {
        modal.classList.remove('hidden');
        updateSkillsCount();
    }
}

function closeSkillModal() {
    const modal = document.getElementById('skillModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function saveSkills() {
    userProfile.skills.technical = Array.from(selectedSkills).map(skill => ({
        name: skill,
        category: determineSkillCategory(skill),
        proficiency: 'intermediate'
    }));

    saveToLocalStorage();
    showNotification('Skills saved successfully');
    closeSkillModal();
}
//experience section
function addExperienceEntry() {
    if (!validateExperience()) {
        showNotification('Please fill in all required fields for the current experience entry', 'error'); // Don't add a new entry if the current one isn't valid
    return;
    }

    const experienceList = document.getElementById('experienceList');
    const newEntry = document.createElement('div');
    newEntry.className = 'experience-entry';
    newEntry.innerHTML = `
        <div class="form-group">
            <label for="jobTitle">Job Title</label>
            <input type="text" id="jobTitle" placeholder="e.g., Software Developer" required>
        </div>
        <div class="form-group">
            <label for="company">Company</label>
            <input type="text" id="company" placeholder="Company name" required>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="startDate">Start Date</label>
                <input type="month" id="startDate" required>
            </div>
            <div class="form-group">
                <label for="endDate">End Date</label>
                <input type="month" id="endDate">
                <div class="checkbox-group">
                    <input type="checkbox" id="currentJob">
                    <label for="currentJob">I currently work here</label>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label for="jobDescription">Description</label>
            <textarea id="jobDescription" rows="4" placeholder="Describe your responsibilities and achievements"></textarea>
        </div>
    `;

    experienceList.appendChild(newEntry);

    // Update IDs to make them unique
    updateExperienceEntryIds();
}

function updateExperienceEntryIds() {
    const entries = document.querySelectorAll('.experience-entry');
    entries.forEach((entry, index) => {
        entry.querySelectorAll('[id]').forEach(element => {
            element.id = `${element.id}_${index}`;
        });
        entry.querySelectorAll('label').forEach(label => {
            if (label.htmlFor) {
                label.htmlFor = `${label.htmlFor}_${index}`;
            }
        });
    });
}






document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".content-section");
    let currentSectionIndex = 0;

    function showSection(index) {
        sections.forEach((section, i) => {
            section.classList.toggle("active", i === index);
        });
    }

    function validateForm(form) {
        return form.checkValidity(); // Uses HTML5 validation
    }

    function nextSection(event) {
        event.preventDefault(); // Prevent actual form submission

        const currentSection = sections[currentSectionIndex];
        const form = currentSection.querySelector("form");

        if (form && !validateForm(form)) {
            form.reportValidity(); // Show validation errors
            return;
        }

        if (currentSectionIndex < sections.length - 1) {
            currentSectionIndex++;
            showSection(currentSectionIndex);
        }
    }

    function prevSection() {
        if (currentSectionIndex > 0) {
            currentSectionIndex--;
            showSection(currentSectionIndex);
        }
    }

    // Attach event listeners to each "Save & Continue" button
    document.querySelectorAll(".primary-button").forEach((btn) => {
        btn.addEventListener("click", nextSection);
    });

    // Attach event listeners to "Back" buttons
    document.querySelectorAll(".secondary-button").forEach((btn) => {
        btn.addEventListener("click", prevSection);
    });

    // Initially show the first section
    showSection(currentSectionIndex);
});
function showSection(sectionId) {
    // Hide all content sections
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(section => {
        section.classList.remove('active');
    });

    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }

    // Update the page title
    const sectionTitleElement = document.getElementById('sectionTitle');
    if (sectionTitleElement) {
        sectionTitleElement.textContent = sectionId.charAt(0).toUpperCase() + sectionId.slice(1) + " Background";
    }

    // Update active link in the sidebar
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
        }
    });
}

// Attach event listeners to sidebar links
const sidebarLinks = document.querySelectorAll('.nav-link[data-section]');
sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const sectionId = this.dataset.section;
        showSection(sectionId);
    });
});