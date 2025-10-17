import * as EmployeeDb from './employeeDbModule.js';

let reviews = [];

function loadReviews() {
    reviews = JSON.parse(localStorage.getItem('performanceReviews') || '[]');
}

function saveReviews() {
    localStorage.setItem('performanceReviews', JSON.stringify(reviews));
}

export async function initModule(container) {
    loadReviews();
    
    // Get all employees for dropdown
    const employees = EmployeeDb.getAllEmployees();
    
    container.innerHTML = `
        <h2>Đánh giá Hiệu suất</h2>
        <div style="margin-bottom: 30px;">
            <h3>Thêm đánh giá hiệu suất</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div>
                    <label for="reviewEmployeeId">Nhân viên:</label>
                    <select id="reviewEmployeeId" style="width: 100%; padding: 12px;">
                        <option value="">Chọn nhân viên</option>
                        ${employees.map(emp => `<option value="${emp.id}">${emp.name} (ID: ${emp.id})</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label for="rating">Đánh giá (1-5):</label>
                    <select id="rating" style="width: 100%; padding: 12px;">
                        <option value="1">1 - Kém</option>
                        <option value="2">2 - Trung bình</option>
                        <option value="3">3 - Khá</option>
                        <option value="4">4 - Tốt</option>
                        <option value="5">5 - Xuất sắc</option>
                    </select>
                </div>
            </div>
            <div style="margin-bottom: 20px;">
                <label for="feedback">Phản hồi:</label>
                <textarea id="feedback" placeholder="Nhập phản hồi" rows="4" style="width: 100%; padding: 12px;"></textarea>
            </div>
            <button id="addReviewBtn" style="padding: 12px 25px;">Thêm đánh giá</button>
        </div>
        <div>
            <h3>Báo cáo hiệu suất</h3>
            <button id="generateReportBtn" style="padding: 12px 25px; margin-bottom: 20px;">Tạo báo cáo hiệu suất</button>
            <div id="performanceReport"></div>
        </div>
    `;
    
    document.getElementById('addReviewBtn').addEventListener('click', () => {
        const employeeId = parseInt(document.getElementById('reviewEmployeeId').value);
        const rating = parseInt(document.getElementById('rating').value);
        const feedback = document.getElementById('feedback').value;
        
        if (employeeId && rating) {
            addReview(employeeId, rating, feedback);
            alert('Đánh giá đã được thêm thành công!');
            document.getElementById('reviewEmployeeId').value = '';
            document.getElementById('feedback').value = '';
        } else {
            alert('Vui lòng chọn nhân viên và đánh giá!');
        }
    });
    
    document.getElementById('generateReportBtn').addEventListener('click', () => {
        const report = generatePerformanceReport();
        renderPerformanceReport(report);
    });
}

function renderPerformanceReport(report) {
    const reportContainer = document.getElementById('performanceReport');
    
    // Get all employees for name lookup
    const employees = EmployeeDb.getAllEmployees();
    
    if (report.topPerformers.length === 0) {
        reportContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; background: #f7fafc; border-radius: 8px;">
                <p>Chưa có đánh giá hiệu suất nào</p>
            </div>
        `;
        return;
    }
    
    reportContainer.innerHTML = `
        <h4>Nhân viên có hiệu suất cao nhất</h4>
        <div style="overflow-x: auto; margin-bottom: 30px;">
            <table>
                <thead>
                    <tr>
                        <th>Nhân viên</th>
                        <th>Điểm trung bình</th>
                        <th>Tổng số đánh giá</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.topPerformers.map(emp => {
                        const employee = employees.find(e => e.id === emp.employeeId);
                        const employeeName = employee ? `${employee.name} (ID: ${employee.id})` : `ID: ${emp.employeeId}`;
                        return `
                            <tr>
                                <td>${employeeName}</td>
                                <td>${emp.averageRating.toFixed(2)}</td>
                                <td>${emp.totalReviews}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
        
        <h4>Tất cả đánh giá</h4>
        <div style="overflow-x: auto;">
            <table>
                <thead>
                    <tr>
                        <th>Nhân viên</th>
                        <th>Ngày</th>
                        <th>Đánh giá</th>
                        <th>Phản hồi</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.allReviews.map(review => {
                        const employee = employees.find(e => e.id === review.employeeId);
                        const employeeName = employee ? `${employee.name} (ID: ${employee.id})` : `ID: ${review.employeeId}`;
                        return `
                            <tr>
                                <td>${employeeName}</td>
                                <td>${new Date(review.date).toLocaleDateString()}</td>
                                <td>${review.rating}/5</td>
                                <td>${review.feedback}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

export function addReview(employeeId, rating, feedback) {
    loadReviews();
    reviews.push({ 
        employeeId, 
        date: new Date().toISOString(), 
        rating, 
        feedback 
    });
    saveReviews();
}

export function getAverageRating(employeeId) {
    loadReviews();
    const empReviews = reviews.filter(r => r.employeeId === employeeId);
    if (empReviews.length === 0) return 0;
    return empReviews.reduce((sum, r) => sum + r.rating, 0) / empReviews.length;
}

export function generatePerformanceReport() {
    loadReviews();
    
    // Get all unique employee IDs
    const employeeIds = [...new Set(reviews.map(r => r.employeeId))];
    
    // Calculate average ratings for each employee
    const employeeRatings = employeeIds.map(employeeId => {
        const empReviews = reviews.filter(r => r.employeeId === employeeId);
        const averageRating = empReviews.reduce((sum, r) => sum + r.rating, 0) / empReviews.length;
        return {
            employeeId,
            averageRating,
            totalReviews: empReviews.length
        };
    });
    
    // Sort by average rating (top performers first)
    const topPerformers = employeeRatings.sort((a, b) => b.averageRating - a.averageRating);
    
    return {
        topPerformers,
        allReviews: [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date, newest first
    };
}