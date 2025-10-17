let positions = [];

function loadPositions() {
    const data = localStorage.getItem('positions');
    if (data) {
        try {
            positions = JSON.parse(data);
        } catch (e) {
            console.error('Error parsing positions data:', e);
            positions = [];
        }
    } else {
        positions = [];
    }
}

function savePositions() {
    try {
        localStorage.setItem('positions', JSON.stringify(positions, null, 2));
    } catch (e) {
        console.error('Error saving positions data:', e);
    }
}

export function init() {
    loadPositions();
    if (positions.length === 0) {
        // Khởi tạo dữ liệu mặc định
        addPosition('Developer', 'Software development', 40000);
        addPosition('Manager', 'Team management', 60000);
        addPosition('Designer', 'UI/UX design', 35000);
        addPosition('HR Specialist', 'Human resources', 30000);
    }
}

export function getAllPositions() {
    loadPositions();
    return [...positions];
}

export function addPosition(title, description, salaryBase) {
    loadPositions();
    const id = Math.max(...positions.map(p => p.id || 0), 0) + 1;
    positions.push({ id, title, description, salaryBase });
    savePositions();
}

export function editPosition(id, updates) {
    loadPositions();
    const position = positions.find(p => p.id === id);
    if (position) {
        Object.assign(position, updates);
        savePositions();
    }
}

export function deletePosition(id) {
    loadPositions();
    positions = positions.filter(p => p.id !== id);
    savePositions();
    // Re-render the table if it exists
    const container = document.getElementById('positions-container');
    if (container) {
        renderTable(container);
    }
}

async function simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 500));
}

export async function initModule(container) {
    loadPositions();
    
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
            await simulateDelay(); // Giả lập async
            addPosition(position.title, position.description, position.salaryBase);
            alert('Vị trí đã được thêm thành công');
            form.reset();
            renderTable(positionsContainer);
        } else {
            alert('Dữ liệu nhập không hợp lệ. Vui lòng kiểm tra lại.');
        }
    });

    positionsContainer.appendChild(form);
    
    const table = document.createElement('table');
    table.id = 'positionsTable';
    positionsContainer.appendChild(table);
    renderTable(positionsContainer);
}

function validatePosition(pos) {
    return pos.title && pos.description && pos.salaryBase > 0;
}

function renderTable(container) {
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
            ${getAllPositions().map(pos => `
                <tr>
                    <td>${pos.id}</td>
                    <td>${pos.title}</td>
                    <td>${pos.description}</td>
                    <td>${pos.salaryBase.toLocaleString()} VNĐ</td>
                    <td>
                        <button onclick="deletePosition(${pos.id})" style="background: #f56565;">Xóa</button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
}

// Export data as JSON string
export function exportAsJson() {
    loadPositions();
    return JSON.stringify(positions, null, 2);
}

// Import data from JSON string
export function importFromJson(jsonString) {
    try {
        const parsed = JSON.parse(jsonString);
        if (Array.isArray(parsed)) {
            positions = parsed;
            savePositions();
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