// API base URL
const API_BASE_URL = '/backend/api.php';

export async function getAllReviews() {
    try {
        const response = await fetch(`${API_BASE_URL}/performance`);
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch performance reviews');
        }
    } catch (error) {
        console.error('Error fetching performance reviews:', error);
        throw error;
    }
}

export async function getReviewByEmployee(employeeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/performance?employee_id=${employeeId}`);
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch performance reviews');
        }
    } catch (error) {
        console.error('Error fetching performance reviews:', error);
        throw error;
    }
}

export async function getReview(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/performance?id=${id}`);
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch performance review');
        }
    } catch (error) {
        console.error('Error fetching performance review:', error);
        throw error;
    }
}

export async function createReview(review) {
    try {
        const response = await fetch(`${API_BASE_URL}/performance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(review)
        });
        
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create performance review');
        }
    } catch (error) {
        console.error('Error creating performance review:', error);
        throw error;
    }
}

export async function updateReview(review) {
    try {
        const response = await fetch(`${API_BASE_URL}/performance`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(review)
        });
        
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update performance review');
        }
    } catch (error) {
        console.error('Error updating performance review:', error);
        throw error;
    }
}

export async function deleteReview(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/performance?id=${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete performance review');
        }
    } catch (error) {
        console.error('Error deleting performance review:', error);
        throw error;
    }
}

export async function getAverageRating(employeeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/performance?action=average&employee_id=${employeeId}`);
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch average rating');
        }
    } catch (error) {
        console.error('Error fetching average rating:', error);
        throw error;
    }
}

export async function getTopPerformers() {
    try {
        const response = await fetch(`${API_BASE_URL}/performance?action=top`);
        if (response.ok) {
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch top performers');
        }
    } catch (error) {
        console.error('Error fetching top performers:', error);
        throw error;
    }
}