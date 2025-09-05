import { useCallback, useMemo, useRef } from 'react';

/**
 * Hook for memoizing expensive computations with dependencies
 * @param factory - Function that creates the value
 * @param deps - Dependencies array
 * @returns Memoized value
 */
export function useMemoCompare<T>(factory: () => T, deps: React.DependencyList): T {
  const ref = useRef<{ deps: React.DependencyList; value: T } | null>(null);
  
  if (!ref.current || !areEqual(deps, ref.current.deps)) {
    ref.current = { deps, value: factory() };
  }
  
  return ref.current.value;
}

/**
 * Deep comparison for dependency arrays
 */
function areEqual(a: React.DependencyList, b: React.DependencyList): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  
  return true;
}

/**
 * Hook for debouncing values to prevent excessive re-renders
 * @param value - Value to debounce
 * @param delay - Debounce delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * Hook for throttling function calls
 * @param callback - Function to throttle
 * @param delay - Throttle delay in milliseconds
 * @returns Throttled function
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T, 
  delay: number
): T {
  const lastCall = useRef<number>(0);
  
  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      return callback(...args);
    }
  }, [callback, delay]) as T;
}

/**
 * Hook for lazy initialization of expensive values
 * @param initializer - Function that creates the initial value
 * @returns Lazily initialized value
 */
export function useLazyValue<T>(initializer: () => T): T {
  return useMemo(() => initializer(), [initializer]);
}

/**
 * Hook for stable object references to prevent unnecessary re-renders
 * @param object - Object to stabilize
 * @returns Stable object reference
 */
export function useStableObject<T extends Record<string, unknown>>(object: T): T {
  return useMemoCompare(() => object, Object.values(object));
}

/**
 * Hook for batching state updates to improve performance
 * @param initialState - Initial state
 * @returns [state, batchedSetState]
 */
export function useBatchedState<T>(
  initialState: T
): [T, (updater: T | ((prev: T) => T)) => void] {
  const [state, setState] = React.useState<T>(initialState);
  const batchedUpdates = useRef<((prev: T) => T)[]>([]);
  
  const batchedSetState = useCallback((updater: T | ((prev: T) => T)) => {
    const updateFunction = typeof updater === 'function' ? updater as (prev: T) => T : () => updater;
    batchedUpdates.current.push(updateFunction);
    
    // Use setTimeout to batch multiple updates in the same tick
    setTimeout(() => {
      if (batchedUpdates.current.length > 0) {
        setState(prev => {
          return batchedUpdates.current.reduce((acc, update) => update(acc), prev);
        });
        batchedUpdates.current = [];
      }
    }, 0);
  }, []);
  
  return [state, batchedSetState];
}

// Re-export React for convenience
import * as React from 'react';