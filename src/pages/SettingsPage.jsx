import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Image as ImageIcon, LogOut, Save, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SettingsPage = ({ currentUser, onUpdateProfile, onLogout, onEditProfile }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newUsername, setNewUsername] = useState(currentUser?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleUsernameChange = (e) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      toast({ title: "Error", description: "El nombre de usuario no puede estar vacío.", variant: "destructive" });
      return;
    }
    if (newUsername.length > 30) {
      toast({ title: "Error", description: "El nombre de usuario no puede exceder los 30 caracteres.", variant: "destructive" });
      return;
    }
    onUpdateProfile({ ...currentUser, username: newUsername });
    toast({ title: "Nombre de usuario actualizado", description: `Tu nuevo nombre de usuario es ${newUsername}.` });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast({ title: "Error", description: "Todos los campos de contraseña son obligatorios.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({ title: "Error", description: "Las nuevas contraseñas no coinciden.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "La nueva contraseña debe tener al menos 6 caracteres.", variant: "destructive" });
      return;
    }
    // Simulate password change
    console.log("Simulating password change. Current:", currentPassword, "New:", newPassword);
    toast({ title: "Contraseña actualizada", description: "Tu contraseña ha sido cambiada exitosamente. (Simulado)" });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
    toast({ title: "Sesión Cerrada", description: "Has cerrado sesión exitosamente." });
  };

  const settingsSections = [
    {
      icon: User,
      title: "Nombre de Usuario",
      content: (
        <form onSubmit={handleUsernameChange} className="space-y-3">
          <div>
            <Label htmlFor="username" className="text-xs">Nuevo nombre de usuario</Label>
            <Input id="username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="Tu nuevo nombre" maxLength={30} />
            <p className="text-xs text-muted-foreground text-right mt-1">{newUsername.length}/30</p>
          </div>
          <Button type="submit" size="sm" className="w-full sm:w-auto rounded-md">
            <Save className="w-4 h-4 mr-2" /> Guardar Nombre
          </Button>
        </form>
      )
    },
    {
      icon: ImageIcon,
      title: "Foto de Perfil y Bio",
      content: (
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Avatar className="w-16 h-16 border-2 border-primary bg-muted">
              <AvatarImage src={currentUser?.avatarUrl} alt={currentUser?.username} />
              <AvatarFallback><User className="w-8 h-8 text-muted-foreground" /></AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground">Cambia tu foto de perfil y tu biografía editando tu perfil.</p>
          </div>
          <Button onClick={onEditProfile} size="sm" variant="outline" className="w-full sm:w-auto rounded-md">
            Editar Perfil Completo
          </Button>
        </div>
      )
    },
    {
      icon: Lock,
      title: "Cambiar Contraseña",
      content: (
        <form onSubmit={handlePasswordChange} className="space-y-3">
          <div>
            <Label htmlFor="currentPassword">Contraseña Actual</Label>
            <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div>
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div>
            <Label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña</Label>
            <Input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button type="submit" size="sm" className="w-full sm:w-auto rounded-md">
            <Save className="w-4 h-4 mr-2" /> Cambiar Contraseña
          </Button>
        </form>
      )
    },
    {
      icon: LogOut,
      title: "Cerrar Sesión",
      content: (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="w-full sm:w-auto rounded-md">
              <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esto cerrará tu sesión actual en Wearly. Podrás volver a iniciar sesión en cualquier momento.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogoutClick}>Cerrar Sesión</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container max-w-screen-md py-6 md:py-8 mx-auto px-2 sm:px-4 lg:px-8"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-6 md:mb-8 text-2xl md:text-3xl font-bold text-foreground px-2 md:px-0"
      >
        Configuración de la Cuenta
      </motion.h1>

      <div className="space-y-6 md:space-y-8">
        {settingsSections.map((section, index) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            className="p-4 md:p-6 bg-card rounded-lg shadow-sm"
          >
            <div className="flex items-center mb-3 md:mb-4">
              <section.icon className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-primary" />
              <h2 className="text-lg md:text-xl font-semibold text-foreground">{section.title}</h2>
            </div>
            <div className="text-sm text-foreground">
              {section.content}
            </div>
          </motion.section>
        ))}
      </div>
       <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 + settingsSections.length * 0.1, duration: 0.5 }}
        className="mt-8 p-4 md:p-6 bg-destructive/10 border border-destructive/30 rounded-lg shadow-sm"
      >
        <div className="flex items-start">
          <ShieldAlert className="w-6 h-6 mr-3 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-destructive">Zona de Peligro</h2>
            <p className="text-sm text-destructive/80 mt-1 mb-3">
              Las acciones en esta sección son permanentes y no se pueden deshacer. Procede con precaución.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="rounded-md">
                  Eliminar Cuenta (Próximamente)
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y todos tus datos de nuestros servidores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => toast({title: "Función no implementada", description: "La eliminación de cuenta estará disponible pronto."})} className="bg-destructive hover:bg-destructive/90">
                    Sí, eliminar mi cuenta
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;