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

// Page state to prevent duplicate renderings
const pageState = {
    isLoading: true,
    recommendationsLoaded: false,
    additionalPathsLoaded: false,
    tipsLoaded: false,
    fallbackDisplayed: false,
    user: null
};

// Document ready function
document.addEventListener('DOMContentLoaded', () => {
    initializeRecommendationsPage();
    
    // Add event listeners for buttons to avoid inline onclick attributes
    setupEventListeners();
});

// Setup event listeners for buttons
function setupEventListeners() {
    // Generic delegate event listener for all buttons
    document.body.addEventListener('click', (event) => {
        const target = event.target;
        
        // View details buttons
        if (target.classList.contains('view-details-btn') || target.classList.contains('mini-view-btn')) {
            const careerIdAttribute = target.getAttribute('data-career-id');
            if (careerIdAttribute) {
                viewCareerDetails(careerIdAttribute);
                event.preventDefault();
            }
        }
        
        // Save career path buttons
        if (target.classList.contains('save-career-btn')) {
            const careerIdAttribute = target.getAttribute('data-career-id');
            if (careerIdAttribute) {
                saveCareerPath(careerIdAttribute);
                event.preventDefault();
            }
        }
        
        // Logout button
        if (target.classList.contains('logout-btn')) {
            handleLogout();
            event.preventDefault();
        }
    });
}

// Page initialization
async function initializeRecommendationsPage() {
    try {
        // Show loading state
        setLoadingState(true);
        
        // Check if user is logged in and profile is complete
        const isAuthenticated = checkUserAuthentication();
        if (!isAuthenticated) {
            return; // Stop initialization if not authenticated
        }
        
        // Load user info
        loadUserInfo();
        
        // Load all page data in parallel
        await Promise.allSettled([
            loadCareerRecommendations(),
            loadAdditionalCareerPaths(),
            loadCareerTips()
        ]);
        
        // If any of the sections failed to load, check if we need fallback content
        if (!pageState.recommendationsLoaded || !pageState.additionalPathsLoaded || !pageState.tipsLoaded) {
            if (!pageState.fallbackDisplayed) {
                displayFallbackContent();
            }
        }
    } catch (error) {
        console.error('Error initializing recommendations page:', error);
        showNotification('Error loading recommendations', 'error');
        
        if (!pageState.fallbackDisplayed) {
            displayFallbackContent();
        }
    } finally {
        setLoadingState(false);
    }
}

// Set loading state
function setLoadingState(isLoading) {
    pageState.isLoading = isLoading;
    
    // Here you could update UI to show loading indicators
    // For example: document.body.classList.toggle('loading', isLoading);
}

// Check if user is logged in and profile is complete
function checkUserAuthentication() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    
    pageState.user = user;
    
    if (!user) {
        window.location.href = 'index.html';
        return false;
    }
    
    if (!userProfile || !userProfile.metadata || !userProfile.metadata.isComplete) {
        showNotification('Please complete your profile first', 'warning');
        // We'll still show the page but with placeholder content
    }
    
    return true;
}

