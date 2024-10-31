import { toast } from 'react-toastify';

export const notify = (message, type) => {
    toast[type](message);
}
export const API_URL = 'https://task-management-backend-4pc7.onrender.com';