import React from 'react';
import { motion } from 'framer-motion';
import { BellRing, UserPlus, Heart, MessageCircle, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const initialNotificationsData = [
  // Example data removed, will be empty initially
];

const NotificationItem = ({ notification }) => {
  const Icon = notification.icon;
  let message = '';
  switch (notification.type) {
    case 'save':
      message = `@${notification.user} guardó tu outfit "${notification.outfit}".`;
      break;
    case 'follow':
      message = `@${notification.user} comenzó a seguirte.`;
      break;
    case 'comment':
      message = `@${notification.user} comentó en tu outfit "${notification.outfit}": "${notification.comment}"`;
      break;
    default:
      message = 'Nueva notificación.';
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start p-3 md:p-4 space-x-3 md:space-x-4 border-b last:border-b-0"
    >
      <Icon className={`w-5 h-5 md:w-6 md:h-6 mt-1 ${notification.color || 'text-primary'}`} />
      <div className="flex-1">
        <p className="text-xs md:text-sm text-foreground">{message}</p>
        <p className="text-xs text-muted-foreground">{notification.time}</p>
      </div>
    </motion.div>
  );
};

const NotificationsPage = () => {
  const [notificationsData, setNotificationsData] = React.useState(initialNotificationsData);
  // In a real app, notifications would come from a prop or context/API call

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container max-w-2xl py-6 md:py-8 mx-auto px-2 sm:px-4 lg:px-8"
    >
      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex items-center mb-4 md:mb-8 text-2xl md:text-3xl font-bold text-foreground px-2 md:px-0"
      >
        <BellRing className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 text-primary" />
        Notificaciones
      </motion.h1>

      <Card className="overflow-hidden shadow-lg">
        <CardContent className="p-0">
          {notificationsData.length > 0 ? (
            notificationsData.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="p-6 md:p-8 text-center"
            >
              <Info className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 text-muted-foreground opacity-30" />
              <p className="text-sm md:text-base text-muted-foreground">No tienes notificaciones nuevas.</p>
              <p className="text-xs md:text-sm text-muted-foreground/70">Tu actividad reciente aparecerá aquí.</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationsPage;