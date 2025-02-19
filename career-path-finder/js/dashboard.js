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
    const buttons = document.querySelectorAll('.skill-suggestion-btn');
    const headers = document.querySelectorAll('.skill-category-header');
    
    // Update category pills
    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.classList.toggle('active', pill.getAttribute('data-category') === category);
    });

    if (category === 'all') {
        buttons.forEach(btn => btn.style.display = 'flex');
        headers.forEach(header => header.style.display = 'block');
    } else {
        buttons.forEach(btn => {
            btn.style.display = btn.getAttribute('data-category') === category ? 'flex' : 'none';
        });
        headers.forEach(header => {
            const shouldShow = header.textContent.toLowerCase().includes(category.toLowerCase());
            header.style.display = shouldShow ? 'block' : 'none';
        });
    }
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