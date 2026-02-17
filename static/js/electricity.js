const electricityRoot = document.getElementById('electricity-root');
const electricityUser = JSON.parse(electricityRoot.getAttribute('data-user').replace(/&quot;/g, '"'));

function ElectricityPage() {
  const [lang, setLang] = React.useState(localStorage.getItem('selectedLanguage') || 'en');
  const [states, setStates] = React.useState([]);
  const [providers, setProviders] = React.useState([]);
  const [connections, setConnections] = React.useState([]);
  const [requests, setRequests] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState({ type: '', text: '' });

  const [formData, setFormData] = React.useState({
    state_code: '',
    provider_code: '',
    address: ''
  });

  const labels = {
    en: {
      title: 'Electricity Services',
      welcome: 'Apply for a new electricity connection and track admin approval status here.',
      consumerNote: 'Consumer number is visible below after admin approval and connection activation.',
      dashboard: 'Dashboard',
      language: 'Language',
      active: 'Active Connections',
      totalReq: 'Total Requests',
      pending: 'Pending Approval',
      apply: 'Apply for New Electricity Connection',
      submit: 'Submit Request',
      submitting: 'Submitting...',
      connections: 'My Electricity Connections',
      status: 'Connection Request Status'
    },
    hi: {
      title: 'बिजली सेवाएं',
      welcome: 'नया बिजली कनेक्शन आवेदन करें और एडमिन अनुमोदन स्थिति देखें।',
      consumerNote: 'एडमिन अनुमोदन और कनेक्शन सक्रिय होने के बाद उपभोक्ता नंबर नीचे दिखाई देगा।',
      dashboard: 'डैशबोर्ड',
      language: 'भाषा',
      active: 'सक्रिय कनेक्शन',
      totalReq: 'कुल अनुरोध',
      pending: 'लंबित स्वीकृति',
      apply: 'नया बिजली कनेक्शन आवेदन',
      submit: 'अनुरोध भेजें',
      submitting: 'भेजा जा रहा है...',
      connections: 'मेरे बिजली कनेक्शन',
      status: 'अनुरोध स्थिति'
    },
    te: {
      title: 'విద్యుత్ సేవలు',
      welcome: 'కొత్త విద్యుత్ కనెక్షన్‌కు అప్లై చేసి, అడ్మిన్ ఆమోద స్థితిని చూడండి.',
      consumerNote: 'అడ్మిన్ ఆమోదం తర్వాత మరియు కనెక్షన్ యాక్టివ్ అయిన వెంటనే కన్స్యూమర్ నంబర్ క్రింద కనిపిస్తుంది.',
      dashboard: 'డాష్‌బోర్డ్',
      language: 'భాష',
      active: 'యాక్టివ్ కనెక్షన్లు',
      totalReq: 'మొత్తం అభ్యర్థనలు',
      pending: 'పెండింగ్ ఆమోదాలు',
      apply: 'కొత్త విద్యుత్ కనెక్షన్ అప్లికేషన్',
      submit: 'అభ్యర్థన పంపించండి',
      submitting: 'పంపిస్తోంది...',
      connections: 'నా విద్యుత్ కనెక్షన్లు',
      status: 'అభ్యర్థన స్థితి'
    },
    ta: {
      title: 'மின்சார சேவைகள்',
      welcome: 'புதிய மின்சார இணைப்பிற்கு விண்ணப்பித்து, நிர்வாகி ஒப்புதல் நிலையை பார்க்கவும்.',
      consumerNote: 'நிர்வாகி ஒப்புதல் கிடைத்த பின் நுகர்வோர் எண் கீழே காணப்படும்.',
      dashboard: 'டாஷ்போர்ட்',
      language: 'மொழி',
      active: 'செயலில் உள்ள இணைப்புகள்',
      totalReq: 'மொத்த கோரிக்கைகள்',
      pending: 'நிலுவையில்',
      apply: 'புதிய மின்சார இணைப்பு விண்ணப்பம்',
      submit: 'சமர்ப்பிக்கவும்',
      submitting: 'சமர்ப்பிக்கப்படுகிறது...',
      connections: 'என் மின்சார இணைப்புகள்',
      status: 'கோரிக்கை நிலை'
    }
  };
  const t = labels[lang] || labels.en;

  const statusClass = (status) => {
    if (status === 'approved') return 'status-approved';
    if (status === 'rejected') return 'status-rejected';
    return 'status-pending';
  };

  const loadStates = async () => {
    const response = await fetch('/api/electricity/states');
    if (!response.ok) throw new Error('Unable to fetch states');
    const data = await response.json();
    setStates(data.items || []);
  };

  const loadProviders = async (stateCode = '') => {
    const query = stateCode ? `?state_code=${encodeURIComponent(stateCode)}` : '';
    const response = await fetch(`/api/electricity/providers${query}`);
    if (!response.ok) throw new Error('Unable to fetch providers');
    const data = await response.json();
    setProviders(data.items || []);
  };

  const loadConnections = async () => {
    const response = await fetch('/api/electricity/connections');
    if (!response.ok) throw new Error('Unable to fetch connections');
    const data = await response.json();
    setConnections(data.items || []);
  };

  const loadRequests = async () => {
    const response = await fetch('/api/electricity/connection-requests');
    if (!response.ok) throw new Error('Unable to fetch request status');
    const data = await response.json();
    setRequests(data.items || []);
  };

  const loadPageData = async () => {
    try {
      await Promise.all([loadStates(), loadProviders(), loadConnections(), loadRequests()]);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load electricity data. Please refresh.' });
    }
  };

  React.useEffect(() => {
    loadPageData();
  }, []);

  const handleStateChange = async (e) => {
    const stateCode = e.target.value;
    setFormData(prev => ({ ...prev, state_code: stateCode, provider_code: '' }));
    try {
      await loadProviders(stateCode);
    } catch (err) {
      setProviders([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.provider_code || !formData.address.trim()) {
      setMessage({ type: 'error', text: 'Provider and address are required.' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/electricity/connection-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_code: formData.provider_code,
          address: formData.address
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage({ type: 'error', text: data.message || 'Submission failed.' });
        return;
      }

      setMessage({ type: 'success', text: 'New electricity connection request submitted.' });
      setFormData(prev => ({ ...prev, provider_code: '', address: '' }));
      await loadRequests();
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error while submitting request.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="electricity-page">
      <header className="electricity-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => window.location.href = '/dashboard'}>
            <i className="fas fa-arrow-left"></i>
            <span>{t.dashboard}</span>
          </button>
          <h1>{t.title}</h1>
        </div>

        <div className="lang-chip">
          <label className="lang-chip-label">{t.language}</label>
          <select
            className="lang-chip-select"
            value={lang}
            onChange={(e) => {
              setLang(e.target.value);
              localStorage.setItem('selectedLanguage', e.target.value);
            }}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="te">Telugu</option>
            <option value="ta">Tamil</option>
          </select>
        </div>

        <div className="user-pill">
          <i className="fas fa-user"></i>
          <span>{electricityUser.name || 'Citizen'}</span>
        </div>
      </header>

      <main className="electricity-content">
        <section className="welcome-card">
          <h2>Welcome, {electricityUser.name || 'Citizen'}</h2>
          <p>{t.welcome}</p>
          <p style={{ marginTop: '8px', fontWeight: 600 }}>{t.consumerNote}</p>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <h3>{t.active}</h3>
            <p>{connections.length}</p>
          </article>
          <article className="stat-card">
            <h3>{t.totalReq}</h3>
            <p>{requests.length}</p>
          </article>
          <article className="stat-card">
            <h3>{t.pending}</h3>
            <p>{requests.filter(r => r.status === 'pending').length}</p>
          </article>
        </section>

        <section className="panel">
          <h3>{t.apply}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>State</label>
                <select className="form-select" value={formData.state_code} onChange={handleStateChange}>
                  <option value="">Select state</option>
                  {states.map(item => (
                    <option key={item.state_code} value={item.state_code}>
                      {item.state_name} ({item.state_code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Provider</label>
                <select
                  className="form-select"
                  value={formData.provider_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, provider_code: e.target.value }))}
                >
                  <option value="">Select provider</option>
                  {providers.map(item => (
                    <option key={item.provider_code} value={item.provider_code}>
                      {item.provider_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Service Address</label>
              <textarea
                className="form-textarea"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter complete address for new electricity connection"
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? t.submitting : t.submit}
              </button>
            </div>
          </form>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
        </section>

        <section className="panel">
          <h3>{t.connections}</h3>
          {connections.length === 0 ? (
            <p className="empty-state">No active electricity connections found yet.</p>
          ) : (
            <div className="list">
              {connections.map(item => (
                <article key={item.connection_id} className="card-item">
                  <h4>{item.provider_name}</h4>
                  <p><strong>Consumer No:</strong> {item.consumer_number}</p>
                  <p><strong>State:</strong> {item.state_code}</p>
                  <p><strong>Status:</strong> {item.status}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <h3>{t.status}</h3>
          {requests.length === 0 ? (
            <p className="empty-state">No connection requests submitted yet.</p>
          ) : (
            <div className="list">
              {requests.map(item => (
                <article key={item.request_id} className="card-item">
                  <h4>{item.provider_name}</h4>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span className={`status-badge ${statusClass(item.status)}`}>{item.status}</span>
                  </p>
                  <p><strong>Address:</strong> {item.address}</p>
                  <p><strong>Admin Remark:</strong> {item.admin_remark || 'No remarks yet'}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('electricity-root')).render(<ElectricityPage />);
