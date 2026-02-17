const { useTranslation, initReactI18next } = window.ReactI18next;

/* TRANSLATIONS */
i18next.use(initReactI18next).init({
  resources: {
    en: { translation: {
      about: "About",
      services: "Services",
      support: "Support",
      login: "Login",
      language: "Language",
      userLogin: "User Login",
      enterMobile: "Enter Mobile Number",
      sendOtp: "Send OTP",
      enterOtp: "Enter OTP",
      verifyOtp: "Verify & Login",
      resendOtp: "Resend OTP",
      otpExpiresIn: "OTP expires in",
      mobileRequired: "Mobile number is required",
      mobileInvalid: "Please enter a valid 10-digit mobile number",
      otpRequired: "Please enter the complete OTP",
      otpSent: "OTP sent successfully",
      otpVerified: "OTP verified successfully",
      otpExpired: "OTP has expired. Please request a new one",
      otpInvalid: "Invalid OTP. Please try again",
      serverError: "Server error. Please try again later",
      footer1: "Help | Website Policies | Copyright Policy | Terms & Conditions | Reach Us | Sitemap",
      footer2: "Website owned & maintained by: Centre for Development of Advanced Computing (C-DAC)"
    }},
    hi: { translation: {
      about: "परिचय",
      services: "सेवाएं",
      support: "सहायता",
      login: "लॉगिन",
      language: "भाषा",
      userLogin: "उपयोगकर्ता लॉगिन",
      enterMobile: "मोबाइल नंबर दर्ज करें",
      sendOtp: "OTP भेजें",
      enterOtp: "OTP दर्ज करें",
      verifyOtp: "सत्यापन और लॉगिन",
      resendOtp: "OTP फिर से भेजें",
      otpExpiresIn: "OTP की समय सीमा समाप्त",
      mobileRequired: "मोबाइल नंबर आवश्यक",
      mobileInvalid: "कृपया एक वैध 10 अंकों का मोबाइल नंबर दर्ज करें",
      otpRequired: "कृपया पूरा OTP दर्ज करें",
      otpSent: "OTP सफलतापूर्वक भेजा गया",
      otpVerified: "OTP सफलतापूर्वक सत्यापित",
      otpExpired: "OTP की समय सीमा समाप्त हो गई है। कृपया नया अनुरोध करें",
      otpInvalid: "अमान्य OTP। कृपया फिर से प्रयास करें",
      serverError: "सर्वर त्रुटि। कृपया बाद में प्रयास करें",
      footer1: "सहायता | वेबसाइट नीतियाँ | कॉपीराइट | नियम | संपर्क | साइटमैप",
      footer2: "सी-डैक द्वारा प्रबंधित"
    }},
    te: { translation: {
      about: "గురించి",
      services: "సేవలు",
      support: "మద్దతు",
      login: "లాగిన్",
      language: "భాష",
      userLogin: "వినియోగదారు లాగిన్",
      enterMobile: "మొబైల్ నంబర్ నమోదు చేయండి",
      sendOtp: "OTP పంపండి",
      enterOtp: "OTP నమోదు చేయండి",
      verifyOtp: "ధృవీకరించి లాగిన్ అవ్వండి",
      resendOtp: "OTP తిరిగి పంపండి",
      otpExpiresIn: "OTP గడువు ముగిసింది",
      mobileRequired: "మొబైల్ నంబర్ అవసరం",
      mobileInvalid: "దయచేసి చెల్లుబాటు అయ్యే 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి",
      otpRequired: "దయచేసి పూర్తి OTP నమోదు చేయండి",
      otpSent: "OTP విజయవంతంగా పంపబడింది",
      otpVerified: "OTP విజయవంతంగా ధృవీకరించబడింది",
      otpExpired: "OTP గడువు ముగిసింది. దయచేసి కొత్తది అభ్యర్థించండి",
      otpInvalid: "చెల్లని OTP. దయచేసి మళ్ళీ ప్రయత్నించండి",
      serverError: "సర్వర్ లోపం. దయచేసి తర్వాత ప్రయత్నించండి",
      footer1: "సహాయం | విధానాలు | కాపీరైట్ | నిబంధనలు | సంప్రదించండి | సైట్‌మ్యాప్",
      footer2: "సి-డాక్ ద్వారా నిర్వహించబడుతుంది"
    }},
    ta: { translation: {
      about: "பற்றி",
      services: "சேவைகள்",
      support: "ஆதரவு",
      login: "உள்நுழைவு",
      language: "மொழி",
      userLogin: "பயனர் உள்நுழைவு",
      enterMobile: "மொபைல் எண்ணை உள்ளிடவும்",
      sendOtp: "OTP அனுப்பு",
      enterOtp: "OTP உள்ளிடவும்",
      verifyOtp: "சரிபார்த்து உள்நுழைக",
      resendOtp: "OTP மீண்டும் அனுப்பு",
      otpExpiresIn: "OTP காலாவதி",
      mobileRequired: "மொபைல் எண் தேவை",
      mobileInvalid: "தயவுசெய்து சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்",
      otpRequired: "தயவுசெய்து முழு OTP ஐ உள்ளிடவும்",
      otpSent: "OTP வெற்றிகரமாக அனுப்பப்பட்டது",
      otpVerified: "OTP வெற்றிகரமாக சரிபார்க்கப்பட்டது",
      otpExpired: "OTP காலாவதியாகிவிட்டது. தயவுசெய்து புதியதை கோருங்கள்",
      otpInvalid: "தவறான OTP. தயவுசெய்து மீண்டும் முயற்சிக்கவும்",
      serverError: "சர்வர் பிழை. தயவுசெய்து பின்னர் முயற்சிக்கவும்",
      footer1: "உதவி | கொள்கைகள் | பதிப்புரிமை | விதிமுறைகள் | தொடர்பு | தள வரைபடம்",
      footer2: "சி-டாக் மூலம் பராமரிக்கப்படுகிறது"
    }}
  },
  lng: "en",
  fallbackLng: "en"
});

