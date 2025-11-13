<<<<<<< HEAD
import { register } from './authModule.js';

// Handle form submission
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
=======
// Function to hash password (same as in authModule.js)
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
    }
    return hash.toString(16);
}

// Handle form submission
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value;
>>>>>>> a380d625c488eb8fe1868308530a9783db0eba5c
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate input
<<<<<<< HEAD
    if (!username || !email || !password || !confirmPassword) {
=======
    if (!username || !password || !confirmPassword) {
>>>>>>> a380d625c488eb8fe1868308530a9783db0eba5c
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
    }
    
<<<<<<< HEAD
    try {
        const result = await register(username, email, password);
        if (result.success) {
            alert('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
            window.location.href = 'index.html';
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Có lỗi xảy ra trong quá trình đăng ký!');
    }
=======
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.username === username)) {
        alert('Tên đăng nhập đã tồn tại!');
        return;
    }
    
    // Add new user
    users.push({ username, password: simpleHash(password) });
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
    window.location.href = 'index.html';
>>>>>>> a380d625c488eb8fe1868308530a9783db0eba5c
});

// Handle back to login button
document.getElementById('backToLoginBtn').addEventListener('click', function() {
    window.location.href = 'index.html';
});

// Add hover effects to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
        });
    });
});