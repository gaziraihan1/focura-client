import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../../components/LoginForm';

describe('LoginForm', () => {
    test('renders login form', () => {
        render(<LoginForm />);
        const emailInput = screen.getByPlaceholderText(/email/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });

    test('allows users to submit form', () => {
        render(<LoginForm />);
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        // Add assertions here to check expected outcomes
    });
});