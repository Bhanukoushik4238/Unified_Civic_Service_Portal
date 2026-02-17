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
      hero1: "Unified Civic Service",
      hero2: "Kiosk Platform",
      desc: "A centralized digital platform designed to provide seamless access to essential public services such as electricity, gas services, complaint registration, and service tracking. Built to empower citizens with transparency and efficiency.",
      footer1: "Help | Website Policies | Copyright Policy | Terms & Conditions | Reach Us | Sitemap",
      footer2: "Website owned & maintained by: Centre for Development of Advanced Computing (C-DAC)"
    }},
    hi: { translation: {
      about: "परिचय",
      services: "सेवाएं",
      support: "सहायता",
      login: "लॉगिन",
      language: "भाषा",
      hero1: "एकीकृत नागरिक सेवा",
      hero2: "कियोस्क प्लेटफॉर्म",
      desc: "एक केंद्रीकृत डिजिटल मंच जो नागरिकों को आवश्यक सार्वजनिक सेवाओं तक सरल पहुँच प्रदान करता है।",
      footer1: "सहायता | वेबसाइट नीतियाँ | कॉपीराइट | नियम | संपर्क | साइटमैप",
      footer2: "सी-डैक द्वारा प्रबंधित"
    }},
    te: { translation: {
      about: "గురించి",
      services: "సేవలు",
      support: "మద్దతు",
      login: "లాగిన్",
      language: "భాష",
      hero1: "ఏకీకృత పౌర సేవా",
      hero2: "కియోస్క్ ప్లాట్‌ఫారం",
      desc: "ప్రజలకు అవసరమైన సేవలను సులభంగా అందించే డిజిటల్ వేదిక.",
      footer1: "సహాయం | విధానాలు | కాపీరైట్ | నిబంధనలు | సంప్రదించండి | సైట్‌మ్యాప్",
      footer2: "సి-డాక్ ద్వారా నిర్వహించబడుతుంది"
    }},
    ta: { translation: {
      about: "பற்றி",
      services: "சேவைகள்",
      support: "ஆதரவு",
      login: "உள்நுழைவு",
      language: "மொழி",
      hero1: "ஒற்றுமையான குடிமக்கள் சேவை",
      hero2: "கியோஸ்க் தளம்",
      desc: "பொது சேவைகளுக்கான மையப்படுத்தப்பட்ட டிஜிட்டல் தளம்.",
      footer1: "உதவி | கொள்கைகள் | பதிப்புரிமை | விதிமுறைகள் | தொடர்பு | தள வரைபடம்",
      footer2: "சி-டாக் மூலம் பராமரிக்கப்படுகிறது"
    }}
  },
  lng: "en",
  fallbackLng: "en"
});

function App() {
  const { t } = useTranslation();

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">

        <div className="logo" onClick={()=>window.location.href="/"}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" width="35"/>
          <span>Unified Civic Portal</span>
        </div>

        <div className="nav-links">

          <div className="nav-item">
            <i className="fa-regular fa-circle-user"></i>
            {t("about")}
          </div>

          <div className="nav-item dropdown-parent">
            <i className="fa-solid fa-code blue"></i>
            {t("services")}
            <div className="dropdown">
              <div className="dropdown-item yellow">
                <i className="fa-solid fa-bolt"></i> Electricity
              </div>
              <div className="dropdown-item orange">
                <i className="fa-solid fa-fire"></i> Gas
              </div>
              <div className="dropdown-item red">
                <i className="fa-solid fa-circle-exclamation"></i> Complaint
              </div>
              <div className="dropdown-item purple">
                <i className="fa-solid fa-magnifying-glass"></i> Tracking
              </div>
            </div>
          </div>

          <div className="nav-item">
            <i className="fa-solid fa-headset green"></i>
            {t("support")}
          </div>

          <div className="nav-item dropdown-parent">
            <i className="fa-solid fa-arrow-right-to-bracket blue"></i>
            {t("login")}
            <div className="dropdown">
              <div className="dropdown-item" onClick={()=>window.location.href="/login?role=user"}>
                <i className="fa-solid fa-user"></i> User
              </div>
              <div className="dropdown-item" onClick={()=>window.location.href="/login?role=admin"}>
                <i className="fa-solid fa-user-shield"></i> Admin
              </div>
            </div>
          </div>

          <div className="nav-item dropdown-parent">
            <i className="fa-solid fa-globe blue"></i>
            {t("language")}
            <div className="dropdown">
              <div className="dropdown-item" onClick={()=>i18next.changeLanguage("en")}>English</div>
              <div className="dropdown-item" onClick={()=>i18next.changeLanguage("hi")}>Hindi</div>
              <div className="dropdown-item" onClick={()=>i18next.changeLanguage("te")}>Telugu</div>
              <div className="dropdown-item" onClick={()=>i18next.changeLanguage("ta")}>Tamil</div>
            </div>
          </div>

        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <h1>
            <span className="blue">{t("hero1")}</span><br/>
            <span className="green">{t("hero2")}</span>
          </h1>
          <p className="description">{t("desc")}</p>
        </div>

        <div className="flag-container">
          <div className="flag-box">
            <img src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" className="flag"/>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" className="emblem"/>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="top-footer" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>
          ↑ TOP
        </div>

        <p>{t("footer1")}</p>
        <p>{t("footer2")}</p>
        <p>© 2026 C-DAC. All rights reserved.</p>

        <div className="govt-line">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" className="small-emblem"/>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRZx6770pMaVJqRX70ZyFUro3loHhmOc3jkw&s" className="cdac-logo-small"/>
        </div>
      </footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
