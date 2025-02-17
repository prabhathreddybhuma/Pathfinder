// Data Structures
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

// Constants
const MAX_SKILLS = 16;
const MAX_INTERESTS = 10;
let selectedSkills = new Set();
let selectedInterests = new Set();

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    checkAuthentication();
    initializeUI();
    initializeNavigation();
    loadSavedData();
    attachEventListeners();
    populateSkillsModal();
    populateInterestsModal();
}

// Authentication Check
function checkAuthentication() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    return user;
}

// UI Initialization
function initializeUI() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('userName').textContent = user.fullName || 'User';
        document.getElementById('userEmail').textContent = user.email || '';
    }
}

// Navigation
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
}

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

// Skills Management
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
    }

    buttons.forEach(btn => {
        const skillName = btn.querySelector('.skill-name').textContent.toLowerCase();
        const matches = skillName.includes(normalizedTerm);
        btn.style.display = matches ? 'flex' : 'none';
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

// Interests Management
function populateInterestsModal() {
    const interestsContainer = document.querySelector('.interest-categories');
    if (!interestsContainer) return;

    interestsContainer.innerHTML = '';

    Object.entries(careerInterests).forEach(([category, interests]) => {
        const categorySection = document.createElement('div');
        categorySection.className = 'interest-category';
        
        const categoryTitle = category
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
        
        categorySection.innerHTML = `
            <h4>${categoryTitle}</h4>
            <div class="interest-options">
                ${interests.map(interest => `
                    <div class="interest-option">
                        <input type="checkbox" 
                               id="${interest.replace(/\s+/g, '-')}"
                               ${selectedInterests.has(interest) ? 'checked' : ''}
                               onchange="toggleInterest('${interest}')">
                        <label for="${interest.replace(/\s+/g, '-')}">${interest}</label>
                    </div>
                `).join('')}
            </div>
        `;
        
        interestsContainer.appendChild(categorySection);
    });
}

function toggleInterest(interest) {
    if (selectedInterests.has(interest)) {
        selectedInterests.delete(interest);
    } else {
        if (selectedInterests.size >= MAX_INTERESTS) {
            showNotification('Maximum interests limit reached', 'error');
            // Uncheck the checkbox
            const checkbox = document.getElementById(interest.replace(/\s+/g, '-'));
            if (checkbox) checkbox.checked = false;
            return;
        }
        selectedInterests.add(interest);
    }
    
    displaySelectedInterests();
    updateInterestsCount();
}

function displaySelectedInterests() {
    const interestsList = document.getElementById('selectedInterestsList');
    const interestsCount = document.querySelector('.interests-count');
    
    if (!interestsList || !interestsCount) return;

    interestsList.innerHTML = '';
    interestsCount.textContent = `${selectedInterests.size}/10 interests added`;
    
    if (selectedInterests.size === 0) {
        interestsList.innerHTML = '<div class="empty-state">No interests selected yet</div>';
        return;
    }
    
    selectedInterests.forEach(interest => {
        const interestTag = document.createElement('div');
        interestTag.className = 'interest-tag';
        interestTag.innerHTML = `
            ${interest}
            <span class="remove-skill" onclick="removeInterest('${interest}')">×</span>
        `;
        interestsList.appendChild(interestTag);
    });
}

function removeInterest(interest) {
    selectedInterests.delete(interest);
    const checkbox = document.getElementById(interest.replace(/\s+/g, '-'));
    if (checkbox) checkbox.checked = false;
    displaySelectedInterests();
    updateInterestsCount();
}

// Work Preferences
function togglePreference(type, value) {
    document.querySelectorAll(`.preference-btn[data-type="${type}"]`)
        .forEach(btn => btn.classList.remove('active'));
    
    const selectedBtn = document.querySelector(
        `.preference-btn[data-type="${type}"][data-value="${value}"]`
    );
    if (selectedBtn) {
        selectedBtn.classList.add('active');
        userProfile.interests.workPreferences[type] = value;
        saveToLocalStorage();
        showNotification('Preference updated successfully');
    }
}

// Modal Management
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

function openInterestModal() {
    const modal = document.getElementById('interestModal');
    if (modal) {
        modal.classList.remove('hidden');
        updateInterestsCount();
    }
}

// Count Updates
function updateSkillsCount() {
    const remaining = MAX_SKILLS - selectedSkills.size;
    const remainingText = document.querySelector('.skills-remaining');
    if (remainingText) {
        remainingText.textContent = 
            `You can add ${remaining} more skill${remaining !== 1 ? 's' : ''}`;
    }
}

function updateInterestsCount() {
    const remaining = MAX_INTERESTS - selectedInterests.size;
    const remainingText = document.querySelector('.interests-remaining');
    if (remainingText) {
        remainingText.textContent = 
            `You can add ${remaining} more interest${remaining !== 1 ? 's' : ''}`;
    }
}

// Data Validation
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

// Save Functions
function saveEducation() {
    const education = {
        degree: document.getElementById('highestDegree').value,
        field: document.getElementById('fieldOfStudy').value,
        graduationYear: document.getElementById('graduationYear').value,
        institution: document.getElementById('institution').value
    };

    userProfile.education = education;
    saveToLocalStorage();
    showNotification('Education details saved successfully');
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

function saveInterests() {
    userProfile.interests.careerInterests = Array.from(selectedInterests).map(interest => ({
        name: interest,
        category: determineInterestCategory(interest)
    }));

    saveToLocalStorage();
    showNotification('Interests saved successfully');
    closeInterestModal();
}

function saveExperience() {
    const experiences = [];
    document.querySelectorAll('.experience-entry').forEach(entry => {
        experiences.push({
            jobTitle: entry.querySelector('#jobTitle').value,
            company: entry.querySelector('#company').value,
            startDate: entry.querySelector('#startDate').value,
            endDate: entry.querySelector('#endDate').value,
            currentJob: entry.querySelector('#currentJob').checked,
            description: entry.querySelector('#jobDescription').value
        });
    });

    userProfile.experience = experiences;
    saveToLocalStorage();
    showNotification('Experience details saved successfully');
}

// Data Management
function saveToLocalStorage() {
    userProfile.lastUpdated = new Date().toISOString();
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
}

function loadSavedData() {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        try {
            userProfile = JSON.parse(savedProfile);
            populateAllSections();
        } catch (error) {
            console.error('Error loading profile data:', error);
            showNotification('Error loading profile data', 'error');
        }
    }
}

function populateAllSections() {
    populateEducation();
    populateSkills();
    populateExperience();
    populateInterests();
}

// Helper Functions
function determineSkillCategory(skill) {
    for (const [category, skills] of Object.entries(technicalSkills)) {
        if (skills.includes(skill)) return category;
    }
    return 'other';
}

function determineInterestCategory(interest) {
    for (const [category, interests] of Object.entries(careerInterests)) {
        if (interests.includes(interest)) return category;
    }
    return 'other';
}

// Navigation Helpers
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

function completeProfile() {
    if (!validateAllSections()) {
        showNotification('Please complete all required sections', 'error');
        return;
    }

    // Prepare final profile data
    const finalProfile = {
        ...userProfile,
        metadata: {
            completedAt: new Date().toISOString(),
            version: '1.0'
        }
    };

    // Save final profile
    localStorage.setItem('userProfile', JSON.stringify(finalProfile));
    showNotification('Profile completed successfully!', 'success');
    
    // Redirect to recommendations
    setTimeout(() => {
        showSection('recommendations');
    }, 1500);
}

function validateAllSections() {
    return validateEducation() && 
           validateSkills() && 
           validateExperience() && 
           validateInterests();
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    setTimeout(() => {
        notification.className = 'notification hidden';
    }, 3000);
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('userProfile');
    window.location.href = 'index.html';
}

// Add dynamic styles
const style = document.createElement('style');
style.textContent = `
    .skill-category-header {
        color: var(--primary-color);
        font-size: 1rem;
        font-weight: 500;
        margin: 1rem 0 0.5rem;
        padding: 0.5rem;
        border-bottom: 1px solid var(--border-color);
    }

    .skill-suggestion-btn {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 0.75rem 1rem;
        margin: 0.25rem 0;
        background: var(--darker-bg);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        color: var(--light-text);
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .skill-suggestion-btn:hover {
        background: var(--hover-bg);
        border-color: var(--primary-color);
    }

    .skill-suggestion-btn.selected {
        background: var(--primary-color);
        color: var(--dark-bg);
        border-color: var(--primary-color);
    }

    .skill-suggestion-btn .add-icon {
        font-size: 1.2rem;
        opacity: 0.7;
    }

    .skill-suggestion-btn:hover .add-icon {
        opacity: 1;
    }
`;
document.head.appendChild(style);