// Load user info
function loadUserInfo() {
    const user = pageState.user;
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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
                userId: pageState.user?.id,
                profileData: JSON.parse(localStorage.getItem('userProfile') || '{}')
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch recommendations');
        }
        
        const data = await response.json();
        
        // For each career path, fetch its associated skills
        const careerPathsWithSkills = await Promise.all(
            data.recommendations.map(async (career) => {
                const skillsResponse = await fetch(`${API_ENDPOINTS.getCareerSkills}/${career.id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
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
            matchingSkills: 24,
            yearsExperience: 3,
            industryMatches: 8
        });
        
        // Display placeholder career recommendations
        displayCareerRecommendations([
            {
                id: 'data-scientist',
                title: 'Data Scientist',
                subtitle: 'AI & Machine Learning Focus',
                matchScore: '95',
                salaryRange: { min: '95K', max: '150K' },
                growthPotential: 'High',
                currentDemand: 'Very High',
                matchedSkills: ['Python', 'Machine Learning', 'Data Analysis'],
                gapSkills: ['Deep Learning']
            },
            {
                id: 'cloud-architect',
                title: 'Cloud Solutions Architect',
                subtitle: 'Enterprise Infrastructure',
                matchScore: '88',
                salaryRange: { min: '110K', max: '180K' },
                growthPotential: 'Very High',
                currentDemand: 'High',
                matchedSkills: ['AWS', 'Cloud Architecture', 'DevOps'],
                gapSkills: ['Kubernetes']
            },
            {
                id: 'full-stack',
                title: 'Full Stack Developer',
                subtitle: 'Modern Web Technologies',
                matchScore: '85',
                salaryRange: { min: '85K', max: '140K' },
                growthPotential: 'High',
                currentDemand: 'Very High',
                matchedSkills: ['JavaScript', 'React', 'Node.js'],
                gapSkills: ['GraphQL']
            }
        ]);
        
        pageState.recommendationsLoaded = true;
    } catch (error) {
        console.error('Error loading career recommendations:', error);
        showNotification('Error loading career recommendations', 'error');
        pageState.recommendationsLoaded = false;
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
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
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
                id: 'ml-engineer',
                title: 'Machine Learning Engineer',
                matchScore: '79',
                salary: { min: '105K', max: '170K' },
                demand: 'High'
            },
            {
                id: 'devops-engineer',
                title: 'DevOps Engineer',
                matchScore: '76',
                salary: { min: '95K', max: '160K' },
                demand: 'Very High'
            },
            {
                id: 'mobile-developer',
                title: 'Mobile App Developer',
                matchScore: '72',
                salary: { min: '80K', max: '140K' },
                demand: 'High'
            },
            {
                id: 'security-engineer',
                title: 'Security Engineer',
                matchScore: '68',
                salary: { min: '90K', max: '150K' },
                demand: 'High'
            }
        ]);
        
        pageState.additionalPathsLoaded = true;
    } catch (error) {
        console.error('Error loading additional career paths:', error);
        showNotification('Error loading additional career paths', 'error');
        pageState.additionalPathsLoaded = false;
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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
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
                title: 'Continuous Learning',
                description: 'Set aside time each week to learn new skills and stay updated with industry trends.'
            },
            {
                icon: '🌐',
                title: 'Build Your Network',
                description: 'Join professional communities and attend industry events to expand your connections.'
            },
            {
                icon: '💼',
                title: 'Portfolio Development',
                description: 'Create personal projects to demonstrate your skills and problem-solving abilities.'
            }
        ]);
        
        pageState.tipsLoaded = true;
    } catch (error) {
        console.error('Error loading career tips:', error);
        showNotification('Error loading career tips', 'error');
        pageState.tipsLoaded = false;
    }
}

// Display fallback content when API data is not available
function displayFallbackContent() {
    // Set flag to avoid duplicate fallback rendering
    if (pageState.fallbackDisplayed) {
        return;
    }
    
    pageState.fallbackDisplayed = true;
    
    // Update profile match summary with placeholder data
    if (!pageState.recommendationsLoaded) {
        updateProfileMatchStats({
            matchingSkills: 'N/A',
            yearsExperience: 'N/A',
            industryMatches: 'N/A'
        });
        
        // Display placeholder career recommendations
        displayCareerRecommendations([
            {
                id: 'career-path-1',
                title: 'Data Scientist',
                subtitle: 'AI & Machine Learning Focus',
                matchScore: 'N/A',
                salaryRange: { min: 'N/A', max: 'N/A' },
                growthPotential: 'N/A',
                currentDemand: 'N/A',
                matchedSkills: ['Python', 'Machine Learning', 'Data Analysis'],
                gapSkills: ['Deep Learning']
            },
            {
                id: 'career-path-2',
                title: 'Cloud Solutions Architect',
                subtitle: 'Enterprise Infrastructure',
                matchScore: 'N/A',
                salaryRange: { min: 'N/A', max: 'N/A' },
                growthPotential: 'N/A',
                currentDemand: 'N/A',
                matchedSkills: ['AWS', 'Cloud Architecture', 'DevOps'],
                gapSkills: ['Kubernetes']
            },
            {
                id: 'career-path-3',
                title: 'Full Stack Developer',
                subtitle: 'Modern Web Technologies',
                matchScore: 'N/A',
                salaryRange: { min: 'N/A', max: 'N/A' },
                growthPotential: 'N/A',
                currentDemand: 'N/A',
                matchedSkills: ['JavaScript', 'React', 'Node.js'],
                gapSkills: ['GraphQL']
            }
        ]);
    }
    
    // Display placeholder additional careers
    if (!pageState.additionalPathsLoaded) {
        displayAdditionalCareers([
            {
                id: 'ml-engineer',
                title: 'Machine Learning Engineer',
                matchScore: 'N/A',
                salary: { min: 'N/A', max: 'N/A' },
                demand: 'N/A'
            },
            {
                id: 'devops-engineer',
                title: 'DevOps Engineer',
                matchScore: 'N/A',
                salary: { min: 'N/A', max: 'N/A' },
                demand: 'N/A'
            },
            {
                id: 'mobile-developer',
                title: 'Mobile App Developer',
                matchScore: 'N/A',
                salary: { min: 'N/A', max: 'N/A' },
                demand: 'N/A'
            },
            {
                id: 'security-engineer',
                title: 'Security Engineer',
                matchScore: 'N/A',
                salary: { min: 'N/A', max: 'N/A' },
                demand: 'N/A'
            }
        ]);
    }
    
    // Display placeholder career tips
    if (!pageState.tipsLoaded) {
        displayCareerTips([
            {
                icon: '📚',
                title: 'Continuous Learning',
                description: 'Set aside time each week to learn new skills and stay updated with industry trends.'
            },
            {
                icon: '🌐',
                title: 'Build Your Network',
                description: 'Join professional communities and attend industry events to expand your connections.'
            },
            {
                icon: '💼',
                title: 'Portfolio Development',
                description: 'Create personal projects to demonstrate your skills and problem-solving abilities.'
            }
        ]);
    }
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
                <button class="view-details-btn" data-career-id="${career.id}">
                    View Details
                </button>
                <button class="save-career-btn" data-career-id="${career.id}">
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
            <button class="mini-view-btn" data-career-id="${career.id}">View Details</button>
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
        const response = await fetch(`${API_ENDPOINTS.getCareerDetails}/${careerId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
                userId: pageState.user?.id,
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
    
    // Clear any existing timeout
    if (notification.timeoutId) {
        clearTimeout(notification.timeoutId);
    }
    
    // Set new timeout
    notification.timeoutId = setTimeout(() => {
        notification.className = 'notification hidden';
    }, 3000);
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('authToken');
    window.location.href = 'index.html';
}