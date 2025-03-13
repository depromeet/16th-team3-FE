import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <motion.div
        style={{
          width: 50,
          height: 50,
          border: '4px solid #ccc',
          borderTop: '4px solid #6b6be1',
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      />
    </div>
  );
};

export default Loader;
