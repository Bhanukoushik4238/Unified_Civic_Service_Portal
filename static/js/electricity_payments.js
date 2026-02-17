const epRoot = document.getElementById('electricity-payments-root');
const epUser = JSON.parse(epRoot.getAttribute('data-user').replace(/&quot;/g, '"'));

function ElectricityPaymentsPage() {
  const [lang, setLang] = React.useState(localStorage.getItem('selectedLanguage') || 'en');
  const [dueBills, setDueBills] = React.useState([]);
  const [history, setHistory] = React.useState([]);
  const [message, setMessage] = React.useState({ type: '', text: '' });
  const [payingBillId, setPayingBillId] = React.useState('');
  const [methods, setMethods] = React.useState({});

  const labels = {
    en: {
      dashboard: 'Dashboard',
      title: 'Electricity Payments',
      summary: 'Payment Summary',
      due: 'Due Electricity Bills',
      attempts: 'Total Payment Attempts',
      failed: 'Failed Attempts',
      pay: 'Pay Electricity Bills',
      history: 'Payment History',
      payNow: 'Pay Now',
      processing: 'Processing...',
      download: 'Download',
      retry: 'Retry'
    },
    hi: {
      dashboard: 'डैशबोर्ड',
      title: 'बिजली भुगतान',
      summary: 'भुगतान सारांश',
      due: 'बकाया बिजली बिल',
      attempts: 'कुल भुगतान प्रयास',
      failed: 'असफल प्रयास',
      pay: 'बिजली बिल भुगतान',
      history: 'भुगतान इतिहास',
      payNow: 'अभी भुगतान करें',
      processing: 'प्रोसेसिंग...',
      download: 'डाउनलोड',
      retry: 'पुनः प्रयास'
    },
    te: {
      dashboard: 'డాష్‌బోర్డ్',
      title: 'విద్యుత్ చెల్లింపులు',
      summary: 'చెల్లింపు సారాంశం',
      due: 'బకాయి విద్యుత్ బిల్లులు',
      attempts: 'మొత్తం చెల్లింపు ప్రయత్నాలు',
      failed: 'విఫలమైన ప్రయత్నాలు',
      pay: 'విద్యుత్ బిల్లుల చెల్లింపు',
      history: 'చెల్లింపు చరిత్ర',
      payNow: 'ఇప్పుడే చెల్లించండి',
      processing: 'ప్రాసెస్ అవుతోంది...',
      download: 'డౌన్‌లోడ్',
      retry: 'మళ్లీ ప్రయత్నించండి'
    },
    ta: {
      dashboard: 'டாஷ்போர்ட்',
      title: 'மின்சார கட்டணங்கள்',
      summary: 'கட்டண சுருக்கம்',
      due: 'நிலுவை மின்சார பில்கள்',
      attempts: 'மொத்த முயற்சிகள்',
      failed: 'தோல்வியுற்றவை',
      pay: 'மின்சார பில் கட்டணம்',
      history: 'கட்டண வரலாறு',
      payNow: 'இப்போது செலுத்து',
      processing: 'செயலாக்கம்...',
      download: 'பதிவிறக்கு',
      retry: 'மீண்டும் முயற்சி'
    }
  };
  const t = labels[lang] || labels.en;

  const loadData = async () => {
    try {
      const [dueResp, histResp] = await Promise.all([
        fetch('/api/payments/electricity/due'),
        fetch('/api/payments/electricity/history')
      ]);
      if (!dueResp.ok || !histResp.ok) throw new Error('Failed to load payment data');
      const dueData = await dueResp.json();
      const histData = await histResp.json();
      const dueItems = dueData.items || [];
      setDueBills(dueItems);
      setHistory(histData.items || []);

      const nextMethods = {};
      dueItems.forEach(item => { nextMethods[item.bill_id] = nextMethods[item.bill_id] || 'upi'; });
      setMethods(prev => ({ ...nextMethods, ...prev }));
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load payments data. Please refresh.' });
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const fmt = (value) => {
    const n = Number(value || 0);
    return `INR ${n.toFixed(2)}`;
  };

  const statusClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'success') return 'ep-status ep-success';
    if (s === 'failed') return 'ep-status ep-failed';
    return 'ep-status ep-pending';
  };

  const payBill = async (billId) => {
    setMessage({ type: '', text: '' });
    setPayingBillId(billId);
    try {
      const paymentMethod = methods[billId] || 'upi';
      const response = await fetch('/api/payments/electricity/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bill_id: billId, payment_method: paymentMethod })
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage({
          type: 'error',
          text: (data.failure_reason || data.message || 'Payment failed. Please try again.')
        });
        await loadData();
        return;
      }

      setMessage({
        type: 'success',
        text: 'Payment successful. Receipt is available in payment history.'
      });
      await loadData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Payment request failed due to network/server issue.' });
    } finally {
      setPayingBillId('');
    }
  };

  const downloadReceipt = (paymentId) => {
    window.location.href = `/api/payments/electricity/receipt/${paymentId}`;
  };

  return (
    <div className="ep-page">
      <header className="ep-header">
        <div className="ep-header-left">
          <button className="ep-back-btn" onClick={() => window.location.href = '/dashboard'}>
            <i className="fas fa-arrow-left"></i> {t.dashboard}
          </button>
          <h1>{t.title}</h1>
        </div>
        <div className="ep-lang-chip">
          <select
            className="ep-lang-select"
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
        <div className="ep-user">
          <i className="fas fa-user"></i> {epUser.name || 'Citizen'}
        </div>
      </header>

      <main className="ep-content">
        <section className="ep-card">
          <h2>{t.summary}</h2>
          <div className="ep-grid">
            <div className="ep-stat">
              <small>{t.due}</small>
              <strong>{dueBills.length}</strong>
            </div>
            <div className="ep-stat">
              <small>{t.attempts}</small>
              <strong>{history.length}</strong>
            </div>
            <div className="ep-stat">
              <small>{t.failed}</small>
              <strong>{history.filter(x => (x.payment_status || '').toLowerCase() === 'failed').length}</strong>
            </div>
          </div>
        </section>

        {message.text && (
          <section className={`ep-message ${message.type}`}>
            {message.text}
          </section>
        )}

        <section className="ep-card">
          <h2>{t.pay}</h2>
          {dueBills.length === 0 ? (
            <p className="ep-empty">No pending electricity bills. You are all caught up.</p>
          ) : (
            <div className="ep-table-wrap">
              <table className="ep-table">
                <thead>
                  <tr>
                    <th>Billing Month</th>
                    <th>Provider</th>
                    <th>Consumer Number</th>
                    <th>Due Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dueBills.map(item => (
                    <tr key={item.bill_id}>
                      <td>{item.billing_month}</td>
                      <td>{item.provider_name}</td>
                      <td>{item.consumer_number}</td>
                      <td>{item.due_date}</td>
                      <td>{fmt(item.total_amount)}</td>
                      <td>
                        <select
                          className="ep-method-select"
                          value={methods[item.bill_id] || 'upi'}
                          onChange={(e) => setMethods(prev => ({ ...prev, [item.bill_id]: e.target.value }))}
                        >
                          <option value="upi">UPI</option>
                          <option value="card">Card</option>
                          <option value="netbanking">Netbanking</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="ep-btn ep-btn-primary"
                          disabled={payingBillId === item.bill_id}
                          onClick={() => payBill(item.bill_id)}
                        >
                          {payingBillId === item.bill_id ? t.processing : t.payNow}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="ep-card">
          <h2>{t.history}</h2>
          {history.length === 0 ? (
            <p className="ep-empty">No electricity payment history yet.</p>
          ) : (
            <div className="ep-table-wrap">
              <table className="ep-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Billing Month</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Failure Reason</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(item => (
                    <tr key={item.payment_id}>
                      <td>{item.paid_at || item.created_at}</td>
                      <td>{item.billing_month}</td>
                      <td>{fmt(item.amount)}</td>
                      <td>{item.payment_method || '-'}</td>
                      <td>
                        <span className={statusClass(item.payment_status)}>{item.payment_status}</span>
                      </td>
                      <td>{item.failure_reason || '-'}</td>
                      <td>
                        {(item.payment_status || '').toLowerCase() === 'success' ? (
                          <button
                            className="ep-btn ep-btn-secondary"
                            onClick={() => downloadReceipt(item.payment_id)}
                          >
                            {t.download}
                          </button>
                        ) : (
                          <button
                            className="ep-btn ep-btn-secondary"
                            onClick={() => payBill(item.bill_id)}
                          >
                            {t.retry}
                          </button>
                        )}
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

ReactDOM.createRoot(document.getElementById('electricity-payments-root')).render(<ElectricityPaymentsPage />);
