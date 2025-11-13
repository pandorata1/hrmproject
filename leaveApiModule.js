// API base URL
const API_BASE_URL = '/backend/api.php';

export async function getAllLeaves() {
    try {
        const response = await fetch(`${API_BASE_URL}/leaves`);
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch leave records');
        }
    } catch (error) {
        console.error('Error fetching leave records:', error);
        throw error;
    }
}

export async function getLeaveByEmployee(employeeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/leaves?employee_id=${employeeId}`);
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch leave records');
        }
    } catch (error) {
        console.error('Error fetching leave records:', error);
        throw error;
    }
}

export async function getLeave(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/leaves?id=${id}`);
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch leave record');
        }
    } catch (error) {
        console.error('Error fetching leave record:', error);
        throw error;
    }
}

export async function createLeave(leave) {
    try {
        const response = await fetch(`${API_BASE_URL}/leaves`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leave)
        });
        
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create leave record');
        }
    } catch (error) {
        console.error('Error creating leave record:', error);
        throw error;
    }
}

export async function updateLeave(leave) {
    try {
        const response = await fetch(`${API_BASE_URL}/leaves`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leave)
        });
        
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update leave record');
        }
    } catch (error) {
        console.error('Error updating leave record:', error);
        throw error;
    }
}

export async function deleteLeave(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/leaves?id=${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete leave record');
        }
    } catch (error) {
        console.error('Error deleting leave record:', error);
        throw error;
    }
}

export async function approveLeave(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/leaves`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                action: 'approve'
            })
        });
        
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to approve leave record');
        }
    } catch (error) {
        console.error('Error approving leave record:', error);
        throw error;
    }
}

export async function rejectLeave(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/leaves`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                action: 'reject'
            })
        });
        
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to reject leave record');
        }
    } catch (error) {
        console.error('Error rejecting leave record:', error);
        throw error;
    }
}