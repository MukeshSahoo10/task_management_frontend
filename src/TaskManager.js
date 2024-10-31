import React, { useEffect, useState } from 'react';
// import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import { CreateTask, DeleteTaskById, GetAllTasks, UpdateTaskById } from './api';
import { notify } from './utils';

function TaskManager() {
    const [input, setInput] = useState({
        task_name: '',
        description: '',
        due_date: '',
        priority: 'Low',
        assigned_to: '',
        status: 'Pending',
    });
    const [tasks, setTasks] = useState([]);
    const [updateTask, setUpdateTask] = useState(null);
    const [filter, setFilter] = useState({ status: '', priority: '', due_date: '' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAllTasks();
    }, []);

    useEffect(() => {
        if (updateTask) {
            setInput(updateTask);
        } else {
            resetInput();
        }
    }, [updateTask]);

    const fetchAllTasks = async () => {
        try {
            const { data } = await GetAllTasks();
            if (Array.isArray(data)) {
                setTasks(data);
            } else {
                console.error('Expected data to be an array:', data);
                notify('Failed to fetch tasks', 'error');
            }
        } catch (err) {
            console.error(err);
            notify('Failed to fetch tasks', 'error');
        }
    };

    const handleTaskSubmit = async () => {
        try {
            if (updateTask) {
                await handleUpdateTask();
            } else {
                await handleCreateTask();
            }
            resetInput();
        } catch (err) {
            console.error(err);
            notify('Operation failed', 'error');
        }
    };

    const handleCreateTask = async () => {
        try {
            const result = await CreateTask(input);
            notify(result.message, result.success ? 'success' : 'error');
            if (result.success) {
                fetchAllTasks();
            }
        } catch (err) {
            console.error(err);
            notify('Failed to create task', 'error');
        }
    };

    const handleUpdateTask = async () => {
        try {
            const result = await UpdateTaskById(updateTask.id, input);  // Adjusted for MySQL's `id`
            notify(result.message, result.success ? 'success' : 'error');
            if (result.success) {
                fetchAllTasks();
                setUpdateTask(null);
            }
        } catch (err) {
            console.error(err);
            notify('Failed to update task', 'error');
        }
    };

    const handleDeleteTask = async (id) => {
        console.log("on button click",id);
        try {
            const result = await DeleteTaskById(id);
            notify(result.message, result.success ? 'success' : 'error');
            if (result.success) {
                setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id)); // Adjusted for MySQL's `id`
            }
        } catch (err) {
            console.error('Delete task failed:', err);
            notify('Failed to delete task. Please try again.', 'error');
        }
    };

    const handleFilter = (field, value) => {
        setFilter((prev) => ({ ...prev, [field]: value }));
    };

    const applyFilters = (task) => {
        const { status, priority, due_date } = filter;
        return (
            (!status || task.status === status) &&
            (!priority || task.priority === priority) &&
            (!due_date || new Date(task.due_date) <= new Date(due_date))
        );
    };

    const filteredTasks = tasks.filter((task) => {
        return (
            applyFilters(task) &&
            task.task_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const resetInput = () => {
        setInput({ task_name: '', description: '', due_date: '', priority: 'Low', assigned_to: '', status: 'Pending' });
    };

    return (
        <div className='d-flex flex-column align-items-center w-75 m-auto mt-5'>
            <h1 className='mb-4'>Task Manager App</h1>

            {/* Task Creation/Update Fields */}
            <div className='d-flex flex-column mb-4 w-100'>
                <input
                    type='text'
                    placeholder='Task Name'
                    value={input.task_name}
                    onChange={(e) => setInput({ ...input, task_name: e.target.value })}
                    className='form-control mb-2'
                />
                <textarea
                    placeholder='Description'
                    value={input.description}
                    onChange={(e) => setInput({ ...input, description: e.target.value })}
                    className='form-control mb-2'
                />
                <input
                    type='date'
                    value={input.due_date}
                    onChange={(e) => setInput({ ...input, due_date: e.target.value })}
                    className='form-control mb-2'
                />
                <select
                    value={input.priority}
                    onChange={(e) => setInput({ ...input, priority: e.target.value })}
                    className='form-select mb-2'
                >
                    <option value='Low'>Low</option>
                    <option value='Medium'>Medium</option>
                    <option value='High'>High</option>
                </select>
                <select
                    value={input.status}
                    onChange={(e) => setInput({ ...input, status: e.target.value })}
                    className='form-select mb-2'
                >
                    <option value='Pending'>Pending</option>
                    <option value='In Progress'>In Progress</option>
                    <option value='Completed'>Completed</option>
                </select>
                <input
                    type='text'
                    placeholder='Assign to'
                    value={input.assigned_to}
                    onChange={(e) => setInput({ ...input, assigned_to: e.target.value })}
                    className='form-control mb-2'
                />
                <button onClick={handleTaskSubmit} className='btn btn-success mb-4'>
                    {updateTask ? 'Update Task' : 'Add Task'}
                </button>
            </div>

            {/* Filter & Search Section */}
            {/* <div className='d-flex mb-4 w-100'>
                <input
                    type='text'
                    placeholder='Search tasks...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='form-control me-2'
                />
                <select onChange={(e) => handleFilter('status', e.target.value)} className='form-select me-2'>
                    <option value=''>Status</option>
                    <option value='Pending'>Pending</option>
                    <option value='In Progress'>In Progress</option>
                    <option value='Completed'>Completed</option>
                </select>
                <select onChange={(e) => handleFilter('priority', e.target.value)} className='form-select me-2'>
                    <option value=''>Priority</option>
                    <option value='Low'>Low</option>
                    <option value='Medium'>Medium</option>
                    <option value='High'>High</option>
                </select>
                <input
                    type='date'
                    onChange={(e) => handleFilter('due_date', e.target.value)}
                    className='form-control'
                />
            </div> */}
            
            {/* Task List */}
            {/* <div className='d-flex flex-column w-100'>
                {filteredTasks.map((task) => (
                    <div key={task.id} className='m-2 p-2 border bg-light w-100 rounded d-flex justify-content-between align-items-center'>
                        <div>
                            <strong>{task.task_name}</strong>
                            <strong>{task.id}</strong>
                            <p>{task.description}</p>
                            <span>{task.due_date}</span>
                            <span className={`badge bg-${task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'secondary'}`}>
                                {task.priority}
                            </span>
                        </div>
                        <div className='d-flex'>
                            <button className='btn btn-warning me-2' onClick={() => setUpdateTask(task)}>
                                <FaPencilAlt />
                            </button>
                            <button className='btn btn-danger' onClick={() => handleDeleteTask(task.id)}>
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div> */}

            <ToastContainer />
        </div>
    );
}

export default TaskManager;
