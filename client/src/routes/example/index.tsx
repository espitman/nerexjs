import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { type TaskDto, type CreateTaskDto } from '@nerexjs/shared-dtos';
import { useApiQuery, useApiMutation } from '../../hook/useApiService';

export const Route = createFileRoute()({
  component: TaskList,
});

function TaskList() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'med' | 'high'>('med');

  // Query for tasks
  const {
    data: tasks = [],
    error,
    isLoading,
    refetch,
  } = useApiQuery<TaskDto[]>('/tasks');

  // Mutation for creating a task
  const createTaskMutation = useApiMutation<TaskDto, CreateTaskDto>(
    'POST',
    '/tasks',
    {
      onSuccess: () => {
        setTitle('');
        setDate('');
        refetch();
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTaskMutation.mutate({ title, ...(date ? { date } : {}), ...(description ? { description } : {}), priority });
  };

  return (
    <div className="max-w-xl mx-auto my-8 font-sans">
      <h1 className='font-bold mb-3 text-xl'>Task Lists</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          minLength={3}
          required
          className="p-2 w-1/2 border rounded"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 w-1/3 ml-2 border rounded"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="p-2 w-full mt-2 border rounded"
        />
        <select
          value={priority}
          onChange={e => setPriority(e.target.value as 'low' | 'med' | 'high')}
          className="p-2 mt-2 border rounded"
          required
        >
          <option value="low">Low</option>
          <option value="med">Medium</option>
          <option value="high">High</option>
        </select>
        <br/>
        <button type="submit" disabled={createTaskMutation.status === 'pending'} className="p-2 mt-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          Add Task
        </button>
      </form>
      {error && <div className="text-red-600 mb-4">{error.message}</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`mb-3 ${task.isDone ? 'line-through text-gray-400' : ''}`}
            >
              <Link
                to="/example/tasks/$id"
                params={{ id: String(task.id) }}
                className="text-blue-700 underline cursor-pointer hover:text-blue-900"
              >
                {task.title}
              </Link>
              {task.priority && (
                <span className="ml-2 text-xs px-2 py-1 rounded bg-gray-200">
                  {task.priority.toUpperCase()}
                </span>
              )}
              {task.date && (
                <span className="text-gray-500 text-xs ml-2">
                  {new Date(task.date).toLocaleDateString()}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      {/* Move the About link to the bottom of the page */}
      <div className="mt-8 text-center">
        <Link to="/example/about" className="text-blue-600 hover:underline">About the Project</Link>
      </div>
    </div>
  );
}

export default TaskList; 