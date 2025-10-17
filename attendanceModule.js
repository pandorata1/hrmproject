import * as EmployeeDb from './employeeDbModule.js';

let attendance = [];

function loadAttendance() {
    attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
}

function saveAttendance() {
    localStorage.setItem('attendance', JSON.stringify(attendance));
}

export async function initModule(container) {
    loadAttendance();
    
    // Get all employees for dropdown
    const employees = EmployeeDb.getAllEmployees();
    
    container.innerHTML = `
        <h2>Quản lý Chấm công</h2>
        <div style="margin-bottom: 30px;">
            <h3>Chấm công hàng ngày</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div>
                    <label for="employeeId">Nhân viên:</label>
                    <select id="employeeId" style="width: 100%; padding: 12px;">
                        <option value="">Chọn nhân viên</option>
                        ${employees.map(emp => `<option value="${emp.id}">${emp.name} (ID: ${emp.id})</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label for="attendanceDate">Ngày:</label>
                    <input type="date" id="attendanceDate" style="width: 100%; padding: 12px;" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div>
                    <label for="attendanceType">Loại chấm công:</label>
                    <select id="attendanceType" style="width: 100%; padding: 12px;">
                        <option value="regular">Giờ hành chính</option>
                        <option value="overtime">Tăng ca</option>
                    </select>
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
                        ${employees.map(emp => `<option value="${emp.id}">${emp.name} (ID: ${emp.id})</option>`).join('')}
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
                <div>
                    <label for="reportType">Loại báo cáo:</label>
                    <select id="reportType" style="width: 100%; padding: 12px;">
                        <option value="all">Tất cả</option>
                        <option value="regular">Giờ hành chính</option>
                        <option value="overtime">Tăng ca</option>
                    </select>
                </div>
            </div>
            <button id="generateReportBtn" style="padding: 12px 25px;">Tạo báo cáo</button>
        </div>
        <div id="attendanceReport" style="margin-top: 20px;"></div>
    `;
    
    document.getElementById('checkInBtn').addEventListener('click', () => {
        const employeeId = parseInt(document.getElementById('employeeId').value);
        const attendanceType = document.getElementById('attendanceType').value;
        if (employeeId) {
            checkIn(employeeId, attendanceType);
            alert('Check in thành công!');
        } else {
            alert('Vui lòng chọn nhân viên!');
        }
    });
    
    document.getElementById('checkOutBtn').addEventListener('click', () => {
        const employeeId = parseInt(document.getElementById('employeeId').value);
        const attendanceType = document.getElementById('attendanceType').value;
        if (employeeId) {
            checkOut(employeeId, attendanceType);
            alert('Check out thành công!');
        } else {
            alert('Vui lòng chọn nhân viên!');
        }
    });
    
    document.getElementById('generateReportBtn').addEventListener('click', () => {
        const employeeId = parseInt(document.getElementById('reportEmployeeId').value);
        const fromDate = document.getElementById('fromDate').value;
        const toDate = document.getElementById('toDate').value;
        const reportType = document.getElementById('reportType').value;
        
        if (employeeId) {
            const report = getAttendanceReport(employeeId, fromDate, toDate, reportType);
            renderAttendanceReport(report, employeeId, reportType);
        } else {
            alert('Vui lòng chọn nhân viên!');
        }
    });
}

function renderAttendanceReport(report, employeeId, reportType) {
    const reportContainer = document.getElementById('attendanceReport');
    
    // Get employee name
    const employees = EmployeeDb.getAllEmployees();
    const employee = employees.find(emp => emp.id === employeeId);
    const employeeName = employee ? `${employee.name} (ID: ${employee.id})` : `ID: ${employeeId}`;
    
    const reportTypeText = reportType === 'regular' ? 'Giờ hành chính' : 
                          reportType === 'overtime' ? 'Tăng ca' : 'Tất cả';
    
    if (report.length === 0) {
        reportContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; background: #f7fafc; border-radius: 8px;">
                <p>Không có dữ liệu chấm công cho nhân viên ${employeeName} (${reportTypeText})</p>
            </div>
        `;
        return;
    }
    
    // Calculate total hours
    const totalHours = report.reduce((sum, record) => sum + record.hours, 0);
    const regularHours = report.filter(r => r.type === 'regular').reduce((sum, r) => sum + r.hours, 0);
    const overtimeHours = report.filter(r => r.type === 'overtime').reduce((sum, r) => sum + r.hours, 0);
    
    let summary = `<p><strong>Tổng số giờ làm việc:</strong> ${totalHours.toFixed(2)} giờ</p>`;
    if (reportType === 'all') {
        summary += `
            <p><strong>Giờ hành chính:</strong> ${regularHours.toFixed(2)} giờ</p>
            <p><strong>Giờ tăng ca:</strong> ${overtimeHours.toFixed(2)} giờ</p>
        `;
    }
    
    reportContainer.innerHTML = `
        <h4>Báo cáo chấm công cho ${employeeName} (${reportTypeText})</h4>
        ${summary}
        <div style="overflow-x: auto;">
            <table>
                <thead>
                    <tr>
                        <th>Ngày</th>
                        <th>Loại</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Giờ làm việc</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.map(record => {
                        const typeText = record.type === 'regular' ? 'Hành chính' : 'Tăng ca';
                        return `
                            <tr>
                                <td>${record.date.split('T')[0]}</td>
                                <td>${typeText}</td>
                                <td>${record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : 'N/A'}</td>
                                <td>${record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : 'N/A'}</td>
                                <td>${record.hours.toFixed(2)} giờ</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

