import Button from './Button';

const STATUS_STYLES = {
  PENDING: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  DONE: 'bg-green-100 text-green-700',
};

const STATUS_LABELS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

export default function TaskCard({ task, onEdit, onDelete, onToggleStatus }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 break-words">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[task.status]}`}>
          {STATUS_LABELS[task.status]}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 break-words">{task.description}</p>
      )}

      {task.dueDate && (
        <p className="text-xs text-gray-400">
          Due {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      <div className="flex gap-2 mt-2 flex-wrap">
        <Button variant="secondary" onClick={() => onToggleStatus(task)}>
          Mark {task.status === 'DONE' ? 'Pending' : 'Done'}
        </Button>
        <Button variant="secondary" onClick={() => onEdit(task)}>
          Edit
        </Button>
        <Button variant="danger" onClick={() => onDelete(task)}>
          Delete
        </Button>
      </div>
    </div>
  );
}
