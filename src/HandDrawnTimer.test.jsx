import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import HandDrawnTimer from './HandDrawnTimer';

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
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 0, 1, 12, 0, 0));

    window.location.hash = '#time=1930';

    render(<HandDrawnTimer />);

    expect(screen.queryByText('Start')).not.toBeInTheDocument();
    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
    expect(screen.queryAllByRole('textbox')).toHaveLength(0);
  });

  it('renders brain rot iframe when #brainrot is in the hash', () => {
    window.location.hash = '#brainrot';
    render(<HandDrawnTimer />);

    const iframe = screen.getByTitle('Brain rot content');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', expect.stringContaining('n_Dv4JMiwK8'));
  });

  it('handles combination of #time and #brainrot in hash', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 0, 1, 12, 0, 0));

    window.location.hash = '#time=1930&brainrot';
    render(<HandDrawnTimer />);

    expect(screen.queryByText('Start')).not.toBeInTheDocument();
    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
    expect(screen.queryAllByRole('textbox')).toHaveLength(0);

    const iframe = screen.getByTitle('Brain rot content');
    expect(iframe).toBeInTheDocument();
  });

  it('allows user to input time and limits input to max value', () => {
    render(<HandDrawnTimer />);

    const inputs = screen.getAllByRole('textbox');
    const hoursInput = inputs[0];
    const minutesInput = inputs[1];

    fireEvent.change(hoursInput, { target: { value: '15' } });
    expect(hoursInput).toHaveValue('15');

    fireEvent.change(minutesInput, { target: { value: '99' } });
    expect(minutesInput).toHaveValue('59');
  });

  it('starts the timer when Start is clicked', () => {
    vi.useFakeTimers();
    render(<HandDrawnTimer />);

    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);

    expect(screen.queryAllByRole('textbox')).toHaveLength(0);
    expect(screen.getByText('Pause')).toBeInTheDocument();
  });

  it('pauses and resumes the timer', () => {
    vi.useFakeTimers();
    render(<HandDrawnTimer />);

    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);

    const pauseButton = screen.getByText('Pause');
    fireEvent.click(pauseButton);

    expect(screen.getByText('Resume')).toBeInTheDocument();

    const resumeButton = screen.getByText('Resume');
    fireEvent.click(resumeButton);

    expect(screen.getByText('Pause')).toBeInTheDocument();
  });

  it('resets the timer', () => {
    render(<HandDrawnTimer />);

    fireEvent.click(screen.getByText('Start'));
    fireEvent.click(screen.getByText('Reset'));

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(3);
  });

  it('decrements time correctly', () => {
    vi.useFakeTimers();
    render(<HandDrawnTimer />);

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '00' } });
    fireEvent.change(inputs[1], { target: { value: '00' } });
    fireEvent.change(inputs[2], { target: { value: '05' } });

    fireEvent.click(screen.getByText('Start'));

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText('Pause')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4000); // the remaining 3 seconds plus 1 to clear
    });

    // We check that the mode is now "finished". In finished mode, there's no Start/Pause, just Reset
    expect(screen.queryByText('Start')).not.toBeInTheDocument();
    expect(screen.queryByText('Pause')).not.toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });
});
