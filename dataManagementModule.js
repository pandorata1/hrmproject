import * as EmployeeDb from './employeeDbModule.js';
import * as Department from './departmentModule.js';
import * as Position from './positionModule.js';
import * as AttendanceApi from './attendanceApiModule.js';
import * as LeaveApi from './leaveApiModule.js';
import * as PerformanceApi from './performanceApiModule.js';

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
async function exportAllData() {
    try {
        // Get all data from API modules
        const allData = {
            metadata: {
                exportedAt: new Date().toISOString(),
                version: "1.0"
            },
            employees: await EmployeeDb.getAllEmployees(),
            departments: await Department.getAllDepartments(),
            positions: await Position.getAllPositions(),
            attendance: await AttendanceApi.getAllAttendance(),
            leaves: await LeaveApi.getAllLeaves(),
            performanceReviews: await PerformanceApi.getAllReviews()
        };
        
        const dataStr = JSON.stringify(allData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `hrm-export-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    } catch (error) {
        console.error('Error exporting data:', error);
        alert('Lỗi khi xuất dữ liệu: ' + error.message);
    }
}

// Import data from JSON file
async function importData() {
    const fileInput = document.getElementById('importFile');
    const resultContainer = document.getElementById('importResult');
    
    if (!fileInput.files.length) {
        resultContainer.innerHTML = '<p style="color: #e53e3e;">Vui lòng chọn một file JSON để nhập</p>';
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = async function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            
            // For this version, we'll show a message that import is not fully supported
            // since we're using a database backend
            resultContainer.innerHTML = `
                <div style="padding: 15px; background: #yellow.500; color: #2d3748; border-radius: 8px;">
                    <h4>Thông báo:</h4>
                    <p>Chức năng nhập dữ liệu hiện chỉ hỗ trợ xem dữ liệu. Trong phiên bản này, dữ liệu được lưu trữ trong cơ sở dữ liệu nên không thể nhập trực tiếp.</p>
                    <p>Dữ liệu trong file JSON đã được đọc thành công.</p>
                </div>
            `;
            
            // Reset file input
            fileInput.value = '';
        } catch (error) {
            resultContainer.innerHTML = `<p style="color: #e53e3e;">Lỗi khi nhập dữ liệu: ${error.message}</p>`;
        }
    };
    
    reader.onerror = function() {
        resultContainer.innerHTML = '<p style="color: #e53e3e;">Lỗi khi đọc file</p>';
    };
    
    reader.readAsText(file);
}