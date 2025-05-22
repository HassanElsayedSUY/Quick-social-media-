document.addEventListener('DOMContentLoaded', () => {
    // --- تحديث السنة ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- التحكم في تبديل الوضع (داكن/فاتح) ---
    const themeToggleButton = document.getElementById('theme-toggle');
    const body = document.body;
    let themeIcon = null;
    if (themeToggleButton) {
        themeIcon = themeToggleButton.querySelector('i');
    }

    const currentTheme = localStorage.getItem('theme') || 'dark-mode';
    body.classList.add(currentTheme);
    if (themeIcon) {
        if (currentTheme === 'light-mode') {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            body.classList.toggle('dark-mode');

            if (body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light-mode');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
            } else {
                localStorage.setItem('theme', 'dark-mode');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
            }
            updateAriaLabels(); 
        });
    }

    // --- التحكم في تبديل اللغة (عربي/إنجليزي) ---
    const languageToggleButton = document.getElementById('language-toggle');
    const htmlElement = document.documentElement;
    const translatableElements = document.querySelectorAll('[data-lang-ar], [data-lang-en]');
    const titleElement = document.querySelector('title');
    const profileImageElement = document.querySelector('.profile-image');

    // --- متغيرات النص المتحرك ---
    const taglineTextElement = document.getElementById('typed-tagline');
    
    let typeTimeoutId; 

    const taglinesArrayAr = [
        "أصنع تجارب ويب مبتكرة وحديثة.",
        "أحول الأفكار إلى واقع رقمي ملموس.",
        "أتقن فنون الواجهات الأمامية والخلفية.",
        "أسعى دوماً لتعلم كل ما هو جديد في عالم الويب.",
        "مُلتزم بتقديم حلول برمجية فعالة وذات جودة عالية."
    ];
    const taglinesArrayEn = [
        "I craft innovative and modern web experiences.",
        "I turn ideas into tangible digital reality.",
        "I master the arts of front-end and back-end.",
        "I always strive to learn everything new in the web world.",
        "Committed to delivering effective, high-quality software solutions."
    ];

    let currentTaglineIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const delayAfterTyping = 2500;
    const delayBeforeTypingNext = 500;

    function typeOrDeleteTagline() {
        if (!taglineTextElement) return; 

        const currentLang = htmlElement.lang || 'ar';
        const activeTaglines = currentLang === 'ar' ? taglinesArrayAr : taglinesArrayEn;
        
        if (currentTaglineIndex >= activeTaglines.length) {
            currentTaglineIndex = 0; 
        }
        const currentFullTagline = activeTaglines[currentTaglineIndex] || ""; 

        if (isDeleting) {
            if (currentCharIndex > 0) {
                taglineTextElement.textContent = currentFullTagline.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                typeTimeoutId = setTimeout(typeOrDeleteTagline, deletingSpeed);
            } else {
                isDeleting = false;
                currentTaglineIndex = (currentTaglineIndex + 1) % activeTaglines.length;
                typeTimeoutId = setTimeout(typeOrDeleteTagline, delayBeforeTypingNext);
            }
        } else {
            if (currentCharIndex < currentFullTagline.length) {
                taglineTextElement.textContent = currentFullTagline.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                typeTimeoutId = setTimeout(typeOrDeleteTagline, typingSpeed);
            } else {
                isDeleting = true;
                typeTimeoutId = setTimeout(typeOrDeleteTagline, delayAfterTyping);
            }
        }
    }
    
    function updateAriaLabels() {
        const currentLang = htmlElement.lang || 'ar';
        const isLightMode = body.classList.contains('light-mode');

        if (themeToggleButton) {
            themeToggleButton.setAttribute('aria-label',
                isLightMode ?
                (currentLang === 'ar' ? 'تغيير إلى الوضع الداكن' : 'Switch to Dark Mode') :
                (currentLang === 'ar' ? 'تغيير إلى الوضع الفاتح' : 'Switch to Light Mode')
            );
        }
        if (languageToggleButton) {
            languageToggleButton.setAttribute('aria-label',
                currentLang === 'ar' ? 'تغيير إلى الإنجليزية' : 'Switch to Arabic'
            );
        }
    }

    function setLanguage(lang) {
        htmlElement.lang = lang;
        htmlElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        body.classList.toggle('ltr', lang === 'en');
        
        translatableElements.forEach(el => {
            if (el.id === 'typed-tagline' || el.classList.contains('typing-cursor')) return;
            if (el.id === 'currentYear') return;

            const text = el.getAttribute(lang === 'ar' ? 'data-lang-ar' : 'data-lang-en');
            if (text !== null) {
                el.textContent = text;
            }
        });

        if (titleElement) {
            const titleText = titleElement.getAttribute(lang === 'ar' ? 'data-title-ar' : 'data-title-en');
            if (titleText) document.title = titleText;
        }

        if (profileImageElement) {
            const altText = profileImageElement.getAttribute(lang === 'ar' ? 'data-alt-ar' : 'data-alt-en');
            if (altText) profileImageElement.alt = altText;
        }

        if (languageToggleButton) {
            languageToggleButton.textContent = lang === 'ar' ? 'EN' : 'AR';
            languageToggleButton.setAttribute('data-current-lang', lang);
        }
        localStorage.setItem('language', lang);
        updateAriaLabels();

        if (taglineTextElement) {
            clearTimeout(typeTimeoutId); 
            taglineTextElement.textContent = ''; 
            currentCharIndex = 0;
            isDeleting = false; 
            currentTaglineIndex = 0; 
            typeTimeoutId = setTimeout(typeOrDeleteTagline, 200); 
        }
    }

    const preferredLanguage = localStorage.getItem('language') || 'ar';
    setLanguage(preferredLanguage); 

    if (languageToggleButton) {
        languageToggleButton.addEventListener('click', () => {
            const newLang = htmlElement.lang === 'ar' ? 'en' : 'ar';
            setLanguage(newLang);
        });
    }
    
    updateAriaLabels(); 
});
