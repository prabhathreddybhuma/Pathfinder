// Global state
let userProfile = {
    education: null,
    skills: {
        technical: [],
        soft: [],
        business: [],
        marketing: [],
        design: []
    },
    experience: [],
    interests: {
        careerInterests: [],
        workPreferences: {
            environment: null,
            companySize: null,
            careerLevel: null
        }
    }
};

// Constants
const MAX_SKILLS = 16;
const MAX_INTERESTS = 10;
let selectedSkills = new Set();
let selectedInterests = new Set();

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    const user = checkAuthentication();
    if (!user) return;

    initializeUI(user);
    initializeNavigation();
    loadSavedData();
    attachEventListeners();
}

// Authentication
function checkAuthentication() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    return user;
}

// UI Initialization
function initializeUI(user) {
    document.getElementById('userName').textContent = user.fullName || 'User';
    document.getElementById('userEmail').textContent = user.email || '';
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
        initializeSection(sectionId);
    }

    updateNavigationState(sectionId);
    history.pushState(null, '', `#${sectionId}`);
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

// Event Listeners
function attachEventListeners() {
    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.add('hidden');
            });
        });
    });

    // Form submissions
    document.getElementById('educationForm')?.addEventListener('submit', handleEducationSubmit);
    document.getElementById('skillsForm')?.addEventListener('submit', handleSkillsSubmit);
    document.getElementById('experienceForm')?.addEventListener('submit', handleExperienceSubmit);
}

// Validation
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