export function checkIn(employeeId, type = 'regular') {
    loadAttendance();
    const today = new Date().toISOString().split('T')[0];
    
    // Check if already checked in today for this type
    const todayLog = attendance.find(log => 
        log.employeeId === employeeId && 
        log.date.startsWith(today) && 
        log.type === type &&
        log.checkIn && 
        !log.checkOut
    );
    
    if (todayLog) {
        alert(`Nhân viên đã check in ${type === 'regular' ? 'giờ hành chính' : 'tăng ca'} hôm nay!`);
        return;
    }
    
    attendance.push({ 
        date: new Date().toISOString(), 
        employeeId, 
        type,
        checkIn: new Date().toISOString(), 
        checkOut: null 
    });
    saveAttendance();
}

export function checkOut(employeeId, type = 'regular') {
    loadAttendance();
    const today = new Date().toISOString().split('T')[0];
    const todayLog = attendance.find(log => 
        log.employeeId === employeeId && 
        log.date.startsWith(today) && 
        log.type === type &&
        log.checkIn && 
        !log.checkOut
    );
    
    if (todayLog) {
        todayLog.checkOut = new Date().toISOString();
        saveAttendance();
    } else {
        alert(`Nhân viên chưa check in ${type === 'regular' ? 'giờ hành chính' : 'tăng ca'} hôm nay!`);
    }
}

export function getAttendanceReport(employeeId, fromDate, toDate, type = 'all') {
    loadAttendance();
    
    let filteredLogs = attendance.filter(log => log.employeeId === employeeId);
    
    // Filter by type
    if (type !== 'all') {
        filteredLogs = filteredLogs.filter(log => log.type === type);
    }
    
    if (fromDate) {
        filteredLogs = filteredLogs.filter(log => log.date >= new Date(fromDate).toISOString());
    }
    
    if (toDate) {
        const nextDay = new Date(toDate);
        nextDay.setDate(nextDay.getDate() + 1);
        filteredLogs = filteredLogs.filter(log => log.date < nextDay.toISOString());
    }
    
    return filteredLogs.map(log => {
        let hours = 0;
        if (log.checkIn && log.checkOut) {
            hours = (new Date(log.checkOut) - new Date(log.checkIn)) / 3600000;
        }
        return { ...log, hours };
    });
}