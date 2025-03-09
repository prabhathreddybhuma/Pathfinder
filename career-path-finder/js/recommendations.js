// API Endpoints (to be used with actual implementation)
const API_ENDPOINTS = {
    getCareerRecommendations: '/api/career-recommendations',
    getProfileMatch: '/api/profile-match',
    saveCareerPath: '/api/save-career',
    getCareerDetails: '/api/career-details',
    getCareerSkills: '/api/career-skills',
    getMoreCareerPaths: '/api/more-career-paths',
    getCareerTips: '/api/career-tips'
};

// Document ready function
document.addEventListener('DOMContentLoaded', () => {
    initializeRecommendationsPage();
});

// Page initialization
async function initializeRecommendationsPage() {
    try {
        // Check if user is logged in and profile is complete
        checkUserAuthentication();
        
        // Load user info
        loadUserInfo();
        
        // Load all page data in parallel
        await Promise.all([
            loadCareerRecommendations(),
            loadAdditionalCareerPaths(),
            loadCareerTips()
        ]);
    } catch (error) {
        console.error('Error initializing recommendations page:', error);
        showNotification('Error loading recommendations', 'error');
        displayFallbackContent();
    }
}

// Check if user is logged in and profile is complete
function checkUserAuthentication() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    if (!userProfile || !userProfile.metadata || !userProfile.metadata.isComplete) {
        showNotification('Please complete your profile first', 'error');
        // We'll still show the page but with placeholder content
    }
}

// Load user info
function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('userName').textContent = user.fullName || 'User';
        document.getElementById('userEmail').textContent = user.email || 'N/A';
    }
}

// Load career recommendations
async function loadCareerRecommendations() {
    try {
        // In a real implementation, this would be an API call:
        /*
        const response = await fetch(API_ENDPOINTS.getCareerRecommendations, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: getUserId(),
                profileData: getUserProfile()
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch recommendations');
        }
        
        const data = await response.json();
        
        // For each career path, fetch its associated skills
        const careerPathsWithSkills = await Promise.all(
            data.recommendations.map(async (career) => {
                const skillsResponse = await fetch(`${API_ENDPOINTS.getCareerSkills}/${career.id}`);
                if (!skillsResponse.ok) {
                    return {
                        ...career,
                        matchedSkills: ['N/A'],
                        gapSkills: ['N/A']
                    };
                }
                
                const skillsData = await skillsResponse.json();
                return {
                    ...career,
                    matchedSkills: skillsData.matchedSkills || ['N/A'],
                    gapSkills: skillsData.gapSkills || ['N/A']
                };
            })
        );
        
        displayCareerRecommendations(careerPathsWithSkills);
        updateProfileMatchStats(data.profileStats);
        */
        
        // Log API endpoints for reference
        console.log(`Career recommendations API endpoint: ${API_ENDPOINTS.getCareerRecommendations}`);
        console.log(`Career skills API endpoint: ${API_ENDPOINTS.getCareerSkills}/{career_id}`);
        
        // For now, display placeholder content
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
        
        // Update profile match stats
        updateProfileMatchStats({
            matchingSkills: 'N/A',
            yearsExperience: 'N/A',
            industryMatches: 'N/A'
        });
        
        // Display placeholder career recommendations
        displayCareerRecommendations([
            {
                id: 'career-path-1',
                title: 'N/A',
                subtitle: 'N/A',
                matchScore: 'N/A',
                salaryRange: { min: 'N/A', max: 'N/A' },
                growthPotential: 'N/A',
                currentDemand: 'N/A',
                matchedSkills: ['N/A', 'N/A', 'N/A'],
                gapSkills: ['N/A']
            },
            {
                id: 'career-path-2',
                title: 'N/A',
                subtitle: 'N/A',
                matchScore: 'N/A',
                salaryRange: { min: 'N/A', max: 'N/A' },
                growthPotential: 'N/A',
                currentDemand: 'N/A',
                matchedSkills: ['N/A', 'N/A', 'N/A'],
                gapSkills: ['N/A']
            },
            {
                id: 'career-path-3',
                title: 'N/A',
                subtitle: 'N/A',
                matchScore: 'N/A',
                salaryRange: { min: 'N/A', max: 'N/A' },
                growthPotential: 'N/A',
                currentDemand: 'N/A',
                matchedSkills: ['N/A', 'N/A', 'N/A'],
                gapSkills: ['N/A']
            }
        ]);
    } catch (error) {
        console.error('Error loading career recommendations:', error);
        showNotification('Error loading career recommendations', 'error');
        displayFallbackContent();
    }
}