// Work Preferences
function togglePreference(type, value) {
    // Remove selected state from all buttons in the group
    document.querySelectorAll(`.preference-btn[data-type="${type}"]`).forEach(btn => {
        btn.classList.remove('selected');
    });

    // Add selected state to clicked button
    const selectedBtn = document.querySelector(
        `.preference-btn[data-type="${type}"][data-value="${value}"]`
    );
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
        
        // Update user profile
        userProfile.interests.workPreferences[type] = value;
        saveToLocalStorage();
        
        // Show feedback
        showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} preference updated`);
    }
}

function openSkillModal() {
    const modal = document.getElementById('skillModal');
    if (modal) {
        modal.classList.remove('hidden');
        updateSkillsRemaining();
    }
}

function closeSkillModal() {
    const modal = document.getElementById('skillModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function handleSkillInput(value) {
    const searchTerm = value.toLowerCase();
    const suggestions = document.querySelectorAll('.skill-suggestion-btn');
    
    suggestions.forEach(btn => {
        const skillText = btn.textContent.toLowerCase();
        const matches = skillText.includes(searchTerm);
        btn.style.display = matches ? 'flex' : 'none';
        
        if (matches && searchTerm) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            const highlighted = btn.textContent.replace(regex, '<mark>$1</mark>');
            btn.innerHTML = highlighted + '<span>+</span>';
        }
    });
}

function addSkill(skill) {
    if (selectedSkills.size >= MAX_SKILLS && !selectedSkills.has(skill)) {
        showNotification('Maximum skills limit reached', 'error');
        return;
    }

    const btn = document.querySelector(`[onclick="addSkill('${skill}')"]`);
    
    if (selectedSkills.has(skill)) {
        selectedSkills.delete(skill);
        btn?.classList.remove('selected');
    } else {
        selectedSkills.add(skill);
        btn?.classList.add('selected');
    }
    
    displaySelectedSkills();
    updateSkillsRemaining();
}

function removeSkill(skill) {
    selectedSkills.delete(skill);
    
    // Update UI
    displaySelectedSkills();
    updateSkillsRemaining();
    
    // Update suggestion button state
    const btn = document.querySelector(`[onclick="addSkill('${skill}')"]`);
    if (btn) {
        btn.classList.remove('selected');
    }
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

function updateSkillsRemaining() {
    const remaining = MAX_SKILLS - selectedSkills.size;
    const remainingText = document.querySelector('.skills-remaining');
    if (remainingText) {
        remainingText.textContent = 
            `You can add ${remaining} more skill${remaining !== 1 ? 's' : ''}`;
    }
}

function saveSkills() {
    if (selectedSkills.size === 0) {
        showNotification('Please select at least one skill', 'error');
        return;
    }

    // Update user profile
    userProfile.skills.technical = Array.from(selectedSkills).map(skill => ({
        skill,
        proficiency: 'intermediate'
    }));

    saveToLocalStorage();
    showNotification('Skills saved successfully!', 'success');
    closeSkillModal();
}

// Interests Management Functions
function openInterestModal() {
    const modal = document.getElementById('interestModal');
    if (modal) {
        modal.classList.remove('hidden');
        updateInterestsRemaining();
    }
}

function closeInterestModal() {
    const modal = document.getElementById('interestModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function handleInterestInput(value) {
    const searchTerm = value.toLowerCase();
    const suggestions = document.querySelectorAll('.interest-suggestion-btn');
    
    suggestions.forEach(btn => {
        const interestText = btn.textContent.toLowerCase();
        const matches = interestText.includes(searchTerm);
        btn.style.display = matches ? 'flex' : 'none';
        
        if (matches && searchTerm) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            const highlighted = btn.textContent.replace(regex, '<mark>$1</mark>');
            btn.innerHTML = highlighted + '<span>+</span>';
        }
    });
}

function addInterest(interest) {
    if (selectedInterests.size >= MAX_INTERESTS && !selectedInterests.has(interest)) {
        showNotification('Maximum interests limit reached', 'error');
        return;
    }

    const btn = document.querySelector(`[onclick="addInterest('${interest}')"]`);
    
    if (selectedInterests.has(interest)) {
        selectedInterests.delete(interest);
        btn?.classList.remove('selected');
    } else {
        selectedInterests.add(interest);
        btn?.classList.add('selected');
    }
    
    displaySelectedInterests();
    updateInterestsRemaining();
}

function removeInterest(interest) {
    selectedInterests.delete(interest);
    displaySelectedInterests();
    updateInterestsRemaining();
    
    const btn = document.querySelector(`[onclick="addInterest('${interest}')"]`);
    if (btn) {
        btn.classList.remove('selected');
    }
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

function updateInterestsRemaining() {
    const remaining = MAX_INTERESTS - selectedInterests.size;
    const remainingText = document.querySelector('.interests-remaining');
    if (remainingText) {
        remainingText.textContent = 
            `You can add ${remaining} more interest${remaining !== 1 ? 's' : ''}`;
    }
}

function saveInterests() {
    if (selectedInterests.size === 0) {
        showNotification('Please select at least one interest', 'error');
        return;
    }

    // Update user profile
    userProfile.interests.careerInterests = Array.from(selectedInterests);
    
    saveToLocalStorage();
    showNotification('Interests saved successfully!', 'success');
    closeInterestModal();
}


// Data Management
function loadSavedData() {
    const savedProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (savedProfile) {
        userProfile = savedProfile;
        populateAllSections();
    }
}

function populateAllSections() {
    populateEducation();
    populateSkills();
    populateExperience();
    populateInterests();
}

function populateEducation() {
    if (userProfile.education) {
        const { degree, field, graduationYear, institution } = userProfile.education;
        document.getElementById('highestDegree').value = degree || '';
        document.getElementById('fieldOfStudy').value = field || '';
        document.getElementById('graduationYear').value = graduationYear || '';
        document.getElementById('institution').value = institution || '';
    }
}

function populateSkills() {
    selectedSkills.clear();
    
    if (userProfile.skills) {
        Object.values(userProfile.skills).forEach(categorySkills => {
            categorySkills.forEach(skillData => {
                if (typeof skillData === 'string') {
                    selectedSkills.add(skillData);
                } else {
                    selectedSkills.add(skillData.skill);
                }
            });
        });
    }
    
    displaySelectedSkills();
    updateSkillButtons();
}

function populateInterests() {
    selectedInterests.clear();
    
    if (userProfile.interests) {
        // Load career interests
        if (userProfile.interests.careerInterests) {
            selectedInterests = new Set(userProfile.interests.careerInterests);
            displaySelectedInterests();
        }

        // Load work preferences
        const { workPreferences } = userProfile.interests;
        if (workPreferences) {
            Object.entries(workPreferences).forEach(([type, value]) => {
                if (value) {
                    const btn = document.querySelector(
                        `.preference-btn[data-type="${type}"][data-value="${value}"]`
                    );
                    if (btn) btn.classList.add('selected');
                }
            });
        }
    }
}

// Helper Functions
function saveToLocalStorage() {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    setTimeout(() => {
        notification.className = 'notification hidden';
    }, 3000);
}

// Logout
function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('userProfile');
    window.location.href = 'index.html';
}

// History Management
window.addEventListener('popstate', () => {
    const sectionId = window.location.hash.slice(1) || 'education';
    showSection(sectionId);
});