    (function() {
    document.addEventListener('DOMContentLoaded', () => {
        const validEmails = [
            'dani@farmesilla.com',
            'chef@farmesilla.com',
            'rose@farmesilla.com',
            'luly@farmesilla.com',
            'jackie@farmesilla.com',
            'manager@farmesilla.com',
            'nic@blacnova.net'
        ];

        // Check if user is already authenticated
        if (localStorage.getItem('authenticated') === 'true') {
            const rememberedEmail = localStorage.getItem('rememberedEmail');
            const rememberedPasscode = localStorage.getItem('rememberedPasscode');
            if (rememberedEmail && rememberedPasscode && validEmails.includes(rememberedEmail)) {
                fetch('https://nicholasxdavis.github.io/CateringSystem/contents/codes.json?t=' + new Date().getTime())
                    .then(response => response.json())
                    .then(data => {
                        const account = data.accounts.find(acc => acc.email === rememberedEmail);
                        if (account && account.passcode === rememberedPasscode) {
                            return; // Skip auth overlay if valid
                        }
                        setupAuthOverlay();
                    })
                    .catch(() => setupAuthOverlay());
                return;
            }
        }

        function setupAuthOverlay() {
            // Create auth overlay
            const authOverlay = document.createElement('div');
            authOverlay.id = 'auth-overlay';
            authOverlay.className = 'fixed inset-0 bg-[#1a1a1a]/96 flex items-center justify-center z-[2000] backdrop-blur overflow-hidden';
            authOverlay.innerHTML = `
                <div class="password-box bg-white rounded-3xl p-8 w-full max-w-md shadow-card">
                    <div class="text-center mb-6">
                        <h2 class="text-2xl font-medium text-dark mb-1">FARMesilla Log In</h2>
                        <p class="text-gray-600 text-sm">Enter credentials to continue</p>
                    </div>
                    <div id="email-form" class="space-y-4">
                        <div>
                            <label for="email-input" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" id="email-input" class="w-full px-3 py-2 border border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Enter your email" required>
                        </div>
                        <button id="email-submit" class="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 rounded-3xl shadow-button hover:shadow-button-hover transition-all">Next</button>
                        <p id="email-error" class="text-red-500 text-sm hidden">Invalid email address</p>
                        <div class="text-center">
                            <a href="https://www.blacnova.net/#contact" class="text-sm text-primary hover:text-primary-dark">Forgot Password?</a>
                        </div>
                    </div>
                    <div id="passcode-form" class="space-y-4 hidden">
                        <div>
                            <label for="passcode-input" class="block text-sm font-medium text-gray-700 mb-1">Passcode</label>
                            <input type="password" id="passcode-input" class="w-full px-3 py-2 border border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Enter passcode" readonly>
                        </div>
                        <div class="grid grid-cols-3 gap-1 max-w-[200px] mx-auto">
                            <button class="numpad-btn bg-gray-100 hover:bg-gray-200 text-dark font-medium w-10 h-10 rounded-full transition-colors flex items-center justify-center">1</button>
                            <button class="numpad-btn bg-gray-100 hover:bg-gray-200 text-dark font-medium w-10 h-10 rounded-full transition-colors flex items-center justify-center">2</button>
                            <button class="numpad-btn bg-gray-100 hover:bg-gray-200 text-dark font-medium w-10 h-10 rounded-full transition-colors flex items-center justify-center">3</button>
                            <button class="numpad-btn bg-gray-100 hover:bg-gray-200 text-dark font-medium w-10 h-10 rounded-full transition-colors flex items-center justify-center">4</button>
                            <button class="numpad-btn bg-gray-100 hover:bg-gray-200 text-dark font-medium w-10 h-10 rounded-full transition-colors flex items-center justify-center">5</button>
                            <button class="numpad-btn bg-gray-100 hover:bg-gray-200 text-dark font-medium w-10 h-10 rounded-full transition-colors flex items-center justify-center">6</button>
                            <button class="numpad-btn bg-gray-100 hover:bg-gray-200 text-dark font-medium w-10 h-10 rounded-full transition-colors flex items-center justify-center">7</button>
                            <button class="numpad-btn bg-gray-100 hover:bg-gray-200 text-dark font-medium w-10 h-10 rounded-full transition-colors flex items-center justify-center">8</button>
                            <button class="numpad-btn bg-gray-100 hover:bg-gray-200 text-dark font-medium w-10 h-10 rounded-full transition-colors flex items-center justify-center">9</button>
                            <button class="numpad-btn bg-gray-100 hover:bg-gray-200 text-dark font-medium w-10 h-10 rounded-full transition-colors flex items-center justify-center">0</button>
                            <button class="numpad-btn bg-gray-100 hover:bg-gray-200 text-dark font-medium h-10 rounded-full transition-colors flex items-center justify-center col-span-2">Clear</button>
                        </div>
                        <button id="passcode-submit" class="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 rounded-3xl shadow-button hover:shadow-button-hover transition-all">Log In</button>
                        <p id="passcode-error" class="text-red-500 text-sm hidden">Invalid passcode</p>
                    </div>
                    <div class="mt-6 text-center text-xs text-gray-500">
                        Unauthorized use is unlawful and prohibited
                    </div>
                </div>
            `;
            document.body.appendChild(authOverlay);

            // Security setup
            document.body.classList.add('password-protected');
            const scrollEvents = ['wheel', 'touchmove', 'scroll'];
            const preventDefaultScroll = function(e) {
                if (!e.target.matches('input, textarea, select, button')) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            };
            scrollEvents.forEach(event => {
                document.addEventListener(event, preventDefaultScroll, {passive: false});
            });

            // Mutation observer for tampering protection
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (!document.body.contains(authOverlay) && authOverlay.style.display !== 'none') {
                        document.body.innerHTML = `
                            <div style="display:flex; justify-content:center; align-items:center; height:100vh; background:#171717; color:white; font-family:sans-serif; text-align:center; padding:20px;">
                                <div>
                                    <h1 style="color:#ef4444; margin-bottom:20px;">Security Violation Detected</h1>
                                    <p>Unauthorized access attempt logged.</p>
                                    <p style="margin-top:20px; color:#9ca3af;">Unauthorized use is unlawful and prohibited</p>
                                </div>
                            </div>
                        `;
                        document.body.style.overflow = 'hidden';
                        observer.disconnect();
                        throw new Error("Security violation detected");
                    }
                });
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });

            // Disable right-click and dev tools
            document.addEventListener('contextmenu', e => {
                if (!e.target.matches('input, textarea')) {
                    e.preventDefault();
                    showToast('Right-click disabled for security', 'error');
                }
            });
            document.addEventListener('keydown', e => {
                if (e.target.matches('input, textarea, [contenteditable]')) return;
                if (e.key === 'F12' || 
                    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                    (e.metaKey && e.altKey && e.key === 'I')) {
                    e.preventDefault();
                    showToast('Developer tools are disabled', 'error');
                }
            });

            // Form handling
            const emailForm = document.getElementById('email-form');
            const passcodeForm = document.getElementById('passcode-form');
            const emailInput = document.getElementById('email-input');
            const passcodeInput = document.getElementById('passcode-input');
            const emailSubmit = document.getElementById('email-submit');
            const passcodeSubmit = document.getElementById('passcode-submit');
            const emailError = document.getElementById('email-error');
            const passcodeError = document.getElementById('passcode-error');
            const numpadButtons = document.querySelectorAll('.numpad-btn');

            function showToast(message, type = 'error') {
                const toast = document.getElementById('toast');
                const toastMsg = document.getElementById('toast-msg');
                toastMsg.textContent = message;
                toast.innerHTML = `<i class="fas fa-exclamation-circle mr-2 text-red-400"></i><span id="toast-msg">${message}</span>`;
                toast.classList.remove('hidden');
                setTimeout(() => toast.classList.add('hidden'), 3000);
            }

            async function validatePasscode(email, passcode) {
                try {
                    const response = await fetch('https://nicholasxdavis.github.io/CateringSystem/contents/codes.json?t=' + new Date().getTime());
                    if (!response.ok) throw new Error('Failed to fetch passcodes');
                    const data = await response.json();
                    const account = data.accounts.find(acc => acc.email === email);
                    return account && account.passcode === passcode;
                } catch (error) {
                    console.error('Error validating passcode:', error);
                    showToast('Error validating passcode');
                    return false;
                }
            }

            emailSubmit.addEventListener('click', () => {
                const email = emailInput.value.trim().toLowerCase();
                if (validEmails.includes(email)) {
                    emailForm.classList.add('hidden');
                    passcodeForm.classList.remove('hidden');
                    emailError.classList.add('hidden');
                    passcodeInput.focus();
                } else {
                    emailError.classList.remove('hidden');
                    emailInput.focus();
                }
            });

            numpadButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const value = button.textContent;
                    if (value === 'Clear') {
                        passcodeInput.value = '';
                    } else {
                        passcodeInput.value += value;
                    }
                    passcodeError.classList.add('hidden');
                });
            });

            passcodeSubmit.addEventListener('click', async () => {
                const email = emailInput.value.trim().toLowerCase();
                const passcode = passcodeInput.value.trim();
                if (await validatePasscode(email, passcode)) {
                    localStorage.setItem('authenticated', 'true');
                    localStorage.setItem('rememberedEmail', email);
                    localStorage.setItem('rememberedPasscode', passcode);
                    authOverlay.style.opacity = '0';
                    setTimeout(() => {
                        authOverlay.style.display = 'none';
                        document.body.classList.remove('password-protected');
                        scrollEvents.forEach(event => {
                            document.removeEventListener(event, preventDefaultScroll, {passive: false});
                        });
                        observer.disconnect();
                    }, 300);
                } else {
                    passcodeError.classList.remove('hidden');
                    passcodeInput.value = '';
                    passcodeInput.focus();
                }
            });

            emailInput.addEventListener('keypress', e => {
                if (e.key === 'Enter') emailSubmit.click();
            });
        }

        setupAuthOverlay();
    });
})();