import { describe, it, expect } from 'vitest';
import { GameProvider } from '../context/GameContext';
import { useGame } from '../hooks/useGame';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';

// Basic test structure (placeholder) - would need refactor to expose reducer separately

describe('GameContext basic', () => {
  it('learns a language', () => {
    const wrapper = ({ children }: { children: ReactNode }) => <GameProvider>{children}</GameProvider>;
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.dispatch({ type: 'LEARN_LANGUAGE', payload: 'english' }));
    expect(result.current.state.knownLanguages).toContain('english');
  });
});
