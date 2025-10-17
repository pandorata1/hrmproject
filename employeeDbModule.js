let employees = [];

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
        employees = [];
    }
}

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
    return [...employees].sort(compareFn);
}

// Export data as JSON string
export function exportAsJson() {
    loadEmployees();
    return JSON.stringify(employees, null, 2);
}

// Import data from JSON string
export function importFromJson(jsonString) {
    try {
        const parsed = JSON.parse(jsonString);
        if (Array.isArray(parsed)) {
            employees = parsed;
            saveEmployees();
            return true;
        }
        return false;
    } catch (e) {
        console.error('Error importing employees data:', e);
        return false;
    }
}

init();