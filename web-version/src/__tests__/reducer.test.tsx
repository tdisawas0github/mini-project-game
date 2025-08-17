import { describe, it, expect } from 'vitest';
import { GameProvider, useGame } from '../context/GameContext';
import { renderHook, act } from '@testing-library/react';

// Basic test structure (placeholder) - would need refactor to expose reducer separately

describe('GameContext basic', () => {
  it('learns a language', () => {
    const wrapper = ({ children }: any) => <GameProvider>{children}</GameProvider>;
    const { result } = renderHook(() => useGame(), { wrapper });
    act(() => result.current.dispatch({ type: 'LEARN_LANGUAGE', payload: 'english' }));
    expect(result.current.state.knownLanguages).toContain('english');
  });
});
