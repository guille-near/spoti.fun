import { motion } from 'framer-motion';

interface BlurFadeProps {
  children: React.ReactNode;
  isVisible: boolean;
}

export const BlurFade: React.FC<BlurFadeProps> = ({ children, isVisible }) => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? 'blur(0px)' : 'blur(10px)',
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};