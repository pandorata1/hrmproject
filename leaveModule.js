import * as EmployeeDb from './employeeDbModule.js';
import * as Department from './departmentModule.js';
import * as Position from './positionModule.js';

let leaves = [];
let balances = {}; // employeeId: { annual: 20, sick: 10 }

// For this demo, we'll use localStorage but in a real app this would be API calls
function loadLeaves() {
    leaves = JSON.parse(localStorage.getItem('leaves') || '[]');
    balances = JSON.parse(localStorage.getItem('leaveBalances') || '{}');
}

function saveLeaves() {
    localStorage.setItem('leaves', JSON.stringify(leaves));
    localStorage.setItem('leaveBalances', JSON.stringify(balances));
}

export async function initModule(container) {
    try {
        loadLeaves();
        
        container.innerHTML = `
            <h2 style="font-size: 1.5em; margin-bottom: 20px;">Quản lý Nghỉ phép</h2>
            
            <!-- Search Employee Section -->
            <div style="margin-bottom: 20px;">
                <h3 style="font-size: 1.2em; margin-bottom: 10px;">Tìm kiếm Nhân viên</h3>
                <div style="margin-bottom: 15px;">
                    <label for="searchEmployee" style="display: block; margin-bottom: 5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Tìm theo tên hoặc mã nhân viên:</label>
                    <input type="text" id="searchEmployee" placeholder="Nhập tên hoặc mã nhân viên" 
                           style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                </div>
                <div id="searchResults" style="margin-top: 15px;"></div>
            </div>
            
            <!-- Leave Requests Section -->
            <div>
                <h3 style="font-size: 1.2em; margin-bottom: 10px;">Danh sách nhân viên đã xin nghỉ</h3>
                <div id="leaveRequestsList"></div>
            </div>
        `;
        
        // Add search functionality
        document.getElementById('searchEmployee').addEventListener('input', handleSearch);
        
        renderLeaveRequests();
    } catch (error) {
        console.error('Error initializing leave module:', error);
        container.innerHTML = `<p>Error loading leave data: ${error.message}</p>`;
    }
}

async function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    try {
        const employees = await EmployeeDb.getAllEmployees();
        
        const filteredEmployees = searchTerm 
            ? employees.filter(emp => 
                emp.name.toLowerCase().includes(searchTerm) || 
                emp.id.toString().includes(searchTerm)
            )
            : [];
        
        const resultsContainer = document.getElementById('searchResults');
        
        if (filteredEmployees.length === 0 && searchTerm) {
            resultsContainer.innerHTML = `<p>Không tìm thấy nhân viên phù hợp</p>`;
            return;
        }
        
        if (!searchTerm) {
            resultsContainer.innerHTML = '';
            return;
        }
        
        // Create table with data attributes instead of inline onclick
        let tableHtml = `
            <div style="max-height: 300px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
                    <thead>
                        <tr style="background-color: #f7fafc;">
                            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">ID</th>
                            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Tên</th>
                            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Email</th>
                            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Phòng ban</th>
                            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Vị trí</th>
                            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        filteredEmployees.forEach(emp => {
            tableHtml += `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 8px;">${emp.id}</td>
                    <td style="padding: 8px;">${emp.name}</td>
                    <td style="padding: 8px;">${emp.email || 'N/A'}</td>
                    <td style="padding: 8px;">${getDepartmentName(emp.department_id)}</td>
                    <td style="padding: 8px;">${getPositionName(emp.position_id)}</td>
                    <td style="padding: 8px;">
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            <button class="leave-btn" data-employee-id="${emp.id}" data-leave-type="annual" style="padding: 6px; background: #4299e1; color: white; border: none; border-radius: 4px; margin: 2px; cursor: pointer; font-size: 0.8em;">Phép năm</button>
                            <button class="leave-btn" data-employee-id="${emp.id}" data-leave-type="sick" style="padding: 6px; background: #48bb78; color: white; border: none; border-radius: 4px; margin: 2px; cursor: pointer; font-size: 0.8em;">Ốm</button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        tableHtml += `
                    </tbody>
                </table>
            </div>
        `;
        
        resultsContainer.innerHTML = tableHtml;
        
        // Add event listeners to the buttons using event delegation
        resultsContainer.querySelectorAll('.leave-btn').forEach(button => {
            button.addEventListener('click', function() {
                const employeeId = parseInt(this.dataset.employeeId);
                const leaveType = this.dataset.leaveType;
                selectEmployeeForLeave(employeeId, leaveType);
            });
        });
    } catch (error) {
        console.error('Error searching employees:', error);
        document.getElementById('searchResults').innerHTML = `<p>Error searching employees: ${error.message}</p>`;
    }
}

