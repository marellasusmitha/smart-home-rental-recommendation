import React, { useState, useMemo } from 'react';
import { Property, User, UserRole } from '../types';
import PropertyCard from './PropertyCard';
import { DetailsModal, VRModal, MapModal } from './Modals';
import { Search, SlidersHorizontal, User as UserIcon, LogOut, Heart, Sparkles, Home, Menu, X } from 'lucide-react';

interface TenantDashboardProps {
  user: User;
  properties: Property[];
  likedPropertyIds: string[];
  onToggleLike: (propertyId: string) => void;
  onLogout: () => void;
}

enum TenantTab {
  FIND = 'FIND',
  AI_PICKS = 'AI_PICKS',
  FAVORITES = 'FAVORITES',
  ABOUT = 'ABOUT',
  PROFILE = 'PROFILE'
}

const TenantDashboard: React.FC<TenantDashboardProps> = ({ 
  user, 
  properties, 
  likedPropertyIds, 
  onToggleLike,
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<TenantTab>(TenantTab.FIND);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isVROpen, setIsVROpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    minRent: '',
    maxRent: '',
    city: '',
    furnishedType: 'Any',
    propertyType: 'Any',
    minRating: ''
  });
  const [isFiltered, setIsFiltered] = useState(false);

  // AI Logic Helpers
  const likedProperties = useMemo(() => 
    properties.filter(p => likedPropertyIds.includes(p.id)), 
  [properties, likedPropertyIds]);

  const getRelevanceScore = (property: Property) => {
    let score = 0;
    // Boost rating
    score += property.rating * 2;
    // Boost if similar to favorites (Simple AI Content-Based Filtering)
    if (likedProperties.length > 0) {
      const cityMatch = likedProperties.some(lp => lp.city === property.city);
      const typeMatch = likedProperties.some(lp => lp.propertyType === property.propertyType);
      const rentSimilar = likedProperties.some(lp => Math.abs(lp.rent - property.rent) < 500);
      
      if (cityMatch) score += 5;
      if (typeMatch) score += 3;
      if (rentSimilar) score += 2;
    }
    return score;
  };

  const filteredAIProperties = useMemo(() => {
    if (!isFiltered) return [];

    let filtered = properties.filter(p => {
      if (filters.minRent && p.rent < Number(filters.minRent)) return false;
      if (filters.maxRent && p.rent > Number(filters.maxRent)) return false;
      if (filters.city && !p.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters.furnishedType !== 'Any' && p.furnishedType !== filters.furnishedType) return false;
      if (filters.propertyType !== 'Any' && p.propertyType !== filters.propertyType) return false;
      if (filters.minRating && p.rating < Number(filters.minRating)) return false;
      return true;
    });

    // Sort by AI relevance
    return filtered.sort((a, b) => getRelevanceScore(b) - getRelevanceScore(a));
  }, [properties, filters, isFiltered, likedProperties]);


  const handleOpenDetails = (p: Property) => {
    setSelectedProperty(p);
    setIsDetailsOpen(true);
  };

  const handleOpenVR = (p: Property) => {
    setSelectedProperty(p);
    setIsVROpen(true);
  };

  const handleOpenMap = (p: Property) => {
    setSelectedProperty(p);
    setIsMapOpen(true);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const renderTabButton = (tab: TenantTab, label: string, icon?: React.ReactNode) => (
    <button 
      onClick={() => { setActiveTab(tab); closeMobileMenu(); }}
      className={`${
        activeTab === tab 
          ? 'text-indigo-600 border-l-4 border-indigo-600 bg-indigo-50 md:bg-transparent md:border-l-0 md:border-b-2' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 md:hover:bg-transparent'
      } block w-full text-left md:inline-block md:w-auto px-4 py-3 md:px-1 md:py-1 text-base md:text-sm font-medium transition-colors`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
                <Home className="w-8 h-8" /> SmartHome
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8 h-full">
              {renderTabButton(TenantTab.FIND, 'Find Rentals')}
              {renderTabButton(TenantTab.AI_PICKS, 'AI Picks', <Sparkles size={16} />)}
              {renderTabButton(TenantTab.FAVORITES, 'Favorites')}
              {renderTabButton(TenantTab.ABOUT, 'About')}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-700 font-medium">Hi, {user.name}</span>
              <button onClick={() => setActiveTab(TenantTab.PROFILE)} className="p-2 rounded-full text-gray-400 hover:text-gray-500">
                <UserIcon size={20} />
              </button>
              <button onClick={onLogout} className="p-2 rounded-full text-red-400 hover:text-red-500">
                <LogOut size={20} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 shadow-lg animate-fadeIn">
            <div className="pt-2 pb-3 space-y-1">
              {renderTabButton(TenantTab.FIND, 'Find Rentals')}
              {renderTabButton(TenantTab.AI_PICKS, 'AI Picks', <Sparkles size={16} />)}
              {renderTabButton(TenantTab.FAVORITES, 'Favorites')}
              {renderTabButton(TenantTab.ABOUT, 'About')}
              {renderTabButton(TenantTab.PROFILE, 'My Profile', <UserIcon size={16} />)}
            </div>
            <div className="pt-4 pb-4 border-t border-gray-200 px-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <UserIcon size={20} />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Find Rentals */}
        {activeTab === TenantTab.FIND && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">All Rentals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(p => (
                <PropertyCard 
                  key={p.id}
                  property={p}
                  userRole={UserRole.TENANT}
                  isLiked={likedPropertyIds.includes(p.id)}
                  onToggleLike={onToggleLike}
                  onViewDetails={handleOpenDetails}
                  onViewVR={handleOpenVR}
                  onViewMap={handleOpenMap}
                />
              ))}
            </div>
          </div>
        )}

        {/* AI Picks */}
        {activeTab === TenantTab.AI_PICKS && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
               <div className="flex items-center gap-2 mb-4">
                 <SlidersHorizontal className="text-indigo-600" />
                 <h2 className="text-xl font-bold text-gray-900">AI Smart Filters</h2>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <input type="number" placeholder="Min Rent" className="border rounded p-2 text-sm w-full" value={filters.minRent} onChange={e => setFilters({...filters, minRent: e.target.value})} />
                  <input type="number" placeholder="Max Rent" className="border rounded p-2 text-sm w-full" value={filters.maxRent} onChange={e => setFilters({...filters, maxRent: e.target.value})} />
                  <input type="text" placeholder="City" className="border rounded p-2 text-sm w-full" value={filters.city} onChange={e => setFilters({...filters, city: e.target.value})} />
                  <select className="border rounded p-2 text-sm w-full" value={filters.propertyType} onChange={e => setFilters({...filters, propertyType: e.target.value})}>
                    <option value="Any">Any Type</option>
                    <option value="2BHK">2BHK</option>
                    <option value="3BHK">3BHK</option>
                    <option value="Individual House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Studio">Studio</option>
                  </select>
                  <select className="border rounded p-2 text-sm w-full" value={filters.furnishedType} onChange={e => setFilters({...filters, furnishedType: e.target.value})}>
                    <option value="Any">Any Furnishing</option>
                    <option value="Fully Furnished">Fully</option>
                    <option value="Semi Furnished">Semi</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                  <input type="number" placeholder="Min Rating (1-5)" className="border rounded p-2 text-sm w-full" value={filters.minRating} onChange={e => setFilters({...filters, minRating: e.target.value})} />
               </div>
               <div className="flex flex-col sm:flex-row gap-4 mt-6">
                 <button onClick={() => setIsFiltered(true)} className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium text-sm">Apply AI Filters</button>
                 <button onClick={() => { setIsFiltered(false); setFilters({minRent:'', maxRent:'', city:'', furnishedType:'Any', propertyType:'Any', minRating:''}); }} className="w-full sm:w-auto px-6 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition font-medium text-sm">Clear</button>
               </div>
            </div>

            {isFiltered ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Sparkles size={18} className="text-yellow-500" /> Recommended for You
                </h3>
                {filteredAIProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAIProperties.map(p => (
                      <PropertyCard 
                        key={p.id}
                        property={p}
                        userRole={UserRole.TENANT}
                        isLiked={likedPropertyIds.includes(p.id)}
                        onToggleLike={onToggleLike}
                        onViewDetails={handleOpenDetails}
                        onViewVR={handleOpenVR}
                        onViewMap={handleOpenMap}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-yellow-700">No properties match your specific preferences. Try adjusting your filters.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p>Use the filters above to find your perfect AI-matched home.</p>
              </div>
            )}
          </div>
        )}

        {/* Favorites */}
        {activeTab === TenantTab.FAVORITES && (
          <div className="space-y-6">
             <h2 className="text-2xl font-bold text-gray-900">Your Favorites</h2>
             {likedProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {likedProperties.map(p => (
                    <PropertyCard 
                      key={p.id}
                      property={p}
                      userRole={UserRole.TENANT}
                      isLiked={true}
                      onToggleLike={onToggleLike}
                      onViewDetails={handleOpenDetails}
                      onViewVR={handleOpenVR}
                      onViewMap={handleOpenMap}
                    />
                  ))}
                </div>
             ) : (
               <div className="text-center py-12">
                 <Heart className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                 <h3 className="text-lg font-medium text-gray-900">No favorites yet</h3>
                 <p className="mt-1 text-gray-500">Start exploring and like properties to see them here.</p>
               </div>
             )}
          </div>
        )}

        {/* About */}
        {activeTab === TenantTab.ABOUT && (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About SmartHome</h2>
            <div className="prose prose-indigo">
              <p className="text-gray-600 text-lg mb-4">
                Smart Home Rental Recommendation is a cutting-edge platform designed to simplify your home search experience using Artificial Intelligence and immersive visualization technologies.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li><strong>AI Recommendations:</strong> Our system learns from your preferences and favorites to suggest the best matches.</li>
                <li><strong>VR Tours:</strong> Experience properties from the comfort of your couch with video walkthroughs.</li>
                <li><strong>360° Map Views:</strong> Explore the neighborhood before you visit.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Profile */}
        {activeTab === TenantTab.PROFILE && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm text-center">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
               <UserIcon size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 mb-6">{user.email}</p>
            <div className="inline-block bg-indigo-50 px-3 py-1 rounded-full text-indigo-700 text-sm font-medium">
              Role: Tenant
            </div>
          </div>
        )}

      </main>

      {/* Modals */}
      {selectedProperty && (
        <>
          <DetailsModal 
            isOpen={isDetailsOpen} 
            onClose={() => setIsDetailsOpen(false)} 
            property={selectedProperty}
            onVR={() => { setIsDetailsOpen(false); setIsVROpen(true); }}
            onMap={() => { setIsDetailsOpen(false); setIsMapOpen(true); }}
            onToggleLike={() => onToggleLike(selectedProperty.id)}
            isLiked={likedPropertyIds.includes(selectedProperty.id)}
            role={UserRole.TENANT}
          />
          <VRModal 
            isOpen={isVROpen} 
            onClose={() => setIsVROpen(false)} 
            videoUrl={selectedProperty.videoUrl} 
          />
          <MapModal 
            isOpen={isMapOpen} 
            onClose={() => setIsMapOpen(false)} 
            latitude={selectedProperty.latitude} 
            longitude={selectedProperty.longitude} 
          />
        </>
      )}
    </div>
  );
};

export default TenantDashboard;