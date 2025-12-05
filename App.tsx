import React, { useState, useEffect } from 'react';
import { AppState, User, UserRole, Property, Notification } from './types';
import { INITIAL_PROPERTIES } from './constants';
import { Landing, Login, Register, ForgotPassword } from './components/Auth';
import TenantDashboard from './components/TenantDashboard';
import OwnerDashboard from './components/OwnerDashboard';

type View = 'LANDING' | 'LOGIN' | 'REGISTER' | 'DASHBOARD' | 'FORGOT_PASSWORD';

const App: React.FC = () => {
  // --- State ---
  const [view, setView] = useState<View>('LANDING');
  
  // Initialize state splitting Data (Shared) and User (Session)
  const [appState, setAppState] = useState<AppState>(() => {
    // 1. Load Shared Data (Properties, Favorites, Notifications)
    const savedData = localStorage.getItem('smartHomeData');
    // 2. Load Session (Current User)
    const savedUser = localStorage.getItem('smartHomeUser');
    
    const parsedData = savedData ? JSON.parse(savedData) : {
      properties: INITIAL_PROPERTIES,
      favorites: {},
      notifications: {}
    };
    
    const parsedUser = savedUser ? JSON.parse(savedUser) : null;
    
    return {
      currentUser: parsedUser,
      ...parsedData
    };
  });

  // --- Persistence & Sync ---

  // 1. Persist Shared Data (Simulating Backend DB)
  useEffect(() => {
    const dataToSave = {
      properties: appState.properties,
      favorites: appState.favorites,
      notifications: appState.notifications
    };
    localStorage.setItem('smartHomeData', JSON.stringify(dataToSave));
  }, [appState.properties, appState.favorites, appState.notifications]);

  // 2. Persist Session (Simulating Auth Cookie)
  useEffect(() => {
    localStorage.setItem('smartHomeUser', JSON.stringify(appState.currentUser));
  }, [appState.currentUser]);

  // 3. Listen for changes from other tabs (Real-time Sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // If the "Database" changes in another tab, update this tab
      if (e.key === 'smartHomeData' && e.newValue) {
        const newData = JSON.parse(e.newValue);
        setAppState(prev => ({
          ...prev,
          properties: newData.properties,
          favorites: newData.favorites,
          notifications: newData.notifications
          // We DO NOT update currentUser here, preserving the local session
        }));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // --- Handlers ---

  const handleLogin = (email: string, role: UserRole) => {
    const user: User = { email, role, name: email.split('@')[0] };
    setAppState(prev => ({ ...prev, currentUser: user }));
    setView('DASHBOARD');
  };

  const handleRegister = (email: string, password: string) => {
    alert("Registration successful! Please login.");
    setView('LOGIN');
  };

  const handleLogout = () => {
    setAppState(prev => ({ ...prev, currentUser: null }));
    setView('LANDING');
  };

  const handleAddProperty = (newProp: Omit<Property, 'id'>) => {
    const property: Property = {
      ...newProp,
      id: Date.now().toString()
    };
    setAppState(prev => ({
      ...prev,
      properties: [...prev.properties, property]
    }));
  };

  const handleUpdateProperty = (updatedProp: Property) => {
    setAppState(prev => ({
      ...prev,
      properties: prev.properties.map(p => p.id === updatedProp.id ? updatedProp : p)
    }));
  };

  const handleDeleteProperty = (propertyId: string) => {
    setAppState(prev => ({
      ...prev,
      properties: prev.properties.filter(p => p.id !== propertyId)
    }));
  };

  const handleToggleLike = (propertyId: string) => {
    if (!appState.currentUser) return;
    
    const userEmail = appState.currentUser.email;
    const currentFavorites = appState.favorites[userEmail] || [];
    const isLiked = currentFavorites.includes(propertyId);
    
    let newFavorites;
    if (isLiked) {
      newFavorites = currentFavorites.filter(id => id !== propertyId);
    } else {
      newFavorites = [...currentFavorites, propertyId];
      
      // Notify Owner
      const property = appState.properties.find(p => p.id === propertyId);
      if (property) {
        const notification: Notification = {
          id: Date.now().toString(),
          ownerEmail: property.ownerEmail,
          message: `Tenant ${userEmail} liked your property "${property.title}"`,
          date: new Date().toISOString(),
          read: false
        };
        
        setAppState(prev => {
          const ownerNotifs = prev.notifications[property.ownerEmail] || [];
          return {
            ...prev,
            notifications: {
              ...prev.notifications,
              [property.ownerEmail]: [notification, ...ownerNotifs]
            }
          };
        });
      }
    }

    setAppState(prev => ({
      ...prev,
      favorites: {
        ...prev.favorites,
        [userEmail]: newFavorites
      }
    }));
  };

  // --- Render Logic ---

  // Check for existing session on initial load
  useEffect(() => {
    if (appState.currentUser && view === 'LANDING') {
        setView('DASHBOARD');
    }
  }, [appState.currentUser, view]);


  if (view === 'LANDING') {
    return <Landing onGetStarted={() => setView('REGISTER')} onSignIn={() => setView('LOGIN')} />;
  }

  if (view === 'LOGIN') {
    return (
      <Login 
        onLogin={handleLogin} 
        onRegister={() => {}} 
        onBack={() => setView('LANDING')} 
        onSwitchToRegister={() => setView('REGISTER')} 
        onForgotPassword={() => setView('FORGOT_PASSWORD')}
      />
    );
  }

  if (view === 'REGISTER') {
    return <Register onRegister={handleRegister} onBack={() => setView('LANDING')} onSwitchToLogin={() => setView('LOGIN')} />;
  }

  if (view === 'FORGOT_PASSWORD') {
    return <ForgotPassword onBack={() => setView('LOGIN')} />;
  }

  if (view === 'DASHBOARD' && appState.currentUser) {
    if (appState.currentUser.role === UserRole.TENANT) {
      return (
        <TenantDashboard 
          user={appState.currentUser}
          properties={appState.properties}
          likedPropertyIds={appState.favorites[appState.currentUser.email] || []}
          onToggleLike={handleToggleLike}
          onLogout={handleLogout}
        />
      );
    } else {
      return (
        <OwnerDashboard 
          user={appState.currentUser}
          properties={appState.properties}
          notifications={appState.notifications[appState.currentUser.email] || []}
          onAddProperty={handleAddProperty}
          onUpdateProperty={handleUpdateProperty}
          onDeleteProperty={handleDeleteProperty}
          onLogout={handleLogout}
        />
      );
    }
  }

  return <div>Loading...</div>;
};

export default App;