// Load additional career paths
async function loadAdditionalCareerPaths() {
    try {
        // In a real implementation, this would be an API call:
        /*
        const response = await fetch(API_ENDPOINTS.getMoreCareerPaths, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch additional career paths');
        }
        
        const data = await response.json();
        displayAdditionalCareers(data.careers);
        */
        
        console.log(`Additional career paths API endpoint: ${API_ENDPOINTS.getMoreCareerPaths}`);
        
        // For now, display placeholder content
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
        
        displayAdditionalCareers([
            {
                id: 'additional-path-1',
                title: 'N/A',
                matchScore: 'N/A',
                salary: { min: 'N/A', max: 'N/A' },
                demand: 'N/A'
            },
            {
                id: 'additional-path-2',
                title: 'N/A',
                matchScore: 'N/A',
                salary: { min: 'N/A', max: 'N/A' },
                demand: 'N/A'
            },
            {
                id: 'additional-path-3',
                title: 'N/A',
                matchScore: 'N/A',
                salary: { min: 'N/A', max: 'N/A' },
                demand: 'N/A'
            },
            {
                id: 'additional-path-4',
                title: 'N/A',
                matchScore: 'N/A',
                salary: { min: 'N/A', max: 'N/A' },
                demand: 'N/A'
            }
        ]);
    } catch (error) {
        console.error('Error loading additional career paths:', error);
        showNotification('Error loading additional career paths', 'error');
        displayAdditionalCareers([]);
    }
}

// Load career development tips
async function loadCareerTips() {
    try {
        // In a real implementation, this would be an API call:
        /*
        const response = await fetch(API_ENDPOINTS.getCareerTips, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch career tips');
        }
        
        const data = await response.json();
        displayCareerTips(data.tips);
        */
        
        console.log(`Career tips API endpoint: ${API_ENDPOINTS.getCareerTips}`);
        
        // For now, display placeholder content
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
        
        displayCareerTips([
            {
                icon: '📚',
                title: 'N/A',
                description: 'N/A'
            },
            {
                icon: '🌐',
                title: 'N/A',
                description: 'N/A'
            },
            {
                icon: '💼',
                title: 'N/A',
                description: 'N/A'
            }
        ]);
    } catch (error) {
        console.error('Error loading career tips:', error);
        displayCareerTips([]);
    }
}

// Display fallback content when API data is not available
function displayFallbackContent() {
    // Update profile match summary with placeholder data
    updateProfileMatchStats({
        matchingSkills: 'N/A',
        yearsExperience: 'N/A',
        industryMatches: 'N/A'
    });
    
    // Display placeholder career recommendations
    displayCareerRecommendations([
        {
            id: 'career-path-1',
            title: 'N/A',
            subtitle: 'N/A',
            matchScore: 'N/A',
            salaryRange: { min: 'N/A', max: 'N/A' },
            growthPotential: 'N/A',
            currentDemand: 'N/A',
            matchedSkills: ['N/A', 'N/A', 'N/A'],
            gapSkills: ['N/A']
        },
        {
            id: 'career-path-2',
            title: 'N/A',
            subtitle: 'N/A',
            matchScore: 'N/A',
            salaryRange: { min: 'N/A', max: 'N/A' },
            growthPotential: 'N/A',
            currentDemand: 'N/A',
            matchedSkills: ['N/A', 'N/A', 'N/A'],
            gapSkills: ['N/A']
        },
        {
            id: 'career-path-3',
            title: 'N/A',
            subtitle: 'N/A',
            matchScore: 'N/A',
            salaryRange: { min: 'N/A', max: 'N/A' },
            growthPotential: 'N/A',
            currentDemand: 'N/A',
            matchedSkills: ['N/A', 'N/A', 'N/A'],
            gapSkills: ['N/A']
        }
    ]);
    
    // Display placeholder additional careers
    displayAdditionalCareers([
        {
            id: 'additional-path-1',
            title: 'N/A',
            matchScore: 'N/A',
            salary: { min: 'N/A', max: 'N/A' },
            demand: 'N/A'
        },
        {
            id: 'additional-path-2',
            title: 'N/A',
            matchScore: 'N/A',
            salary: { min: 'N/A', max: 'N/A' },
            demand: 'N/A'
        },
        {
            id: 'additional-path-3',
            title: 'N/A',
            matchScore: 'N/A',
            salary: { min: 'N/A', max: 'N/A' },
            demand: 'N/A'
        },
        {
            id: 'additional-path-4',
            title: 'N/A',
            matchScore: 'N/A',
            salary: { min: 'N/A', max: 'N/A' },
            demand: 'N/A'
        }
    ]);
    
    // Display placeholder career tips
    displayCareerTips([
        {
            icon: '📚',
            title: 'N/A',
            description: 'N/A'
        },
        {
            icon: '🌐',
            title: 'N/A',
            description: 'N/A'
        },
        {
            icon: '💼',
            title: 'N/A',
            description: 'N/A'
        }
    ]);
}

