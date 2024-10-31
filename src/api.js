// src/api.js

import { API_URL } from './utils';

// Create a new task with all properties
export const CreateTask = async (taskObj) => {
    const url = `${API_URL}/tasks`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskObj),
    };
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Error creating task:', err);
        return { success: false, message: 'Failed to create task' };
    }
};

// Get all tasks from the database
export const GetAllTasks = async () => {
    const url = `${API_URL}/tasks`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Error fetching tasks:', err);
        return { success: false, message: 'Failed to fetch tasks' };
    }
};

// Update task by ID
export const UpdateTaskById = async (id, taskObj) => {
    const url = `${API_URL}/tasks/${id}`;
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskObj),
    };
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Error updating task:', err);
        return { success: false, message: 'Failed to update task' };
    }
};

// Delete task by ID
export const DeleteTaskById = async (id) => {
    const url = `${API_URL}/tasks/${id}`;
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(url, options);

        // Check if the response is successful
        if (!response.ok) {
            const errorData = await response.json(); // Try to get error details from response
            return { success: false, message: errorData.message || 'Failed to delete task' };
        }

        // Parse and return JSON response if successful
        const data = await response.json();
        return { success: true, ...data };
    } catch (err) {
        console.error('Error deleting task:', err);
        return { success: false, message: 'Failed to delete task due to network or server error' };
    }
};
