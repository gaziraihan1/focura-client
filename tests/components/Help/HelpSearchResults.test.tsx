import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HelpSearchResults } from '@/components/Help/HelpSearchResults';

describe('HelpSearchResults', () => {
  it('returns null when query is empty', () => {
    const { container } = render(<HelpSearchResults query="" />);
    expect(container.innerHTML).toBe('');
  });

  it('displays no-results message for unmatched query', () => {
    render(<HelpSearchResults query="xyznonexistent" />);
    expect(screen.getByText(/No results for/)).toBeInTheDocument();
  });

  it('shows matching article results', () => {
    render(<HelpSearchResults query="pomodoro" />);
    expect(screen.getByText(/result/)).toBeInTheDocument();
  });
});
