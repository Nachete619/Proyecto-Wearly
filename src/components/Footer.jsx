import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const footerLinks = [
    { name: "Acerca de Wearly", path: "/about" },
    { name: "Contacto", path: "/contact" },
    { name: "Términos y Condiciones", path: "/terms" },
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="py-6 border-t border-border/40 bg-secondary/30 text-xs"
    >
      <div className="container flex flex-col items-center justify-between max-w-screen-2xl sm:flex-row px-4 sm:px-6 lg:px-8">
        <p className="text-muted-foreground">
          © {new Date().getFullYear()} Wearly. Todos los derechos reservados.
        </p>
        <nav className="flex mt-3 space-x-4 sm:mt-0 sm:space-x-6">
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-muted-foreground hover:text-primary-foreground transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </motion.footer>
  );
};

export default Footer;