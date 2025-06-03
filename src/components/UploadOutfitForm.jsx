import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { PlusCircle, Trash2, ImageDown as ImageUp, CheckCircle, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

const UploadOutfitForm = ({ isOpen, onOpenChange, onOutfitAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [garments, setGarments] = useState([{ id: uuidv4(), name: '', url: '' }]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    // Revoke the object URL when the component unmounts or imagePreview changes
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview); // Revoke previous blob URL
      }
      setImageFile(file);
      const newPreviewUrl = URL.createObjectURL(file);
      setImagePreview(newPreviewUrl);
    }
  };

  const handleAddGarment = () => {
    setGarments([...garments, { id: uuidv4(), name: '', url: '' }]);
  };

  const handleRemoveGarment = (idToRemove) => {
    setGarments(garments.filter(garment => garment.id !== idToRemove));
  };

  const handleGarmentChange = (id, field, value) => {
    setGarments(garments.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setGarments([{ id: uuidv4(), name: '', url: '' }]);
    setImageFile(null);
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({ title: "Error", description: "El título del outfit es obligatorio.", variant: "destructive" });
      return;
    }
    if (!imageFile) {
      toast({ title: "Error", description: "Debes seleccionar una imagen para el outfit.", variant: "destructive" });
      return;
    }
    const validGarments = garments.filter(g => g.name.trim() && g.url.trim());
    if (garments.length === 0 || validGarments.length !== garments.length) {
       toast({ title: "Error", description: "Debes añadir al menos una prenda, y todas las prendas deben tener nombre y URL.", variant: "destructive" });
      return;
    }
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (validGarments.some(g => !urlRegex.test(g.url))) {
      toast({ title: "Error", description: "Por favor, introduce URLs válidas para las prendas (ej: https://tienda.com/prenda).", variant: "destructive" });
      return;
    }

    const newOutfit = {
      id: uuidv4(), title, description, imageUrl: imagePreview, // This will be a blob URL, needs proper handling for persistence
      garments: validGarments, uploadedAt: new Date().toISOString(), user: "currentUser", saves: 0,
    };

    onOutfitAdd(newOutfit);
    toast({ title: "¡Éxito!", description: "Tu outfit ha sido subido.", action: <CheckCircle className="text-green-500" /> });
    onOpenChange(false); // Close modal, which will trigger resetForm via onOpenChange prop in Dialog
  };
  
  const handleModalOpenChange = (open) => {
    if (!open) {
      resetForm(); // Ensure form is reset and blob URL revoked when dialog is closed
    }
    onOpenChange(open);
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleModalOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg bg-gradient-to-br from-background to-secondary/20 border-border/70 rounded-lg shadow-xl p-0 data-[state=open]:animate-fade-in">
        <DialogHeader className="px-6 py-4 border-b border-border/50">
          <DialogTitle className="text-xl font-semibold text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>Subir Nuevo Outfit</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Añade una imagen y los detalles de tu look.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4 max-h-[calc(80vh-140px)] overflow-y-auto">
            <div className="space-y-2">
              {imagePreview && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  className="mb-3 rounded-md overflow-hidden border border-border/50 aspect-square w-full max-w-xs mx-auto bg-muted"
                >
                  <img src={imagePreview} alt="Vista previa del outfit" className="object-cover w-full h-full" />
                </motion.div>
              )}
              <Label htmlFor="image-upload" className="text-xs font-medium text-muted-foreground">Imagen del Outfit</Label>
              <Input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full rounded-md border-dashed hover:border-primary hover:text-primary">
                <ImageUp className="w-4 h-4 mr-2" />
                {imagePreview ? "Cambiar Imagen" : "Seleccionar Imagen"}
              </Button>
            </div>

            <div className="space-y-1">
              <Label htmlFor="title" className="text-xs font-medium text-muted-foreground">Título</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-md focus:border-primary text-sm" placeholder="Ej: Look casual de verano" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="description" className="text-xs font-medium text-muted-foreground">Descripción (Opcional)</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-md focus:border-primary min-h-[60px] text-sm" placeholder="Detalles, inspiración..." />
            </div>

            <div>
              <Label className="mb-1 text-xs font-medium text-muted-foreground flex items-center"><LinkIcon className="w-3 h-3 mr-1.5 text-primary"/>Prendas (mínimo 1)</Label>
              <AnimatePresence>
                {garments.map((garment) => (
                  <motion.div
                    key={garment.id} layout initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 gap-2 p-2 mb-2 border rounded-md sm:grid-cols-12 bg-background/30 border-border/50"
                  >
                    <Input value={garment.name} onChange={(e) => handleGarmentChange(garment.id, 'name', e.target.value)} placeholder="Nombre prenda" className="sm:col-span-5 rounded-md focus:border-primary text-xs h-8" />
                    <Input value={garment.url} onChange={(e) => handleGarmentChange(garment.id, 'url', e.target.value)} placeholder="URL" type="url" className="sm:col-span-6 rounded-md focus:border-primary text-xs h-8" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveGarment(garment.id)} className="text-destructive hover:text-destructive/80 sm:col-span-1 disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8" aria-label="Eliminar prenda" disabled={garments.length <= 1}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button type="button" variant="outline" onClick={handleAddGarment} className="w-full mt-1 border-dashed rounded-md hover:border-primary hover:text-primary text-xs h-8">
                <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Añadir Prenda
              </Button>
            </div>
          </div>
          <DialogFooter className="px-6 py-3 border-t border-border/50">
            <DialogClose asChild><Button type="button" variant="outline" className="rounded-md text-sm h-9">Cancelar</Button></DialogClose>
            <Button type="submit" className="rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm h-9">Subir Outfit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadOutfitForm;