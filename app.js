import * as Auth from './authModule.js';
import * as EmployeeDb from './employeeDbModule.js';
import * as Department from './departmentModule.js';
import * as Position from './positionModule.js';
import * as Salary from './salaryModule.js';
import * as Attendance from './attendanceModule.js';
import * as Leave from './leaveModule.js';
import * as Performance from './performanceModule.js';
import * as DataManagement from './dataManagementModule.js';
import * as EmployeeManagement from './employeeManagementModule.js'; // New module

const modules = {
    auth: Auth,
    employeeDb: EmployeeDb,
    employeeManagement: EmployeeManagement, // New module
    department: Department,
    position: Position,
    salary: Salary,
    attendance: Attendance,
    leave: Leave,
    performance: Performance,
    dataManagement: DataManagement
};

const appContainer = document.getElementById('app');
const loginForm = document.getElementById('login-form');
const dashboard = document.getElementById('dashboard');
const menu = document.getElementById('menu');
const content = document.getElementById('content');

function initApp() {
    if (!Auth.isLoggedIn()) {
        showLogin();
    } else {
        showDashboard();
    }
}

function showLogin() {
    loginForm.style.display = 'block';
    dashboard.style.display = 'none';
    Auth.renderLoginForm(loginForm, handleLogin);
}

function handleLogin(success) {
    if (success) {
        showDashboard();
    }
}

function showDashboard() {
    loginForm.style.display = 'none';
    dashboard.style.display = 'flex';
    renderMenu();
    // Show welcome message
    content.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h2>Chào mừng đến với Hệ thống Quản lý Nhân sự</h2>
            <p style="font-size: 18px; color: #4a5568; margin-top: 20px;">
                Vui lòng chọn một chức năng từ menu bên trái để bắt đầu.
            </p>
            <div style="margin-top: 30px; font-size: 16px; color: #718096;">
                <p><strong>Hướng dẫn sử dụng:</strong></p>
                <p>• Quản lý nhân viên: Chọn "Quản lý Nhân sự"</p>
                <p>• Tìm kiếm nhân viên: Chọn "Tìm kiếm Nhân viên"</p>
                <p>• Quản lý phòng ban: Chọn "Phòng ban"</p>
                <p>• Quản lý vị trí: Chọn "Vị trí"</p>
            </div>
        </div>
    `;
}

function renderMenu() {
    menu.innerHTML = `
        <div class="menu-header">
            <h2>HRM System</h2>
            <button id="toggleMenu">×</button>
        </div>
        <ul>
            <li><button data-module="employeeManagement"><i>👥</i> <span>Quản lý Nhân sự</span></button></li>
            <li><button data-module="department"><i>🏢</i> <span>Phòng ban</span></button></li>
            <li><button data-module="position"><i>💼</i> <span>Vị trí</span></button></li>
            <li><button data-module="salary"><i>💰</i> <span>Lương</span></button></li>
            <li><button data-module="attendance"><i>⏰</i> <span>Chấm công</span></button></li>
            <li><button data-module="leave"><i>📅</i> <span>Nghỉ phép</span></button></li>
            <li><button data-module="performance"><i>📊</i> <span>Đánh giá</span></button></li>
            <li><button data-module="dataManagement"><i>💾</i> <span>Quản lý Dữ liệu</span></button></li>
            <li><button id="logoutBtn"><i>🚪</i> <span>Đăng xuất</span></button></li>
        </ul>
    `;
    
    // Add event listeners
    document.querySelectorAll('#menu button[data-module]').forEach(button => {
        button.addEventListener('click', () => {
            loadModule(button.dataset.module);
        });
    });
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        Auth.logout();
        initApp();
    });
    
    // Add toggle menu functionality
    document.getElementById('toggleMenu').addEventListener('click', toggleMenu);
}

function toggleMenu() {
    if (menu.classList.contains('collapsed')) {
        menu.classList.remove('collapsed');
        document.getElementById('toggleMenu').textContent = '×';
    } else {
        menu.classList.add('collapsed');
        document.getElementById('toggleMenu').textContent = '☰';
    }
}

function loadModule(moduleName) {
    content.innerHTML = '<div style="text-align: center; padding: 20px;">Đang tải...</div>';
    
    // Add slight delay to show loading state
    setTimeout(() => {
        // Use initModule if available, otherwise use init
        if (modules[moduleName] && typeof modules[moduleName].initModule === 'function') {
            modules[moduleName].initModule(content);
        } else if (modules[moduleName] && typeof modules[moduleName].init === 'function') {
            modules[moduleName].init(content);
        } else {
            content.innerHTML = `<p>Module "${moduleName}" chưa được triển khai.</p>`;
        }
    }, 300);
}

// Make global functions for inline event handlers
window.deletePosition = function(id) {
    if (confirm('Bạn có chắc chắn muốn xóa vị trí này?')) {
        Position.deletePosition(id);
        // Refresh the current module
        loadModule('position');
    }
};

window.deleteDepartment = function(id) {
    if (confirm('Bạn có chắc chắn muốn xóa phòng ban này?')) {
        Department.deleteDepartment(id);
        // Refresh the current module
        loadModule('department');
    }
};

// Initialize the app
initApp();