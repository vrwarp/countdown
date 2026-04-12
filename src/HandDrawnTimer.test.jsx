import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HandDrawnTimer from './HandDrawnTimer';

describe('HandDrawnTimer Component', () => {
  it('renders with the default setup time 00:08:12', () => {
    render(<HandDrawnTimer />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(3);
    expect(inputs[0]).toHaveValue('00'); // hours
    expect(inputs[1]).toHaveValue('08'); // minutes
    expect(inputs[2]).toHaveValue('12'); // seconds

    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });
});
