import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HelpFAQ } from '@/components/Help/HelpFaq';

describe('HelpFAQ', () => {
  it('renders the FAQ heading', () => {
    render(<HelpFAQ />);
    expect(screen.getByText('Frequently asked questions')).toBeInTheDocument();
  });

  it('renders FAQ group titles', () => {
    render(<HelpFAQ />);
    expect(screen.getByText('Account & Access')).toBeInTheDocument();
    expect(screen.getByText('Billing & Payments')).toBeInTheDocument();
  });

  it('expands a FAQ item when clicked', () => {
    render(<HelpFAQ />);
    const question = screen.getByText('Can I use Focura without creating an account?');
    fireEvent.click(question);
    expect(screen.getByText(/all Focura features require an account/)).toBeInTheDocument();
  });
});
