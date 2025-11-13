import * as EmployeeDb from './employeeDbModule.js';
import * as Department from './departmentModule.js';
import * as Position from './positionModule.js';

export async function initModule(container) {
    // Load departments and positions for dropdowns
    const departments = Department.getAllDepartments();
    const positions = Position.getAllPositions();
    
    container.innerHTML = `
        <h2>Tìm kiếm Nhân viên</h2>
        <form id="searchForm">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px;">
                <div>
                    <label for="searchName">Tên nhân viên:</label>
                    <input type="text" id="searchName" placeholder="Nhập tên hoặc phần tên" style="width: 100%; padding: 12px;">
                </div>
                <div>
                    <label for="searchDepartment">Phòng ban:</label>
                    <select id="searchDepartment" style="width: 100%; padding: 12px;">
                        <option value="">Tất cả phòng ban</option>
                        ${departments.map(dept => `<option value="${dept.id}">${dept.name}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label for="searchPosition">Vị trí:</label>
                    <select id="searchPosition" style="width: 100%; padding: 12px;">
                        <option value="">Tất cả vị trí</option>
                        ${positions.map(pos => `<option value="${pos.id}">${pos.title}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label for="minSalary">Lương tối thiểu:</label>
                    <input type="number" id="minSalary" placeholder="0" style="width: 100%; padding: 12px;">
                </div>
                <div>
                    <label for="maxSalary">Lương tối đa:</label>
                    <input type="number" id="maxSalary" placeholder="1000000" style="width: 100%; padding: 12px;">
                </div>
            </div>
            <button type="submit" style="padding: 12px 25px; font-size: 16px;">Tìm kiếm</button>
            <button type="button" id="clearSearch" style="padding: 12px 25px; margin-left: 10px; background: #718096;">Xóa</button>
        </form>
        <div id="searchResults"></div>
    `;
    
    document.getElementById('searchForm').addEventListener('submit', handleSearch);
    document.getElementById('clearSearch').addEventListener('click', clearSearch);
    
    // Show all employees by default
    const allEmployees = EmployeeDb.getAllEmployees();
    renderTable(allEmployees);
}

function handleSearch(e) {
    e.preventDefault();
    const nameQuery = document.getElementById('searchName').value;
    const departmentId = document.getElementById('searchDepartment').value;
    const positionId = document.getElementById('searchPosition').value;
    const minSalary = parseFloat(document.getElementById('minSalary').value) || 0;
    const maxSalary = parseFloat(document.getElementById('maxSalary').value) || Infinity;
    
    // Create regex for name search (if provided)
    const nameRegex = nameQuery ? new RegExp(nameQuery, 'i') : null;
    
    const filtered = EmployeeDb.filterEmployees(emp => {
        // Name filter
        if (nameRegex && !nameRegex.test(emp.name)) return false;
        
        // Department filter
        if (departmentId && emp.departmentId != departmentId) return false;
        
        // Position filter
        if (positionId && emp.positionId != positionId) return false;
        
        // Salary filter
        if (emp.salary < minSalary || emp.salary > maxSalary) return false;
        
        return true;
    });
    
    // Sort by salary descending
    const sorted = filtered.sort((a, b) => b.salary - a.salary);
    
    renderTable(sorted);
}

function clearSearch() {
    document.getElementById('searchForm').reset();
    const allEmployees = EmployeeDb.getAllEmployees();
    renderTable(allEmployees);
}

function renderTable(employees) {
    const resultsContainer = document.getElementById('searchResults');
    
    if (employees.length === 0) {
        resultsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; background: white; border-radius: 10px; box-shadow: 0 3px 10px rgba(0,0,0,0.08);">
                <h3>Chưa có nhân viên nào trong hệ thống</h3>
                <p>Vui lòng chọn "Quản lý Nhân sự" từ menu để thêm nhân viên mới</p>
            </div>
        `;
        return;
    }
    
    // Get departments and positions for display
    const departments = Department.getAllDepartments();
    const positions = Position.getAllPositions();
    
    resultsContainer.innerHTML = `
        <h3>Kết quả tìm kiếm (${employees.length} nhân viên)</h3>
        <div style="overflow-x: auto;">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Phòng ban</th>
                        <th>Vị trí</th>
                        <th>Lương</th>
                        <th>Ngày vào làm</th>
                    </tr>
                </thead>
                <tbody>
                    ${employees.map(emp => {
                        const department = departments.find(d => d.id == emp.departmentId);
                        const position = positions.find(p => p.id == emp.positionId);
                        return `
                            <tr>
                                <td>${emp.id}</td>
                                <td>${emp.name}</td>
                                <td>${emp.email || 'N/A'}</td>
                                <td>${emp.phone || 'N/A'}</td>
                                <td>${emp.address || 'N/A'}</td>
                                <td>${department ? department.name : 'N/A'}</td>
                                <td>${position ? position.title : 'N/A'}</td>
                                <td>${emp.salary.toLocaleString()} VNĐ</td>
                                <td>${emp.hireDate}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}