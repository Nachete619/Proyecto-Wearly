import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Bell, Bookmark, PlusSquare } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

const navItems = [
  { path: "/trends", label: "Tendencias", icon: TrendingUp },
  { path: "/home", label: "Inicio", icon: Home },
  { path: "/notifications", label: "Notificaciones", icon: Bell },
  { path: "/saved", label: "Guardados", icon: Bookmark },
];

const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/f35a503e-e59f-4088-b629-60f8a2d53297/cca53b1ccb3e4680f9eb3b92c046a5da.png";

const SideMenu = ({ onUploadClick }) => {
  const location = useLocation();

  return (
    <TooltipProvider delayDuration={100}>
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className="fixed top-0 left-0 z-40 hidden md:flex flex-col items-center w-20 h-full pt-4 pb-8 bg-background border-r border-border/60 shadow-sm"
      >
        <NavLink to="/home" className="mb-8 flex items-center justify-center w-full h-16">
          <motion.img
            src={logoUrl}
            alt="Wearly Logo"
            className="w-auto h-10 object-contain"
            whileHover={{ scale: 1.05, rotate: -3 }}
            transition={{ type: "spring", stiffness: 400 }}
          />
        </NavLink>

        <div className="flex flex-col items-center space-y-6">
          {navItems.map((item) => (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `p-3 rounded-lg transition-colors duration-200 ease-in-out hover:bg-primary/70 ${
                      isActive || (item.path === "/home" && (location.pathname === "/" || location.pathname === "/explore")) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-primary-foreground'
                    }`
                  }
                >
                  <item.icon className="w-6 h-6" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onUploadClick}
              className="p-3 mt-auto rounded-lg text-muted-foreground transition-colors duration-200 ease-in-out hover:bg-primary/70 hover:text-primary-foreground"
              aria-label="Subir Outfit"
            >
              <PlusSquare className="w-6 h-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-2">
            <p>Subir Outfit</p>
          </TooltipContent>
        </Tooltip>
      </motion.aside>
    </TooltipProvider>
  );
};

export default SideMenu;