import * as EmployeeDb from './employeeDbModule.js';
import * as Department from './departmentModule.js';
import * as Position from './positionModule.js';

<<<<<<< HEAD
export async function initModule(container) {
    try {
        // Render payroll table
        const report = await generatePayrollReport();
        await renderPayrollTable(container, report);
    } catch (error) {
        console.error('Error initializing salary module:', error);
        container.innerHTML = `<p>Error loading salary data: ${error.message}</p>`;
    }
}

async function renderPayrollTable(container, report) {
    try {
        // Get departments and positions for display
        const departments = await Department.getAllDepartments();
        const positions = await Position.getAllPositions();
        
        container.innerHTML = `
            <h2>Bảng Lương</h2>
            <div style="overflow-x: auto;">
                <table id="payrollTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nhân viên</th>
                            <th>Email</th>
                            <th>Điện thoại</th>
                            <th>Phòng ban</th>
                            <th>Vị trí</th>
                            <th>Lương cơ bản</th>
                            <th>Thưởng</th>
                            <th>Khấu trừ</th>
                            <th>Thực lãnh</th>
                        </tr>
                    </thead>
                    <tbody id="payrollTableBody">
                        ${report.map(emp => {
                            const department = departments.find(d => d.id == emp.department_id);
                            // Fix: Use correct field names for position (title instead of name)
                            const position = positions.find(p => p.id == emp.position_id);
                            return `
                                <tr>
                                    <td>${emp.id}</td>
                                    <td>${emp.first_name} ${emp.last_name}</td>
                                    <td>${emp.email || 'N/A'}</td>
                                    <td>${emp.phone || 'N/A'}</td>
                                    <td>${department ? department.name : 'N/A'}</td>
                                    <td>${position ? (position.title || position.name) : 'N/A'}</td>
                                    <td>${emp.salary ? parseFloat(emp.salary).toLocaleString() : '0'} VNĐ</td>
                                    <td>${(emp.bonus || 0).toLocaleString()} VNĐ</td>
                                    <td>${(emp.deduction || 0).toLocaleString()} VNĐ</td>
                                    <td>${calculateNetSalary(emp).toLocaleString()} VNĐ</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Error rendering payroll table:', error);
        container.innerHTML = `<p>Error rendering payroll table: ${error.message}</p>`;
    }
}

export function calculateNetSalary(employee) {
    return (parseFloat(employee.salary) || 0) + (parseFloat(employee.bonus) || 0) - (parseFloat(employee.deduction) || 0);
}

export async function generatePayrollReport() {
    try {
        const employees = await EmployeeDb.getAllEmployees();
        return employees.map(emp => ({
            ...emp,
            netSalary: calculateNetSalary(emp)
        }));
    } catch (error) {
        console.error('Error generating payroll report:', error);
        throw error;
    }
}

// Use map/reduce for totals if needed
export async function updateEmployeeSalary(employeeId, bonus = 0, deduction = 0) {
    try {
        const updates = {
            bonus: parseFloat(bonus) || 0,
            deduction: parseFloat(deduction) || 0
        };
        
        const result = await EmployeeDb.updateEmployee(employeeId, updates);
        return result !== null;
    } catch (error) {
        console.error('Error updating employee salary:', error);
        return false;
    }
=======
let employees = [];

function loadEmployees() {
    employees = JSON.parse(localStorage.getItem('employees') || '[]');
}

function saveEmployees() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

export async function initModule(container) {
    // Render payroll table
    const report = generatePayrollReport();
    renderPayrollTable(container, report);
}

function renderPayrollTable(container, report) {
    // Get departments and positions for display
    const departments = Department.getAllDepartments();
    const positions = Position.getAllPositions();
    
    container.innerHTML = `
        <h2>Bảng Lương</h2>
        <div style="overflow-x: auto;">
            <table id="payrollTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nhân viên</th>
                        <th>Email</th>
                        <th>Điện thoại</th>
                        <th>Phòng ban</th>
                        <th>Vị trí</th>
                        <th>Lương cơ bản</th>
                        <th>Thưởng</th>
                        <th>Khấu trừ</th>
                        <th>Thực lãnh</th>
                    </tr>
                </thead>
                <tbody id="payrollTableBody">
                    ${report.map(emp => {
                        const department = departments.find(d => d.id === emp.departmentId);
                        const position = positions.find(p => p.id === emp.positionId);
                        return `
                            <tr>
                                <td>${emp.id}</td>
                                <td>${emp.name} (ID: ${emp.id})</td>
                                <td>${emp.email || 'N/A'}</td>
                                <td>${emp.phone || 'N/A'}</td>
                                <td>${department ? department.name : 'N/A'}</td>
                                <td>${position ? position.title : 'N/A'}</td>
                                <td>${emp.salary.toLocaleString()} VNĐ</td>
                                <td>${(emp.bonus || 0).toLocaleString()} VNĐ</td>
                                <td>${(emp.deduction || 0).toLocaleString()} VNĐ</td>
                                <td>${calculateNetSalary(emp).toLocaleString()} VNĐ</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

export function calculateNetSalary(employee) {
    return employee.salary + (employee.bonus || 0) - (employee.deduction || 0);
}

export function generatePayrollReport() {
    loadEmployees();
    return employees.map(emp => ({
        ...emp,
        netSalary: calculateNetSalary(emp)
    }));
}

// Use map/reduce for totals if needed

export function updateEmployeeSalary(employeeId, bonus = 0, deduction = 0) {
    loadEmployees();
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
        employee.bonus = bonus;
        employee.deduction = deduction;
        saveEmployees();
        return true;
    }
    return false;
>>>>>>> a380d625c488eb8fe1868308530a9783db0eba5c
}