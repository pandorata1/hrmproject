import * as EmployeeDb from './employeeDbModule.js';
import * as LeaveApi from './leaveApiModule.js';

export async function initModule(container) {
    try {
        container.innerHTML = `
            <h2 style="font-size: 1.5em; margin-bottom: 20px;">Quản lý Nghỉ phép</h2>
            
            <!-- Leave Request Form -->
            <div style="margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                <h3 style="font-size: 1.2em; margin-bottom: 15px;">Đăng ký nghỉ phép</h3>
                <form id="leaveRequestForm">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 15px;">
                        <div>
                            <label for="employeeId" style="display: block; margin-bottom: 5px;">Nhân viên:</label>
                            <select id="employeeId" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">Chọn nhân viên</option>
                            </select>
                        </div>
                        <div>
                            <label for="leaveType" style="display: block; margin-bottom: 5px;">Loại nghỉ phép:</label>
                            <select id="leaveType" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="annual">Phép năm</option>
                                <option value="sick">Nghỉ ốm</option>
                                <option value="personal">Nghỉ cá nhân</option>
                            </select>
                        </div>
                        <div>
                            <label for="startDate" style="display: block; margin-bottom: 5px;">Ngày bắt đầu:</label>
                            <input type="date" id="startDate" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                        </div>
                        <div>
                            <label for="endDate" style="display: block; margin-bottom: 5px;">Ngày kết thúc:</label>
                            <input type="date" id="endDate" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                        </div>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label for="reason" style="display: block; margin-bottom: 5px;">Lý do:</label>
                        <textarea id="reason" rows="3" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
                    </div>
                    <button type="submit" style="padding: 12px 25px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Gửi yêu cầu</button>
                </form>
            </div>
            
            <!-- Leave Requests List -->
            <div>
                <h3 style="font-size: 1.2em; margin-bottom: 15px;">Danh sách yêu cầu nghỉ phép</h3>
                <div id="leaveRequestsList" style="margin-top: 20px;"></div>
            </div>
        `;
        
        // Populate employee dropdown
        await populateEmployeeDropdown();
        
        // Add form submission handler
        document.getElementById('leaveRequestForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleLeaveRequest();
        });
        
        // Load and display leave requests
        await renderLeaveRequests();
    } catch (error) {
        console.error('Error initializing leave management module:', error);
        container.innerHTML = `<p>Error loading leave management module: ${error.message}</p>`;
    }
}

