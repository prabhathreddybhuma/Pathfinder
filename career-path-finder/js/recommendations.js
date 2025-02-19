// API Endpoints (to be replaced with actual endpoints)
const API_ENDPOINTS = {
    getCareerRecommendations: '/api/career-recommendations',
    getProfileMatch: '/api/profile-match',
    saveCareerPath: '/api/save-career',
    getCareerDetails: '/api/career-details'
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
});

async function initializePage() {
    try {
        await loadUserProfile();
        await loadCareerRecommendations();
    } catch (error) {
        console.error('Error initializing page:', error);
        showNotification('Error loading recommendations', 'error');
    }
}

// Load user profile and update UI
async function loadUserProfile() {
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (!userProfile) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Update profile match stats
    updateProfileStats(userProfile);
    
    // Update user info in sidebar
    updateUserInfo(userProfile);
}

// Update profile match statistics
function updateProfileStats(profile) {
    const matchingSkills = profile.skills.technical.length;
    const yearsExperience = calculateYearsExperience(profile.experience);
    const industryMatches = calculateIndustryMatches(profile);

    document.querySelector('.match-stats').innerHTML = `
        <div class="stat-item">
            <span class="stat-value">${matchingSkills}</span>
            <span class="stat-label">Matching Skills</span>
        </div>
        <div class="stat-item">
            <span class="stat-value">${yearsExperience}</span>
            <span class="stat-label">Years Experience</span>
        </div>
        <div class="stat-item">
            <span class="stat-value">${industryMatches}</span>
            <span class="stat-label">Industry Matches</span>
        </div>
    `;
}

// Calculate total years of experience
function calculateYearsExperience(experience) {
    if (!Array.isArray(experience)) return 0;
    
    const totalMonths = experience.reduce((total, job) => {
        const start = new Date(job.startDate);
        const end = job.currentJob ? new Date() : new Date(job.endDate);
        const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                      (end.getMonth() - start.getMonth());
        return total + months;
    }, 0);

    return Math.round(totalMonths / 12);
}

// Calculate matching industries based on interests
function calculateIndustryMatches(profile) {
    if (!profile.interests || !profile.interests.careerInterests) return 0;
    return profile.interests.careerInterests.length;
}

// Load and display career recommendations
async function loadCareerRecommendations() {
    try {
        const userProfile = JSON.parse(localStorage.getItem('userProfile'));
        
        // Mock data for demonstration (replace with actual API call)
        const recommendations = [
            {
                id: 1,
                title: "Data Scientist",
                subtitle: "AI & Machine Learning Focus",
                matchScore: 95,
                salaryRange: { min: 95000, max: 150000 },
                growthPotential: "High",
                currentDemand: "Very High",
                requiredSkills: ["Python", "Machine Learning", "Data Analysis", "Deep Learning"],
                matchedSkills: ["Python", "Machine Learning", "Data Analysis"],
                gapSkills: ["Deep Learning"],
                description: "Lead data science initiatives focusing on AI and ML applications."
            },
            {
                id: 2,
                title: "Cloud Solutions Architect",
                subtitle: "Enterprise Infrastructure",
                matchScore: 88,
                salaryRange: { min: 110000, max: 180000 },
                growthPotential: "Very High",
                currentDemand: "High",
                requiredSkills: ["AWS", "Cloud Architecture", "DevOps", "Kubernetes"],
                matchedSkills: ["AWS", "Cloud Architecture", "DevOps"],
                gapSkills: ["Kubernetes"],
                description: "Design and implement cloud-based solutions for enterprise clients."
            },
            {
                id: 3,
                title: "Full Stack Developer",
                subtitle: "Modern Web Technologies",
                matchScore: 85,
                salaryRange: { min: 85000, max: 140000 },
                growthPotential: "High",
                currentDemand: "Very High",
                requiredSkills: ["JavaScript", "React", "Node.js", "GraphQL"],
                matchedSkills: ["JavaScript", "React", "Node.js"],
                gapSkills: ["GraphQL"],
                description: "Develop full-stack applications using modern web technologies."
            }
        ];

        displayTopCareers(recommendations);
        displayAdditionalRecommendations(recommendations);
    } catch (error) {
        console.error('Error loading recommendations:', error);
        showNotification('Error loading career recommendations', 'error');
    }
}

// Display top career recommendations
function displayTopCareers(careers) {
    const container = document.querySelector('.career-cards');
    if (!container) return;

    container.innerHTML = careers.slice(0, 3).map(career => `
        <div class="career-card" data-career-id="${career.id}">
            <div class="career-header">
                <span class="match-score">${career.matchScore}% Match</span>
                <h3 class="career-title">${career.title}</h3>
                <p class="career-subtitle">${career.subtitle}</p>
            </div>
            <div class="career-content">
                <div class="key-details">
                    <div class="detail-item">
                        <span class="detail-icon">💰</span>
                        <div class="detail-info">
                            <div class="detail-label">Salary Range</div>
                            <div class="detail-value">$${(career.salaryRange.min/1000).toFixed(0)}K - $${(career.salaryRange.max/1000).toFixed(0)}K</div>
                        </div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">📈</span>
                        <div class="detail-info">
                            <div class="detail-label">Growth Potential</div>
                            <div class="detail-value">${career.growthPotential}</div>
                        </div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">🎯</span>
                        <div class="detail-info">
                            <div class="detail-label">Current Demand</div>
                            <div class="detail-value">${career.currentDemand}</div>
                        </div>
                    </div>
                </div>
                <div class="career-skills">
                    <h4 class="skills-title">Required Skills</h4>
                    <div class="skills-list">
                        ${career.matchedSkills.map(skill => `
                            <span class="skill-tag">${skill}</span>
                        `).join('')}
                        ${career.gapSkills.map(skill => `
                            <span class="skill-tag gap">${skill}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="career-actions">
                <button class="view-details-btn" onclick="viewCareerDetails(${career.id})">
                    View Details
                </button>
                <button class="save-career-btn" onclick="saveCareerPath(${career.id})">
                    Save Path
                </button>
            </div>
        </div>
    `).join('');
}

// View career details
async function viewCareerDetails(careerId) {
    try {
        // This would be an API call in production
        const details = await getCareerDetails(careerId);
        // Navigate to career details page
        window.location.href = `career-details.html?id=${careerId}`;
    } catch (error) {
        console.error('Error viewing career details:', error);
        showNotification('Error loading career details', 'error');
    }
}

// Save career path
async function saveCareerPath(careerId) {
    try {
        // This would be an API call in production
        // await fetch(API_ENDPOINTS.saveCareerPath, {
        //     method: 'POST',
        //     body: JSON.stringify({ careerId })
        // });
        
        showNotification('Career path saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving career path:', error);
        showNotification('Error saving career path', 'error');
    }
}

// Update user info in sidebar
function updateUserInfo(profile) {
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    
    if (userName) userName.textContent = profile.name || 'User';
    if (userEmail) userEmail.textContent = profile.email || '';
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    setTimeout(() => {
        notification.className = 'notification hidden';
    }, 3000);
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('userProfile');
    window.location.href = 'index.html';
}