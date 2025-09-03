/**
 * Main Dialog System Component
 * Combines provider and renderer for easy use
 */

import React from 'react';
import { DialogProvider } from './DialogProvider';
import { DialogRenderer } from './DialogRenderer';
import type { DialogProviderProps } from './types';

interface DialogSystemProps extends DialogProviderProps {
  backgroundImage?: string;
  characterSprite?: string;
  enableKeyboard?: boolean;
}

export function DialogSystem({
  children,
  backgroundImage,
  characterSprite,
  enableKeyboard = true,
  ...providerProps
}: React.PropsWithChildren<DialogSystemProps>) {
  return (
    <DialogProvider {...providerProps}>
      {children || (
        <DialogRenderer
          backgroundImage={backgroundImage}
          characterSprite={characterSprite}
          enableKeyboard={enableKeyboard}
        />
      )}
    </DialogProvider>
  );
}