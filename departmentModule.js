let departments = [];

function loadDepartments() {
    departments = JSON.parse(localStorage.getItem('departments') || '[]');
}

function saveDepartments() {
    localStorage.setItem('departments', JSON.stringify(departments));
}

export function init() {
    loadDepartments();
    if (departments.length === 0) {
        // Add defaults
        addDepartment('HR');
        addDepartment('IT');
        addDepartment('Finance');
        addDepartment('Marketing');
    }
}

export function getAllDepartments() {
    loadDepartments();
    return [...departments];
}

export function addDepartment(name) {
    loadDepartments();
    const id = Math.max(...departments.map(d => d.id), 0) + 1;
    departments.push({ id, name });
    saveDepartments();
}

export function editDepartment(id, newName) {
    loadDepartments();
    const dept = departments.find(d => d.id === id);
    if (dept) dept.name = newName;
    saveDepartments();
}

export function deleteDepartment(id) {
    loadDepartments();
    departments = departments.filter(d => d.id !== id);
    saveDepartments();
}

init();

export async function initModule(container) {
    loadDepartments();
    
    container.innerHTML = `
        <h2>Department Management</h2>
        <form id="departmentForm">
            <input type="text" id="departmentName" placeholder="Department Name" required>
            <button type="submit">Add Department</button>
        </form>
        <div id="departmentsList"></div>
    `;
    
    document.getElementById('departmentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('departmentName').value;
        if (name) {
            addDepartment(name);
            document.getElementById('departmentName').value = '';
            renderDepartmentsList();
        }
    });
    
    renderDepartmentsList();
}

function renderDepartmentsList() {
    const listContainer = document.getElementById('departmentsList');
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
                ${getAllDepartments().map(dept => `
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