import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from '@/AppRoutes';
import { AppStateProvider } from '@/contexts/AppStateContext';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <AppStateProvider>
        <AppRoutes />
        <Toaster />
      </AppStateProvider>
    </Router>
  );
}

export default App;