function clearSearch() {
    document.getElementById('searchEmployee').value = '';
    document.getElementById('searchResults').innerHTML = '';
}

function getDepartmentName(departmentId) {
    try {
        const departments = JSON.parse(localStorage.getItem('departments') || '[]');
        const department = departments.find(d => d.id == departmentId);
        return department ? department.name : `Phòng ${departmentId}`;
    } catch (error) {
        return `Phòng ${departmentId}`;
    }
}

function getPositionName(positionId) {
    try {
        const positions = JSON.parse(localStorage.getItem('positions') || '[]');
        const position = positions.find(p => p.id == positionId);
        return position ? position.title : `Vị trí ${positionId}`;
    } catch (error) {
        return `Vị trí ${positionId}`;
    }
}

function selectEmployeeForLeave(employeeId, leaveType) {
    try {
        const employees = JSON.parse(localStorage.getItem('employees') || '[]');
        const employee = employees.find(emp => emp.id == employeeId);
        
        if (!employee) {
            alert('Không tìm thấy nhân viên!');
            return;
        }
        
        // Get today's date
        const today = new Date().toISOString().split('T')[0];
        
        // Automatically create leave request
        requestLeave(employeeId, today, today, leaveType);
        alert(`Đã ghi nhận nhân viên ${employee.name} nghỉ ${leaveType === 'annual' ? 'phép năm' : 'ốm'}!`);
        
        // Clear search and refresh list
        clearSearch();
        renderLeaveRequests();
    } catch (error) {
        alert('Error processing leave request: ' + error.message);
    }
}

