import { type ReactElement } from 'react';
import { motion } from 'framer-motion';

interface LoadingFallbackProps {
  message?: string;
}

export const LoadingFallback = ({ message = 'Loading...' }: LoadingFallbackProps): ReactElement => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3a 100%)',
      color: '#d4af37',
      fontFamily: '"Cinzel", serif',
    }}
  >
    <motion.div
      animate={{ 
        scale: [1, 1.1, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        fontSize: '1.5rem',
        marginBottom: '1rem',
        textAlign: 'center'
      }}
    >
      {message}
    </motion.div>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(212, 175, 55, 0.3)',
        borderTop: '3px solid #d4af37',
        borderRadius: '50%'
      }}
    />
  </motion.div>
);