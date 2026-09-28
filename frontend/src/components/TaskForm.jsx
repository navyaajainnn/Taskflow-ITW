import {useState} from 'react';
import Input from './Input';
import Button from './Button';

const EMPTY_TASK = { title: '', description: '', status: 'PENDING', dueDate: '' };

export default function TaskForm({ initialTask, onSubmit, onCancel }) {
  const [values, setValues] = useState(
    initialTask
      ? { ...EMPTY_TASK, ...initialTask, dueDate: initialTask.dueDate?.slice(0, 10) || '' }
      : EMPTY_TASK
  );
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (!values.title.trim()) next.title = 'Title is required';
    else if (values.title.trim().length > 120) next.title = 'Title must be under 120 characters';
    if (values.dueDate && Number.isNaN(Date.parse(values.dueDate))) {
      next.dueDate = 'Enter a valid date';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
  e.preventDefault();
  if (!validate()) return;

  setSubmitting(true);
  try{
    await onSubmit({ ...values, dueDate: values.dueDate || null });
  }catch (err) {
  const serverErrors = err.response?.data?.errors;
  const message = serverErrors?.length
    ? serverErrors.map((e) => e.message).join(', ')
    : err.response?.data?.message || 'Something went wrong. Please try again.';
  setErrors({ ...errors, form: message });
}finally {
    setSubmitting(false);
  }
}

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-stone-800 bg-stone-900/90 p-5 shadow-lg shadow-black/10">
      <Input
        id="title"
        label="Title"
        value={values.title}
        error={errors.title}
        onChange={(e) => setValues({ ...values, title: e.target.value })}
        placeholder="e.g. Finish assessment README"
      />

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-stone-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={values.description}
          onChange={(e) => setValues({ ...values, description: e.target.value })}
          className="w-full rounded-xl border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="Optional details"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-stone-300 mb-1">
            Status
          </label>
          <select
            id="status"
            value={values.status}
            onChange={(e) => setValues({ ...values, status: e.target.value })}
            className="w-full rounded-xl border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-stone-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <Input
          id="dueDate"
          label="Due date"
          type="date"
          min={new Date().toISOString().slice(0, 10)}
          max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)}
          value={values.dueDate}
          error={errors.dueDate}
          onChange={(e) => setValues({ ...values, dueDate: e.target.value })}
        />
      </div>
{errors.form && <p className="text-sm text-red-600 mb-2">{errors.form}</p>}
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : initialTask ? 'Save changes' : 'Add task'}
        </Button>
      </div>
    </form>
  );
}