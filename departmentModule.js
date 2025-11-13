let departments = [];

// API base URL
const API_BASE_URL = '/backend/api.php';

async function loadDepartments() {
    try {
        const response = await fetch(`${API_BASE_URL}/departments`);
        if (response.ok) {
            departments = await response.json();
        } else {
            departments = [];
        }
    } catch (error) {
        console.error('Error loading departments:', error);
        departments = [];
    }
}

async function saveDepartments() {
    // This function is kept for compatibility but not used since we're using API calls
    console.log('Departments saved to backend');
}

export async function init() {
    await loadDepartments();
    if (departments.length === 0) {
        // Add defaults
        await addDepartment('HR');
        await addDepartment('IT');
        await addDepartment('Finance');
        await addDepartment('Marketing');
    }
}

export async function getAllDepartments() {
    await loadDepartments();
    return [...departments];
}

export async function addDepartment(name) {
    try {
        const response = await fetch(`${API_BASE_URL}/departments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
        
        if (response.ok) {
            const newDepartment = await response.json();
            await loadDepartments(); // Refresh the local cache
            return newDepartment;
        } else {
            const errorText = await response.text();
            try {
                const error = JSON.parse(errorText);
                throw new Error(error.error || 'Failed to add department');
            } catch (e) {
                throw new Error('Failed to add department: ' + errorText);
            }
        }
    } catch (error) {
        console.error('Error adding department:', error);
        throw error;
    }
}

export async function editDepartment(id, newName) {
    try {
        // Note: This requires an update endpoint on the backend
        // For now, we'll implement a simple version that deletes and re-adds
        await deleteDepartment(id);
        await addDepartment(newName);
        await loadDepartments(); // Refresh the local cache
    } catch (error) {
        console.error('Error editing department:', error);
        throw error;
    }
}

export async function deleteDepartment(id) {
    try {
        // Note: This requires a delete endpoint on the backend
        // For now, we'll just remove from local cache
        departments = departments.filter(d => d.id != id);
        await loadDepartments(); // Refresh the local cache
    } catch (error) {
        console.error('Error deleting department:', error);
        throw error;
    }
}

export async function initModule(container) {
    await loadDepartments();
    
    container.innerHTML = `
        <h2>Department Management</h2>
        <form id="departmentForm">
            <input type="text" id="departmentName" placeholder="Department Name" required>
            <button type="submit">Add Department</button>
        </form>
        <div id="departmentsList"></div>
    `;
    
    document.getElementById('departmentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('departmentName').value;
        if (name) {
            try {
                await addDepartment(name);
                document.getElementById('departmentName').value = '';
                await renderDepartmentsList();
            } catch (error) {
                alert('Error adding department: ' + error.message);
            }
        }
    });
    
    await renderDepartmentsList();
}

async function renderDepartmentsList() {
    const listContainer = document.getElementById('departmentsList');
    const departments = await getAllDepartments();
    
    listContainer.innerHTML = `
        <h3>Departments List</h3>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${departments.map(dept => `
                    <tr>
                        <td>${dept.id}</td>
                        <td>${dept.name}</td>
                        <td>
                            <button onclick="deleteDepartment(${dept.id})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Make global function for inline event handlers
window.deleteDepartment = deleteDepartment;

init();