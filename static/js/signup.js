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
      userRegistration: "User Registration",
      completeRegistration: "Complete your registration to access services",
      mobileNumber: "Mobile Number",
      fullName: "Full Name",
      emailAddress: "Email Address",
      address: "Address",
      agreeTerms: "I agree to the Terms & Conditions",
      register: "Register",
      back: "Back",
      nameRequired: "Name is required",
      nameMinLength: "Name must be at least 3 characters",
      emailRequired: "Email is required",
      emailInvalid: "Please enter a valid email address",
      addressRequired: "Address is required",
      addressMinLength: "Address must be at least 10 characters",
      termsRequired: "You must agree to the Terms & Conditions",
      registrationSuccess: "Registration successful! Redirecting to dashboard...",
      registrationError: "Registration failed. Please try again",
      mobileExists: "Mobile number already registered",
      emailExists: "Email address already registered",
      serverError: "Server error. Please try again later",
      termsAndConditions: "Terms & Conditions",
      privacyPolicy: "Privacy Policy",
      footer1: "Help | Website Policies | Copyright Policy | Terms & Conditions | Reach Us | Sitemap",
      footer2: "Website owned & maintained by: Centre for Development of Advanced Computing (C-DAC)"
    }},
    hi: { translation: {
      about: "परिचय",
      services: "सेवाएं",
      support: "सहायता",
      login: "लॉगिन",
      language: "भाषा",
      userRegistration: "उपयोगकर्ता पंजीकरण",
      completeRegistration: "सेवाओं तक पहुंचने के लिए अपना पंजीकरण पूर्ण करें",
      mobileNumber: "मोबाइल नंबर",
      fullName: "पूरा नाम",
      emailAddress: "ईमेल पता",
      address: "पता",
      agreeTerms: "मैं नियम और शर्तों से सहमत हूं",
      register: "रजिस्टर करें",
      back: "वापस",
      nameRequired: "नाम आवश्यक",
      nameMinLength: "नाम कम से कम 3 अक्षरों का होना चाहिए",
      emailRequired: "ईमेल आवश्यक",
      emailInvalid: "कृपया एक वैध ईमेल पता दर्ज करें",
      addressRequired: "पता आवश्यक",
      addressMinLength: "पता कम से कम 10 अक्षरों का होना चाहिए",
      termsRequired: "आपको नियम और शर्तों से सहमत होना होगा",
      registrationSuccess: "पंजीकरण सफल! डैशबोर्ड पर रीडायरेक्ट किया जा रहा है...",
      registrationError: "पंजीकरण विफल। कृपया फिर से प्रयास करें",
      mobileExists: "मोबाइल नंबर पहले से ही पंजीकृत है",
      emailExists: "ईमेल पता पहले से ही पंजीकृत है",
      serverError: "सर्वर त्रुटि। कृपया बाद में प्रयास करें",
      termsAndConditions: "नियम और शर्तें",
      privacyPolicy: "गोपनीयता नीति",
      footer1: "सहायता | वेबसाइट नीतियाँ | कॉपीराइट | नियम | संपर्क | साइटमैप",
      footer2: "सी-डैक द्वारा प्रबंधित"
    }},
    te: { translation: {
      about: "గురించి",
      services: "సేవలు",
      support: "మద్దతు",
      login: "లాగిన్",
      language: "భాష",
      userRegistration: "వినియోగదారు నమోదు",
      completeRegistration: "సేవలను యాక్సెస్ చేయడానికి మీ నమోదును పూర్తి చేయండి",
      mobileNumber: "మొబైల్ నంబర్",
      fullName: "పూర్తి పేరు",
      emailAddress: "ఇమెయిల్ చిరునామా",
      address: "చిరునామా",
      agreeTerms: "నిబంధనలు & షరతులకు నేను అంగీకరిస్తున్నాను",
      register: "నమోదు చేయండి",
      back: "వెనుకకు",
      nameRequired: "పేరు అవసరం",
      nameMinLength: "పేరు కనీసం 3 అక్షరాలు ఉండాలి",
      emailRequired: "ఇమెయిల్ అవసరం",
      emailInvalid: "దయచేసి చెల్లుబాటు అయ్యే ఇమెయిల్ చిరునామాను నమోదు చేయండి",
      addressRequired: "చిరునామా అవసరం",
      addressMinLength: "చిరునామా కనీసం 10 అక్షరాలు ఉండాలి",
      termsRequired: "మీరు నిబంధనలు & షరతులకు అంగీకరించాలి",
      registrationSuccess: "నమోదు విజయవంతం! డ్యాష్‌బోర్డ్‌కు రీడైరెక్ట్ చేస్తోంది...",
      registrationError: "నమోదు విఫలమైంది. దయచేసి మళ్ళీ ప్రయత్నించండి",
      mobileExists: "మొబైల్ నంబర్ ఇప్పటికే నమోదు చేయబడింది",
      emailExists: "ఇమెయిల్ చిరునామా ఇప్పటికే నమోదు చేయబడింది",
      serverError: "సర్వర్ లోపం. దయచేసి తర్వాత ప్రయత్నించండి",
      termsAndConditions: "నిబంధనలు & షరతులు",
      privacyPolicy: "గోప్యతా విధానం",
      footer1: "సహాయం | విధానాలు | కాపీరైట్ | నిబంధనలు | సంప్రదించండి | సైట్‌మ్యాప్",
      footer2: "సి-డాక్ ద్వారా నిర్వహించబడుతుంది"
    }},
    ta: { translation: {
      about: "பற்றி",
      services: "சேவைகள்",
      support: "ஆதரவு",
      login: "உள்நுழைவு",
      language: "மொழி",
      userRegistration: "பயனர் பதிவு",
      completeRegistration: "சேவைகளை அணுக உங்கள் பதிவை முடிக்கவும்",
      mobileNumber: "மொபைல் எண்",
      fullName: "முழு பெயர்",
      emailAddress: "மின்னஞ்சல் முகவரி",
      address: "முகவரி",
      agreeTerms: "நான் விதிமுறைகள் மற்றும் நிபந்தனைகளுக்கு இணங்குகிறேன்",
      register: "பதிவு செய்யவும்",
      back: "பின்",
      nameRequired: "பெயர் தேவை",
      nameMinLength: "பெயர் குறைந்தது 3 எழுத்துக்களாக இருக்க வேண்டும்",
      emailRequired: "மின்னஞ்சல் தேவை",
      emailInvalid: "தயவுசெய்து சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்",
      addressRequired: "முகவரி தேவை",
      addressMinLength: "முகவரி குறைந்தது 10 எழுத்துக்களாக இருக்க வேண்டும்",
      termsRequired: "நீங்கள் விதிமுறைகள் மற்றும் நிபந்தனைகளுக்கு இணங்க வேண்டும்",
      registrationSuccess: "பதிவு வெற்றிகரமாக! டாஷ்போர்டுக்கு திசைதிருப்பப்படுகிறது...",
      registrationError: "பதிவு தோல்வியடைந்தது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்",
      mobileExists: "மொபைல் எண் ஏற்கனவே பதிவு செய்யப்பட்டது",
      emailExists: "மின்னஞ்சல் முகவரி ஏற்கனவே பதிவு செய்யப்பட்டது",
      serverError: "சர்வர் பிழை. தயவுசெய்து பின்னர் முயற்சிக்கவும்",
      termsAndConditions: "விதிமுறைகள் & நிபந்தனைகள்",
      privacyPolicy: "தனியுரிமைக் கொள்கை",
      footer1: "உதவி | கொள்கைகள் | பதிப்புரிமை | விதிமுறைகள் | தொடர்பு | தள வரைபடம்",
      footer2: "சி-டாக் மூலம் பராமரிக்கப்படுகிறது"
    }}
  },
  lng: "en",
  fallbackLng: "en"
});