function renderLeaveRequests() {
    try {
        loadLeaves(); // Load latest data from localStorage
        const container = document.getElementById('leaveRequestsList');
        
        // Get all employees for name lookup
        const employees = JSON.parse(localStorage.getItem('employees') || '[]');
        
        // Show all leaves (not just pending)
        if (leaves.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 20px; background: #f7fafc; border-radius: 8px;">
                    <p>Chưa có nhân viên nào xin nghỉ phép</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div style="overflow-x: auto; max-height: 400px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
                    <thead>
                        <tr style="background-color: #f7fafc;">
                            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Nhân viên</th>
                            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Ngày nghỉ</th>
                            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Loại nghỉ</th>
                            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${leaves.map(leave => {
                            const employee = employees.find(emp => emp.id == leave.employeeId);
                            const employeeName = employee ? `${employee.name} (ID: ${employee.id})` : `ID: ${leave.employeeId}`;
                            return `
                                <tr style="border-bottom: 1px solid #e2e8f0;">
                                    <td style="padding: 8px;">${employeeName}</td>
                                    <td style="padding: 8px;">${leave.startDate}</td>
                                    <td style="padding: 8px;">${leave.type === 'annual' ? 'Phép năm' : 'Ốm'}</td>
                                    <td style="padding: 8px;">${leave.status === 'pending' ? 'Đang chờ' : leave.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Error rendering leave requests:', error);
        document.getElementById('leaveRequestsList').innerHTML = `<p>Error loading leave requests: ${error.message}</p>`;
    }
}

function requestLeave(employeeId, startDate, endDate, type) {
    try {
        loadLeaves(); // Load latest data
        
        // Initialize balance if not exists
        if (!balances[employeeId]) {
            balances[employeeId] = { annual: 20, sick: 10 };
        }
        
        leaves.push({ 
            id: Date.now(), 
            employeeId, 
            startDate, 
            endDate, 
            type, 
            status: 'approved' // Automatically approved
        });
        
        // Update balance
        if (balances[employeeId]) {
            balances[employeeId][type] -= 1; // Deduct 1 day
        }
        
        saveLeaves();
        renderLeaveRequests(); // Ensure the list is updated after saving
    } catch (error) {
        console.error('Error requesting leave:', error);
        throw error;
    }
}

export function getLeaveBalance(employeeId) {
    try {
        loadLeaves();
        return balances[employeeId] || { annual: 20, sick: 10 };
    } catch (error) {
        console.error('Error getting leave balance:', error);
        return { annual: 20, sick: 10 };
    }
}
import * as EmployeeDb from './employeeDbModule.js';
import * as Department from './departmentModule.js';
import * as Position from './positionModule.js';

let leaves = [];
let balances = {}; // employeeId: { annual: 20, sick: 10 }

function loadLeaves() {
    leaves = JSON.parse(localStorage.getItem('leaves') || '[]');
    balances = JSON.parse(localStorage.getItem('leaveBalances') || '{}');
}

function saveLeaves() {
    localStorage.setItem('leaves', JSON.stringify(leaves));
    localStorage.setItem('leaveBalances', JSON.stringify(balances));
}

export async function initModule(container) {
    loadLeaves();
    
    container.innerHTML = `
        <h2 style="font-size: 1.5em; margin-bottom: 20px;">Quản lý Nghỉ phép</h2>
        
        <!-- Search Employee Section -->
        <div style="margin-bottom: 20px;">
            <h3 style="font-size: 1.2em; margin-bottom: 10px;">Tìm kiếm Nhân viên</h3>
            <div style="margin-bottom: 15px;">
                <label for="searchEmployee" style="display: block; margin-bottom: 5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Tìm theo tên hoặc mã nhân viên:</label>
                <input type="text" id="searchEmployee" placeholder="Nhập tên hoặc mã nhân viên" 
                       style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            </div>
            <div id="searchResults" style="margin-top: 15px;"></div>
        </div>
        
        <!-- Leave Requests Section -->
        <div>
            <h3 style="font-size: 1.2em; margin-bottom: 10px;">Danh sách nhân viên đã xin nghỉ</h3>
            <div id="leaveRequestsList"></div>
        </div>
    `;
    
    // Add search functionality
    document.getElementById('searchEmployee').addEventListener('input', handleSearch);
    
    renderLeaveRequests();
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const employees = EmployeeDb.getAllEmployees();
    
    const filteredEmployees = searchTerm 
        ? employees.filter(emp => 
            emp.name.toLowerCase().includes(searchTerm) || 
            emp.id.toString().includes(searchTerm)
        )
        : [];
    
    const resultsContainer = document.getElementById('searchResults');
    
    if (filteredEmployees.length === 0 && searchTerm) {
        resultsContainer.innerHTML = `<p>Không tìm thấy nhân viên phù hợp</p>`;
        return;
    }
    
    if (!searchTerm) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    // Create table with data attributes instead of inline onclick
    let tableHtml = `
        <div style="max-height: 300px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
                <thead>
                    <tr style="background-color: #f7fafc;">
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">ID</th>
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Tên</th>
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Email</th>
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Phòng ban</th>
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Vị trí</th>
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    filteredEmployees.forEach(emp => {
        tableHtml += `
            <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px;">${emp.id}</td>
                <td style="padding: 8px;">${emp.name}</td>
                <td style="padding: 8px;">${emp.email || 'N/A'}</td>
                <td style="padding: 8px;">${getDepartmentName(emp.departmentId)}</td>
                <td style="padding: 8px;">${getPositionName(emp.positionId)}</td>
                <td style="padding: 8px;">
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <button class="leave-btn" data-employee-id="${emp.id}" data-leave-type="annual" style="padding: 6px; background: #4299e1; color: white; border: none; border-radius: 4px; margin: 2px; cursor: pointer; font-size: 0.8em;">Phép năm</button>
                        <button class="leave-btn" data-employee-id="${emp.id}" data-leave-type="sick" style="padding: 6px; background: #48bb78; color: white; border: none; border-radius: 4px; margin: 2px; cursor: pointer; font-size: 0.8em;">Ốm</button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableHtml += `
                </tbody>
            </table>
        </div>
    `;
    
    resultsContainer.innerHTML = tableHtml;
    
    // Add event listeners to the buttons using event delegation
    resultsContainer.querySelectorAll('.leave-btn').forEach(button => {
        button.addEventListener('click', function() {
            const employeeId = parseInt(this.dataset.employeeId);
            const leaveType = this.dataset.leaveType;
            selectEmployeeForLeave(employeeId, leaveType);
        });
    });
}

function clearSearch() {
    document.getElementById('searchEmployee').value = '';
    document.getElementById('searchResults').innerHTML = '';
}

function getDepartmentName(departmentId) {
    const departments = Department.getAllDepartments();
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : `Phòng ${departmentId}`;
}

function getPositionName(positionId) {
    const positions = Position.getAllPositions();
    const position = positions.find(p => p.id === positionId);
    return position ? position.title : `Vị trí ${positionId}`;
}

function selectEmployeeForLeave(employeeId, leaveType) {
    const employees = EmployeeDb.getAllEmployees();
    const employee = employees.find(emp => emp.id === employeeId);
    
    if (!employee) return;
    
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Automatically create leave request
    requestLeave(employeeId, today, today, leaveType);
    alert(`Đã ghi nhận nhân viên ${employee.name} nghỉ ${leaveType === 'annual' ? 'phép năm' : 'ốm'}!`);
    
    // Clear search and refresh list
    clearSearch();
    renderLeaveRequests();
}

function renderLeaveRequests() {
    loadLeaves(); // Load latest data from localStorage
    const container = document.getElementById('leaveRequestsList');
    
    // Get all employees for name lookup
    const employees = EmployeeDb.getAllEmployees();
    
    // Show all leaves (not just pending)
    if (leaves.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px; background: #f7fafc; border-radius: 8px;">
                <p>Chưa có nhân viên nào xin nghỉ phép</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div style="overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
                <thead>
                    <tr style="background-color: #f7fafc;">
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Nhân viên</th>
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Ngày nghỉ</th>
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Loại nghỉ</th>
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    ${leaves.map(leave => {
                        const employee = employees.find(emp => emp.id === leave.employeeId);
                        const employeeName = employee ? `${employee.name} (ID: ${employee.id})` : `ID: ${leave.employeeId}`;
                        return `
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                                <td style="padding: 8px;">${employeeName}</td>
                                <td style="padding: 8px;">${leave.startDate}</td>
                                <td style="padding: 8px;">${leave.type === 'annual' ? 'Phép năm' : 'Ốm'}</td>
                                <td style="padding: 8px;">${leave.status === 'pending' ? 'Đang chờ' : leave.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function requestLeave(employeeId, startDate, endDate, type) {
    loadLeaves(); // Load latest data
    
    // Initialize balance if not exists
    if (!balances[employeeId]) {
        balances[employeeId] = { annual: 20, sick: 10 };
    }
    
    leaves.push({ 
        id: Date.now(), 
        employeeId, 
        startDate, 
        endDate, 
        type, 
        status: 'approved' // Automatically approved
    });
    
    // Update balance
    if (balances[employeeId]) {
        balances[employeeId][type] -= 1; // Deduct 1 day
    }
    
    saveLeaves();
    renderLeaveRequests(); // Ensure the list is updated after saving
}

export function getLeaveBalance(employeeId) {
    loadLeaves();
    return balances[employeeId] || { annual: 20, sick: 10 };
}