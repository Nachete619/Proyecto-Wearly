import React from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bookmark as BookmarkIcon, ExternalLink, Link as LinkIcon, Heart, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

const OutfitDetailModal = ({ isOpen, onOpenChange, outfit, toggleSaveOutfit, isOutfitSaved, isOutfitLiked, toggleLikeOutfit, currentUser, onDeleteOutfit }) => {
  const { toast } = useToast();

  if (!outfit) return null;

  const handleSaveClick = (e) => {
    e.stopPropagation();
    toggleSaveOutfit(outfit.id);
    toast({
      title: !isOutfitSaved ? "Outfit Guardado" : "Outfit Eliminado de Guardados",
      description: !isOutfitSaved ? `"${outfit.title}" se añadió a tus guardados.` : `"${outfit.title}" se eliminó de tus guardados.`,
    });
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    toggleLikeOutfit(outfit.id);
    toast({
      title: !isOutfitLiked ? "¡Te gusta!" : "Ya no te gusta",
    });
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDeleteOutfit && isCurrentUserOutfit) {
      onDeleteOutfit(outfit);
    }
  };

  const isCurrentUserOutfit = outfit.user?.id === currentUser?.id;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl md:max-w-3xl p-0 overflow-hidden data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="grid md:grid-cols-2 gap-0 max-h-[90vh]"
        >
          <div className="relative aspect-[3/4] md:aspect-auto md:h-full bg-muted">
            {outfit.imageUrl ? (
              outfit.imageUrl.startsWith('blob:') ? (
                <img src={outfit.imageUrl} alt={outfit.title} className="object-cover w-full h-full" />
              ) : (
                <img-replace src={outfit.imageUrl} alt={outfit.title} class="object-cover w-full h-full" />
              )
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <p className="text-muted-foreground">Imagen no disponible</p>
              </div>
            )}
          </div>

          <div className="flex flex-col p-4 md:p-6 space-y-3 md:space-y-4 overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl md:text-2xl font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>{outfit.title || "Outfit Sin Título"}</DialogTitle>
              {outfit.user?.username && (
                <div className="flex items-center space-x-2 pt-1">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={outfit.user.avatarUrl} alt={outfit.user.username} />
                    <AvatarFallback><User className="w-3 h-3" /></AvatarFallback>
                  </Avatar>
                  <Link to={isCurrentUserOutfit ? "/profile" : `/profile/${outfit.user.id}`} className="text-sm text-muted-foreground hover:underline">
                    Subido por @{outfit.user.username}
                  </Link>
                </div>
              )}
            </DialogHeader>

            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              <Button variant="secondary" onClick={handleSaveClick} className="text-foreground bg-background/70 hover:bg-background/90 rounded-full shadow-sm text-xs px-3 py-1 h-auto md:text-sm md:px-4 md:py-2">
                <BookmarkIcon className={`w-3 h-3 md:w-4 md:h-4 mr-1.5 ${isOutfitSaved ? 'fill-current' : ''}`} /> {isOutfitSaved ? 'Guardado' : 'Guardar'}
              </Button>
              <Button variant="ghost" onClick={handleLikeClick} className="text-foreground hover:bg-secondary rounded-full text-xs px-3 py-1 h-auto md:text-sm md:px-4 md:py-2">
                <Heart className={`w-3 h-3 md:w-4 md:h-4 mr-1.5 ${isOutfitLiked ? 'fill-red-500 text-red-500' : ''}`} /> {outfit.likes || 0} Me gusta
              </Button>
              {isCurrentUserOutfit && (
                <Button variant="destructive" onClick={handleDeleteClick} className="text-destructive-foreground bg-red-700/80 hover:bg-red-600/90 rounded-full shadow-sm text-xs px-3 py-1 h-auto md:text-sm md:px-4 md:py-2">
                  <Trash2 className="w-3 h-3 md:w-4 md:h-4 mr-1.5" /> Eliminar
                </Button>
              )}
            </div>

            {outfit.description && (
              <DialogDescription className="text-xs md:text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                {outfit.description}
              </DialogDescription>
            )}

            {outfit.garments && outfit.garments.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm md:text-md font-medium text-foreground flex items-center">
                  <LinkIcon className="w-3 h-3 md:w-4 md:h-4 mr-2 text-primary" /> Prendas y Accesorios
                </h4>
                <ul className="space-y-1.5">
                  {outfit.garments.map((garment, index) => (
                    <li key={index} className="text-xs md:text-sm">
                      <a
                        href={garment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-1.5 md:p-2 rounded-md bg-secondary/50 hover:bg-secondary transition-colors group"
                      >
                        <span className="truncate max-w-[80%]">{garment.name}</span>
                        <ExternalLink className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {outfit.user?.username && !isCurrentUserOutfit && (
              <div className="pt-3 md:pt-4 mt-auto">
                <Link to={`/profile/${outfit.user.id}`}>
                  <Button variant="outline" className="w-full rounded-lg text-xs md:text-sm">Ver más de @{outfit.user.username}</Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default OutfitDetailModal;