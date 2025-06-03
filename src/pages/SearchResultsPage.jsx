import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import OutfitCard from '@/components/OutfitCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Layers, Users, Package, Frown, User as UserIcon } from 'lucide-react';

const SearchResultsPage = ({ allOutfits, allUsers, onOutfitClick, savedOutfits, toggleSaveOutfit, likedOutfits, toggleLikeOutfit, currentUser, onDeleteOutfit }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  
  const [filteredOutfits, setFilteredOutfits] = React.useState([]);
  const [filteredUsers, setFilteredUsers] = React.useState([]);
  const [filteredGarments, setFilteredGarments] = React.useState([]);

  React.useEffect(() => {
    if (query) {
      const outfitsResults = allOutfits.filter(outfit => 
        outfit.title?.toLowerCase().includes(query) ||
        outfit.description?.toLowerCase().includes(query) ||
        outfit.user?.username?.toLowerCase().includes(query) ||
        outfit.garments?.some(g => g.name?.toLowerCase().includes(query))
      );
      setFilteredOutfits(outfitsResults);

      const usersResults = allUsers.filter(user =>
        user.username?.toLowerCase().includes(query) ||
        user.bio?.toLowerCase().includes(query)
      );
      setFilteredUsers(usersResults);
      
      const garmentsResults = [];
      allOutfits.forEach(outfit => {
        outfit.garments?.forEach(garment => {
          if (garment.name?.toLowerCase().includes(query) && !garmentsResults.find(g => g.name === garment.name && g.outfitTitle === outfit.title)) {
            garmentsResults.push({ ...garment, outfitId: outfit.id, outfitTitle: outfit.title, outfitImage: outfit.imageUrl }); 
          }
        });
      });
      setFilteredGarments(garmentsResults);

    } else {
      setFilteredOutfits([]);
      setFilteredUsers([]);
      setFilteredGarments([]);
    }
  }, [query, allOutfits, allUsers]);

  const hasResults = filteredOutfits.length > 0 || filteredUsers.length > 0 || filteredGarments.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container max-w-screen-xl py-6 md:py-8 mx-auto px-2 sm:px-4 lg:px-8"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex items-center mb-4 md:mb-8 text-2xl md:text-3xl font-bold text-foreground px-2 md:px-0"
      >
        <Search className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 text-primary" />
        Resultados para: <span className="text-primary ml-2">"{query}"</span>
      </motion.div>

      {!hasResults && query ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center justify-center h-[calc(100vh-20rem)] text-center px-4"
        >
          <Frown className="w-24 h-24 md:w-32 md:h-32 mb-6 text-muted-foreground opacity-30" />
          <h2 className="text-xl md:text-2xl font-semibold text-muted-foreground">Sin resultados</h2>
          <p className="text-sm md:text-base text-muted-foreground">No encontramos nada para "{query}". Intenta con otras palabras.</p>
        </motion.div>
      ) : null}

      {filteredOutfits.length > 0 && (
        <section className="mb-8 md:mb-12">
          <h2 className="flex items-center text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4 px-2 md:px-0">
            <Layers className="w-5 h-5 md:w-6 md:h-6 mr-2 text-primary/80" /> Outfits
          </h2>
          <div className="gap-3 md:gap-4 space-y-3 md:space-y-4 columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5">
            <AnimatePresence>
              {filteredOutfits.map((outfit, index) => (
                <motion.div
                  key={`outfit-${outfit.id || index}`}
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
        </section>
      )}

      {filteredUsers.length > 0 && (
        <section className="mb-8 md:mb-12">
          <h2 className="flex items-center text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4 px-2 md:px-0">
            <Users className="w-5 h-5 md:w-6 md:h-6 mr-2 text-primary/80" /> Usuarios
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredUsers.map(user => (
              <Link 
                to={user.id === currentUser?.id ? "/profile" : `/profile/${user.id}`} 
                key={`user-${user.id}`} 
                className="block p-3 rounded-lg bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10 md:w-12 md:h-12">
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback>
                        {user.username ? user.username[0]?.toUpperCase() : <UserIcon className="w-5 h-5"/>}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground truncate">{user.username}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.bio || 'Sin bio'}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      
      {filteredGarments.length > 0 && (
         <section className="mb-8 md:mb-12">
          <h2 className="flex items-center text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4 px-2 md:px-0">
            <Package className="w-5 h-5 md:w-6 md:h-6 mr-2 text-primary/80" /> Prendas Encontradas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
             {filteredGarments.map((garment, index) => {
                const originalOutfit = allOutfits.find(o => o.id === garment.outfitId);
                return (
                    <div 
                        key={`garment-${index}-${garment.name}`} 
                        className="p-3 rounded-lg bg-card hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => originalOutfit && onOutfitClick(originalOutfit)}
                    >
                        <div className="relative w-full aspect-square mb-2 rounded overflow-hidden bg-muted">
                            {garment.outfitImage ? (
                                garment.outfitImage.startsWith('blob:') ? (
                                    <img src={garment.outfitImage} alt={garment.outfitTitle} className="object-cover w-full h-full" />
                                ) : (
                                    <img-replace src={garment.outfitImage} alt={garment.outfitTitle} class="object-cover w-full h-full" />
                                )
                            ) : (
                                <div className="flex items-center justify-center w-full h-full">
                                <Package className="w-12 h-12 text-muted-foreground/50"/>
                                </div>
                            )}
                        </div>
                        <p className="text-sm font-semibold text-foreground truncate">{garment.name}</p>
                        <p className="text-xs text-muted-foreground truncate">En: {garment.outfitTitle}</p>
                    </div>
                );
             })}
          </div>
        </section>
      )}

    </motion.div>
  );
};

export default SearchResultsPage;