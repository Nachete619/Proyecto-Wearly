import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, TrendingUp, Bell, Bookmark, PlusSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: "/home", label: "Inicio", icon: Home },
  { path: "/trends", label: "Tendencias", icon: TrendingUp },
  { path: "/saved", label: "Guardados", icon: Bookmark },
  { path: "/notifications", label: "Notificaciones", icon: Bell },
];

const MobileBottomNav = ({ onUploadClick }) => {
  return (
    <motion.nav 
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden items-center justify-around h-16 bg-background/90 backdrop-blur-md border-t border-border/60 shadow-top"
    >
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 ease-in-out ${
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`
          }
        >
          <item.icon className="w-5 h-5" />
          <span className="mt-0.5 text-[0.6rem]">{item.label}</span>
        </NavLink>
      ))}
      <button
        onClick={onUploadClick}
        className="flex flex-col items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out"
        aria-label="Subir Outfit"
      >
        <PlusSquare className="w-5 h-5" />
        <span className="mt-0.5 text-[0.6rem]">Subir</span>
      </button>
    </motion.nav>
  );
};

export default MobileBottomNav;