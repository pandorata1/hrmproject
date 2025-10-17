let jsonData = {};

export async function initModule(container) {
    container.innerHTML = `
        <h2>Quản lý Dữ liệu JSON</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 30px;">
            <div>
                <h3>Xuất dữ liệu</h3>
                <p>Xuất toàn bộ dữ liệu hệ thống ra file JSON</p>
                <button id="exportAllDataBtn" style="padding: 12px 20px; font-size: 16px;">Xuất dữ liệu JSON</button>
            </div>
            <div>
                <h3>Nhập dữ liệu</h3>
                <p>Nhập dữ liệu từ file JSON (sẽ ghi đè dữ liệu hiện tại)</p>
                <input type="file" id="importFile" accept=".json" style="margin-bottom: 15px;">
                <button id="importDataBtn" style="padding: 12px 20px; font-size: 16px; background: #48bb78;">Nhập dữ liệu JSON</button>
            </div>
        </div>
        <div id="importResult" style="margin-top: 20px;"></div>
    `;
    
    document.getElementById('exportAllDataBtn').addEventListener('click', exportAllData);
    document.getElementById('importDataBtn').addEventListener('click', importData);
}

// Export all data as JSON
function exportAllData() {
    // Import all modules to get their data
    import('./employeeDbModule.js').then(EmployeeDb => {
        import('./departmentModule.js').then(Department => {
            import('./positionModule.js').then(Position => {
                const allData = {
                    metadata: {
                        exportedAt: new Date().toISOString(),
                        version: "1.0"
                    },
                    employees: EmployeeDb.getAllEmployees(),
                    departments: Department.getAllDepartments(),
                    positions: Position.getAllPositions(),
                    attendance: JSON.parse(localStorage.getItem('attendance') || '[]'),
                    leaves: JSON.parse(localStorage.getItem('leaves') || '[]'),
                    leaveBalances: JSON.parse(localStorage.getItem('leaveBalances') || '{}'),
                    performanceReviews: JSON.parse(localStorage.getItem('performanceReviews') || '[]'),
                    users: JSON.parse(localStorage.getItem('users') || '[]')
                };
                
                const dataStr = JSON.stringify(allData, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                
                const exportFileDefaultName = `hrm-export-${new Date().toISOString().split('T')[0]}.json`;
                
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
            });
        });
    });
}

// Import data from JSON file
function importData() {
    const fileInput = document.getElementById('importFile');
    const resultContainer = document.getElementById('importResult');
    
    if (!fileInput.files.length) {
        resultContainer.innerHTML = '<p style="color: #e53e3e;">Vui lòng chọn một file JSON để nhập</p>';
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            
            // Import data to respective modules
            Promise.all([
                import('./employeeDbModule.js'),
                import('./departmentModule.js'),
                import('./positionModule.js')
            ]).then(([EmployeeDb, Department, Position]) => {
                // Import employees
                if (jsonData.employees && Array.isArray(jsonData.employees)) {
                    localStorage.setItem('employees', JSON.stringify(jsonData.employees, null, 2));
                }
                
                // Import departments
                if (jsonData.departments && Array.isArray(jsonData.departments)) {
                    localStorage.setItem('departments', JSON.stringify(jsonData.departments, null, 2));
                }
                
                // Import positions
                if (jsonData.positions && Array.isArray(jsonData.positions)) {
                    localStorage.setItem('positions', JSON.stringify(jsonData.positions, null, 2));
                }
                
                // Import other data
                if (jsonData.attendance) {
                    localStorage.setItem('attendance', JSON.stringify(jsonData.attendance, null, 2));
                }
                
                if (jsonData.leaves) {
                    localStorage.setItem('leaves', JSON.stringify(jsonData.leaves, null, 2));
                }
                
                if (jsonData.leaveBalances) {
                    localStorage.setItem('leaveBalances', JSON.stringify(jsonData.leaveBalances, null, 2));
                }
                
                if (jsonData.performanceReviews) {
                    localStorage.setItem('performanceReviews', JSON.stringify(jsonData.performanceReviews, null, 2));
                }
                
                if (jsonData.users) {
                    localStorage.setItem('users', JSON.stringify(jsonData.users, null, 2));
                }
                
                resultContainer.innerHTML = `
                    <div style="padding: 15px; background: #48bb78; color: white; border-radius: 8px;">
                        <h4>Nhập dữ liệu thành công!</h4>
                        <p>Đã nhập ${jsonData.employees ? jsonData.employees.length : 0} nhân viên</p>
                        <p>Đã nhập ${jsonData.departments ? jsonData.departments.length : 0} phòng ban</p>
                        <p>Đã nhập ${jsonData.positions ? jsonData.positions.length : 0} vị trí</p>
                    </div>
                `;
                
                // Reset file input
                fileInput.value = '';
            });
        } catch (error) {
            resultContainer.innerHTML = `<p style="color: #e53e3e;">Lỗi khi nhập dữ liệu: ${error.message}</p>`;
        }
    };
    
    reader.onerror = function() {
        resultContainer.innerHTML = '<p style="color: #e53e3e;">Lỗi khi đọc file</p>';
    };
    
    reader.readAsText(file);
}