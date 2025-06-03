import React, { createContext, useContext, useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

const AppStateContext = createContext();

export const useAppState = () => useContext(AppStateContext);

const initialOutfitsData = [];
const initialUsersData = [
  { id: 'user1', username: 'StyleSavvy', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces', bio: 'Amante de la moda urbana y los looks atrevidos.', followers: 120, following: 50, socialLinks: { instagram: 'https://instagram.com/stylesavvy', pinterest: ''} },
  { id: 'user2', username: 'ChicSeeker', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces', bio: 'En busca de la elegancia en cada detalle. Minimalismo y sofisticación.', followers: 250, following: 80, socialLinks: { instagram: '', pinterest: 'https://pinterest.com/chicseeker'} },
  { id: 'user3', username: 'VintageVibes', avatarUrl: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=100&h=100&fit=crop&crop=faces', bio: 'Rescatando tesoros del pasado. Moda con historia y personalidad.', followers: 180, following: 70, socialLinks: { instagram: 'https://instagram.com/vintagevibes', pinterest: 'https://pinterest.com/vintagevibes'} },
];
const defaultCurrentUser = {
  id: 'currentUser',
  username: 'TuNombreDeUsuario',
  bio: 'Tu bio aquí...',
  avatarUrl: '',
  followers: 0,
  following: 0,
  socialLinks: { instagram: '', pinterest: '' }
};

export const AppStateProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage('wearly-auth', false);
  const [currentUser, setCurrentUser] = useLocalStorage('wearly-currentUser', defaultCurrentUser);
  const [outfits, setOutfits] = useLocalStorage('wearly-outfits', initialOutfitsData);
  const [users, setUsers] = useLocalStorage('wearly-users', initialUsersData);
  const [savedOutfits, setSavedOutfits] = useLocalStorage('wearly-saved-outfits', []);
  const [likedOutfits, setLikedOutfits] = useLocalStorage('wearly-liked-outfits', []); 
  const [followedUsers, setFollowedUsers] = useLocalStorage('wearly-followed-users', []);

  useEffect(() => {
    if (outfits.length > 0) {
      setOutfits(prevOutfits => [...prevOutfits].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)));
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    const storedUser = JSON.parse(localStorage.getItem('wearly-currentUser'));
    if (!storedUser || !storedUser.id) {
      setCurrentUser(defaultCurrentUser);
      localStorage.setItem('wearly-currentUser', JSON.stringify(defaultCurrentUser));
    } else {
      setCurrentUser(storedUser);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleUpdateProfile = (updatedProfileData) => {
    if (currentUser.avatarUrl && currentUser.avatarUrl.startsWith('blob:') && currentUser.avatarUrl !== updatedProfileData.avatarUrl) {
      URL.revokeObjectURL(currentUser.avatarUrl);
    }
    setCurrentUser(prevUser => ({ ...prevUser, ...updatedProfileData }));
    setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? { ...u, ...updatedProfileData } : u));
  };

  const handleAddOutfit = (newOutfitData) => {
    const outfitWithUser = {
      ...newOutfitData,
      id: newOutfitData.id || uuidv4(),
      user: {
        id: currentUser.id,
        username: currentUser.username,
        avatarUrl: currentUser.avatarUrl,
      },
      saves: 0,
      likes: 0, 
      uploadedAt: newOutfitData.uploadedAt || new Date().toISOString(),
    };
    setOutfits(prevOutfits => [outfitWithUser, ...prevOutfits].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)));
  };

  const handleDeleteOutfit = (outfitId) => {
    const outfitToDelete = outfits.find(o => o.id === outfitId);
    if (outfitToDelete && outfitToDelete.imageUrl && outfitToDelete.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(outfitToDelete.imageUrl);
    }
    setOutfits(prevOutfits => prevOutfits.filter(o => o.id !== outfitId));
    setSavedOutfits(prevSaved => prevSaved.filter(o => o.id !== outfitId));
    setLikedOutfits(prevLiked => prevLiked.filter(id => id !== outfitId));
  };

  const toggleSaveOutfit = (outfitId) => {
    setOutfits(prevOutfits =>
      prevOutfits.map(o => {
        if (o.id === outfitId) {
          const isCurrentlySaved = savedOutfits.some(saved => saved.id === outfitId);
          return { ...o, saves: Math.max(0, (o.saves || 0) + (isCurrentlySaved ? -1 : 1)) };
        }
        return o;
      })
    );
    setSavedOutfits(prevSaved => {
      const isCurrentlySaved = prevSaved.some(saved => saved.id === outfitId);
      if (isCurrentlySaved) {
        return prevSaved.filter(saved => saved.id !== outfitId);
      } else {
        const outfitToSave = outfits.find(o => o.id === outfitId);
        return outfitToSave ? [...prevSaved, outfitToSave] : prevSaved;
      }
    });
  };

  const toggleLikeOutfit = (outfitId) => {
    const isCurrentlyLiked = likedOutfits.includes(outfitId);
    setOutfits(prevOutfits =>
      prevOutfits.map(o => {
        if (o.id === outfitId) {
          return { ...o, likes: Math.max(0, (o.likes || 0) + (isCurrentlyLiked ? -1 : 1)) };
        }
        return o;
      })
    );
    setLikedOutfits(prevLiked => {
      if (isCurrentlyLiked) {
        return prevLiked.filter(id => id !== outfitId);
      } else {
        return [...prevLiked, outfitId];
      }
    });
  };

  const toggleFollowUser = (userIdToFollow) => {
    setFollowedUsers(prevFollowed => {
      if (prevFollowed.includes(userIdToFollow)) {
        return prevFollowed.filter(id => id !== userIdToFollow);
      } else {
        return [...prevFollowed, userIdToFollow];
      }
    });
  };

  const value = {
    isAuthenticated,
    currentUser,
    outfits,
    users,
    savedOutfits,
    likedOutfits,
    followedUsers,
    setIsAuthenticated,
    setCurrentUser,
    setOutfits,
    setUsers,
    setSavedOutfits,
    setLikedOutfits,
    setFollowedUsers,
    handleLogin,
    handleLogout,
    handleUpdateProfile,
    handleAddOutfit,
    handleDeleteOutfit,
    toggleSaveOutfit,
    toggleLikeOutfit,
    toggleFollowUser,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};