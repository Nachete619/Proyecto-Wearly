import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark as BookmarkIcon, Eye, Heart, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const OutfitCard = ({ outfit, onClick, isSavedInitial, toggleSaveOutfit, isLikedInitial, toggleLikeOutfit, currentUser, onDeleteOutfit }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const { toast } = useToast();

  if (!outfit) return null;

  const isOwner = currentUser && outfit.user && currentUser.id === outfit.user.id;

  const handleCardClick = (e) => {
    if (e.target.closest('.action-button-area') || e.target.closest('.delete-button-area')) return;
    if (onClick) {
      onClick(outfit);
    }
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    toggleSaveOutfit(outfit.id);
    toast({
      title: !isSavedInitial ? "Outfit Guardado" : "Outfit Eliminado de Guardados",
      description: !isSavedInitial ? `"${outfit.title}" se añadió a tus guardados.` : `"${outfit.title}" se eliminó de tus guardados.`,
    });
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    toggleLikeOutfit(outfit.id);
    toast({
      title: !isLikedInitial ? "¡Te gusta!" : "Ya no te gusta",
      description: `"${outfit.title}" ${!isLikedInitial ? 'recibió un me gusta.' : 'ya no te gusta.'}`,
    });
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDeleteOutfit && isOwner) {
      onDeleteOutfit(outfit);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative break-inside-avoid-column cursor-pointer group mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <Card className="overflow-hidden transition-all duration-300 ease-in-out border-transparent group-hover:shadow-xl group-hover:border-primary/50 bg-card">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-lg bg-muted">
          {outfit.imageUrl ? (
            outfit.imageUrl.startsWith('blob:') ? (
              <img
                src={outfit.imageUrl}
                alt={outfit.title || 'Outfit image'}
                className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
            ) : (
              <img-replace
                src={outfit.imageUrl}
                alt={outfit.title || 'Outfit image'}
                class="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
            )
          ) : (
            <div className="flex items-center justify-center aspect-[3/4] w-full bg-secondary">
              <p className="text-muted-foreground text-sm">Imagen no disponible</p>
            </div>
          )}

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/60"
              >
                <Eye className="w-8 h-8 mb-2 text-white md:w-10 md:h-10" />
                <p className="text-xs font-semibold text-center text-white md:text-sm">{outfit.title}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute top-2 right-2 flex flex-col space-y-1 action-button-area">
            <Button
              variant="ghost"
              size="icon"
              className="text-white bg-black/30 hover:bg-black/50 rounded-full h-8 w-8"
              onClick={handleSaveClick}
              aria-label="Guardar outfit"
            >
              <BookmarkIcon className={`w-4 h-4 ${isSavedInitial ? 'fill-white' : ''}`} />
            </Button>
            {isOwner && isHovered && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white bg-red-700/50 hover:bg-red-600/70 rounded-full h-8 w-8 delete-button-area"
                onClick={handleDeleteClick}
                aria-label="Eliminar outfit"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <CardContent className="p-2 md:p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium truncate text-foreground md:text-sm">{outfit.title || "Outfit Sin Título"}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <button onClick={handleLikeClick} className="flex items-center mr-2 p-1 rounded hover:bg-secondary action-button-area">
                <Heart className={`w-3 h-3 md:w-4 md:h-4 ${isLikedInitial ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                <span className="ml-1">{outfit.likes || 0}</span>
              </button>
              <BookmarkIcon className={`w-3 h-3 md:w-4 md:h-4 ${isSavedInitial ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
              <span className="ml-1">{outfit.saves || 0}</span>
            </div>
          </div>
          {outfit.user?.username && (
            <Link to={isOwner ? "/profile" : `/profile/${outfit.user.id}`} onClick={(e) => e.stopPropagation()} className="text-xs text-muted-foreground truncate hover:underline">
              @{outfit.user.username}
            </Link>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OutfitCard;