async function populateEmployeeDropdown() {
    try {
        const employees = await EmployeeDb.getAllEmployees();
        const select = document.getElementById('employeeId');
        
        // Clear existing options except the first one
        select.innerHTML = '<option value="">Chọn nhân viên</option>';
        
        // Add employees to dropdown
        employees.forEach(emp => {
            const option = document.createElement('option');
            option.value = emp.id;
            option.textContent = `${emp.first_name} ${emp.last_name} (ID: ${emp.id})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating employee dropdown:', error);
    }
}

async function handleLeaveRequest() {
    try {
        const employeeId = document.getElementById('employeeId').value;
        const leaveType = document.getElementById('leaveType').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const reason = document.getElementById('reason').value;
        
        if (!employeeId || !startDate || !endDate) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }
        
        // Create leave request
        const leaveData = {
            employee_id: employeeId,
            start_date: startDate,
            end_date: endDate,
            reason: reason,
            status: 'pending'
        };
        
        await LeaveApi.createLeave(leaveData);
        alert('Yêu cầu nghỉ phép đã được gửi thành công!');
        
        // Reset form
        document.getElementById('leaveRequestForm').reset();
        
        // Refresh leave requests list
        await renderLeaveRequests();
    } catch (error) {
        console.error('Error handling leave request:', error);
        alert('Lỗi khi gửi yêu cầu nghỉ phép: ' + error.message);
    }
}

async function renderLeaveRequests() {
    try {
        const container = document.getElementById('leaveRequestsList');
        const leaves = await LeaveApi.getAllLeaves();
        const employees = await EmployeeDb.getAllEmployees();
        
        if (leaves.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                    <p>Chưa có yêu cầu nghỉ phép nào</p>
                </div>
            `;
            return;
        }
        
        // Sort leaves by start date (newest first)
        leaves.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
        
        container.innerHTML = `
            <div style="overflow-x: auto; border: 1px solid #dee2e6; border-radius: 8px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #e9ecef;">
                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">Nhân viên</th>
                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">Loại nghỉ</th>
                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">Ngày bắt đầu</th>
                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">Ngày kết thúc</th>
                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">Lý do</th>
                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">Trạng thái</th>
                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${leaves.map(leave => {
                            const employee = employees.find(emp => emp.id == leave.employee_id);
                            const employeeName = employee ? `${employee.first_name} ${employee.last_name}` : `ID: ${leave.employee_id}`;
                            
                            const leaveTypeText = leave.reason === 'annual' ? 'Phép năm' : 
                                                leave.reason === 'sick' ? 'Nghỉ ốm' : 
                                                leave.reason === 'personal' ? 'Nghỉ cá nhân' : 
                                                leave.reason || 'Khác';
                            
                            const statusText = leave.status === 'pending' ? 'Đang chờ' : 
                                             leave.status === 'approved' ? 'Đã duyệt' : 
                                             leave.status === 'rejected' ? 'Từ chối' : 
                                             leave.status;
                            
                            const statusClass = leave.status === 'pending' ? 'warning' : 
                                              leave.status === 'approved' ? 'success' : 
                                              leave.status === 'rejected' ? 'danger' : 
                                              'secondary';
                            
                            return `
                                <tr style="border-bottom: 1px solid #dee2e6;">
                                    <td style="padding: 12px;">${employeeName}</td>
                                    <td style="padding: 12px;">${leaveTypeText}</td>
                                    <td style="padding: 12px;">${leave.start_date}</td>
                                    <td style="padding: 12px;">${leave.end_date}</td>
                                    <td style="padding: 12px;">${leave.reason || 'N/A'}</td>
                                    <td style="padding: 12px;">
                                        <span class="status-badge ${statusClass}" style="padding: 4px 8px; border-radius: 4px; font-size: 0.85em;">
                                            ${statusText}
                                        </span>
                                    </td>
                                    <td style="padding: 12px;">
                                        ${leave.status === 'pending' ? `
                                            <button class="approve-btn" data-id="${leave.id}" style="padding: 6px 12px; background: #28a745; color: white; border: none; border-radius: 4px; margin-right: 5px; cursor: pointer;">Duyệt</button>
                                            <button class="reject-btn" data-id="${leave.id}" style="padding: 6px 12px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Từ chối</button>
                                        ` : ''}
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        // Add event listeners for approve/reject buttons
        document.querySelectorAll('.approve-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const leaveId = e.target.dataset.id;
                await handleApproveLeave(leaveId);
            });
        });
        
        document.querySelectorAll('.reject-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const leaveId = e.target.dataset.id;
                await handleRejectLeave(leaveId);
            });
        });
    } catch (error) {
        console.error('Error rendering leave requests:', error);
        document.getElementById('leaveRequestsList').innerHTML = `<p>Error loading leave requests: ${error.message}</p>`;
    }
}

async function handleApproveLeave(leaveId) {
    try {
        if (confirm('Bạn có chắc chắn muốn duyệt yêu cầu nghỉ phép này?')) {
            await LeaveApi.approveLeave(leaveId);
            alert('Yêu cầu nghỉ phép đã được duyệt!');
            await renderLeaveRequests();
        }
    } catch (error) {
        console.error('Error approving leave:', error);
        alert('Lỗi khi duyệt yêu cầu nghỉ phép: ' + error.message);
    }
}

async function handleRejectLeave(leaveId) {
    try {
        if (confirm('Bạn có chắc chắn muốn từ chối yêu cầu nghỉ phép này?')) {
            await LeaveApi.rejectLeave(leaveId);
            alert('Yêu cầu nghỉ phép đã bị từ chối!');
            await renderLeaveRequests();
        }
    } catch (error) {
        console.error('Error rejecting leave:', error);
        alert('Lỗi khi từ chối yêu cầu nghỉ phép: ' + error.message);
    }
}

// Add CSS styles for status badges
const style = document.createElement('style');
style.textContent = `
    .status-badge.warning {
        background-color: #ffc107;
        color: #212529;
    }
    
    .status-badge.success {
        background-color: #28a745;
        color: white;
    }
    
    .status-badge.danger {
        background-color: #dc3545;
        color: white;
    }
    
    .status-badge.secondary {
        background-color: #6c757d;
        color: white;
    }
`;
document.head.appendChild(style);