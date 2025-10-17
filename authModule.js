export function isLoggedIn() {
    return !!localStorage.getItem('sessionToken');
}

export function logout() {
    localStorage.removeItem('sessionToken');
}

export function renderLoginForm(container, onLogin) {
    container.innerHTML = `
        <div style="text-align: center;">
            <h2>Đăng nhập Hệ thống HRM</h2>
            <p style="color: #718096; margin-bottom: 30px;">Vui lòng nhập thông tin đăng nhập</p>
            <form id="loginForm">
                <div style="margin-bottom: 20px;">
                    <input type="text" id="username" placeholder="Tên đăng nhập" required style="width: 100%;">
                </div>
                <div style="margin-bottom: 25px;">
                    <input type="password" id="password" placeholder="Mật khẩu" required style="width: 100%;">
                </div>
                <button type="submit" style="width: 100%;">Đăng nhập</button>
                <button type="button" id="registerBtn" style="width: 100%; margin-top: 15px; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%) !important;">Đăng ký tài khoản mới</button>
            </form>
        </div>
    `;

    const form = document.getElementById('loginForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const success = await login(username, password);
        onLogin(success);
    });

    document.getElementById('registerBtn').addEventListener('click', () => {
        window.location.href = 'register.html';
    });
}

async function login(username, password) {
    await simulateDelay();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === simpleHash(password));
    if (user) {
        localStorage.setItem('sessionToken', 'loggedIn');
        return true;
    }
    alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    return false;
}

function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
    }
    return hash.toString(16);
}

async function simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 500));
}