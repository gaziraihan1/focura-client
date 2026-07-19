import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HelpCategories } from '@/components/Help/HelpCategories';

describe('HelpCategories', () => {
  it('renders the section heading', () => {
    render(<HelpCategories onCategoryClick={vi.fn()} />);
    expect(screen.getByText('All help categories')).toBeInTheDocument();
  });

  it('renders all category cards', () => {
    render(<HelpCategories onCategoryClick={vi.fn()} />);
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('Tasks & Subtasks')).toBeInTheDocument();
    expect(screen.getByText('Troubleshooting')).toBeInTheDocument();
  });

  it('calls onCategoryClick with the correct id when a card is clicked', () => {
    const onClick = vi.fn();
    render(<HelpCategories onCategoryClick={onClick} />);
    fireEvent.click(screen.getByText('Getting Started'));
    expect(onClick).toHaveBeenCalledWith('getting-started');
  });

  it('displays article counts for categories', () => {
    render(<HelpCategories onCategoryClick={vi.fn()} />);
    expect(screen.getAllByText(/articles/).length).toBeGreaterThan(0);
  });
});
