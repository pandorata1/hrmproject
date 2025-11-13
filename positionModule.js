let positions = [];

// API base URL
const API_BASE_URL = '/backend/api.php';

async function loadPositions() {
    try {
        const response = await fetch(`${API_BASE_URL}/positions`);
        if (response.ok) {
            positions = await response.json();
        } else {
            positions = [];
        }
    } catch (error) {
        console.error('Error loading positions:', error);
        positions = [];
    }
}

async function savePositions() {
    // This function is kept for compatibility but not used since we're using API calls
    console.log('Positions saved to backend');
}

export async function init() {
    await loadPositions();
    if (positions.length === 0) {
        // Khởi tạo dữ liệu mặc định
        await addPosition('Developer', 'Software development', 40000);
        await addPosition('Manager', 'Team management', 60000);
        await addPosition('Designer', 'UI/UX design', 35000);
        await addPosition('HR Specialist', 'Human resources', 30000);
    }
}

export async function getAllPositions() {
    await loadPositions();
    return [...positions];
}

export async function addPosition(title, description, salaryBase) {
    try {
        const response = await fetch(`${API_BASE_URL}/positions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                name: title, 
                description, 
                salaryBase,
                department_id: null  // Tạm thời để null, có thể thêm trường chọn phòng ban sau
            })
        });
        
        if (response.ok) {
            const newPosition = await response.json();
            await loadPositions(); // Refresh the local cache
            return newPosition;
        } else {
            const errorText = await response.text();
            try {
                const error = JSON.parse(errorText);
                throw new Error(error.error || 'Failed to add position');
            } catch (e) {
                throw new Error('Failed to add position: ' + errorText);
            }
        }
    } catch (error) {
        console.error('Error adding position:', error);
        throw error;
    }
}

export async function editPosition(id, updates) {
    try {
        // Call the update API endpoint
        const response = await fetch(`${API_BASE_URL}/positions`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, ...updates })
        });
        
        if (response.ok) {
            const updatedPosition = await response.json();
            await loadPositions(); // Refresh the local cache
            return updatedPosition;
        } else {
            const errorText = await response.text();
            try {
                const error = JSON.parse(errorText);
                throw new Error(error.error || 'Failed to update position');
            } catch (e) {
                throw new Error('Failed to update position: ' + errorText);
            }
        }
    } catch (error) {
        console.error('Error editing position:', error);
        throw error;
    }
}

export async function deletePosition(id) {
    try {
        // Call the delete API endpoint
        const response = await fetch(`${API_BASE_URL}/positions?id=${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await loadPositions(); // Refresh the local cache
            return true;
        } else {
            const errorText = await response.text();
            try {
                const error = JSON.parse(errorText);
                throw new Error(error.error || 'Failed to delete position');
            } catch (e) {
                throw new Error('Failed to delete position: ' + errorText);
            }
        }
    } catch (error) {
        console.error('Error deleting position:', error);
        throw error;
    }
}

async function simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 500));
}

export async function initModule(container) {
    await loadPositions();
    
    // Create container with ID for re-rendering
    const positionsContainer = document.createElement('div');
    positionsContainer.id = 'positions-container';
    container.appendChild(positionsContainer);
    
    const form = document.createElement('form');
    form.innerHTML = `
        <h3>Thêm Vị trí Mới</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
            <div>
                <label for="title">Tên vị trí:</label>
                <input type="text" id="title" placeholder="Tên vị trí" required>
            </div>
            <div>
                <label for="description">Mô tả:</label>
                <input type="text" id="description" placeholder="Mô tả công việc" required>
            </div>
            <div>
                <label for="salaryBase">Lương cơ bản:</label>
                <input type="number" id="salaryBase" placeholder="Lương cơ bản" required min="0">
            </div>
        </div>
        <button type="submit" style="margin-top: 15px;">Thêm Vị trí</button>
    `;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const position = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            salaryBase: parseFloat(document.getElementById('salaryBase').value)
        };
        if (validatePosition(position)) {
            try {
                await addPosition(position.title, position.description, position.salaryBase);
                alert('Vị trí đã được thêm thành công');
                form.reset();
                await renderTable(positionsContainer);
            } catch (error) {
                alert('Error adding position: ' + error.message);
            }
        } else {
            alert('Dữ liệu nhập không hợp lệ. Vui lòng kiểm tra lại.');
        }
    });

    positionsContainer.appendChild(form);
    
    const table = document.createElement('table');
    table.id = 'positionsTable';
    positionsContainer.appendChild(table);
    await renderTable(positionsContainer);
}

function validatePosition(pos) {
    return pos.title && pos.description && (!isNaN(pos.salaryBase) && pos.salaryBase >= 0);
}

async function renderTable(container) {
    const positions = await getAllPositions();
    const table = container.querySelector('#positionsTable');
    if (!table) return;
    
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Tên vị trí</th>
                <th>Mô tả</th>
                <th>Lương cơ bản</th>
                <th>Hành động</th>
            </tr>
        </thead>
        <tbody>
            ${positions.map(pos => `
                <tr>
                    <td>${pos.id}</td>
                    <td>${pos.title || pos.name || 'Không có tên'}</td>
                    <td>${pos.description || ''}</td>
                    <td>${pos.salary_base ? parseFloat(pos.salary_base).toLocaleString() : '0'} VNĐ</td>
                    <td>
                        <button onclick="deletePosition(${pos.id})" style="background: #f56565;">Xóa</button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
}

// Export data as JSON string
export async function exportAsJson() {
    await loadPositions();
    return JSON.stringify(positions, null, 2);
}

// Import data from JSON string
export async function importFromJson(jsonString) {
    try {
        const parsed = JSON.parse(jsonString);
        if (Array.isArray(parsed)) {
            positions = parsed;
            await savePositions();
            return true;
        }
        return false;
    } catch (e) {
        console.error('Error importing positions data:', e);
        return false;
    }
}

// Initialize on load
init();