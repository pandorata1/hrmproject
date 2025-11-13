<<<<<<< HEAD
// API base URL - sử dụng URL tương đối cho máy chủ PHP tích hợp
const API_BASE_URL = 'backend/api.php';

=======
>>>>>>> a380d625c488eb8fe1868308530a9783db0eba5c
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
<<<<<<< HEAD
    try {
        // Sử dụng URL trực tiếp đến api.php với endpoint trong query parameter
        const baseUrl = window.location.origin;
        const response = await fetch(`${baseUrl}/backend/api.php?endpoint=login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            const result = await response.json();
            localStorage.setItem('sessionToken', 'loggedIn');
            return true;
        } else {
            const error = await response.json();
            alert(error.error || 'Tên đăng nhập hoặc mật khẩu không đúng!');
            return false;
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Có lỗi xảy ra trong quá trình đăng nhập!');
        return false;
    }
}

export async function register(username, email, password) {
    try {
        // Debug: Log the data being sent
        console.log('Registering with data:', { username, email, password });
        
        // Sử dụng URL trực tiếp đến api.php với endpoint trong query parameter
        const baseUrl = window.location.origin;
        const fullUrl = `${baseUrl}/backend/api.php?endpoint=register`;
        console.log('Full URL:', fullUrl);
        
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', [...response.headers.entries()]);
        
        if (response.ok) {
            const result = await response.json();
            return { success: true, message: result.message };
        } else {
            const errorText = await response.text();
            console.log('Error response text:', errorText);
            
            try {
                const error = JSON.parse(errorText);
                return { success: false, message: error.error || 'Registration failed' };
            } catch (e) {
                return { success: false, message: 'Registration failed: ' + errorText };
            }
        }
    } catch (error) {
        console.error('Error during registration:', error);
        return { success: false, message: 'Có lỗi xảy ra trong quá trình đăng ký!' };
    }
=======
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
>>>>>>> a380d625c488eb8fe1868308530a9783db0eba5c
}

async function simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 500));
}