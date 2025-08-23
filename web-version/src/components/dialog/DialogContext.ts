/**
 * Dialog Hook for accessing Dialog Context
 */

import React from 'react';
import type { DialogContextValue } from './types';

const DialogContext = React.createContext<DialogContextValue | null>(null);

export function useDialog(): DialogContextValue {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}

export { DialogContext };