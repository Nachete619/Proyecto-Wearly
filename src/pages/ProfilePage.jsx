import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Edit3, Layers, UserPlus, UserCheck, Instagram, Link as LinkIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import OutfitCard from '@/components/OutfitCard';
import { useToast } from '@/components/ui/use-toast';

const ProfilePage = ({ onOutfitClick, outfits, users, isCurrentUserProfile, followedUsers, toggleFollowUser, onEditProfile, currentUser, likedOutfits, toggleLikeOutfit, toggleSaveOutfit, onDeleteOutfit, savedOutfits }) => {
  const { userId: paramsUserId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = React.useState(null);
  const [userOutfits, setUserOutfits] = React.useState([]);
  const [isFollowedByCurrentUser, setIsFollowedByCurrentUser] = React.useState(false);

  const effectiveUserId = isCurrentUserProfile ? currentUser?.id : paramsUserId;

  React.useEffect(() => {
    let targetUser;
    if (isCurrentUserProfile) {
      targetUser = currentUser;
    } else {
      targetUser = users.find(u => u.id === effectiveUserId);
    }

    if (targetUser) {
      setProfileData(targetUser);
      const filteredOutfits = outfits.filter(o => o.user?.id === targetUser.id);
      setUserOutfits(filteredOutfits);
      setIsFollowedByCurrentUser(followedUsers?.includes(targetUser.id) || false);
    } else if (!isCurrentUserProfile && effectiveUserId) {
      toast({ title: "Usuario no encontrado", description: "No se pudo encontrar el perfil solicitado.", variant: "destructive"});
      navigate('/profile');
    }
  }, [effectiveUserId, currentUser, users, outfits, followedUsers, isCurrentUserProfile, navigate, toast]);
  
   React.useEffect(() => {
    if (profileData) { 
      setIsFollowedByCurrentUser(followedUsers?.includes(profileData.id) || false);
    }
  }, [followedUsers, profileData]);


  const handleFollowToggle = () => {
    if (isCurrentUserProfile || !profileData) return; 
    toggleFollowUser(profileData.id);
    setIsFollowedByCurrentUser(!isFollowedByCurrentUser); 
    toast({
      title: !isFollowedByCurrentUser ? `Siguiendo a @${profileData.username}` : `Dejaste de seguir a @${profileData.username}`,
    });
  };
  
  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Cargando perfil...</p>
      </div>
    );
  }


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container max-w-screen-lg py-6 md:py-8 mx-auto px-2 sm:px-4 lg:px-8"
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex flex-col items-center p-4 md:p-6 mb-6 md:mb-8 rounded-lg sm:flex-row sm:items-start bg-card shadow-sm"
      >
        <Avatar className="w-20 h-20 md:w-24 lg:w-32 md:h-24 lg:h-32 mb-4 border-2 sm:mb-0 sm:mr-6 md:mr-8 border-primary">
          <AvatarImage src={profileData.avatarUrl || undefined} alt={profileData.username} />
          <AvatarFallback>
            <User className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center mb-1 md:mb-2 sm:justify-start">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">{profileData.username}</h1>
            {isCurrentUserProfile && (
              <Button variant="ghost" size="icon" onClick={onEditProfile} className="ml-2 md:ml-3 text-muted-foreground hover:text-primary h-7 w-7 md:h-8 md:w-8">
                <Edit3 className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            )}
          </div>
          <div className="flex justify-center mb-2 md:mb-3 space-x-4 md:space-x-6 text-xs md:text-sm sm:justify-start text-muted-foreground">
            <span><strong className="text-foreground">{userOutfits.length}</strong> outfits</span>
            <span><strong className="text-foreground">{profileData.followers || 0}</strong> seguidores</span>
            <span><strong className="text-foreground">{profileData.following || 0}</strong> siguiendo</span>
          </div>
          <p className="mb-3 md:mb-4 text-xs md:text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{profileData.bio}</p>
          
          {profileData.socialLinks && (profileData.socialLinks.instagram || profileData.socialLinks.pinterest) && (
            <div className="flex justify-center sm:justify-start space-x-3 mb-3 md:mb-4">
              {profileData.socialLinks.instagram && (
                <a href={profileData.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-pink-500 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {profileData.socialLinks.pinterest && (
                <a href={profileData.socialLinks.pinterest} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-red-600 transition-colors">
                  <LinkIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          )}

          {isCurrentUserProfile ? (
             <Button variant="outline" onClick={onEditProfile} className="rounded-lg text-xs md:text-sm h-8 md:h-9 px-3 md:px-4">
              <Edit3 className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" /> Editar Perfil
            </Button>
          ) : (
            <Button onClick={handleFollowToggle} variant={isFollowedByCurrentUser ? "secondary" : "default"} className="rounded-lg text-xs md:text-sm h-8 md:h-9 px-3 md:px-4 bg-primary text-primary-foreground hover:bg-primary/90 data-[variant=secondary]:bg-secondary data-[variant=secondary]:text-secondary-foreground">
              {isFollowedByCurrentUser ? <UserCheck className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" /> : <UserPlus className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />}
              {isFollowedByCurrentUser ? 'Siguiendo' : 'Seguir'}
            </Button>
          )}
        </div>
      </motion.div>

      <motion.h2 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-4 md:mb-6 text-lg md:text-xl font-semibold text-foreground px-2 md:px-0"
      >
        Outfits de @{profileData.username}
      </motion.h2>
      
      {userOutfits && userOutfits.length > 0 ? (
        <div className="gap-3 md:gap-4 space-y-3 md:space-y-4 columns-2 sm:columns-2 md:columns-3 lg:columns-4">
          <AnimatePresence>
            {userOutfits.map((outfit, index) => (
              <motion.div
                key={outfit.id || index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 + 0.2 }}
                className="break-inside-avoid" 
              >
                <OutfitCard 
                  outfit={outfit} 
                  onClick={onOutfitClick} 
                  isSavedInitial={savedOutfits ? savedOutfits.some(saved => saved.id === outfit.id) : false}
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
          transition={{ delay: 0.3, duration: 0.5 }}
          className="py-10 md:py-12 text-center"
        >
          <Layers className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="text-sm md:text-base text-muted-foreground">@{profileData.username} aún no ha subido ningún outfit.</p>
          {isCurrentUserProfile && <p className="text-xs md:text-sm text-muted-foreground/70">¡Anímate a compartir tu primer look!</p>}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProfilePage;