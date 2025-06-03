import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { useAppState } from '@/contexts/AppStateContext';

import SideMenu from '@/components/SideMenu';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';

import HomePage from '@/pages/HomePage';
import TrendsPage from '@/pages/TrendsPage';
import NotificationsPage from '@/pages/NotificationsPage';
import ProfilePage from '@/pages/ProfilePage';
import SavedPage from '@/pages/SavedPage';
import LandingPage from '@/pages/LandingPage';
import SearchResultsPage from '@/pages/SearchResultsPage';
import SettingsPage from '@/pages/SettingsPage';

import UploadOutfitForm from '@/components/UploadOutfitForm';
import OutfitDetailModal from '@/components/OutfitDetailModal';
import EditProfileModal from '@/components/EditProfileModal';
import DeleteOutfitDialog from '@/components/DeleteOutfitDialog';

const AppRoutes = () => {
  const {
    isAuthenticated,
    currentUser,
    outfits,
    savedOutfits,
    likedOutfits,
    users,
    followedUsers,
    handleLogin,
    handleLogout,
    handleUpdateProfile,
    handleAddOutfit,
    toggleSaveOutfit,
    toggleLikeOutfit,
    toggleFollowUser,
    handleDeleteOutfit,
  } = useAppState();

  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [isOutfitDetailModalOpen, setIsOutfitDetailModalOpen] = useState(false);
  const [isDeleteOutfitDialogOpen, setIsDeleteOutfitDialogOpen] = useState(false);
  const [outfitToDelete, setOutfitToDelete] = useState(null);

  const location = useLocation();

  const handleOutfitCardClick = (outfit) => {
    setSelectedOutfit(outfit);
    setIsOutfitDetailModalOpen(true);
  };

  const openDeleteDialog = (outfit) => {
    setOutfitToDelete(outfit);
    setIsDeleteOutfitDialogOpen(true);
    if (isOutfitDetailModalOpen) setIsOutfitDetailModalOpen(false); 
  };

  const confirmDeleteOutfit = () => {
    if (outfitToDelete) {
      handleDeleteOutfit(outfitToDelete.id);
      setOutfitToDelete(null);
    }
    setIsDeleteOutfitDialogOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  const isAuthPage = location.pathname === '/';
  const allUsersForSearch = [currentUser, ...users.filter(u => u.id !== currentUser.id)];

  return (
    <div className={`flex min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 ${isAuthPage ? '' : 'pb-16 md:pb-0'}`}>
      {!isAuthPage && <SideMenu onUploadClick={() => setIsUploadFormOpen(true)} />}
      <div className={`flex flex-col flex-grow ${isAuthPage ? '' : 'md:ml-20'}`}>
        {!isAuthPage && <TopBar onLogout={handleLogout} currentUser={currentUser} />}
        <main className={`flex-grow ${isAuthPage ? '' : 'md:pt-16'}`}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<HomePage outfits={outfits} onOutfitClick={handleOutfitCardClick} savedOutfits={savedOutfits} toggleSaveOutfit={toggleSaveOutfit} likedOutfits={likedOutfits} toggleLikeOutfit={toggleLikeOutfit} currentUser={currentUser} onDeleteOutfit={openDeleteDialog} />} />
              <Route path="/trends" element={<TrendsPage outfits={outfits} onOutfitClick={handleOutfitCardClick} savedOutfits={savedOutfits} toggleSaveOutfit={toggleSaveOutfit} likedOutfits={likedOutfits} toggleLikeOutfit={toggleLikeOutfit} currentUser={currentUser} onDeleteOutfit={openDeleteDialog} />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/saved" element={<SavedPage savedOutfits={savedOutfits} onOutfitClick={handleOutfitCardClick} toggleSaveOutfit={toggleSaveOutfit} allOutfits={outfits} likedOutfits={likedOutfits} toggleLikeOutfit={toggleLikeOutfit} currentUser={currentUser} onDeleteOutfit={openDeleteDialog} />} />
              <Route path="/search" element={<SearchResultsPage allOutfits={outfits} allUsers={allUsersForSearch} onOutfitClick={handleOutfitCardClick} savedOutfits={savedOutfits} toggleSaveOutfit={toggleSaveOutfit} likedOutfits={likedOutfits} toggleLikeOutfit={toggleLikeOutfit} currentUser={currentUser} onDeleteOutfit={openDeleteDialog} />} />
              <Route
                path="/profile/:userId"
                element={
                  <ProfilePage
                    onOutfitClick={handleOutfitCardClick}
                    outfits={outfits}
                    users={allUsersForSearch}
                    followedUsers={followedUsers}
                    toggleFollowUser={toggleFollowUser}
                    onEditProfile={() => setIsEditProfileModalOpen(true)}
                    currentUser={currentUser}
                    likedOutfits={likedOutfits}
                    toggleLikeOutfit={toggleLikeOutfit}
                    toggleSaveOutfit={toggleSaveOutfit}
                    onDeleteOutfit={openDeleteDialog}
                    savedOutfits={savedOutfits}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <ProfilePage
                    onOutfitClick={handleOutfitCardClick}
                    outfits={outfits}
                    users={allUsersForSearch}
                    isCurrentUserProfile={true}
                    followedUsers={followedUsers}
                    toggleFollowUser={toggleFollowUser}
                    onEditProfile={() => setIsEditProfileModalOpen(true)}
                    currentUser={currentUser}
                    likedOutfits={likedOutfits}
                    toggleLikeOutfit={toggleLikeOutfit}
                    toggleSaveOutfit={toggleSaveOutfit}
                    onDeleteOutfit={openDeleteDialog}
                    savedOutfits={savedOutfits}
                  />
                }
              />
              <Route path="/settings" element={<SettingsPage currentUser={currentUser} onUpdateProfile={handleUpdateProfile} onLogout={handleLogout} onEditProfile={() => setIsEditProfileModalOpen(true)} />} />
              <Route path="/about" element={ <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="p-8 text-center"> <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/f35a503e-e59f-4088-b629-60f8a2d53297/cca53b1ccb3e4680f9eb3b92c046a5da.png" alt="W Logo" className="w-8 h-8 inline-block mr-2 text-primary" /><h1 className="inline-block text-2xl font-semibold">Acerca de W</h1> <p className="text-muted-foreground">W es una plataforma para descubrir y compartir inspiración de moda. ¡Únete a nuestra comunidad!</p> </motion.div>} />
              <Route path="/contact" element={ <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="p-8 text-center"> <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/f35a503e-e59f-4088-b629-60f8a2d53297/cca53b1ccb3e4680f9eb3b92c046a5da.png" alt="W Logo" className="w-8 h-8 inline-block mr-2 text-primary" /><h1 className="inline-block text-2xl font-semibold">Contacto</h1> <p className="text-muted-foreground">Para consultas, contáctanos en support@wearly.com</p> </motion.div>} />
              <Route path="/terms" element={ <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="p-8 text-center"> <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/f35a503e-e59f-4088-b629-60f8a2d53297/cca53b1ccb3e4680f9eb3b92c046a5da.png" alt="W Logo" className="w-8 h-8 inline-block mr-2 text-primary" /><h1 className="inline-block text-2xl font-semibold">Términos y Condiciones</h1> <p className="text-muted-foreground">Lee nuestros términos y condiciones de uso aquí. (Página en construcción)</p> </motion.div>} />
            </Routes>
          </AnimatePresence>
        </main>
        {!isAuthPage && <Footer />}
      </div>
      {!isAuthPage && <MobileBottomNav onUploadClick={() => setIsUploadFormOpen(true)} />}
      <UploadOutfitForm
        isOpen={isUploadFormOpen}
        onOpenChange={setIsUploadFormOpen}
        onOutfitAdd={handleAddOutfit}
      />
      {currentUser &&
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onOpenChange={setIsEditProfileModalOpen}
          currentUser={currentUser}
          onUpdateProfile={handleUpdateProfile}
        />
      }
      {selectedOutfit &&
        <OutfitDetailModal
          isOpen={isOutfitDetailModalOpen}
          onOpenChange={setIsOutfitDetailModalOpen}
          outfit={selectedOutfit}
          toggleSaveOutfit={toggleSaveOutfit}
          isOutfitSaved={savedOutfits.some(saved => saved.id === selectedOutfit.id)}
          isOutfitLiked={likedOutfits.includes(selectedOutfit.id)}
          toggleLikeOutfit={toggleLikeOutfit}
          currentUser={currentUser}
          onDeleteOutfit={openDeleteDialog}
        />
      }
      <DeleteOutfitDialog
        isOpen={isDeleteOutfitDialogOpen}
        onOpenChange={setIsDeleteOutfitDialogOpen}
        onConfirmDelete={confirmDeleteOutfit}
        outfitTitle={outfitToDelete?.title}
      />
    </div>
  );
};

export default AppRoutes;