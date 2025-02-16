// Global state to store user data
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
    interests: []
};

let selectedSkills = new Set();
const MAX_SKILLS = 16;

// DOM Elements and Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // Set user info in dashboard
    document.getElementById('userName').textContent = user.fullName || 'User';
    document.getElementById('userEmail').textContent = user.email || '';

    // Initialize first section
    showSection('education');
    loadSavedData();

    // Add event listeners for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.currentTarget.getAttribute('data-section');
            showSection(section);
        });
    });

    // Initialize skills modal
    initializeSkillsModal();
});

// Skills Modal Functions
function initializeSkillsModal() {
    // Set up search functionality
    const searchInput = document.getElementById('skillInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => handleSkillInput(e.target.value));
    }

    // Set up category filters
    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const category = pill.textContent.toLowerCase();
            filterSkillsByCategory(category);
        });
    });
}

function openSkillModal() {
    document.getElementById('skillModal').classList.remove('hidden');
    updateSkillsRemaining();
}

function closeSkillModal() {
    document.getElementById('skillModal').classList.add('hidden');
}

function handleSkillInput(value) {
    const searchTerm = value.toLowerCase();
    const suggestions = document.querySelectorAll('.skill-suggestion-btn');
    
    suggestions.forEach(btn => {
        const skillText = btn.textContent.toLowerCase();
        const matches = skillText.includes(searchTerm);
        btn.style.display = matches ? 'flex' : 'none';
        
        // Highlight matching text if needed
        if (matches && searchTerm) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            const highlighted = btn.textContent.replace(regex, '<mark>$1</mark>');
            btn.innerHTML = highlighted + '<span>+</span>';
        }
    });
}

function filterSkillsByCategory(category) {
    // Update active state of category pills
    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.classList.toggle('active', 
            pill.textContent.toLowerCase() === category);
    });

    // Filter visible skills
    const suggestions = document.querySelectorAll('.skill-suggestion-btn');
    suggestions.forEach(btn => {
        if (category === 'all') {
            btn.style.display = 'flex';
        } else {
            btn.style.display = 
                btn.dataset.category === category ? 'flex' : 'none';
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

// Modified saveSkills function
function saveSkills() {
    if (selectedSkills.size === 0) {
        showNotification('Please select at least one skill', 'error');
        return;
    }

    // Categorize skills
    const categorizedSkills = {
        technical: [],
        business: [],
        marketing: [],
        design: []
    };

    selectedSkills.forEach(skill => {
        const btn = document.querySelector(`[onclick="addSkill('${skill}')"]`);
        const category = btn?.dataset.category || 'technical';
        categorizedSkills[category].push({
            skill,
            proficiency: 'intermediate'
        });
    });

    userProfile.skills = categorizedSkills;
    saveToLocalStorage();
    showNotification('Skills saved successfully!', 'success');
    closeSkillModal();
}

// Modified populateSkills function
function populateSkills() {
    if (!userProfile.skills) return;

    selectedSkills.clear();
    
    // Collect all skills from different categories
    Object.values(userProfile.skills).forEach(categorySkills => {
        categorySkills.forEach(skillData => {
            if (typeof skillData === 'string') {
                selectedSkills.add(skillData);
            } else {
                selectedSkills.add(skillData.skill);
            }
        });
    });

    displaySelectedSkills();
    
    // Update suggestion buttons
    selectedSkills.forEach(skill => {
        const btn = document.querySelector(`[onclick="addSkill('${skill}')"]`);
        if (btn) {
            btn.classList.add('selected');
        }
    });
}

// Keep the rest of your existing code (navigation, validation, etc.)
// but remove the old skills-related code that we've replaced

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
// Add to your existing userProfile object
userProfile.interests = {
    careerInterests: [],
    workPreferences: {
        environment: null,
        companySize: null,
        careerLevel: null
    }
};

// Global state for interests
let selectedInterests = new Set();
const MAX_INTERESTS = 10;

// Interest Modal Functions
function openInterestModal() {
    document.getElementById('interestModal').classList.remove('hidden');
    updateInterestsRemaining();
}

function closeInterestModal() {
    document.getElementById('interestModal').classList.add('hidden');
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

function filterInterests(category) {
    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.classList.toggle('active', 
            pill.textContent.toLowerCase() === category);
    });

    const suggestions = document.querySelectorAll('.interest-suggestion-btn');
    suggestions.forEach(btn => {
        if (category === 'all') {
            btn.style.display = 'flex';
        } else {
            btn.style.display = 
                btn.dataset.category === category ? 'flex' : 'none';
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

function togglePreference(type, value) {
    // Find all buttons in the same group
    const buttons = document.querySelectorAll(`[onclick*="togglePreference('${type}'"]`);
    
    // Remove active state from all buttons in group
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Add active state to clicked button
    const selectedBtn = document.querySelector(`[onclick="togglePreference('${type}', '${value}')"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
        
        // Update preferences in state
        userProfile.interests.workPreferences[type] = value;
    }
}

function validateInterests() {
    if (selectedInterests.size === 0) {
        showNotification('Please select at least one career interest', 'error');
        return false;
    }

    const { environment, companySize, careerLevel } = userProfile.interests.workPreferences;
    if (!environment || !companySize || !careerLevel) {
        showNotification('Please select all work preferences', 'error');
        return false;
    }

    return true;
}

function saveInterests() {
    userProfile.interests.careerInterests = Array.from(selectedInterests);
    saveToLocalStorage();
    showNotification('Interests saved successfully!', 'success');
    closeInterestModal();
}

function saveAndContinue() {
    if (!validateInterests()) {
        return;
    }

    saveInterests();
    
    // Generate career recommendations based on profile
    generateRecommendations(userProfile)
        .then(recommendations => {
            // Save recommendations
            localStorage.setItem('recommendations', JSON.stringify(recommendations));
            // Redirect to recommendations page
            showSection('recommendations');
        })
        .catch(error => {
            showNotification('Error generating recommendations. Please try again.', 'error');
        });
}

// Load saved interests
function populateInterests() {
    if (userProfile.interests) {
        // Load career interests
        selectedInterests = new Set(userProfile.interests.careerInterests || []);
        displaySelectedInterests();

        // Update interest suggestion buttons
        selectedInterests.forEach(interest => {
            const btn = document.querySelector(`[onclick="addInterest('${interest}')"]`);
            if (btn) {
                btn.classList.add('selected');
            }
        });

        // Load work preferences
        const { workPreferences } = userProfile.interests;
        if (workPreferences) {
            Object.entries(workPreferences).forEach(([type, value]) => {
                if (value) {
                    const btn = document.querySelector(`[onclick="togglePreference('${type}', '${value}')"]`);
                    if (btn) {
                        btn.classList.add('active');
                    }
                }
            });
        }
    }
}

// Initialize interests section when loaded
document.addEventListener('DOMContentLoaded', () => {
    const interestsSection = document.getElementById('interests');
    if (interestsSection) {
        populateInterests();
    }
});