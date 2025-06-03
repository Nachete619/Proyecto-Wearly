import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare as MessageSquareText, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area'; // Assuming ScrollArea is created

const conversations = [
  { id: 1, name: 'StyleGuru', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop', lastMessage: '¡Hola! Me encantó tu último outfit.', unread: 2, time: '10:30 AM' },
  { id: 2, name: 'Fashionista', avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=50&h=50&fit=crop', lastMessage: '¿Dónde compraste esos zapatos?', unread: 0, time: 'Ayer' },
  { id: 3, name: 'ModernMuse', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop', lastMessage: 'Gracias por el consejo de estilo :)', unread: 0, time: 'Vie' },
];

const messages = [
    { id: 1, sender: 'StyleGuru', text: '¡Hola! Me encantó tu último outfit.', time: '10:30 AM', self: false },
    { id: 2, sender: 'self', text: '¡Muchas gracias! Lo armé con piezas de segunda mano.', time: '10:32 AM', self: true },
    { id: 3, sender: 'StyleGuru', text: '¡Qué genial! Tienes mucho talento.', time: '10:33 AM', self: false },
];


const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = React.useState(conversations[0]);
  const [messageInput, setMessageInput] = React.useState('');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container max-w-screen-xl h-[calc(100vh-4rem)] py-0 mx-auto flex" // Adjusted height
    >
      {/* Sidebar with conversations */}
      <div className="flex flex-col w-1/3 border-r border-border/60 bg-background">
        <div className="p-4 border-b border-border/60">
          <h2 className="text-xl font-semibold text-foreground flex items-center">
            <MessageSquareText className="w-6 h-6 mr-2 text-primary" />
            Mensajes
          </h2>
        </div>
        <ScrollArea className="flex-1">
          {conversations.map(conv => (
            <div 
              key={conv.id} 
              className={`flex items-center p-3 space-x-3 cursor-pointer hover:bg-secondary/70 ${selectedConversation?.id === conv.id ? 'bg-secondary' : ''}`}
              onClick={() => setSelectedConversation(conv)}
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={conv.avatar} alt={conv.name} />
                <AvatarFallback>{conv.name.substring(0,1)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate text-foreground">{conv.name}</p>
                  <p className="text-xs text-muted-foreground">{conv.time}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm truncate text-muted-foreground">{conv.lastMessage}</p>
                  {conv.unread > 0 && (
                    <span className="px-2 py-0.5 text-xs font-semibold text-white rounded-full bg-primary">{conv.unread}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat area */}
      <div className="flex flex-col flex-1 bg-background">
        {selectedConversation ? (
          <>
            <div className="flex items-center p-4 space-x-3 border-b border-border/60">
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                <AvatarFallback>{selectedConversation.name.substring(0,1)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{selectedConversation.name}</p>
                <p className="text-xs text-green-500">En línea</p>
              </div>
            </div>
            <ScrollArea className="flex-1 p-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.self ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${msg.self ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.self ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/70 text-left'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="p-4 border-t border-border/60">
              <div className="flex items-center space-x-2">
                <Input 
                  type="text" 
                  placeholder="Escribe un mensaje..." 
                  className="flex-1 rounded-full bg-secondary/70 border-transparent focus:bg-background focus:border-primary"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <Button type="submit" size="icon" className="rounded-full bg-primary hover:bg-primary/90">
                  <Send className="w-5 h-5 text-primary-foreground" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1">
            <img-replace alt="No conversation selected illustration" class="w-48 h-48 mb-6 text-muted-foreground opacity-50" />
            <p className="text-lg text-muted-foreground">Selecciona una conversación para empezar a chatear.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessagesPage;