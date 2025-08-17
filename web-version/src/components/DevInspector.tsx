import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { deriveRipple } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function DevInspector() {
  const { state } = useGame();
  const [open, setOpen] = useState(false);
  const ripple = deriveRipple(state);

  return (
    <div style={{ position: 'fixed', bottom: 10, right: 10, zIndex: 1000 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: '#334155',
          color: '#e2e8f0',
          border: '1px solid #475569',
          borderRadius: 6,
          padding: '6px 12px',
          fontSize: 12,
          cursor: 'pointer'
        }}
      >{open ? 'Close Inspector' : 'Inspector'}</button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            style={{
              marginTop: 8,
              width: 360,
              maxHeight: 400,
              overflow: 'auto',
              background: '#0f172a',
              color: '#e2e8f0',
              fontFamily: 'monospace',
              fontSize: 12,
              padding: 12,
              border: '1px solid #475569',
              borderRadius: 8,
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
            }}
          >
            <strong>Game State</strong>
            <pre>{JSON.stringify(state, null, 2)}</pre>
            <strong>Ripple Summary</strong>
            <pre>{JSON.stringify(ripple, null, 2)}</pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