// Update profile match statistics
function updateProfileMatchStats(stats) {
    const matchingSkills = document.querySelector('.stat-item:nth-child(1) .stat-value');
    const yearsExperience = document.querySelector('.stat-item:nth-child(2) .stat-value');
    const industryMatches = document.querySelector('.stat-item:nth-child(3) .stat-value');
    
    if (matchingSkills) matchingSkills.textContent = stats.matchingSkills;
    if (yearsExperience) yearsExperience.textContent = stats.yearsExperience;
    if (industryMatches) industryMatches.textContent = stats.industryMatches;
}

// Display career recommendations
function displayCareerRecommendations(careers) {
    const careerCardsContainer = document.querySelector('.career-cards');
    if (!careerCardsContainer) return;
    
    careerCardsContainer.innerHTML = careers.map(career => `
        <div class="career-card">
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
                            <div class="detail-value">$${career.salaryRange.min} - $${career.salaryRange.max}</div>
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
                <button class="view-details-btn" onclick="viewCareerDetails('${career.id}')">
                    View Details
                </button>
                <button class="save-career-btn" onclick="saveCareerPath('${career.id}')">
                    Save Path
                </button>
            </div>
        </div>
    `).join('');
}

// Function to display additional career recommendations
function displayAdditionalCareers(careers) {
    const additionalCareersContainer = document.querySelector('.recommendation-grid');
    if (!additionalCareersContainer) return;
    
    additionalCareersContainer.innerHTML = careers.map(career => `
        <div class="mini-career-card">
            <div class="mini-card-header">
                <span class="mini-match">${career.matchScore}%</span>
                <h4>${career.title}</h4>
            </div>
            <div class="mini-card-content">
                <div class="mini-detail">
                    <span class="mini-label">Salary:</span>
                    <span class="mini-value">$${career.salary.min} - $${career.salary.max}</span>
                </div>
                <div class="mini-detail">
                    <span class="mini-label">Demand:</span>
                    <span class="mini-value">${career.demand}</span>
                </div>
            </div>
            <button class="mini-view-btn" onclick="viewCareerDetails('${career.id}')">View Details</button>
        </div>
    `).join('');
}

// Display career development tips
function displayCareerTips(tips) {
    const tipsContainer = document.querySelector('.tip-cards');
    if (!tipsContainer) return;
    
    tipsContainer.innerHTML = tips.map(tip => `
        <div class="tip-card">
            <div class="tip-icon">${tip.icon}</div>
            <h4>${tip.title}</h4>
            <p>${tip.description}</p>
        </div>
    `).join('');
}

// View career details
async function viewCareerDetails(careerId) {
    try {
        // In a real implementation, this would be an API call:
        /*
        const response = await fetch(`${API_ENDPOINTS.getCareerDetails}/${careerId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch career details');
        }
        const data = await response.json();
        */
        
        showNotification('Loading career details...', 'success');
        console.log(`API endpoint to call: ${API_ENDPOINTS.getCareerDetails}/${careerId}`);
        // Would normally navigate to detail page:
        // window.location.href = `career-details.html?id=${careerId}`;
    } catch (error) {
        console.error('Error viewing career details:', error);
        showNotification('Error loading career details', 'error');
    }
}

// Save career path
async function saveCareerPath(careerId) {
    try {
        // In a real implementation, this would be an API call:
        /*
        const response = await fetch(API_ENDPOINTS.saveCareerPath, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: getUserId(),
                careerId: careerId
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to save career path');
        }
        */
        
        showNotification('Career path saved successfully!', 'success');
        console.log(`API endpoint to call: ${API_ENDPOINTS.saveCareerPath} with career ID: ${careerId}`);
    } catch (error) {
        console.error('Error saving career path:', error);
        showNotification('Error saving career path', 'error');
    }
}

// Utility to show notifications
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