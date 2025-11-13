import { register } from './authModule.js';

// Handle form submission
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate input
    if (!username || !email || !password || !confirmPassword) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
    }
    
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