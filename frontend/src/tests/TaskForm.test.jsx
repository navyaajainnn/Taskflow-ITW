import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskForm from '../components/TaskForm';

describe('TaskForm', () => {
  it('shows a validation error and does not submit when title is empty', () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);

    fireEvent.click(screen.getByText('Add task'));

    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with the entered values when the form is valid', () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Write README' },
    });
    fireEvent.click(screen.getByText('Add task'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Write README', status: 'PENDING' })
    );
  });
});
