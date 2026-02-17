// Get user data from data attribute
const userElement = document.getElementById('root');
const currentUser = JSON.parse(userElement.getAttribute('data-user').replace(/&quot;/g, '"'));

function DashboardApp() {
  const [user, setUser] = React.useState(currentUser);
  const profilePhotoStorageKey = `dashboardProfilePhoto_${currentUser.user_id || currentUser.mobile || 'default'}`;
  const defaultAvatarUrl = '/images/image.png';
  const [activeSection, setActiveSection] = React.useState('overview');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedLanguage, setSelectedLanguage] = React.useState('en');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [profilePhoto, setProfilePhoto] = React.useState(localStorage.getItem(profilePhotoStorageKey) || '');

  // Mock notification data (will be dynamic from backend)
  const [notifications, setNotifications] = React.useState([]);
  const [notificationCount, setNotificationCount] = React.useState(0);

  // Language translations
  const translations = {
    en: {
      overview: 'Overview',
      profile: 'My Profile',
      services: 'Services',
      bills: 'Bills & Payments',
      complaints: 'Complaints',
      settings: 'Settings',
      welcome: 'Welcome',
      role: 'Role',
      email: 'Email',
      mobile: 'Mobile',
      userId: 'User ID',
      memberSince: 'Member Since',
      electricity: 'Electricity',
      gas: 'Gas',
      payments: 'Payments',
      openComplaints: 'Open',
      resolvedComplaints: 'Resolved',
      comingSoon: 'Coming Soon',
      logout: 'Logout',
      searchService: 'Search Service...',
      notifications: 'Notifications',
      language: 'Language',
      payElectricityBill: 'Pay Electricity Bill',
      payGasBill: 'Pay Gas Bill',
      fileComplaint: 'File Complaint',
      trackApplication: 'Track Application'
    },
    hi: {
      overview: 'à¤…à¤µà¤²à¥‹à¤•',
      profile: 'à¤®à¥‡à¤°à¥€ à¤ªà¥à¤°à¥‹à¤«à¤¾à¤‡à¤²',
      services: 'à¤¸à¥‡à¤µà¤¾à¤“à¤‚',
      bills: 'à¤¬à¤¿à¤² à¤”à¤° à¤­à¥à¤—à¤¤à¤¾à¤¨',
      complaints: 'à¤¶à¤¿à¤•à¤¾à¤¯à¤¤',
      settings: 'à¤¸à¥‡à¤Ÿà¤¿à¤‚à¤—à¥à¤¸',
      welcome: 'à¤¸à¥à¤µà¤¾à¤—à¤¤',
      role: 'à¤­à¥‚à¤®à¤¿à¤•à¤¾',
      email: 'à¤ˆà¤®à¥‡à¤²',
      mobile: 'à¤®à¥‹à¤¬à¤¾à¤‡à¤²',
      userId: 'à¤‰à¤ªà¤¯à¥‹à¤—à¤•à¤° à¤†à¤ˆà¤¡à¥€',
      memberSince: 'à¤¸à¤¦à¤¸à¥à¤¯ à¤¸à¥‡',
      electricity: 'à¤µà¤¿à¤¦à¥à¤¯à¥à¤¤',
      gas: 'à¤—à¥ˆà¤¸',
      payments: 'à¤­à¥à¤—à¤¤à¤¾à¤¨',
      openComplaints: 'à¤–à¥à¤²à¥‡ à¤—à¤',
      resolvedComplaints: 'à¤¸à¤®à¤¾à¤§à¤¾à¤¨',
      comingSoon: 'à¤œà¤²à¥à¤¦à¥€ à¤®à¥‡à¤‚',
      logout: 'à¤²à¥‰à¤— à¤†à¤‰à¤Ÿ',
      searchService: 'à¤¸à¥‡à¤µà¤¾ à¤–à¥‹à¤œà¥‡à¤‚...',
      notifications: 'à¤¸à¥‚à¤šà¤¨à¤¾à¤à¤‚',
      language: 'à¤­à¤¾à¤·à¤¾',
      payElectricityBill: 'à¤µà¤¿à¤¦à¥à¤¯à¥à¤¤ à¤¬à¤¿à¤² à¤­à¥à¤—à¤¤à¤¾à¤¨ à¤•à¤°à¥‡à¤‚',
      payGasBill: 'à¤—à¥ˆà¤¸ à¤¬à¤¿à¤² à¤­à¥à¤—à¤¤à¤¾à¤¨ à¤•à¤°à¥‡à¤‚',
      fileComplaint: 'à¤¶à¤¿à¤•à¤¾à¤¯à¤¤ à¤¦à¤°à¥à¤œ à¤•à¤°à¥‡à¤‚',
      trackApplication: 'à¤†à¤µà¥‡à¤¦à¤¨ à¤Ÿà¥à¤°à¥ˆà¤• à¤•à¤°à¥‡à¤‚'
    },
    te: {
      overview: 'à°…à°µà°²à±‹à°•à°¨à°‚',
      profile: 'à°¨à°¾ à°ªà±à°°à±Šà°«à±ˆà°²à±',
      services: 'à°¸à±‡à°µà°²à±',
      bills: 'à°¬à°¿à°²à±à°²à±à°²à± à°®à°°à°¿à°¯à± à°šà±†à°²à±à°²à°¿à°‚à°ªà±à°²à±',
      complaints: 'à°«à°¿à°°à±à°¯à°¾à°¦à±à°²à±',
      settings: 'à°¸à±†à°Ÿà±à°Ÿà°¿à°‚à°—à±à°²à±',
      welcome: 'à°¸à±à°µà°¾à°—à°¤à°‚',
      role: 'à°ªà°¾à°¤à±à°°',
      email: 'à°‡à°®à±†à°¯à°¿à°²à±',
      mobile: 'à°®à±Šà°¬à±ˆà°²à±',
      userId: 'à°µà°¿à°¨à°¿à°¯à±‹à°—à°¦à°¾à°°à± ID',
      memberSince: 'à°¸à°­à±à°¯à±à°¡à°¿à°—à°¾',
      electricity: 'à°µà°¿à°¦à±à°¯à±à°¤à±',
      gas: 'à°—à±à°¯à°¾à°¸à±',
      payments: 'à°šà±†à°²à±à°²à°¿à°‚à°ªà±à°²à±',
      openComplaints: 'à°¤à±†à°°à°¿à°šà°¿à°¨à°µà°¿',
      resolvedComplaints: 'à°ªà°°à°¿à°·à±à°•à°°à°¿à°‚à°šà°¬à°¡à°¿à°¨à°µà°¿',
      comingSoon: 'à°¤à±à°µà°°à°²à±‹ à°µà°¸à±à°¤à±‹à°‚à°¦à°¿',
      logout: 'à°²à°¾à°—à±à°…à°µà±à°Ÿà±',
      searchService: 'à°¸à±‡à°µà°¨à± à°¶à±‹à°§à°¿à°‚à°šà°‚à°¡à°¿...',
      notifications: 'à°ªà±à°°à°•à°Ÿà°¨à°²à±',
      language: 'à°­à°¾à°·',
      payElectricityBill: 'à°µà°¿à°¦à±à°¯à±à°¤à± à°¬à°¿à°²à± à°šà±†à°²à±à°²à°¿à°‚à°šà°‚à°¡à°¿',
      payGasBill: 'à°—à±à°¯à°¾à°¸à± à°¬à°¿à°²à± à°šà±†à°²à±à°²à°¿à°‚à°šà°‚à°¡à°¿',
      fileComplaint: 'à°«à°¿à°°à±à°¯à°¾à°¦à± à°¦à°¾à°–à°²à± à°šà±‡à°¯à°‚à°¡à°¿',
      trackApplication: 'à°¦à°°à°–à°¾à°¸à±à°¤à± à°Ÿà±à°°à°¾à°•à± à°šà±‡à°¯à°‚à°¡à°¿'
    },
    ta: {
      overview: 'à®•à®£à¯à®£à¯‹à®Ÿà¯à®Ÿà®®à¯',
      profile: 'à®Žà®©à¯ à®šà¯à®¯à®µà®¿à®µà®°à®®à¯',
      services: 'à®šà¯‡à®µà¯ˆà®•à®³à¯',
      bills: 'à®ªà®¿à®²à¯à®•à®³à¯ à®®à®±à¯à®±à¯à®®à¯ à®•à®Ÿà¯à®Ÿà®£à®™à¯à®•à®³à¯',
      complaints: 'à®ªà¯à®•à®¾à®°à¯à®•à®³à¯',
      settings: 'à®…à®®à¯ˆà®ªà¯à®ªà¯à®•à®³à¯',
      welcome: 'à®µà®°à®µà¯‡à®±à¯à®ªà¯',
      role: 'à®ªà®¾à®¤à¯à®¤à®¿à®°à®®à¯',
      email: 'à®®à®¿à®©à¯à®©à®žà¯à®šà®²à¯',
      mobile: 'à®®à¯Šà®ªà¯ˆà®²à¯',
      userId: 'à®ªà®¯à®©à®°à¯ ID',
      memberSince: 'à®‰à®±à¯à®ªà¯à®ªà®¿à®©à®°à®¾à®•',
      electricity: 'à®®à®¿à®©à¯à®šà®¾à®°à®®à¯',
      gas: 'à®Žà®°à®¿à®µà®¾à®¯à¯',
      payments: 'à®•à®Ÿà¯à®Ÿà®£à®™à¯à®•à®³à¯',
      openComplaints: 'à®¤à®¿à®±à®•à¯à®•à®ªà¯à®ªà®Ÿà¯à®Ÿà®µà¯ˆ',
      resolvedComplaints: 'à®¤à¯€à®°à¯à®•à¯à®•à®ªà¯à®ªà®Ÿà¯à®Ÿà®µà¯ˆ',
      comingSoon: 'à®µà®¿à®°à¯ˆà®µà®¿à®²à¯ à®µà®°à¯à®®à¯',
      logout: 'à®µà¯†à®³à®¿à®¯à¯‡à®±à¯',
      searchService: 'à®šà¯‡à®µà¯ˆà®¯à¯ˆà®¤à¯ à®¤à¯‡à®Ÿà¯...',
      notifications: 'à®…à®±à®¿à®µà®¿à®ªà¯à®ªà¯à®•à®³à¯',
      language: 'à®®à¯Šà®´à®¿',
      payElectricityBill: 'à®®à®¿à®©à¯ à®ªà®¿à®²à¯ à®šà¯†à®²à¯à®¤à¯à®¤à¯',
      payGasBill: 'à®Žà®°à®¿à®µà®¾à®¯à¯ à®ªà®¿à®²à¯ à®šà¯†à®²à¯à®¤à¯à®¤à¯',
      fileComplaint: 'à®ªà¯à®•à®¾à®°à¯ à®¤à®¾à®•à¯à®•à®²à¯ à®šà¯†à®¯à¯à®•',
      trackApplication: 'à®µà®¿à®£à¯à®£à®ªà¯à®ªà¯ˆ à®•à®£à¯à®•à®¾à®£à®¿à®•à¯à®•'
    }
  };

  // Translation function
  const t = (key) => {
    return translations[selectedLanguage]?.[key] || translations.en[key];
  };

  // Change language
  const changeLanguage = (lang) => {
    setSelectedLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  };

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'just now';
    const createdAt = new Date(timestamp);
    const now = new Date();
    const diffMs = now - createdAt;
    const minutes = Math.floor(diffMs / 60000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const normalizeNotification = (item) => {
    const message = item.message || '';
    return {
      id: item.id || `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: item.title || 'Admin Update',
      message,
      abstract: message.length > 78 ? `${message.slice(0, 78)}...` : message,
      time: formatRelativeTime(item.created_at),
      createdAt: item.created_at || new Date().toISOString(),
      isRead: Boolean(item.is_read),
      targetUrl: item.target_url || '/notifications'
    };
  };

  const markNotificationsAsRead = (ids = []) => {
    if (!ids.length) return;
    fetch('/api/notifications/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    }).catch(() => null);
    setNotifications(prev => {
      const next = prev.map(item => (ids.includes(item.id) ? { ...item, isRead: true } : item));
      setNotificationCount(next.filter(item => !item.isRead).length);
      return next;
    });
  };

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      const items = (data.items || []).map(normalizeNotification);
      setNotifications(items);
      setNotificationCount(items.filter(item => !item.isRead).length);
    } catch (err) {
      setNotifications([]);
      setNotificationCount(0);
    }
  };

  React.useEffect(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage');
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
    }

    loadNotifications();
    const intervalId = setInterval(loadNotifications, 20000);
    return () => clearInterval(intervalId);
  }, []);

  React.useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (!response.ok) return;
        const data = await response.json();
        setUser(prev => ({ ...prev, ...data }));
      } catch (error) {
        // Keep token data when profile API fails.
      }
    };
    loadUserProfile();
  }, []);

  const formatDateYMD = (dateValue) => {
    if (!dateValue) return 'N/A';
    const dt = new Date(dateValue);
    if (Number.isNaN(dt.getTime())) return 'N/A';
    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const resolveServiceRoute = (serviceName) => {
    const normalized = (serviceName || '').toLowerCase().trim();
    const compact = normalized.replace(/[\s_-]+/g, '');

    if (!compact) return '/dashboard';
    if (compact === 'payments' || compact === 'payment' || compact === 'history') return '/payments';
    if (
      compact.includes('electricity') ||
      compact.includes('electricty') ||
      compact.includes('power')
    ) {
      if (compact.includes('bill') || compact.includes('pay') || compact.includes('payment')) {
        return '/payments/electricity';
      }
      return '/electricity';
    }
    if (
      compact === 'electricitybill' ||
      compact === 'billpay' ||
      compact === 'payelectricity' ||
      compact === 'electricitypayment'
    ) return '/payments/electricity';
    if (compact.includes('notification')) return '/notifications';

    return `/${normalized.replace(/\s+/g, '-')}`;
  };

  // Service navigation
  const navigateToService = (serviceName) => {
    window.location.href = resolveServiceRoute(serviceName);
  };

  // Service cards data
	  const serviceCards = [
	    { 
	      id: 'electricity', 
	      icon: 'fas fa-bolt', 
	      title: t('electricity'), 
	      color: '#3b82f6',
	      description: 'View Details'
	    },
	    { 
	      id: 'gas', 
	      icon: 'fas fa-fire', 
	      title: t('gas'), 
	      color: '#f59e0b',
	      description: 'View Details'
	    },
	    { 
	      id: 'payments', 
	      icon: 'fas fa-rupee-sign', 
	      title: t('payments'), 
	      color: '#10b981',
	      description: 'View Details'
	    },
	    { 
	      id: 'complaints', 
	      icon: 'fas fa-exclamation-circle', 
	      title: t('complaints'), 
	      color: '#ef4444',
	      description: 'View Details'
	    }
	  ];

  // Quick actions data
  const quickActions = [
    { 
      id: 'electricity-bill', 
      icon: 'fas fa-bolt', 
      label: t('payElectricityBill'), 
      action: () => window.location.href = '/payments/electricity'
    },
    { 
      id: 'gas-bill', 
      icon: 'fas fa-fire', 
      label: t('payGasBill'), 
      action: () => navigateToService('gas-bill')
    },
    { 
      id: 'complaint', 
      icon: 'fas fa-exclamation-circle', 
      label: t('fileComplaint'), 
      action: () => navigateToService('complaint')
    },
    { 
      id: 'tracking', 
      icon: 'fas fa-search', 
      label: t('trackApplication'), 
      action: () => navigateToService('tracking')
    }
  ];

  // Menu items with colors
  const menuItems = [
    { id: 'overview', icon: 'fas fa-tachometer-alt', label: t('overview'), color: '#111111' },
    { id: 'profile', icon: 'fas fa-user', label: t('profile'), color: '#111111' },
    { id: 'services', icon: 'fas fa-bolt', label: t('services'), color: '#111111' },
    { id: 'bills', icon: 'fas fa-file-invoice', label: t('bills'), color: '#111111' },
    { id: 'complaints', icon: 'fas fa-exclamation-circle', label: t('complaints'), color: '#111111' },
    { id: 'settings', icon: 'fas fa-cog', label: t('settings'), color: '#111111' }
  ];

  // Render content based on active section
  const renderContent = () => {
    switch(activeSection) {
      case 'overview':
        return (
          <div className="overview-section">
            <div className="welcome-header">
	              <div className="welcome-content">
	                <h1>{t('welcome')}, {user.name || 'T Bhanu Koushik'}!</h1>
	                <p>{t('role')}: <span className="role-badge">{user.role || 'user'}</span></p>
	              </div>
	              <div className="user-avatar">
	                {profilePhoto ? (
	                  <img className="profile-portrait" src={profilePhoto} alt="Profile" />
	                ) : (
                    <img className="profile-portrait" src={defaultAvatarUrl} alt="Default avatar" />
	                )}
	              </div>
	            </div>

            <div className="stats-container">
              <div className="stats-grid">
                {serviceCards.map(service => (
                  <div 
                    key={service.id}
                    className="stat-card clickable-card"
                    onClick={() => navigateToService(service.id)}
                  >
                    <div className="stat-icon" style={{background: service.color}}>
                      <i className={service.icon}></i>
                    </div>
                    <div className="stat-content">
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-buttons">
                {quickActions.map(action => (
                  <button 
                    key={action.id}
                    className="action-btn" 
                    onClick={action.action}
                  >
                    <i className={action.icon}></i>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="profile-section">
            <div className="profile-card">
              <h2><i className="fas fa-user"></i> {t('profile')}</h2>
              <div className="profile-content">
                <div className="profile-field">
                  <label>{t('userId')}</label>
                  <p>{user.user_id || 'N/A'}</p>
                </div>
                <div className="profile-field">
                  <label>Full Name</label>
                  <p>{user.name || 'N/A'}</p>
                </div>
                <div className="profile-field">
                  <label>{t('email')}</label>
                  <p>{user.email || 'N/A'}</p>
                </div>
                <div className="profile-field">
                  <label>{t('mobile')}</label>
                  <p>{user.mobile || 'N/A'}</p>
                </div>
                <div className="profile-field">
                  <label>{t('role')}</label>
                  <p><span className="role-badge profile-role-badge">{user.role || 'user'}</span></p>
                </div>
                <div className="profile-field">
                  <label>{t('memberSince')}</label>
                  <p>{formatDateYMD(user.created_at)}</p>
                </div>
	                <div className="profile-field">
	                  <label>Profile Photo</label>
	                  <input type="file" accept="image/*" onChange={(e) => handleProfilePhotoUpload(e)} />
	                  {profilePhoto && <img src={profilePhoto} alt="Profile preview" className="profile-preview" />}
	                </div>
	              </div>
	            </div>
          </div>
        );

      default:
        return (
          <div className="coming-soon-section">
            <div className="coming-soon">
              <i className="fas fa-tools"></i>
              <h2>{t('comingSoon')}</h2>
              <p>This section is under development</p>
            </div>
          </div>
        );
    }
  };

  // Handle profile photo upload
	  const handleProfilePhotoUpload = (e) => {
	    const file = e.target.files[0];
	    if (file) {
	      const reader = new FileReader();
	      reader.onload = (event) => {
	        const dataUrl = event.target.result;
	        setProfilePhoto(dataUrl);
	        localStorage.setItem(profilePhotoStorageKey, dataUrl);
	      };
	      reader.readAsDataURL(file);
	    }
	  };

  const openNotificationsPage = () => {
    markNotificationsAsRead(notifications.filter(item => !item.isRead).map(item => item.id));
    window.location.href = '/notifications';
  };

  const unreadRecentNotifications = notifications
    .filter(item => !item.isRead)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

	  return (
	    <div className="dashboard-container">
      <button
        className="panel-toggle-floating"
        onClick={() => setIsSidebarCollapsed(prev => !prev)}
        title={isSidebarCollapsed ? 'Open Panel' : 'Close Panel'}
      >
        <i className={`fas ${isSidebarCollapsed ? 'fa-angles-right' : 'fa-angles-left'}`}></i>
      </button>
	      {/* Sidebar Navigation */}
	      <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
	        <div className="sidebar-header">
	          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1024px-Emblem_of_India.svg.png" width="40" alt="Emblem"/>
	          <h3>Civic Portal</h3>
	        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map(item => (
	            <div 
	              key={item.id}
	              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
	              onClick={() => setActiveSection(item.id)}
	            >
	              <i className={item.icon} style={{color: activeSection === item.id ? '#ffffff' : '#111111'}}></i>
	              <span>{item.label}</span>
	            </div>
	          ))}
        </nav>

        {/* Search and Language in Sidebar */}
        <div className="sidebar-search">
          <input 
            type="text" 
            placeholder={t('searchService')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                navigateToService(searchQuery.toLowerCase());
              }
            }}
            className="sidebar-search-input"
          />
          <button 
            onClick={() => navigateToService(searchQuery.toLowerCase())}
            className="sidebar-search-btn"
          >
            <i className="fas fa-search"></i>
          </button>
        </div>

        <div className="sidebar-language">
          <label>{t('language')}</label>
          <select value={selectedLanguage} onChange={(e) => changeLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="hi">à¤¹à¤¿à¤¨à¥à¤¦à¥€</option>
            <option value="te">à°¤à±†à°²à±à°—à±</option>
            <option value="ta">à®¤à®®à®¿à®´à¯</option>
          </select>
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <i className="fas fa-user-circle"></i>
            <div>
              <p className="user-name">{user.name || 'User'}</p>
              <p className="user-role">{user.role || 'user'}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={() => window.location.href = '/logout'}>
            <i className="fas fa-sign-out-alt"></i>
            {t('logout')}
          </button>
        </div>
	      </div>

	      {/* Main Content */}
	      <div className={`main-content ${isSidebarCollapsed ? 'expanded' : ''}`}>
	        <header className="content-header">
	          <div className="header-left">
	            <div className="header-controls">
	              <div
	                className="notification-container"
	                onMouseEnter={() => setShowNotifications(true)}
	                onMouseLeave={() => setShowNotifications(false)}
	              >
	                <button
	                  className="notification-btn"
	                  onClick={openNotificationsPage}
	                  title="Open Notifications"
	                >
                  <i className="fas fa-bell"></i>
                  {notificationCount > 0 && (
                    <span className="notification-badge">{notificationCount}</span>
                  )}
                </button>
                {showNotifications && (
                  <div className="notification-dropdown">
                    <h3>{t('notifications')}</h3>
                    {unreadRecentNotifications.length > 0 ? (
                      unreadRecentNotifications.slice(0, 4).map(notification => (
                        <div
                          key={notification.id}
                          className="notification-item"
                          onClick={() => {
                            markNotificationsAsRead([notification.id]);
                            openNotificationsPage();
                          }}
                        >
                          <p>{notification.abstract}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                      ))
                    ) : (
                      <div className="notification-item">
                        <p>No new notifications</p>
                        <span className="notification-time">Waiting for admin updates</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
	            </div>
	            <h1>Unified Civic Portal</h1>
	          </div>
	        </header>

        {renderContent()}
      </div>
    </div>
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DashboardApp />);

