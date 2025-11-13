import * as EmployeeDb from './employeeDbModule.js';
import * as AttendanceApi from './attendanceApiModule.js';

export async function initModule(container) {
    try {
        // Get all employees for dropdown
        const employees = await EmployeeDb.getAllEmployees();
        
        container.innerHTML = `
            <h2>Quản lý Chấm công</h2>
            <div style="margin-bottom: 30px;">
                <h3>Chấm công hàng ngày</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 20px;">
                    <div>
                        <label for="employeeId">Nhân viên:</label>
                        <select id="employeeId" style="width: 100%; padding: 12px;">
                            <option value="">Chọn nhân viên</option>
                            ${employees.map(emp => `<option value="${emp.id}">${emp.first_name} ${emp.last_name} (ID: ${emp.id})</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label for="attendanceDate">Ngày:</label>
                        <input type="date" id="attendanceDate" style="width: 100%; padding: 12px;" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                </div>
                <button id="checkInBtn" style="padding: 12px 25px; margin-right: 10px;">Check In</button>
                <button id="checkOutBtn" style="padding: 12px 25px;">Check Out</button>
            </div>
            <div>
                <h3>Báo cáo chấm công</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 20px;">
                    <div>
                        <label for="reportEmployeeId">Nhân viên:</label>
                        <select id="reportEmployeeId" style="width: 100%; padding: 12px;">
                            <option value="">Chọn nhân viên</option>
                            ${employees.map(emp => `<option value="${emp.id}">${emp.first_name} ${emp.last_name} (ID: ${emp.id})</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label for="fromDate">Từ ngày:</label>
                        <input type="date" id="fromDate" style="width: 100%; padding: 12px;">
                    </div>
                    <div>
                        <label for="toDate">Đến ngày:</label>
                        <input type="date" id="toDate" style="width: 100%; padding: 12px;">
                    </div>
                </div>
                <button id="generateReportBtn" style="padding: 12px 25px;">Tạo báo cáo</button>
            </div>
            <div id="attendanceReport" style="margin-top: 20px;"></div>
        `;
        
        document.getElementById('checkInBtn').addEventListener('click', async () => {
            const employeeId = parseInt(document.getElementById('employeeId').value);
            const attendanceDate = document.getElementById('attendanceDate').value;
            if (employeeId && attendanceDate) {
                try {
                    const checkInTime = new Date().toISOString();
                    await AttendanceApi.checkIn(employeeId, attendanceDate, checkInTime);
                    alert('Check in thành công!');
                } catch (error) {
                    alert('Lỗi khi check in: ' + error.message);
                }
            } else {
                alert('Vui lòng chọn nhân viên và ngày!');
            }
        });
        
        document.getElementById('checkOutBtn').addEventListener('click', async () => {
            const employeeId = parseInt(document.getElementById('employeeId').value);
            const attendanceDate = document.getElementById('attendanceDate').value;
            if (employeeId && attendanceDate) {
                try {
                    const checkOutTime = new Date().toISOString();
                    await AttendanceApi.checkOut(employeeId, attendanceDate, checkOutTime);
                    alert('Check out thành công!');
                } catch (error) {
                    alert('Lỗi khi check out: ' + error.message);
                }
            } else {
                alert('Vui lòng chọn nhân viên và ngày!');
            }
        });
        
        document.getElementById('generateReportBtn').addEventListener('click', async () => {
            const employeeId = parseInt(document.getElementById('reportEmployeeId').value);
            const fromDate = document.getElementById('fromDate').value;
            const toDate = document.getElementById('toDate').value;
            
            if (employeeId) {
                try {
                    const report = await getAttendanceReport(employeeId, fromDate, toDate);
                    renderAttendanceReport(report, employeeId);
                } catch (error) {
                    alert('Lỗi khi tạo báo cáo: ' + error.message);
                }
            } else {
                alert('Vui lòng chọn nhân viên!');
            }
        });
    } catch (error) {
        console.error('Error initializing attendance module:', error);
        container.innerHTML = `<p>Error loading attendance module: ${error.message}</p>`;
    }
}

async function renderAttendanceReport(report, employeeId) {
    const reportContainer = document.getElementById('attendanceReport');
    
    try {
        // Get employee name
        const employees = await EmployeeDb.getAllEmployees();
        const employee = employees.find(emp => emp.id == employeeId);
        const employeeName = employee ? `${employee.first_name} ${employee.last_name} (ID: ${employee.id})` : `ID: ${employeeId}`;
        
        if (report.length === 0) {
            reportContainer.innerHTML = `
                <div style="text-align: center; padding: 20px; background: #f7fafc; border-radius: 8px;">
                    <p>Không có dữ liệu chấm công cho nhân viên ${employeeName}</p>
                </div>
            `;
            return;
        }
        
        // Calculate total hours
        const totalHours = report.reduce((sum, record) => {
            if (record.check_in && record.check_out) {
                const checkIn = new Date(record.check_in);
                const checkOut = new Date(record.check_out);
                return sum + (checkOut - checkIn) / 3600000;
            }
            return sum;
        }, 0);
        
        reportContainer.innerHTML = `
            <h4>Báo cáo chấm công cho ${employeeName}</h4>
            <p><strong>Tổng số giờ làm việc:</strong> ${totalHours.toFixed(2)} giờ</p>
            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Trạng thái</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                            <th>Giờ làm việc</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${report.map(record => {
                            let hours = 0;
                            let checkInTime = 'N/A';
                            let checkOutTime = 'N/A';
                            
                            if (record.check_in) {
                                const checkIn = new Date(record.check_in);
                                checkInTime = checkIn.toLocaleTimeString();
                                
                                if (record.check_out) {
                                    const checkOut = new Date(record.check_out);
                                    checkOutTime = checkOut.toLocaleTimeString();
                                    hours = (checkOut - checkIn) / 3600000;
                                }
                            }
                            
                            const statusText = record.status === 'present' ? 'Có mặt' : 
                                             record.status === 'absent' ? 'Vắng mặt' : 'Đi muộn';
                            
                            return `
                                <tr>
                                    <td>${record.date}</td>
                                    <td>${statusText}</td>
                                    <td>${checkInTime}</td>
                                    <td>${checkOutTime}</td>
                                    <td>${hours.toFixed(2)} giờ</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Error rendering attendance report:', error);
        reportContainer.innerHTML = `<p>Error rendering attendance report: ${error.message}</p>`;
    }
}

export async function getAttendanceReport(employeeId, fromDate, toDate) {
    try {
        const attendance = await AttendanceApi.getAttendanceByEmployee(employeeId);
        
        let filteredLogs = attendance;
        
        if (fromDate) {
            filteredLogs = filteredLogs.filter(log => log.date >= fromDate);
        }
        
        if (toDate) {
            filteredLogs = filteredLogs.filter(log => log.date <= toDate);
        }
        
        return filteredLogs;
    } catch (error) {
        console.error('Error getting attendance report:', error);
        throw error;
    }
}