function LoginApp() {
  const { t } = useTranslation();
  
  // Get role from data attribute
  React.useEffect(() => {
    const rootElement = document.getElementById('root');
    const role = rootElement.getAttribute('data-role') || 'user';
    setRole(role);
  }, []);
  
  const [mobile, setMobile] = React.useState('');
  const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
  const [role, setRole] = React.useState('user');
  const [showOtpSection, setShowOtpSection] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(180); // 3 minutes in seconds
  const [isTimerActive, setIsTimerActive] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  
  const otpInputRefs = React.useRef([]);

  // Timer effect
  React.useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Mobile validation
  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  // Handle mobile input change
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow numbers
    if (value.length <= 10) {
      setMobile(value);
      setError('');
    }
  };

  // Send OTP
  const sendOtp = async () => {
    setError('');
    setSuccess('');

    if (!mobile) {
      setError(t('mobileRequired'));
      return;
    }

    if (!validateMobile(mobile)) {
      setError(t('mobileInvalid'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(t('otpSent'));
        setShowOtpSection(true);
        setTimeLeft(180);
        setIsTimerActive(true);
        setOtp(['', '', '', '', '', '']);
        // Focus first OTP input
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
      } else {
        setError(data.message || t('serverError'));
      }
    } catch (err) {
      setError(t('serverError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP key down
  const handleOtpKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const digits = pastedData.replace(/\D/g, '');
    
    if (digits.length === 6) {
      const newOtp = digits.split('');
      setOtp(newOtp);
      otpInputRefs.current[5]?.focus();
    }
  };

  // Verify OTP and login
  const verifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError(t('otpRequired'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, otp: otpString, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(t('otpVerified'));
        // Redirect based on user existence
        setTimeout(() => {
          window.location.href = data.redirect;
        }, 1000);
      } else {
        setError(data.message || t('otpInvalid'));
      }
    } catch (err) {
      setError(t('serverError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    if (timeLeft > 0) return;
    
    await sendOtp();
  };

  return (
    <div className="login-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo" onClick={() => window.location.href = '/home'}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" width="35" alt="Emblem"/>
          <span>Unified Civic Portal</span>
        </div>

        <div className="nav-links">
          <div className="nav-item" onClick={() => window.location.href = '/home'}>
            <i className="fa-solid fa-home"></i>
            Home
          </div>

          <div className="nav-item dropdown-parent">
            <i className="fa-solid fa-globe blue"></i>
            {t('language')}
            <div className="dropdown">
              <div className="dropdown-item" onClick={() => i18next.changeLanguage("en")}>English</div>
              <div className="dropdown-item" onClick={() => i18next.changeLanguage("hi")}>हिंदी</div>
              <div className="dropdown-item" onClick={() => i18next.changeLanguage("te")}>తెలుగు</div>
              <div className="dropdown-item" onClick={() => i18next.changeLanguage("ta")}>தமிழ்</div>
            </div>
          </div>
        </div>
      </nav>

      {/* LOGIN MAIN SECTION */}
      <main className="login-main">
        <div className="login-card">
          {/* CDAC Logo */}
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRZx6770pMaVJqRX70ZyFUro3loHhmOc3jkw&s" 
            alt="CDAC Logo" 
            className="cdac-logo"
          />

          {/* Login Title */}
          <h1 className="login-title">{t('userLogin')}</h1>
          <p className="login-subtitle">Secure authentication with OTP</p>

          {/* Error and Success Messages */}
          {error && <div className="error-message show">{error}</div>}
          {success && <div style={{color: '#10b981', fontSize: '14px', marginBottom: '20px'}}>{success}</div>}

          {/* Mobile Input Section */}
          <div className="form-group">
            <label className="form-label">{t('enterMobile')}</label>
            <input
              type="tel"
              className={`form-input ${error && !showOtpSection ? 'error' : ''}`}
              value={mobile}
              onChange={handleMobileChange}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
              disabled={showOtpSection}
            />
          </div>

          {!showOtpSection ? (
            /* Send OTP Button */
            <button 
              className="btn btn-primary"
              onClick={sendOtp}
              disabled={isLoading}
            >
              {isLoading && <span className="spinner"></span>}
              {t('sendOtp')}
            </button>
          ) : (
            /* OTP Section */
            <div className={`otp-section ${showOtpSection ? 'show' : ''}`}>
              <div className="form-group">
                <label className="form-label">{t('enterOtp')}</label>
                <div className="otp-container" onPaste={handleOtpPaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => otpInputRefs.current[index] = el}
                      type="text"
                      className={`otp-input ${digit ? 'filled' : ''}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      maxLength={1}
                      inputMode="numeric"
                      pattern="[0-9]"
                    />
                  ))}
                </div>
              </div>

              {/* Timer Section */}
              <div className="timer-section">
                <p className={`timer-text ${timeLeft === 0 ? 'expired' : ''}`}>
                  {timeLeft > 0 
                    ? `${t('otpExpiresIn')}: ${formatTime(timeLeft)}`
                    : t('otpExpired')
                  }
                </p>
                <button 
                  className="resend-btn"
                  onClick={resendOtp}
                  disabled={timeLeft > 0 || isLoading}
                >
                  {t('resendOtp')}
                </button>
              </div>

              {/* Verify OTP Button */}
              <button 
                className="btn btn-primary"
                onClick={verifyOtp}
                disabled={isLoading}
              >
                {isLoading && <span className="spinner"></span>}
                {t('verifyOtp')}
              </button>

              {/* Back Button */}
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowOtpSection(false);
                  setIsTimerActive(false);
                  setTimeLeft(180);
                  setOtp(['', '', '', '', '', '']);
                  setError('');
                  setSuccess('');
                }}
              >
                Back
              </button>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="top-footer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          ↑ TOP
        </div>

        <p>{t('footer1')}</p>
        <p>{t('footer2')}</p>
        <p>© 2026 C-DAC. All rights reserved.</p>

        <div className="govt-line">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" className="small-emblem" alt="Emblem"/>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRZx6770pMaVJqRX70ZyFUro3loHhmOc3jkw&s" className="cdac-logo-small" alt="CDAC"/>
        </div>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<LoginApp />);
