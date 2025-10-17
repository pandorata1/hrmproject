import * as EmployeeDb from './employeeDbModule.js';
import * as Department from './departmentModule.js';
import * as Position from './positionModule.js';

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
}