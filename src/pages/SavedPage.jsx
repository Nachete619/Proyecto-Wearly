import React from 'react';
import OutfitCard from '@/components/OutfitCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Layers, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const SavedPage = ({ savedOutfits, onOutfitClick, toggleSaveOutfit, allOutfits, likedOutfits, toggleLikeOutfit, currentUser, onDeleteOutfit }) => {
  
  const suggestedOutfits = allOutfits
    .filter(outfit => !savedOutfits.some(saved => saved.id === outfit.id)) // Filter out already saved
    .sort(() => 0.5 - Math.random()) // Shuffle
    .slice(0, 4); // Take 4 suggestions

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
        className="flex items-center mb-4 md:mb-8 text-2xl md:text-3xl font-bold text-foreground px-2 md:px-0"
      >
        <Bookmark className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 text-primary" />
        Mis Outfits Guardados
      </motion.h1>
      
      {savedOutfits && savedOutfits.length > 0 ? (
        <div className="gap-3 md:gap-4 space-y-3 md:space-y-4 columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5">
          <AnimatePresence>
            {savedOutfits.map((outfit, index) => (
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
                  isSavedInitial={true} // All outfits here are saved
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
          className="flex flex-col items-center justify-center h-[calc(100vh-20rem)] text-center px-4"
        >
          <Layers className="w-24 h-24 md:w-32 md:h-32 mb-6 text-muted-foreground opacity-30" />
          <h2 className="text-xl md:text-2xl font-semibold text-muted-foreground">No tienes outfits guardados</h2>
          <p className="text-sm md:text-base text-muted-foreground mb-6">Explora y guarda los looks que te inspiren.</p>
          <Link to="/home">
            <Button variant="default" size="lg" className="rounded-full">
              <Search className="w-5 h-5 mr-2" /> Explorar Outfits
            </Button>
          </Link>
        </motion.div>
      )}

      {savedOutfits && savedOutfits.length > 0 && suggestedOutfits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 md:mt-16"
        >
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4 px-2 md:px-0">
            Quizás te guste...
          </h2>
          <div className="gap-3 md:gap-4 space-y-3 md:space-y-4 columns-2 sm:columns-2 md:columns-3 lg:columns-4">
            {suggestedOutfits.map((outfit, index) => (
              <motion.div
                key={`suggest-${outfit.id || index}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 + 0.5 }}
                className="break-inside-avoid"
              >
                <OutfitCard 
                  outfit={outfit} 
                  onClick={onOutfitClick} 
                  isSavedInitial={false} // These are suggestions, not saved yet
                  toggleSaveOutfit={toggleSaveOutfit}
                  isLikedInitial={likedOutfits.includes(outfit.id)}
                  toggleLikeOutfit={toggleLikeOutfit}
                  currentUser={currentUser}
                  onDeleteOutfit={onDeleteOutfit}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SavedPage;