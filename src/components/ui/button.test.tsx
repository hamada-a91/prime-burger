import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';
import { describe, it, expect, vi } from 'vitest';

describe('Button', () => {
    it('renders correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('handles click events', async () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Click me</Button>);

        await userEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('can be disabled', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });
});
