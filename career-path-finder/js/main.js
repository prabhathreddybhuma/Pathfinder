// Screen management with animations
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        if (screen.id !== screenId + '-screen') {
            screen.classList.add('hidden');
        }
    });
    
    // Show requested screen
    const targetScreen = document.getElementById(`${screenId}-screen`);
    targetScreen.style.transform = 'translateX(100%)';
    
    // Trigger reflow
    targetScreen.offsetHeight;
    
    targetScreen.classList.remove('hidden');
    targetScreen.style.transform = 'translateX(0)';
}

// Form handling
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Add loading state
    const button = event.target.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Loading...';
    
    // Simulate API call
    setTimeout(() => {
        console.log('Login attempt:', { email, password });
        button.textContent = originalText;
        window.location.href = 'recommendations.html';
    }, 1500);
}

function handleSignup(event) {
    event.preventDefault();
    
    const email = document.getElementById('signup-email').value;
    const username = document.getElementById('signup-username').value;
    const fullName = document.getElementById('signup-fullname').value;
    const password = document.getElementById('signup-password').value;
    
    // Add loading state
    const button = event.target.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Creating account...';
    
    // Simulate API call
    setTimeout(() => {
        console.log('Signup attempt:', { email, username, fullName, password });
        button.textContent = originalText;
        window.location.href = 'recommendations.html';
    }, 1500);
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    showScreen('splash');
});