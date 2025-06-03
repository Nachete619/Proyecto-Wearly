import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';

const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/f35a503e-e59f-4088-b629-60f8a2d53297/cca53b1ccb3e4680f9eb3b92c046a5da.png";

const LandingPage = ({ onLogin }) => {
  const handleLoginClick = () => {
    onLogin(); 
  };

  const handleCreateAccountClick = () => {
    onLogin(); 
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <img src={logoUrl} alt="Wearly Logo" className="w-auto h-24 md:h-32 mb-8 object-contain" />
      </motion.div>
      
      <motion.h1 
        className="text-4xl md:text-5xl font-bold text-foreground mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Descubre tu Estilo.
      </motion.h1>
      <motion.p 
        className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        Únete a la comunidad donde la moda cobra vida. Comparte tus outfits, inspírate y conecta con amantes del estilo como tú.
      </motion.p>
      
      <motion.div 
        className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Button 
          onClick={handleLoginClick}
          size="lg" 
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-base"
        >
          <LogIn className="w-5 h-5 mr-2" />
          Iniciar Sesión
        </Button>
        <Button 
          onClick={handleCreateAccountClick}
          variant="outline" 
          size="lg" 
          className="rounded-full border-primary text-primary hover:bg-primary/10 px-8 py-3 text-base"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Crear Cuenta
        </Button>
      </motion.div>

      <motion.p 
        className="text-xs text-muted-foreground mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        © {new Date().getFullYear()} <img src={logoUrl} alt="W Logo" style={{filter: 'grayscale(100%) brightness(0.7)'}} className="w-4 h-4 inline-block mx-0.5 opacity-70" />. Inspirando estilos.
      </motion.p>
    </motion.div>
  );
};

export default LandingPage;