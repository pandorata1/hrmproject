let employees = [];

<<<<<<< HEAD
// API base URL
const API_BASE_URL = '/backend/api.php';

export async function init() {
    try {
        await loadEmployees();
        if (employees.length === 0) {
            // Không tạo dữ liệu mẫu nữa
            await saveEmployees();
        }
    } catch (error) {
        console.error('Error initializing employee module:', error);
    }
}

async function loadEmployees() {
    try {
        const response = await fetch(`${API_BASE_URL}/employees`);
        if (response.ok) {
            employees = await response.json();
        } else {
            employees = [];
        }
    } catch (error) {
        console.error('Error loading employees:', error);
=======
export function init() {
    loadEmployees();
    if (employees.length === 0) {
        // Không tạo dữ liệu mẫu nữa
        saveEmployees();
    }
}

function loadEmployees() {
    const data = localStorage.getItem('employees');
    if (data) {
        try {
            employees = JSON.parse(data);
        } catch (e) {
            console.error('Error parsing employees data:', e);
            employees = [];
        }
    } else {
>>>>>>> a380d625c488eb8fe1868308530a9783db0eba5c
        employees = [];
    }
}

<<<<<<< HEAD
async function saveEmployees() {
    // This function is kept for compatibility but not used since we're using API calls
    try {
        // In a real implementation, we would sync with the backend here
        console.log('Employees saved to backend');
    } catch (error) {
        console.error('Error saving employees:', error);
    }
}

export async function getAllEmployees() {
    await loadEmployees();
    return [...employees];
}

export async function getEmployeeById(id) {
    await loadEmployees();
    return employees.find(e => e.id == id); // Using == because id might be string from API
}

export async function addEmployee(employee) {
    try {
        const response = await fetch(`${API_BASE_URL}/employees`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employee)
        });
        
        if (response.ok) {
            const newEmployee = await response.json();
            await loadEmployees(); // Refresh the local cache
            return newEmployee;
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add employee');
        }
    } catch (error) {
        console.error('Error adding employee:', error);
        throw error;
    }
}

export async function updateEmployee(id, updates) {
    try {
        const response = await fetch(`${API_BASE_URL}/employees`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, ...updates })
        });
        
        if (response.ok) {
            const updatedEmployee = await response.json();
            await loadEmployees(); // Refresh the local cache
            return updatedEmployee;
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update employee');
        }
    } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
    }
}

export async function deleteEmployee(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/employees?id=${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await loadEmployees(); // Refresh the local cache
            return true;
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete employee');
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
    }
}

// Higher-order for filter/sort
export async function filterEmployees(predicate) {
    await loadEmployees();
    return employees.filter(predicate);
}

export async function sortEmployees(compareFn) {
    await loadEmployees();
=======
function saveEmployees() {
    try {
        localStorage.setItem('employees', JSON.stringify(employees, null, 2));
    } catch (e) {
        console.error('Error saving employees data:', e);
    }
}

function initDefaultEmployees() {
    // Không tạo dữ liệu mẫu
    employees = [];
    saveEmployees();
}

export function getAllEmployees() {
    loadEmployees();
    return [...employees];
}

export function getEmployeeById(id) {
    loadEmployees();
    return employees.find(e => e.id === id);
}

export function addEmployee(employee) {
    loadEmployees();
    employee.id = Math.max(...employees.map(e => e.id), 0) + 1;
    // Set default values if not provided
    if (employee.bonus === undefined) employee.bonus = 0;
    if (employee.deduction === undefined) employee.deduction = 0;
    if (employee.hireDate === undefined) employee.hireDate = new Date().toISOString().split('T')[0];
    
    employees.push(employee);
    saveEmployees();
}

export function updateEmployee(id, updates) {
    loadEmployees();
    const index = employees.findIndex(e => e.id === id);
    if (index !== -1) {
        employees[index] = { ...employees[index], ...updates };
        saveEmployees();
    }
}

export function deleteEmployee(id) {
    loadEmployees();
    employees = employees.filter(e => e.id !== id);
    saveEmployees();
}

// Higher-order for filter/sort
export function filterEmployees(predicate) {
    loadEmployees();
    return employees.filter(predicate);
}

export function sortEmployees(compareFn) {
    loadEmployees();
>>>>>>> a380d625c488eb8fe1868308530a9783db0eba5c
    return [...employees].sort(compareFn);
}

// Export data as JSON string
<<<<<<< HEAD
export async function exportAsJson() {
    await loadEmployees();
=======
export function exportAsJson() {
    loadEmployees();
>>>>>>> a380d625c488eb8fe1868308530a9783db0eba5c
    return JSON.stringify(employees, null, 2);
}

// Import data from JSON string
<<<<<<< HEAD
export async function importFromJson(jsonString) {
    try {
        const parsed = JSON.parse(jsonString);
        if (Array.isArray(parsed)) {
            // For simplicity, we'll just replace all employees
            // In a real implementation, you might want to handle this differently
            employees = parsed;
            await saveEmployees();
=======
export function importFromJson(jsonString) {
    try {
        const parsed = JSON.parse(jsonString);
        if (Array.isArray(parsed)) {
            employees = parsed;
            saveEmployees();
>>>>>>> a380d625c488eb8fe1868308530a9783db0eba5c
            return true;
        }
        return false;
    } catch (e) {
        console.error('Error importing employees data:', e);
        return false;
    }
}

init();