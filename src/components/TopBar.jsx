import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, UserCircle, Settings, Moon, Sun, LogOut, Edit3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useAppState } from '@/contexts/AppStateContext';


const TopBar = ({ onLogout: propOnLogout, currentUser: propCurrentUser }) => {
  const { currentUser: contextCurrentUser, handleLogout: contextHandleLogout } = useAppState();
  const currentUser = propCurrentUser || contextCurrentUser;
  const onLogout = propOnLogout || contextHandleLogout;

  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('wearly-theme');
    return storedTheme === 'dark';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('wearly-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('wearly-theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
    toast({
      title: "Sesión Cerrada",
      description: "Has cerrado sesión exitosamente.",
    });
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSearchIconClick = () => {
    if (searchTerm.trim() !== '') {
       navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  }

  return (
    <motion.header 
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "circOut" }}
      className="fixed top-0 left-0 md:left-20 right-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-background/80 backdrop-blur-md border-b border-border/60"
    >
      <div className="relative flex-grow max-w-xs md:max-w-xl">
        <button onClick={handleSearchIconClick} className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground">
          <Search className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <Input 
          type="search" 
          placeholder="Buscar..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
          className="w-full pl-9 md:pl-10 pr-4 text-xs md:text-sm rounded-full bg-secondary/70 border-transparent focus:bg-background focus:border-primary focus:ring-primary h-9 md:h-auto"
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }} className="cursor-pointer ml-3">
            <Avatar className="w-8 h-8 md:w-9 md:h-9">
              <AvatarImage src={currentUser?.avatarUrl || ''} alt={currentUser?.username || 'User'} />
              <AvatarFallback>
                <UserCircle className="w-full h-full text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-2 border-border/70 shadow-lg bg-background">
          <DropdownMenuLabel>{currentUser?.username || 'Mi Cuenta'}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center cursor-pointer">
              <UserCircle className="w-4 h-4 mr-2" />
              Ver Perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')} className="flex items-center cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            Opciones
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem
            checked={darkMode}
            onCheckedChange={toggleDarkMode}
            className="flex items-center cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
            Modo Oscuro
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleLogoutClick}
            className="flex items-center text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-700/20 dark:focus:text-red-500"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.header>
  );
};

export default TopBar;