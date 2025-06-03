import React from 'react';
import OutfitCard from '@/components/OutfitCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers } from 'lucide-react';

const HomePage = ({ outfits, onOutfitClick, savedOutfits, toggleSaveOutfit, likedOutfits, toggleLikeOutfit, currentUser, onDeleteOutfit }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container max-w-screen-xl py-6 md:py-8 mx-auto px-2 sm:px-4 lg:px-8"
    >
      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-4 md:mb-8 text-2xl md:text-3xl font-bold text-foreground px-2 md:px-0"
      >
        Explora Outfits
      </motion.h1>
      
      {outfits && outfits.length > 0 ? (
        <div className="gap-3 md:gap-4 space-y-3 md:space-y-4 columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5">
          <AnimatePresence>
            {outfits.map((outfit, index) => (
              <motion.div
                key={outfit.id || index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="break-inside-avoid" 
              >
                <OutfitCard 
                  outfit={outfit} 
                  onClick={onOutfitClick} 
                  isSavedInitial={savedOutfits.some(saved => saved.id === outfit.id)}
                  toggleSaveOutfit={toggleSaveOutfit}
                  isLikedInitial={likedOutfits.includes(outfit.id)}
                  toggleLikeOutfit={toggleLikeOutfit}
                  currentUser={currentUser}
                  onDeleteOutfit={onDeleteOutfit}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center justify-center h-[calc(100vh-15rem)] text-center px-4"
        >
          <Layers className="w-24 h-24 md:w-32 md:h-32 mb-6 text-muted-foreground opacity-30" />
          <h2 className="text-xl md:text-2xl font-semibold text-muted-foreground">Aún no hay outfits</h2>
          <p className="text-sm md:text-base text-muted-foreground">¡Sé el primero en compartir tu estilo!</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HomePage;