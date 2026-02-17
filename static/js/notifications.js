const notificationsElement = document.getElementById('notifications-root');
const notificationsUser = JSON.parse(notificationsElement.getAttribute('data-user').replace(/&quot;/g, '"'));

function NotificationsPage() {
  const [notifications, setNotifications] = React.useState([]);

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

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) throw new Error('Unable to load notifications');
      const data = await response.json();
      const items = data.items || [];
      setNotifications(items);

      const unreadIds = items.filter(item => !item.is_read).map(item => item.id).filter(Boolean);
      if (unreadIds.length) {
        await fetch('/api/notifications/read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: unreadIds })
        });
        setNotifications(items.map(item => ({ ...item, is_read: true })));
      }
    } catch (error) {
      setNotifications([]);
    }
  };

  React.useEffect(() => {
    loadNotifications();
    const intervalId = setInterval(loadNotifications, 20000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="notifications-page">
      <header className="notifications-header">
        <button className="back-btn" onClick={() => window.location.href = '/dashboard'}>
          <i className="fas fa-arrow-left"></i>
          <span>Back to Dashboard</span>
        </button>
        <h1>Notifications</h1>
        <div className="user-pill">
          <i className="fas fa-user"></i>
          <span>{notificationsUser.name || 'Citizen'}</span>
        </div>
      </header>

      <main className="notifications-content">
        {notifications.length === 0 ? (
          <div className="empty-notifications">
            <i className="fas fa-bell-slash"></i>
            <h2>No notifications yet</h2>
            <p>Admin updates will appear here when messages are sent.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map(item => (
              <article key={item.id} className={`notification-card ${item.is_read ? 'read' : 'unread'}`}>
                <div className="notification-icon">
                  <i className="fas fa-bell"></i>
                </div>
                <div className="notification-body">
                  <h3>{item.title || 'Admin Update'}</h3>
                  <p>{item.message}</p>
                </div>
                <time>{formatRelativeTime(item.created_at)}</time>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('notifications-root')).render(<NotificationsPage />);
