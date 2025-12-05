import React, { useState } from 'react';
import { Property, User, Notification, UserRole, PropertyType, FurnishedType } from '../types';
import PropertyCard from './PropertyCard';
import { DetailsModal, VRModal, MapModal } from './Modals';
import { PlusCircle, List, Bell, User as UserIcon, LogOut, Home, Info, Upload, Link as LinkIcon, Edit2, MapPin, Menu, X } from 'lucide-react';

interface OwnerDashboardProps {
  user: User;
  properties: Property[];
  notifications: Notification[];
  onAddProperty: (p: Omit<Property, 'id'>) => void;
  onUpdateProperty: (p: Property) => void;
  onDeleteProperty: (id: string) => void;
  onLogout: () => void;
}

enum OwnerTab {
  MY_PROPERTIES = 'MY_PROPERTIES',
  ADD_PROPERTY = 'ADD_PROPERTY',
  NOTIFICATIONS = 'NOTIFICATIONS',
  ABOUT = 'ABOUT',
  PROFILE = 'PROFILE'
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  user,
  properties,
  notifications,
  onAddProperty,
  onUpdateProperty,
  onDeleteProperty,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<OwnerTab>(OwnerTab.MY_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Modal States
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isVROpen, setIsVROpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Edit Mode State
  const [editingId, setEditingId] = useState<string | null>(null);

  // Video Upload State
  const [videoInputType, setVideoInputType] = useState<'URL' | 'UPLOAD'>('URL');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    rating: '4.0',
    furnishedType: FurnishedType.FULLY,
    propertyType: PropertyType.BHK2,
    imageUrl: 'https://picsum.photos/800/600',
    rent: '',
    videoUrl: '',
    latitude: '',
    longitude: ''
  });

  const myProperties = properties.filter(p => p.ownerEmail === user.email);

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

  const handleEditClick = (p: Property) => {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      description: p.description,
      city: p.city,
      rating: p.rating.toString(),
      furnishedType: p.furnishedType as FurnishedType,
      propertyType: p.propertyType as PropertyType,
      imageUrl: p.imageUrl,
      rent: p.rent.toString(),
      videoUrl: p.videoUrl || '',
      latitude: p.latitude.toString(),
      longitude: p.longitude.toString()
    });
    // Guess input type based on URL content
    if (p.videoUrl && p.videoUrl.startsWith('blob:')) {
      setVideoInputType('UPLOAD');
    } else {
      setVideoInputType('URL');
    }
    setActiveTab(OwnerTab.ADD_PROPERTY);
    closeMobileMenu();
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to remove this property?")) {
      onDeleteProperty(id);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setFormData({ ...formData, videoUrl: objectUrl });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.rent || !formData.latitude || !formData.longitude || !formData.city) {
      alert("Please fill in all required fields.");
      return;
    }

    const propertyData = {
      title: formData.title,
      description: formData.description,
      rating: Number(formData.rating),
      furnishedType: formData.furnishedType,
      propertyType: formData.propertyType,
      imageUrl: formData.imageUrl,
      rent: Number(formData.rent),
      videoUrl: formData.videoUrl,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      city: formData.city,
      ownerEmail: user.email
    };

    if (editingId) {
      onUpdateProperty({ ...propertyData, id: editingId });
      alert("Property updated successfully!");
    } else {
      onAddProperty(propertyData);
      alert("Property added successfully!");
    }

    resetForm();
    setActiveTab(OwnerTab.MY_PROPERTIES);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '', description: '', city: '', rating: '4.0', furnishedType: FurnishedType.FULLY,
      propertyType: PropertyType.BHK2, imageUrl: 'https://picsum.photos/800/600',
      rent: '', videoUrl: '', latitude: '', longitude: ''
    });
    setVideoInputType('URL');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const renderTabButton = (tab: OwnerTab, label: string, icon?: React.ReactNode, extra?: React.ReactNode) => (
    <button 
      onClick={() => { setActiveTab(tab); resetForm(); closeMobileMenu(); }}
      className={`${
        activeTab === tab 
          ? 'text-indigo-600 border-l-4 border-indigo-600 bg-indigo-50 md:bg-transparent md:border-l-0 md:border-b-2' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 md:hover:bg-transparent'
      } block w-full text-left md:inline-block md:w-auto px-4 py-3 md:px-1 md:py-1 text-base md:text-sm font-medium transition-colors`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
        {extra}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
                <Home className="w-8 h-8" /> SmartHome <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded ml-2 hidden sm:inline-block">Owner</span>
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8 h-full">
              {renderTabButton(OwnerTab.MY_PROPERTIES, 'My Properties')}
              {renderTabButton(
                OwnerTab.ADD_PROPERTY, 
                editingId ? 'Edit Property' : 'Add Property', 
                editingId ? <Edit2 size={16} /> : <PlusCircle size={16} />
              )}
              {renderTabButton(
                OwnerTab.NOTIFICATIONS, 
                'Notifications', 
                <Bell size={16} />,
                notifications.filter(n => !n.read).length > 0 && <span className="ml-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
              {renderTabButton(OwnerTab.ABOUT, 'About')}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-700 font-medium">{user.name}</span>
              <button onClick={() => setActiveTab(OwnerTab.PROFILE)} className="p-2 rounded-full text-gray-400 hover:text-gray-500">
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
              {renderTabButton(OwnerTab.MY_PROPERTIES, 'My Properties')}
              {renderTabButton(
                OwnerTab.ADD_PROPERTY, 
                editingId ? 'Edit Property' : 'Add Property', 
                editingId ? <Edit2 size={16} /> : <PlusCircle size={16} />
              )}
              {renderTabButton(
                OwnerTab.NOTIFICATIONS, 
                'Notifications', 
                <Bell size={16} />,
                notifications.filter(n => !n.read).length > 0 && <span className="ml-1 w-2 h-2 bg-red-500 rounded-full inline-block"></span>
              )}
              {renderTabButton(OwnerTab.ABOUT, 'About')}
              {renderTabButton(OwnerTab.PROFILE, 'My Profile', <UserIcon size={16} />)}
            </div>
            <div className="pt-4 pb-4 border-t border-gray-200 px-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* My Properties */}
        {activeTab === OwnerTab.MY_PROPERTIES && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><List /> My Properties</h2>
            {myProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProperties.map(p => (
                  <PropertyCard 
                    key={p.id}
                    property={p}
                    userRole={UserRole.OWNER}
                    onViewDetails={handleOpenDetails}
                    onViewVR={handleOpenVR}
                    onViewMap={handleOpenMap}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 text-center rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">You haven't listed any properties yet.</p>
                <button onClick={() => { setActiveTab(OwnerTab.ADD_PROPERTY); resetForm(); closeMobileMenu(); }} className="mt-4 text-indigo-600 font-medium hover:underline">Add your first property</button>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Property */}
        {activeTab === OwnerTab.ADD_PROPERTY && (
           <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-200">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{editingId ? 'Edit Property' : 'List a New Property'}</h2>
                {editingId && <button onClick={resetForm} className="text-sm text-red-500 hover:underline">Cancel Edit</button>}
             </div>
             
             <form onSubmit={handleSubmit} className="space-y-4">
               <div><label className="block text-sm font-medium text-gray-700">Title</label><input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required /></div>
               <div><label className="block text-sm font-medium text-gray-700">Description</label><textarea className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required /></div>
               <div><label className="block text-sm font-medium text-gray-700">City / Place</label><div className="relative"><MapPin className="absolute left-2 top-2.5 text-gray-400" size={16} /><input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 pl-8" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required placeholder="e.g. Vijayawada, Bangalore" /></div></div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div><label className="block text-sm font-medium text-gray-700">Rent (₹/mo)</label><input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={formData.rent} onChange={e => setFormData({...formData, rent: e.target.value})} required /></div>
                 <div><label className="block text-sm font-medium text-gray-700">Rating (Initial)</label><input type="number" step="0.1" max="5" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} /></div>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700">Type</label>
                   <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={formData.propertyType} onChange={e => setFormData({...formData, propertyType: e.target.value as any})}>
                     {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700">Furnishing</label>
                   <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={formData.furnishedType} onChange={e => setFormData({...formData, furnishedType: e.target.value as any})}>
                     {Object.values(FurnishedType).map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                 </div>
               </div>
               <div><label className="block text-sm font-medium text-gray-700">Image URL</label><input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} required /></div>
               
               {/* VR/Video Section */}
               <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">VR View / Video Walkthrough</label>
                  <div className="flex flex-col sm:flex-row gap-4 mb-3">
                    <button 
                      type="button" 
                      onClick={() => setVideoInputType('URL')} 
                      className={`flex-1 py-2 sm:py-1 px-3 rounded text-sm flex items-center justify-center gap-2 border ${videoInputType === 'URL' ? 'bg-white border-indigo-500 text-indigo-600 shadow-sm' : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-100'}`}
                    >
                      <LinkIcon size={14} /> Link (YouTube/MP4)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setVideoInputType('UPLOAD')} 
                      className={`flex-1 py-2 sm:py-1 px-3 rounded text-sm flex items-center justify-center gap-2 border ${videoInputType === 'UPLOAD' ? 'bg-white border-indigo-500 text-indigo-600 shadow-sm' : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-100'}`}
                    >
                      <Upload size={14} /> Upload Video
                    </button>
                  </div>
                  
                  {videoInputType === 'URL' ? (
                     <input 
                       type="text" 
                       className="block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                       value={formData.videoUrl} 
                       onChange={e => setFormData({...formData, videoUrl: e.target.value})} 
                       placeholder="e.g. https://www.youtube.com/watch?v=..." 
                     />
                  ) : (
                    <div>
                      <input 
                        type="file" 
                        accept="video/*" 
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        onChange={handleFileChange}
                      />
                      {formData.videoUrl && formData.videoUrl.startsWith('blob:') && (
                        <p className="mt-2 text-xs text-green-600">Video selected ready for upload.</p>
                      )}
                    </div>
                  )}
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div><label className="block text-sm font-medium text-gray-700">Latitude</label><input type="number" step="any" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} required placeholder="e.g. 40.7128" /></div>
                 <div><label className="block text-sm font-medium text-gray-700">Longitude</label><input type="number" step="any" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} required placeholder="e.g. -74.0060" /></div>
               </div>
               <div><label className="block text-sm font-medium text-gray-700">Owner Email (Read-only)</label><input type="text" className="mt-1 block w-full border border-gray-300 bg-gray-100 rounded-md shadow-sm p-2 text-gray-500" value={user.email} disabled /></div>
               
               <div className="pt-4 flex flex-col sm:flex-row gap-4">
                 <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                   {editingId ? 'Update Property' : 'Add Property'}
                 </button>
                 {editingId && (
                   <button type="button" onClick={resetForm} className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                     Cancel
                   </button>
                 )}
               </div>
             </form>
           </div>
        )}

        {/* Notifications */}
        {activeTab === OwnerTab.NOTIFICATIONS && (
          <div className="max-w-3xl mx-auto space-y-4">
             <h2 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h2>
             {notifications.length > 0 ? (
                notifications.map(n => (
                  <div key={n.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-indigo-500 flex items-start">
                    <Info className="text-indigo-500 mt-1 mr-3 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-gray-800">{n.message}</p>
                      <span className="text-xs text-gray-500 block mt-1">{new Date(n.date).toLocaleString()}</span>
                    </div>
                  </div>
                ))
             ) : (
                <div className="bg-blue-50 text-blue-700 p-4 rounded-md">No notifications yet.</div>
             )}
          </div>
        )}

        {/* About */}
        {activeTab === OwnerTab.ABOUT && (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why List With Us?</h2>
            <div className="space-y-4 text-gray-600">
               <p><strong>Maximum Visibility:</strong> Our AI algorithms ensure your property is seen by the tenants most likely to rent it.</p>
               <p><strong>Advanced Tech:</strong> Tenants can view your property in VR and explore the location via 360° maps before even calling you, saving you time on unqualified leads.</p>
               <p><strong>Real-time Updates:</strong> Get notified instantly when someone shows interest.</p>
            </div>
          </div>
        )}

        {/* Profile */}
        {activeTab === OwnerTab.PROFILE && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm text-center">
             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
               <UserIcon size={48} />
             </div>
             <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
             <p className="text-gray-500 mb-6">{user.email}</p>
             <div className="inline-block bg-green-50 px-3 py-1 rounded-full text-green-700 text-sm font-medium">
               Role: Owner
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
            role={UserRole.OWNER}
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

export default OwnerDashboard;