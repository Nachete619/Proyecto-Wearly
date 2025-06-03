import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, ImageDown as ImageUp, Save, Instagram, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const EditProfileModal = ({ isOpen, onOpenChange, currentUser, onUpdateProfile }) => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [pinterestLink, setPinterestLink] = useState('');
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    // Revoke the object URL for avatar preview when the component unmounts or avatarPreview (that is a blob) changes
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);
  
  useEffect(() => {
    if (currentUser && isOpen) {
      setUsername(currentUser.username || '');
      setBio(currentUser.bio || '');
      setAvatarPreview(currentUser.avatarUrl || ''); // This could be a permalink or a blob from previous edit
      setInstagramLink(currentUser.socialLinks?.instagram || '');
      setPinterestLink(currentUser.socialLinks?.pinterest || '');
    } else if (!isOpen) {
       // Clean up if modal is closed without saving (or after saving)
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
      setAvatarPreview(''); // Reset preview to avoid showing old blob if user data not reloaded
      setAvatarFile(null);
      if(fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [currentUser, isOpen]);


  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({ title: "Error", description: "La imagen es demasiado grande. Máximo 2MB.", variant: "destructive" });
        return;
      }
      if (avatarPreview && avatarPreview.startsWith('blob:')) { // Revoke previous blob if any
        URL.revokeObjectURL(avatarPreview);
      }
      setAvatarFile(file);
      const newPreviewUrl = URL.createObjectURL(file);
      setAvatarPreview(newPreviewUrl);
    }
  };

  const validateUrl = (url) => {
    if (!url) return true; // Optional field
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast({ title: "Error", description: "El nombre de usuario no puede estar vacío.", variant: "destructive" });
      return;
    }
    if (username.length > 30) {
      toast({ title: "Error", description: "El nombre de usuario no puede exceder los 30 caracteres.", variant: "destructive" });
      return;
    }
    if (bio.length > 150) {
      toast({ title: "Error", description: "La bio no puede exceder los 150 caracteres.", variant: "destructive" });
      return;
    }
    if (!validateUrl(instagramLink) || !validateUrl(pinterestLink)) {
       toast({ title: "Error", description: "Por favor, introduce URLs válidas para las redes sociales.", variant: "destructive" });
      return;
    }


    const updatedProfileData = {
      username,
      bio,
      // If avatarFile exists, it means a new image was selected.
      // The avatarPreview will be a blob URL.
      // In a real backend scenario, you'd upload avatarFile and get a new permanent URL.
      // For localStorage, we'll store the blob URL directly for preview, but this won't persist across sessions well.
      // Ideally, for localStorage, you'd convert the image to base64, but that can be large.
      // For now, if a new file is selected, we pass its blob URL. If not, we pass the existing avatarUrl (which might be a permanent URL).
      avatarUrl: avatarFile ? avatarPreview : currentUser.avatarUrl,
      socialLinks: {
        instagram: instagramLink,
        pinterest: pinterestLink,
      }
    };
    
    onUpdateProfile(updatedProfileData);
    toast({ title: "¡Perfil Actualizado!", description: "Tus cambios han sido guardados." });
    // Do not revoke avatarPreview here if it's the one being saved and it's a blob.
    // The parent component (App.jsx) will update currentUser, and this modal will re-render with the new currentUser.avatarUrl.
    // The cleanup effect for 'avatarPreview' handles revoking old blobs if a new one is chosen or component unmounts.
    onOpenChange(false);
  };
  
  const resetFormOnClose = () => {
     // This function ensures that when the dialog is closed (either by Cancel or X),
     // any generated blob URL is revoked.
    if (avatarPreview && avatarPreview.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview);
    }
    // Reset local component state to reflect original currentUser values for next open
    if (currentUser) {
      setUsername(currentUser.username || '');
      setBio(currentUser.bio || '');
      setAvatarPreview(currentUser.avatarUrl || '');
      setInstagramLink(currentUser.socialLinks?.instagram || '');
      setPinterestLink(currentUser.socialLinks?.pinterest || '');
    }
    setAvatarFile(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  }


  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) resetFormOnClose(); onOpenChange(open); }}>
      <DialogContent className="sm:max-w-md md:max-w-lg bg-gradient-to-br from-background to-secondary/20 border-border/70 rounded-lg shadow-xl p-0 data-[state=open]:animate-fade-in">
        <DialogHeader className="px-6 py-4 border-b border-border/50">
          <DialogTitle className="text-xl font-semibold text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>Editar Perfil</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Personaliza tu información pública.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4 max-h-[calc(80vh-140px)] overflow-y-auto">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="w-24 h-24 border-2 border-primary bg-muted">
                <AvatarImage src={avatarPreview} alt={username} />
                <AvatarFallback>
                  <User className="w-12 h-12 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <Input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} ref={fileInputRef} className="hidden" />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full max-w-xs rounded-md border-dashed hover:border-primary hover:text-primary text-sm">
                <ImageUp className="w-4 h-4 mr-2" />
                Cambiar Foto de Perfil
              </Button>
            </div>

            <div className="space-y-1">
              <Label htmlFor="username" className="text-xs font-medium text-muted-foreground">Nombre de Usuario</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="rounded-md focus:border-primary text-sm" placeholder="Tu nombre de usuario" maxLength={30}/>
              <p className="text-xs text-muted-foreground text-right">{username.length}/30</p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="bio" className="text-xs font-medium text-muted-foreground">Bio</Label>
              <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="rounded-md focus:border-primary min-h-[80px] text-sm" placeholder="Cuéntanos sobre ti..." maxLength={150}/>
              <p className="text-xs text-muted-foreground text-right">{bio.length}/150</p>
            </div>
             <div className="space-y-1">
              <Label htmlFor="instagramLink" className="text-xs font-medium text-muted-foreground flex items-center"><Instagram className="w-3.5 h-3.5 mr-1.5 text-pink-500"/>Instagram (Opcional)</Label>
              <Input id="instagramLink" type="url" value={instagramLink} onChange={(e) => setInstagramLink(e.target.value)} className="rounded-md focus:border-primary text-sm" placeholder="https://instagram.com/tuusuario"/>
            </div>
             <div className="space-y-1">
              <Label htmlFor="pinterestLink" className="text-xs font-medium text-muted-foreground flex items-center"><LinkIcon className="w-3.5 h-3.5 mr-1.5 text-red-600"/>Pinterest (Opcional)</Label>
              <Input id="pinterestLink" type="url" value={pinterestLink} onChange={(e) => setPinterestLink(e.target.value)} className="rounded-md focus:border-primary text-sm" placeholder="https://pinterest.com/tuusuario"/>
            </div>
          </div>
          <DialogFooter className="px-6 py-3 border-t border-border/50">
            <DialogClose asChild><Button type="button" variant="outline" className="rounded-md text-sm h-9">Cancelar</Button></DialogClose>
            <Button type="submit" className="rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm h-9">
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;