const paymentsRoot = document.getElementById('payments-root');
const paymentsUser = JSON.parse(paymentsRoot.getAttribute('data-user').replace(/&quot;/g, '"'));

function PaymentsPage() {
  const [items, setItems] = React.useState([]);
  const [filter, setFilter] = React.useState('all');
  const [lang, setLang] = React.useState(localStorage.getItem('selectedLanguage') || 'en');

  const labels = {
    en: {
      title: 'All Payments',
      summary: 'Payment Summary',
      total: 'Total Payments',
      success: 'Successful',
      failed: 'Failed',
      history: 'Payments History',
      all: 'All Services',
      electricity: 'Electricity',
      gas: 'Gas',
      service: 'Service',
      date: 'Date',
      provider: 'Provider',
      consumer: 'Consumer No',
      txn: 'Transaction ID',
      amount: 'Amount',
      method: 'Method',
      status: 'Status',
      receipt: 'Receipt',
      download: 'Download',
      none: 'No payments found for selected filter.'
    },
    hi: {
      title: 'सभी भुगतान',
      summary: 'भुगतान सारांश',
      total: 'कुल भुगतान',
      success: 'सफल',
      failed: 'असफल',
      history: 'भुगतान इतिहास',
      all: 'सभी सेवाएं',
      electricity: 'बिजली',
      gas: 'गैस',
      service: 'सेवा',
      date: 'तारीख',
      provider: 'प्रदाता',
      consumer: 'उपभोक्ता नंबर',
      txn: 'ट्रांजैक्शन आईडी',
      amount: 'राशि',
      method: 'विधि',
      status: 'स्थिति',
      receipt: 'रसीद',
      download: 'डाउनलोड',
      none: 'चयनित फ़िल्टर के लिए कोई भुगतान नहीं मिला।'
    },
    te: {
      title: 'అన్ని చెల్లింపులు',
      summary: 'చెల్లింపు సారాంశం',
      total: 'మొత్తం చెల్లింపులు',
      success: 'విజయవంతం',
      failed: 'విఫలమైంది',
      history: 'చెల్లింపు చరిత్ర',
      all: 'అన్ని సేవలు',
      electricity: 'విద్యుత్',
      gas: 'గ్యాస్',
      service: 'సేవ',
      date: 'తేదీ',
      provider: 'ప్రొవైడర్',
      consumer: 'కన్స్యూమర్ నంబర్',
      txn: 'లావాదేవీ ID',
      amount: 'మొత్తం',
      method: 'విధానం',
      status: 'స్థితి',
      receipt: 'రసీదు',
      download: 'డౌన్‌లోడ్',
      none: 'ఎంచుకున్న ఫిల్టర్‌కి చెల్లింపులు లేవు.'
    },
    ta: {
      title: 'அனைத்து பணப்பரிவர்த்தனைகள்',
      summary: 'கட்டண சுருக்கம்',
      total: 'மொத்த கட்டணங்கள்',
      success: 'வெற்றி',
      failed: 'தோல்வி',
      history: 'கட்டண வரலாறு',
      all: 'அனைத்து சேவைகள்',
      electricity: 'மின்சாரம்',
      gas: 'எரிவாயு',
      service: 'சேவை',
      date: 'தேதி',
      provider: 'வழங்குநர்',
      consumer: 'நுகர்வோர் எண்',
      txn: 'பரிவர்த்தனை ஐடி',
      amount: 'தொகை',
      method: 'முறை',
      status: 'நிலை',
      receipt: 'ரசீது',
      download: 'பதிவிறக்கு',
      none: 'தேர்ந்தெடுத்த வடிகட்டிக்கு கட்டணங்கள் இல்லை.'
    }
  };

  const t = labels[lang] || labels.en;

  const loadHistory = async () => {
    const resp = await fetch('/api/payments/history');
    if (!resp.ok) return;
    const data = await resp.json();
    setItems(data.items || []);
  };

  React.useEffect(() => {
    loadHistory();
  }, []);

  const filtered = items.filter(x => filter === 'all' || (x.utility_type || '') === filter);

  const statusClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'success') return 'status-badge status-success';
    if (s === 'failed') return 'status-badge status-failed';
    return 'status-badge status-pending';
  };

  const serviceClass = (service) => {
    return (service || '').toLowerCase() === 'gas'
      ? 'service-badge service-gas'
      : 'service-badge service-electricity';
  };

  return (
    <div className="payments-page">
      <header className="payments-header">
        <div className="payments-header-left">
          <button className="payments-back-btn" onClick={() => window.location.href = '/dashboard'}>
            <i className="fas fa-arrow-left"></i> Dashboard
          </button>
          <h1>{t.title}</h1>
        </div>
        <div className="payments-lang-chip">
          <select
            className="payments-select"
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
        <div className="payments-chip">
          <i className="fas fa-user"></i> {paymentsUser.name || 'Citizen'}
        </div>
      </header>

      <main className="payments-content">
        <section className="payments-card">
          <h2>{t.summary}</h2>
          <div className="payments-grid">
            <div className="payments-stat">
              <small>{t.total}</small>
              <strong>{items.length}</strong>
            </div>
            <div className="payments-stat">
              <small>{t.success}</small>
              <strong>{items.filter(x => (x.payment_status || '').toLowerCase() === 'success').length}</strong>
            </div>
            <div className="payments-stat">
              <small>{t.failed}</small>
              <strong>{items.filter(x => (x.payment_status || '').toLowerCase() === 'failed').length}</strong>
            </div>
          </div>
        </section>

        <section className="payments-card">
          <div className="payments-toolbar">
            <h2 style={{ margin: 0 }}>{t.history}</h2>
            <select className="payments-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">{t.all}</option>
              <option value="electricity">{t.electricity}</option>
              <option value="gas">{t.gas}</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="payments-empty">{t.none}</p>
          ) : (
            <div className="payments-table-wrap">
              <table className="payments-table">
                <thead>
                  <tr>
                    <th>{t.date}</th>
                    <th>{t.service}</th>
                    <th>{t.provider}</th>
                    <th>{t.consumer}</th>
                    <th>{t.txn}</th>
                    <th>{t.amount}</th>
                    <th>{t.method}</th>
                    <th>{t.status}</th>
                    <th>{t.receipt}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(item => (
                    <tr key={item.payment_id}>
                      <td>{item.paid_at || item.created_at}</td>
                      <td><span className={serviceClass(item.utility_type)}>{item.utility_type}</span></td>
                      <td>{item.provider_name}</td>
                      <td>{item.consumer_number}</td>
                      <td>{item.razorpay_payment_id || '-'}</td>
                      <td>INR {Number(item.amount || 0).toFixed(2)}</td>
                      <td>{item.payment_method || '-'}</td>
                      <td><span className={statusClass(item.payment_status)}>{item.payment_status}</span></td>
                      <td>
                        {(item.payment_status || '').toLowerCase() === 'success' ? (
                          <button
                            className="payments-btn"
                            onClick={() => window.location.href = `/api/payments/receipt/${item.payment_id}`}
                          >
                            {t.download}
                          </button>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('payments-root')).render(<PaymentsPage />);
