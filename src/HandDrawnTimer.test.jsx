import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HandDrawnTimer from './HandDrawnTimer';

import { vi, afterEach } from 'vitest';

describe('HandDrawnTimer Component', () => {
  afterEach(() => {
    window.location.hash = '';
    vi.useRealTimers();
  });

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

  it('starts automatically and hides controls when #time=XXXX hash is present', () => {
    // Set a fixed date for reliable testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 0, 1, 12, 0, 0)); // 12:00:00 PM

    // Set hash to 19:30 (7:30 PM), which is 7 hours and 30 minutes in the future
    window.location.hash = '#time=1930';

    render(<HandDrawnTimer />);

    // Controls should not be in the document
    expect(screen.queryByText('Start')).not.toBeInTheDocument();
    expect(screen.queryByText('Reset')).not.toBeInTheDocument();

    // The display time should reflect the diff: 7 hours = 07, 30 mins = 30, 0 secs = 00
    // We can just verify the values are displayed
    // The structure has divs with the characters split
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('7').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(1);

    // Specifically verify it's not showing the setup inputs
    expect(screen.queryAllByRole('textbox')).toHaveLength(0);
  });
});
