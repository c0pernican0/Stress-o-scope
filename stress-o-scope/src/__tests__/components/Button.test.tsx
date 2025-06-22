import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // For extended matchers like .toBeInTheDocument()
import { Button } from '@/components/ui'; // Assuming Button is exported from ui/index.ts

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('bg-nebula-purple'); // Default variant is primary
    expect(buttonElement).toHaveClass('px-4 py-2'); // Default size is md
  });

  it('renders with specified variant (secondary)', () => {
    render(<Button variant="secondary">Secondary Action</Button>);
    const buttonElement = screen.getByRole('button', { name: /secondary action/i });
    expect(buttonElement).toHaveClass('bg-gray-200');
  });

  it('renders with specified variant (cosmic)', () => {
    render(<Button variant="cosmic">Cosmic Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /cosmic button/i });
    expect(buttonElement).toHaveClass('bg-gradient-to-r'); // Check for part of gradient class
  });

  it('renders with specified size (lg)', () => {
    render(<Button size="lg">Large Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /large button/i });
    expect(buttonElement).toHaveClass('px-6 py-3'); // lg size styles
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /disabled button/i });
    expect(buttonElement).toBeDisabled();
    expect(buttonElement).toHaveClass('opacity-50 cursor-not-allowed');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    const buttonElement = screen.getByRole('button', { name: /clickable/i });
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick handler when disabled and clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Non-Clickable</Button>);
    const buttonElement = screen.getByRole('button', { name: /non-clickable/i });
    fireEvent.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies additional className', () => {
    render(<Button className="extra-class">Styled Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /styled button/i });
    expect(buttonElement).toHaveClass('extra-class');
  });

  it('renders with correct type attribute', () => {
    render(<Button type="submit">Submit</Button>);
    const buttonElement = screen.getByRole('button', { name: /submit/i });
    expect(buttonElement).toHaveAttribute('type', 'submit');
  });
});