function SignupApp() {
  const { t } = useTranslation();
  
  // Get mobile and role from URL parameters and data attribute
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mobile = urlParams.get('mobile');
    const role = urlParams.get('role');
    
    // Also check data attribute as fallback
    const rootElement = document.getElementById('root');
    const dataRole = rootElement.getAttribute('data-role') || 'user';
    
    if (mobile) {
      setFormData(prev => ({ ...prev, mobile }));
    }
    if (role) {
      setFormData(prev => ({ ...prev, role }));
    } else {
      setFormData(prev => ({ ...prev, role: dataRole }));
    }
  }, []);
  
  const [formData, setFormData] = React.useState({
    mobile: '',
    name: '',
    email: '',
    address: '',
    agreeTerms: false,
    role: 'user'
  });
  const [errors, setErrors] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState('');
  const [showTermsModal, setShowTermsModal] = React.useState(false);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t('nameRequired');
    } else if (formData.name.trim().length < 3) {
      newErrors.name = t('nameMinLength');
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('emailInvalid');
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = t('addressRequired');
    } else if (formData.address.trim().length < 10) {
      newErrors.address = t('addressMinLength');
    }

    // Terms validation
    if (!formData.agreeTerms) {
      newErrors.terms = t('termsRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccess('');
    setErrors({});

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(t('registrationSuccess'));
        
        // Show success animation
        setTimeout(() => {
          window.location.href = data.redirect || '/dashboard';
        }, 2000);
      } else {
        setErrors({ submit: data.message || t('registrationError') });
      }
    } catch (err) {
      setErrors({ submit: t('serverError') });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back button
  const handleBack = () => {
    window.location.href = '/login';
  };

  return (
    <div className="signup-container">
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

      {/* SIGNUP MAIN SECTION */}
      <main className="signup-main">
        <div className="signup-card">
          {/* CDAC Logo */}
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRZx6770pMaVJqRX70ZyFUro3loHhmOc3jkw&s" 
            alt="CDAC Logo" 
            className="cdac-logo"
          />

          {/* Signup Title */}
          <h1 className="signup-title">{t('userRegistration')}</h1>
          <p className="signup-subtitle">{t('completeRegistration')}</p>

          {/* Progress Bar */}
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '85%' }}></div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            {/* Mobile Number (Readonly) */}
            <div className="form-group">
              <label className="form-label">
                {t('mobileNumber')}
              </label>
              <input
                type="tel"
                className="form-input"
                name="mobile"
                value={formData.mobile}
                readOnly
                placeholder="Mobile number from OTP verification"
              />
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">
                {t('fullName')} <span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.name ? 'error' : ''}`}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                maxLength={100}
              />
              {errors.name && <div className="error-message show">{errors.name}</div>}
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label className="form-label">
                {t('emailAddress')} <span className="required">*</span>
              </label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                maxLength={100}
              />
              {errors.email && <div className="error-message show">{errors.email}</div>}
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label">
                {t('address')} <span className="required">*</span>
              </label>
              <textarea
                className={`form-textarea ${errors.address ? 'error' : ''}`}
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your complete address"
                maxLength={500}
              />
              {errors.address && <div className="error-message show">{errors.address}</div>}
            </div>

            {/* Terms & Conditions */}
            <div className="checkbox-group">
              <input
                type="checkbox"
                className="checkbox-input"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
              />
              <label className="checkbox-label" htmlFor="agreeTerms">
                {t('agreeTerms')}{' '}
                <button 
                  type="button" 
                  onClick={() => setShowTermsModal(true)}
                  style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}
                >
                  ({t('termsAndConditions')})
                </button>
              </label>
            </div>
            {errors.terms && <div className="error-message show">{errors.terms}</div>}

            {/* Success/Error Messages */}
            {success && <div className="success-message show">{success}</div>}
            {errors.submit && <div className="error-message show">{errors.submit}</div>}

            {/* Submit Button */}
            <button 
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading && <span className="spinner"></span>}
              {t('register')}
            </button>

            {/* Back Button */}
            <button 
              type="button"
              className="btn btn-secondary"
              onClick={handleBack}
              disabled={isLoading}
            >
              {t('back')}
            </button>
          </form>
        </div>
      </main>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="modal-overlay show" onClick={() => setShowTermsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{t('termsAndConditions')}</h2>
              <button className="modal-close" onClick={() => setShowTermsModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <h3>1. Acceptance of Terms</h3>
              <p>By registering with the Unified Civic Portal, you agree to these terms and conditions.</p>
              
              <h3>2. User Responsibilities</h3>
              <ul>
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Use the portal for legitimate purposes only</li>
                <li>Not share your login credentials with others</li>
              </ul>
              
              <h3>3. Privacy Policy</h3>
              <p>We are committed to protecting your personal information. Please review our Privacy Policy for details.</p>
              
              <h3>4. Service Availability</h3>
              <p>We strive to maintain the portal's availability but cannot guarantee uninterrupted service.</p>
              
              <h3>5. Prohibited Activities</h3>
              <ul>
                <li>Unauthorized access to systems or data</li>
                <li>Use of portal for illegal activities</li>
                <li>Attempt to harm or disrupt the service</li>
              </ul>
              
              <h3>6. Contact Information</h3>
              <p>For questions about these terms, please contact our support team.</p>
            </div>
          </div>
        </div>
      )}

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

ReactDOM.createRoot(document.getElementById('root')).render(<SignupApp />);
