// API base URL
const API_BASE_URL = '/backend/api.php';

export async function getAllAttendance() {
    try {
        const response = await fetch(`${API_BASE_URL}/attendance`);
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch attendance records');
        }
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        throw error;
    }
}

export async function getAttendanceByEmployee(employeeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/attendance?employee_id=${employeeId}`);
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch attendance records');
        }
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        throw error;
    }
}

export async function checkIn(employeeId, date, checkInTime) {
    try {
        const response = await fetch(`${API_BASE_URL}/attendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'check_in',
                employee_id: employeeId,
                date: date,
                check_in: checkInTime
            })
        });
        
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to check in');
        }
    } catch (error) {
        console.error('Error checking in:', error);
        throw error;
    }
}

export async function checkOut(employeeId, date, checkOutTime) {
    try {
        const response = await fetch(`${API_BASE_URL}/attendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'check_out',
                employee_id: employeeId,
                date: date,
                check_out: checkOutTime
            })
        });
        
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to check out');
        }
    } catch (error) {
        console.error('Error checking out:', error);
        throw error;
    }
}

export async function createAttendance(attendance) {
    try {
        const response = await fetch(`${API_BASE_URL}/attendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(attendance)
        });
        
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create attendance record');
        }
    } catch (error) {
        console.error('Error creating attendance record:', error);
        throw error;
    }
}

export async function updateAttendance(attendance) {
    try {
        const response = await fetch(`${API_BASE_URL}/attendance`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(attendance)
        });
        
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update attendance record');
        }
    } catch (error) {
        console.error('Error updating attendance record:', error);
        throw error;
    }
}

export async function deleteAttendance(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/attendance?id=${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete attendance record');
        }
    } catch (error) {
        console.error('Error deleting attendance record:', error);
        throw error;
    }
}