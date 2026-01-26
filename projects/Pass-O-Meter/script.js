/**
 * Pass-O-Meter Logic
 * Calculates password entropy and estimates crack time based on brute force speeds.
 */

// DOM Elements
const input = document.getElementById('password-input');
const toggleBtn = document.getElementById('toggle-visibility');
const bar = document.getElementById('strength-bar');
const text = document.getElementById('strength-text');
const entropyVal = document.getElementById('entropy-val');
const crackTime = document.getElementById('crack-time');
const shield = document.getElementById('shield-icon');
const shieldWrapper = document.querySelector('.icon-wrapper');

const reqs = {
    len: document.getElementById('req-len'),
    up: document.getElementById('req-up'),
    low: document.getElementById('req-low'),
    num: document.getElementById('req-num'),
    sym: document.getElementById('req-sym')
};

// Configuration
// Assume a modern GPU rig can do ~10 billion hashes/second (10^10)
const HASHES_PER_SECOND = 10_000_000_000; 

toggleBtn.addEventListener('click', () => {
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    toggleBtn.querySelector('i').className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
});

input.addEventListener('input', analyzePassword);

function analyzePassword() {
    const pwd = input.value;
    const len = pwd.length;

    // 1. Update Requirements List
    const hasUp = /[A-Z]/.test(pwd);
    const hasLow = /[a-z]/.test(pwd);
    const hasNum = /[0-9]/.test(pwd);
    const hasSym = /[^A-Za-z0-9]/.test(pwd);

    updateReq(reqs.len, len >= 8);
    updateReq(reqs.up, hasUp);
    updateReq(reqs.low, hasLow);
    updateReq(reqs.num, hasNum);
    updateReq(reqs.sym, hasSym);

    // 2. Calculate Entropy
    // E = L * log2(R)
    let poolSize = 0;
    if (hasLow) poolSize += 26;
    if (hasUp) poolSize += 26;
    if (hasNum) poolSize += 10;
    if (hasSym) poolSize += 32;

    if (pwd.length === 0) poolSize = 0;

    // Entropy calculation
    const entropy = len * Math.log2(poolSize || 1); 
    
    // 3. Estimate Crack Time
    // Seconds = 2^Entropy / HashRate
    const seconds = Math.pow(2, entropy) / HASHES_PER_SECOND;

    // 4. Update UI
    entropyVal.innerText = `${Math.floor(entropy)} bits`;
    crackTime.innerText = formatTime(seconds);
    updateMeter(entropy);
}

function updateReq(el, isValid) {
    if (isValid) el.classList.add('valid');
    else el.classList.remove('valid');
}

function updateMeter(entropy) {
    let strength = 0; // 0-100
    let color = '#ff4d4f'; // Red
    let label = 'Very Weak';
    let iconClass = 'weak';

    if (entropy > 120) {
        strength = 100;
        color = '#52c41a'; // Green
        label = 'Excellent';
        iconClass = 'secure';
    } else if (entropy > 80) {
        strength = 75;
        color = '#52c41a';
        label = 'Strong';
        iconClass = 'secure';
    } else if (entropy > 50) {
        strength = 50;
        color = '#faad14'; // Orange
        label = 'Moderate';
        iconClass = '';
    } else if (entropy > 1) {
        strength = 25;
        color = '#ff4d4f';
        label = 'Weak';
        iconClass = 'weak';
    } else {
        label = 'Empty';
    }

    bar.style.width = `${strength}%`;
    bar.style.backgroundColor = color;
    text.innerText = label;
    text.style.color = color;

    // Shield Icon update
    shieldWrapper.className = `icon-wrapper ${iconClass}`;
    if (iconClass === 'secure') {
        shield.className = 'fas fa-check-circle';
    } else if (iconClass === 'weak') {
        shield.className = 'fas fa-exclamation-triangle';
    } else {
        shield.className = 'fas fa-shield-alt';
    }
}

function formatTime(seconds) {
    if (seconds <= 0) return 'Instant';
    if (seconds < 60) return 'Instant'; // < 1 min
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.floor(seconds / 86400)} days`;
    
    const years = seconds / 31536000;
    if (years < 1000) return `${Math.floor(years)} years`;
    if (years < 1_000_000) return `${Math.floor(years / 100)} centuries`;
    
    return 'Forever';
}