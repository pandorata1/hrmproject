import * as EmployeeDb from './employeeDbModule.js';
<<<<<<< HEAD
import * as PerformanceApi from './performanceApiModule.js';

export async function initModule(container) {
    try {
        // Get all employees for dropdown
        const employees = await EmployeeDb.getAllEmployees();
        
        container.innerHTML = `
            <h2>Đánh giá Hiệu suất</h2>
            <div style="margin-bottom: 30px;">
                <h3>Thêm đánh giá hiệu suất</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 20px;">
                    <div>
                        <label for="reviewEmployeeId">Nhân viên:</label>
                        <select id="reviewEmployeeId" style="width: 100%; padding: 12px;">
                            <option value="">Chọn nhân viên</option>
                            ${employees.map(emp => `<option value="${emp.id}">${emp.first_name} ${emp.last_name} (ID: ${emp.id})</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label for="reviewDate">Ngày đánh giá:</label>
                        <input type="date" id="reviewDate" style="width: 100%; padding: 12px;" value="${new Date().toISOString().split('T')[0]}">
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
        
        document.getElementById('addReviewBtn').addEventListener('click', async () => {
            const employeeId = parseInt(document.getElementById('reviewEmployeeId').value);
            const reviewDate = document.getElementById('reviewDate').value;
            const rating = parseFloat(document.getElementById('rating').value);
            const feedback = document.getElementById('feedback').value;
            
            if (employeeId && reviewDate && rating) {
                try {
                    await addReview(employeeId, reviewDate, rating, feedback);
                    alert('Đánh giá đã được thêm thành công!');
                    document.getElementById('reviewEmployeeId').value = '';
                    document.getElementById('feedback').value = '';
                } catch (error) {
                    alert('Lỗi khi thêm đánh giá: ' + error.message);
                }
            } else {
                alert('Vui lòng chọn nhân viên, ngày đánh giá và đánh giá!');
            }
        });
        
        document.getElementById('generateReportBtn').addEventListener('click', async () => {
            try {
                const report = await generatePerformanceReport();
                renderPerformanceReport(report);
            } catch (error) {
                alert('Lỗi khi tạo báo cáo: ' + error.message);
            }
        });
    } catch (error) {
        console.error('Error initializing performance module:', error);
        container.innerHTML = `<p>Error loading performance module: ${error.message}</p>`;
    }
}

async function renderPerformanceReport(report) {
    const reportContainer = document.getElementById('performanceReport');
    
    try {
        // Get all employees for name lookup
        const employees = await EmployeeDb.getAllEmployees();
        
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
                            const employee = employees.find(e => e.id == emp.employee_id);
                            const employeeName = employee ? `${employee.first_name} ${employee.last_name} (ID: ${employee.id})` : `ID: ${emp.employee_id}`;
                            return `
                                <tr>
                                    <td>${employeeName}</td>
                                    <td>${parseFloat(emp.average_rating).toFixed(2)}</td>
                                    <td>${emp.total_reviews}</td>
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
                            const employee = employees.find(e => e.id == review.employee_id);
                            const employeeName = employee ? `${employee.first_name} ${employee.last_name} (ID: ${employee.id})` : `ID: ${review.employee_id}`;
                            return `
                                <tr>
                                    <td>${employeeName}</td>
                                    <td>${review.review_date}</td>
                                    <td>${parseFloat(review.score).toFixed(1)}/5</td>
                                    <td>${review.comments || 'N/A'}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Error rendering performance report:', error);
        reportContainer.innerHTML = `<p>Error rendering performance report: ${error.message}</p>`;
    }
}

export async function addReview(employeeId, reviewDate, rating, feedback) {
    try {
        const reviewData = {
            employee_id: employeeId,
            review_date: reviewDate,
            score: rating,
            comments: feedback
        };
        
        return await PerformanceApi.createReview(reviewData);
    } catch (error) {
        console.error('Error adding review:', error);
        throw error;
    }
}

export async function getAverageRating(employeeId) {
    try {
        const rating = await PerformanceApi.getAverageRating(employeeId);
        return rating.average_rating ? parseFloat(rating.average_rating) : 0;
    } catch (error) {
        console.error('Error getting average rating:', error);
        return 0;
    }
}

export async function generatePerformanceReport() {
    try {
        const allReviews = await PerformanceApi.getAllReviews();
        const topPerformers = await PerformanceApi.getTopPerformers();
        
        // Sort by average rating (top performers first)
        topPerformers.sort((a, b) => parseFloat(b.average_rating) - parseFloat(a.average_rating));
        
        // Sort all reviews by date, newest first
        allReviews.sort((a, b) => new Date(b.review_date) - new Date(a.review_date));
        
        return {
            topPerformers,
            allReviews
        };
    } catch (error) {
        console.error('Error generating performance report:', error);
        throw error;
    }
=======

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
>>>>>>> a380d625c488eb8fe1868308530a9783db0eba5c
}