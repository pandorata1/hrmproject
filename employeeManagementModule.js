import * as EmployeeDb from './employeeDbModule.js';
import * as Department from './departmentModule.js';
import * as Position from './positionModule.js';

export async function initModule(container) {
    const departments = Department.getAllDepartments();
    const positions = Position.getAllPositions();
    const employees = EmployeeDb.getAllEmployees();
    
    // Set today as default date for new employees
    const today = new Date().toISOString().split('T')[0];
    
    container.innerHTML = `
        <h2>Quản lý Nhân sự</h2>
        
        <!-- Add Employee Form Toggle -->
        <button id="toggleAddForm" class="toggle-form-btn">
            <span id="toggleText">Ẩn</span> form thêm nhân viên
        </button>
        
        <!-- Add Employee Form -->
        <div id="addEmployeeSection">
            <form id="addEmployeeForm">
                <h3>Thêm Nhân viên mới</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                    <input type="text" id="name" placeholder="Tên nhân viên" required style="padding: 8px;">
                    <input type="email" id="email" placeholder="Email" required style="padding: 8px;">
                    <input type="tel" id="phone" placeholder="Số điện thoại" required style="padding: 8px;">
                    <input type="text" id="address" placeholder="Địa chỉ" required style="padding: 8px;">
                    <select id="departmentId" style="padding: 8px;">
                        <option value="">Chọn phòng ban</option>
                        ${departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                    </select>
                    <select id="positionId" style="padding: 8px;">
                        <option value="">Chọn vị trí</option>
                        ${positions.map(p => `<option value="${p.id}">${p.title}</option>`).join('')}
                    </select>
                    <input type="number" id="salary" placeholder="Lương cơ bản" required min="0" style="padding: 8px;">
                    <input type="number" id="bonus" placeholder="Thưởng" min="0" style="padding: 8px;">
                    <input type="number" id="deduction" placeholder="Khấu trừ" min="0" style="padding: 8px;">
                    <input type="date" id="hireDate" required value="${today}" style="padding: 8px;">
                </div>
                <button type="submit" style="margin-top: 10px; padding: 10px 20px;">Thêm Nhân viên</button>
            </form>
        </div>
        
        <!-- Search and Employee List -->
        <div id="employeeList">
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 15px;">
                <h3 style="margin: 0; font-size: 1.2em;">Danh sách Nhân viên (${employees.length})</h3>
                <div style="flex: 1; min-width: 200px;">
                    <input type="text" id="searchEmployee" placeholder="Tìm tên nhân viên" 
                           style="padding: 8px; border: 1px solid #e2e8f0; border-radius: 4px; width: 100%; box-sizing: border-box;">
                </div>
            </div>
            <div id="employeeTableContainer" style="max-height: 250px; overflow-y: auto;">
                ${renderEmployeeTable(employees, departments, positions)}
            </div>
        </div>
        
        <!-- Employee Detail Modal -->
        <div id="employeeModal" class="modal">
            <div class="modal-content" style="width: 95%; max-width: 500px; margin: 10px auto; padding: 15px;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="margin: 0; font-size: 1.3em;">Thông tin nhân viên</h3>
                    <button id="closeModal" class="close-modal" style="font-size: 1.5em; background: none; border: none; cursor: pointer;">&times;</button>
                </div>
                <div id="employeeDetailContent"></div>
            </div>
        </div>
    `;
    
    // Add event listeners
    document.getElementById('addEmployeeForm').addEventListener('submit', handleAddSubmit);
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('employeeModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Add search functionality
    document.getElementById('searchEmployee').addEventListener('input', handleSearch);
    
    // Add toggle functionality
    document.getElementById('toggleAddForm').addEventListener('click', toggleAddForm);
    
    // Add event listeners for action buttons
    addActionButtonListeners();
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const departments = Department.getAllDepartments();
    const positions = Position.getAllPositions();
    const allEmployees = EmployeeDb.getAllEmployees();
    
    const filteredEmployees = searchTerm 
        ? allEmployees.filter(emp => emp.name.toLowerCase().includes(searchTerm))
        : allEmployees;
    
    const tableContainer = document.getElementById('employeeTableContainer');
    tableContainer.innerHTML = renderEmployeeTable(filteredEmployees, departments, positions);
    addActionButtonListeners();
}

function clearSearch() {
    document.getElementById('searchEmployee').value = '';
    const departments = Department.getAllDepartments();
    const positions = Position.getAllPositions();
    const employees = EmployeeDb.getAllEmployees();
    
    const tableContainer = document.getElementById('employeeTableContainer');
    tableContainer.innerHTML = renderEmployeeTable(employees, departments, positions);
    addActionButtonListeners();
}

function toggleAddForm() {
    const section = document.getElementById('addEmployeeSection');
    const toggleText = document.getElementById('toggleText');
    
    if (section.style.display === 'none') {
        section.style.display = 'block';
        toggleText.textContent = 'Ẩn';
    } else {
        section.style.display = 'none';
        toggleText.textContent = 'Hiện';
    }
}

function renderEmployeeTable(employees, departments, positions) {
    if (employees.length === 0) {
        return `
            <div style="text-align: center; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <h3>Chưa có nhân viên</h3>
                <button id="showAddFormBtn" style="margin-top: 15px; padding: 10px 20px; background: #4299e1; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Thêm Nhân viên mới
                </button>
            </div>
        `;
    }
    
    return `
        <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
                <thead>
                    <tr style="background-color: #f7fafc;">
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">ID</th>
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Tên</th>
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Email</th>
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">ĐT</th>
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Phòng</th>
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Vị trí</th>
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Lương</th>
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Ngày vào</th>
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    ${employees.map(emp => {
                        const department = departments.find(d => d.id == emp.departmentId);
                        const position = positions.find(p => p.id == emp.positionId);
                        return `
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                                <td style="padding: 8px;">${emp.id}</td>
                                <td style="padding: 8px;">${emp.name}</td>
                                <td style="padding: 8px;">${emp.email || 'N/A'}</td>
                                <td style="padding: 8px;">${emp.phone || 'N/A'}</td>
                                <td style="padding: 8px;">${department ? department.name : 'N/A'}</td>
                                <td style="padding: 8px;">${position ? position.title : 'N/A'}</td>
                                <td style="padding: 8px;">${emp.salary.toLocaleString()} VNĐ</td>
                                <td style="padding: 8px;">${emp.hireDate}</td>
                                <td style="padding: 8px;">
                                    <div style="display: flex; flex-direction: column; gap: 5px;">
                                        <button class="view-btn" data-id="${emp.id}" style="padding: 5px; font-size: 0.8em; margin: 1px; background: #4299e1; color: white; border: none; border-radius: 3px;">Xem</button>
                                        <button class="edit-btn" data-id="${emp.id}" style="padding: 5px; font-size: 0.8em; margin: 1px; background: #ed8936; color: white; border: none; border-radius: 3px;">Sửa</button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Add Employee Functions
function handleAddSubmit(e) {
    e.preventDefault();
    
    const employee = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        departmentId: parseInt(document.getElementById('departmentId').value),
        positionId: parseInt(document.getElementById('positionId').value),
        salary: parseFloat(document.getElementById('salary').value),
        bonus: parseFloat(document.getElementById('bonus').value) || 0,
        deduction: parseFloat(document.getElementById('deduction').value) || 0,
        hireDate: document.getElementById('hireDate').value
    };
    
    if (validateEmployee(employee)) {
        EmployeeDb.addEmployee(employee);
        alert('Thêm nhân viên thành công!');
        e.target.reset();
        
        // Set today as default date
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('hireDate').value = today;
        
        // Refresh the employee list
        refreshEmployeeList();
    } else {
        alert('Vui lòng kiểm tra lại thông tin!');
    }
}

// View Employee Detail
function viewEmployeeDetail(employeeId) {
    const employees = EmployeeDb.getAllEmployees();
    const employee = employees.find(emp => emp.id === parseInt(employeeId));
    
    if (employee) {
        const departments = Department.getAllDepartments();
        const positions = Position.getAllPositions();
        
        const department = departments.find(d => d.id == employee.departmentId);
        const position = positions.find(p => p.id == employee.positionId);
        
        const modal = document.getElementById('employeeModal');
        const content = document.getElementById('employeeDetailContent');
        
        content.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div><strong>ID:</strong> ${employee.id}</div>
                <div><strong>Tên:</strong> ${employee.name}</div>
                <div><strong>Email:</strong> ${employee.email || 'N/A'}</div>
                <div><strong>ĐT:</strong> ${employee.phone || 'N/A'}</div>
                <div><strong>Địa chỉ:</strong> ${employee.address || 'N/A'}</div>
                <div><strong>Phòng:</strong> ${department ? department.name : 'N/A'}</div>
                <div><strong>Vị trí:</strong> ${position ? position.title : 'N/A'}</div>
                <div><strong>Lương:</strong> ${employee.salary.toLocaleString()} VNĐ</div>
                <div><strong>Thưởng:</strong> ${(employee.bonus || 0).toLocaleString()} VNĐ</div>
                <div><strong>Khấu trừ:</strong> ${(employee.deduction || 0).toLocaleString()} VNĐ</div>
                <div><strong>Ngày vào:</strong> ${employee.hireDate}</div>
            </div>
        `;
        
        modal.style.display = 'flex';
    }
}

// Edit Employee Functions
function editEmployee(employeeId) {
    const employees = EmployeeDb.getAllEmployees();
    const employee = employees.find(emp => emp.id === parseInt(employeeId));
    
    if (employee) {
        const departments = Department.getAllDepartments();
        const positions = Position.getAllPositions();
        
        const modal = document.getElementById('employeeModal');
        const content = document.getElementById('employeeDetailContent');
        
        content.innerHTML = `
            <form id="editEmployeeForm">
                <input type="hidden" id="editEmployeeId" value="${employee.id}">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-top: 10px;">
                    <input type="text" id="editName" value="${employee.name}" placeholder="Tên nhân viên" required>
                    <input type="email" id="editEmail" value="${employee.email || ''}" placeholder="Email" required>
                    <input type="tel" id="editPhone" value="${employee.phone || ''}" placeholder="Số điện thoại" required>
                    <input type="text" id="editAddress" value="${employee.address || ''}" placeholder="Địa chỉ" required>
                    <select id="editDepartmentId">
                        <option value="">Chọn phòng ban</option>
                        ${departments.map(dept => `<option value="${dept.id}" ${dept.id == employee.departmentId ? 'selected' : ''}>${dept.name}</option>`).join('')}
                    </select>
                    <select id="editPositionId">
                        <option value="">Chọn vị trí</option>
                        ${positions.map(pos => `<option value="${pos.id}" ${pos.id == employee.positionId ? 'selected' : ''}>${pos.title}</option>`).join('')}
                    </select>
                    <input type="number" id="editSalary" value="${employee.salary}" placeholder="Lương cơ bản" required min="0">
                    <input type="number" id="editBonus" value="${employee.bonus || 0}" placeholder="Thưởng" min="0">
                    <input type="number" id="editDeduction" value="${employee.deduction || 0}" placeholder="Khấu trừ" min="0">
                    <input type="date" id="editHireDate" value="${employee.hireDate}" required>
                </div>
                <div style="margin-top: 15px; text-align: right;">
                    <button type="button" id="cancelEdit" style="background: #718096; margin-right: 10px;">Hủy</button>
                    <button type="submit">Cập nhật</button>
                </div>
            </form>
        `;
        
        modal.style.display = 'flex';
        
        document.getElementById('editEmployeeForm').addEventListener('submit', function(e) {
            e.preventDefault();
            handleEditSubmit(e);
        });
        
        document.getElementById('cancelEdit').addEventListener('click', closeModal);
    }
}

function handleEditSubmit(e) {
    e.preventDefault();
    
    const employeeId = parseInt(document.getElementById('editEmployeeId').value);
    const updates = {
        name: document.getElementById('editName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        address: document.getElementById('editAddress').value,
        departmentId: parseInt(document.getElementById('editDepartmentId').value),
        positionId: parseInt(document.getElementById('editPositionId').value),
        salary: parseFloat(document.getElementById('editSalary').value),
        bonus: parseFloat(document.getElementById('editBonus').value) || 0,
        deduction: parseFloat(document.getElementById('editDeduction').value) || 0,
        hireDate: document.getElementById('editHireDate').value
    };
    
    if (validateEmployee(updates)) {
        EmployeeDb.updateEmployee(employeeId, updates);
        alert('Cập nhật thành công!');
        closeModal();
        refreshEmployeeList();
    } else {
        alert('Vui lòng kiểm tra lại thông tin!');
    }
}

// Delete Employee Functions
function deleteEmployee(employeeId) {
    const employees = EmployeeDb.getAllEmployees();
    const employee = employees.find(emp => emp.id === parseInt(employeeId));
    
    if (employee && window.confirm(`Xóa ${employee.name} (ID: ${employee.id})?`)) {
        EmployeeDb.deleteEmployee(employeeId);
        alert('Đã xóa nhân viên!');
        refreshEmployeeList();
    }
}

// Helper Functions
function validateEmployee(emp) {
    return emp.name && emp.email && emp.phone && emp.address && 
           emp.salary > 0 && emp.hireDate && 
           !isNaN(emp.departmentId) && !isNaN(emp.positionId) &&
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emp.email);
}

function refreshEmployeeList() {
    const departments = Department.getAllDepartments();
    const positions = Position.getAllPositions();
    const employees = EmployeeDb.getAllEmployees();
    
    const tableContainer = document.getElementById('employeeTableContainer');
    tableContainer.innerHTML = renderEmployeeTable(employees, departments, positions);
    
    addActionButtonListeners();
    
    const showAddFormBtn = document.getElementById('showAddFormBtn');
    if (showAddFormBtn) {
        showAddFormBtn.addEventListener('click', function() {
            const section = document.getElementById('addEmployeeSection');
            const toggleText = document.getElementById('toggleText');
            section.style.display = 'block';
            toggleText.textContent = 'Ẩn';
            section.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

function addActionButtonListeners() {
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            viewEmployeeDetail(this.dataset.id);
        });
    });
    
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            editEmployee(this.dataset.id);
        });
    });
}

function closeModal() {
    document.getElementById('employeeModal').style.display = 'none';
}