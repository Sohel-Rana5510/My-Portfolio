import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

// --- Animations Hook ---
const useOnScreen = <T extends HTMLElement = HTMLDivElement>(options: IntersectionObserverInit) => {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [options]);

  return [ref, isVisible] as const;
};

// --- Reusable CTA Component ---
const CTAButton = ({ text, href = "#", style, onClick }: { text: string, href?: string, style?: React.CSSProperties, onClick?: () => void }) => {
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick();
      return;
    }

    // Smooth scroll for anchor links
    if (href && href.startsWith('#') && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <a 
      href={href}
      className="cta-button"
      onClick={handleClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '14px 28px',
        border: '1px solid rgba(0,0,0,0.2)',
        borderRadius: '100px',
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        cursor: 'pointer',
        background: 'rgba(0,0,0,0.03)',
        color: '#111',
        backdropFilter: 'blur(5px)',
        transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        textDecoration: 'none',
        ...style
      }}
    >
      {text}
      <span style={{ marginLeft: '12px', fontSize: '1.2em', lineHeight: 0.5 }}>→</span>
    </a>
  );
};

// --- Icons ---
const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);
const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);

const ContactIconButton = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={label}
      style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: `1px solid ${hovered ? '#dafe00' : 'rgba(0,0,0,0.1)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: hovered ? '#111' : '#111',
        transition: 'all 0.3s ease',
        background: hovered ? '#dafe00' : 'rgba(0,0,0,0.05)',
        backdropFilter: 'blur(5px)',
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
        cursor: 'pointer'
      }}
    >
      {icon}
    </a>
  );
};

// --- Interactive Vector Component ---
const InteractiveShape = ({ 
  type, 
  style,
  factor = 0.1
}: { 
  type: 'architectural' | 'circle' | 'helix' | 'asterisk'; 
  style?: React.CSSProperties;
  factor?: number;
}) => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const speed = 0.03;
      const x = (window.innerWidth - e.clientX * speed) / 100;
      const y = (window.innerHeight - e.clientY * speed) / 100;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };
    
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getSvgContent = () => {
    switch (type) {
      case 'architectural':
        return (
          <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', animation: 'spin 120s linear infinite' }}>
            <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" strokeDasharray="4 4" />
            <ellipse cx="100" cy="100" rx="90" ry="30" fill="none" stroke="currentColor" strokeWidth="0.5" transform="rotate(45 100 100)" />
            <ellipse cx="100" cy="100" rx="90" ry="30" fill="none" stroke="currentColor" strokeWidth="0.5" transform="rotate(-45 100 100)" />
            <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeWidth="0.5" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" strokeWidth="0.5" />
            <rect x="70" y="70" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="0.5" transform="rotate(45 100 100)" />
          </svg>
        );
      case 'circle':
        return (
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" style={{ animation: 'spin-reverse 40s linear infinite', transformOrigin: 'center' }} />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        );
      case 'helix':
        return (
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <path d="M10,50 Q25,25 50,50 T90,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M10,50 Q25,75 50,50 T90,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        );
      case 'asterisk':
        return (
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', animation: 'spin 30s linear infinite' }}>
            <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="1" />
            <line x1="15" y1="15" x2="85" y2="85" stroke="currentColor" strokeWidth="1" />
            <line x1="85" y1="15" x2="15" y2="85" stroke="currentColor" strokeWidth="1" />
          </svg>
        );
    }
  };

  const totalY = mouseOffset.y + (scrollY * factor);

  return (
    <div 
      ref={ref}
      style={{ 
        position: 'absolute', 
        pointerEvents: 'none',
        opacity: 0.15,
        transform: `translate3d(${mouseOffset.x}px, ${totalY}px, 0)`,
        transition: 'transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1)',
        ...style 
      }}
    >
      {getSvgContent()}
    </div>
  );
};

// --- Tilt Text Component (Interactive) ---
const TiltText = ({ text, style, className }: { text: string, style?: React.CSSProperties, className?: string }) => {
  const [transform, setTransform] = useState('');
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -25; 
    const rotateY = ((x - centerX) / centerX) * 25;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div 
      className={className}
      style={{ 
        ...style, 
        transform, 
        transition: 'transform 0.2s cubic-bezier(0.03, 0.98, 0.52, 0.99)', 
        display: 'inline-block', 
        cursor: 'default',
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </div>
  );
};

// --- Components ---

const Reveal = ({ children, delay = 0, width = '100%' }: { children?: React.ReactNode, delay?: number, width?: string }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  const [overflow, setOverflow] = useState<'hidden' | 'visible'>('hidden');

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setOverflow('visible');
      }, 1000 + (delay * 1000));
      return () => clearTimeout(timer);
    }
  }, [isVisible, delay]);
  
  return (
    <div ref={ref} style={{ width, overflow }}>
      <div
        style={{
          transform: isVisible ? 'translateY(0)' : 'translateY(75px)',
          opacity: isVisible ? 1 : 0,
          transition: `transform 1s cubic-bezier(0.2, 0.65, 0.3, 0.9) ${delay}s, opacity 1s ease ${delay}s`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const NavBar = () => {
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 100,
      padding: '24px 0',
      color: '#111',
      pointerEvents: 'none'
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.7)', 
        backdropFilter: 'blur(20px)', 
        WebkitBackdropFilter: 'blur(20px)',
        padding: '16px 32px',
        borderRadius: '100px',
        border: '1px solid rgba(0,0,0,0.05)', 
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)', 
        pointerEvents: 'auto'
      }}>
        <div style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em' }}>
          SRS©
        </div>
        <div className="nav-links">
          <a href="#work" onClick={scrollTo('#work')} className="nav-link">Work</a>
          <a href="#profile" onClick={scrollTo('#profile')} className="nav-link">Profile</a>
          <a href="#contact" onClick={scrollTo('#contact')} className="nav-link">Contact</a>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <header style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center',
      paddingTop: '100px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <InteractiveShape 
        type="architectural" 
        style={{ top: '5%', right: '-15%', width: '900px', height: '900px', opacity: 0.08 }} 
        factor={0.15}
      />
      
      <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.85 }}>
            <TiltText 
              text="Sohel Rana" 
              className="hero-name" 
              style={{ 
                fontSize: 'clamp(50px, 14vw, 180px)', 
                fontWeight: 600,
                letterSpacing: '-0.04em',
                marginBottom: 0,
                textTransform: 'uppercase'
              }} 
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <TiltText 
                text="Showrov" 
                className="hero-name" 
                style={{ 
                  fontSize: 'clamp(50px, 14vw, 180px)', 
                  fontWeight: 600,
                  letterSpacing: '-0.04em',
                  marginBottom: '40px',
                  textTransform: 'uppercase',
                  textAlign: 'right',
                  color: 'transparent',
                  WebkitTextStroke: '2px rgba(0,0,0,0.8)',
                }} 
              />
            </div>
          </div>
        </Reveal>
        
        <Reveal delay={0.2}>
          <div className="hero-footer-grid">
             <div className="hero-footer-left">
               <h2 style={{ fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 400, lineHeight: 1.2, marginBottom: '30px' }}>
                 Software QA<br />
                 <span style={{ fontFamily: 'serif', fontStyle: 'italic' }}>Engineer</span>
               </h2>
               <CTAButton text="Let's Talk" href="#contact" />
             </div>
             
             <div className="hero-footer-mid">
               <div style={{ opacity: 0.5, marginBottom: '8px' }}>Based In</div>
               <div>Dhaka, Bangladesh</div>
             </div>

             <div className="hero-footer-right">
                <div style={{ opacity: 0.5, marginBottom: '8px' }}>Scroll</div>
                <div style={{ animation: 'bounce 2s infinite' }}>↓</div>
             </div>
          </div>
        </Reveal>
      </div>
    </header>
  );
};

const CaseStudy: React.FC<{ number: string, title: string, category: string, img: string, delay?: number }> = ({ number, title, category, img, delay = 0 }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      style={{ marginBottom: '150px', cursor: 'pointer', position: 'relative', zIndex: 1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Reveal delay={delay}>
        <div style={{ 
          marginBottom: '20px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'baseline',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          paddingBottom: '15px'
        }}>
          <div>
            <span style={{ fontSize: '14px', marginRight: '20px', opacity: 0.6 }}>{number}</span>
            <span style={{ fontSize: '14px' }}>{category}</span>
          </div>
        </div>

        <h2 style={{ 
          fontSize: 'clamp(32px, 4vw, 60px)', 
          fontWeight: 400, 
          marginBottom: '40px',
          letterSpacing: '-0.01em',
          maxWidth: '80%'
        }}>
          {title}
        </h2>
      </Reveal>

      <Reveal delay={delay + 0.1}>
        <div style={{ 
          width: '100%', 
          height: '60vh', 
          backgroundColor: '#e5e5e5', 
          overflow: 'hidden',
          position: 'relative'
        }}>
          <img 
            src={img} 
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)',
              opacity: 0.9
            }}
          />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.3)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.4s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
             <div style={{
               transform: hovered ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
               opacity: hovered ? 1 : 0,
               transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s'
             }}>
                <CTAButton 
                  text="View Project Details" 
                  style={{ 
                    backgroundColor: 'white', 
                    color: 'black', 
                    borderColor: 'white' 
                  }} 
                />
             </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
};

const WorkSection = () => {
  const categories = ['All', 'Web Automation', 'API Testing', 'Load Testing'];
  const [activeTab, setActiveTab] = useState('All');
  const [tabState, setTabState] = useState<'top' | 'fixed' | 'bottom'>('top');
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || isMobile) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const navHeight = 120; 
      const sidebarHeight = 400; 

      if (rect.top > navHeight) {
         setTabState('top');
      } else if (rect.bottom < (100 + sidebarHeight)) {
         setTabState('bottom');
      } else {
         setTabState('fixed');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  const projectData = [
    {
      id: 1,
      category: 'Web Automation',
      title: 'Prime Bank user side automated - Playwright.',
      img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop',
      number: '01'
    },
    {
      id: 2,
      category: 'API Testing',
      title: 'Prime Bank QR Token Automation System – API Workflow.',
      img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2668&auto=format&fit=crop',
      number: '02'
    },
    {
      id: 3,
      category: 'Web Automation',
      title: 'Selenium-JUnit UI Automation Framework – Web Form.',
      img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2670&auto=format&fit=crop',
      number: '03'
    },
    {
      id: 4,
      category: 'Load Testing',
      title: 'Prime Bank QR Management System – Load Testing (k6).',
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop',
      number: '04'
    }
  ];

  const filteredProjects = activeTab === 'All' 
    ? projectData 
    : projectData.filter(p => p.category === activeTab);

  const sidebarStyle: React.CSSProperties = isMobile ? {
     position: 'relative',
     display: 'flex',
     width: '100%',
     marginBottom: '60px',
     paddingTop: '80px'
  } : {
     transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
     zIndex: 50,
     ...(tabState === 'top' ? {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        marginBottom: '60px',
        paddingTop: '80px',
        left: '0',
        top: '0'
      } : tabState === 'fixed' ? {
        position: 'fixed',
        top: '120px',
        left: '40px',
        display: 'flex',
        flexDirection: 'column',
        width: '200px',
        alignItems: 'flex-start'
      } : {
        position: 'absolute',
        bottom: '100px', 
        left: '0',
        display: 'flex',
        flexDirection: 'column',
        width: '200px',
        alignItems: 'flex-start'
     })
  };

  const projectContainerStyle: React.CSSProperties = {
     transition: 'margin 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
     marginLeft: (!isMobile && tabState !== 'top') ? '240px' : '0'
  };

  return (
    <section id="work" ref={sectionRef} className="container" style={{ paddingBottom: '100px', position: 'relative' }}>
      <InteractiveShape type="circle" style={{ top: '20%', left: '-10%', width: '400px', height: '400px' }} factor={0.05} />
      
       {!isMobile && (
          <div style={{ 
            height: tabState === 'top' ? '0px' : '100px',
            marginBottom: tabState === 'top' ? '0' : '60px',
            transition: 'all 0.5s ease'
          }} />
       )}

        <div style={sidebarStyle}>
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            flexDirection: (!isMobile && tabState !== 'top') ? 'column' : 'row',
            overflowX: (!isMobile && tabState !== 'top') ? 'visible' : 'auto',
            width: (!isMobile && tabState !== 'top') ? '100%' : 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingBottom: '10px'
          }}>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveTab(cat)}
                style={{
                  padding: '12px 28px',
                  borderRadius: '100px',
                  border: `1px solid ${activeTab === cat ? '#111' : 'rgba(0,0,0,0.1)'}`,
                  background: activeTab === cat ? '#111' : 'transparent',
                  color: activeTab === cat ? '#F5F5F5' : '#111',
                  cursor: 'pointer',
                  fontSize: '13px',
                  whiteSpace: 'nowrap',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.02em',
                  textAlign: (!isMobile && tabState !== 'top') ? 'left' : 'center',
                  width: (!isMobile && tabState !== 'top') ? '100%' : 'auto'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={projectContainerStyle}>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((p) => (
              <CaseStudy 
                key={p.id}
                number={p.number}
                category={p.category}
                title={p.title}
                img={p.img}
                delay={0}
              />
            ))
          ) : (
            <Reveal>
              <div style={{ padding: '40px 0', opacity: 0.5 }}>No projects found in this category.</div>
            </Reveal>
          )}
        </div>

      <Reveal>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px', marginLeft: (!isMobile && tabState !== 'top') ? '240px' : '0' }}>
          <CTAButton text="View GitHub" href="https://github.com/Sohel-Rana5510" style={{ padding: '20px 50px', fontSize: '14px' }} />
        </div>
      </Reveal>
    </section>
  );
};

const AnimatedListItem: React.FC<{ children: React.ReactNode, index: number }> = ({ children, index }) => {
  const [ref, isVisible] = useOnScreen<HTMLLIElement>({ threshold: 0.2 });
  return (
    <li 
      ref={ref}
      style={{ 
        marginBottom: '25px', 
        borderBottom: '1px solid rgba(0,0,0,0.1)', 
        paddingBottom: '20px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${index * 0.1}s`
      }}
    >
      {children}
    </li>
  );
}

const DataColumn = ({ title, items }: { title: string, items: { label: string, sub?: string }[] }) => (
  <div style={{ flex: 1, minWidth: '250px', marginBottom: '40px' }}>
    <h3 style={{ 
      fontSize: '12px', 
      textTransform: 'uppercase', 
      letterSpacing: '0.1em', 
      marginBottom: '30px',
      opacity: 0.5
    }}>{title}</h3>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {items.map((item, i) => (
        <AnimatedListItem key={i} index={i}>
          <div style={{ fontSize: '18px', fontWeight: 500, marginBottom: '5px' }}>{item.label}</div>
          {item.sub && <div style={{ fontSize: '14px', opacity: 0.6 }}>{item.sub}</div>}
        </AnimatedListItem>
      ))}
    </ul>
  </div>
);

const AboutDataSection = () => {
  return (
    <section id="profile" style={{ 
      color: '#111', 
      padding: '120px 0', 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      <InteractiveShape type="helix" style={{ bottom: '10%', right: '-5%', width: '500px', height: '500px', opacity: 0.1 }} factor={0.1} />
      
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <Reveal>
          <div style={{ maxWidth: '900px', marginBottom: '80px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 300, lineHeight: 1.4, marginBottom: '40px' }}>
              Detail-oriented and proactive SQA Engineer with hands-on experience in web, mobile, and API testing. Committed to delivering high-quality software.
            </h2>
            <CTAButton text="Download Resume" href="#" />
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '40px', 
            justifyContent: 'space-between',
            borderTop: '2px solid #111',
            paddingTop: '60px'
          }}>
            
            <DataColumn 
              title="Experience" 
              items={[
                { label: 'Software Quality Assurance Engineer', sub: 'Deep Mind Labs AI • 06/2025 - Present' },
                { label: 'Jr. Software Quality Assurance Engineer', sub: 'ShareTrip Ltd • 02/2024 - 05/2025' }
              ]} 
            />

            <DataColumn 
              title="Education" 
              items={[
                { label: 'B.Sc. in Computer Science & Engineering', sub: 'Primeasia University • 2018 - 2023' }
              ]} 
            />

            <DataColumn 
              title="Training & Certifications" 
              items={[
                { label: 'Full Stack SQA', sub: 'Comprehensive Software Testing' },
                { label: 'AWS Cloud Solution Architect', sub: 'Cloud Infrastructure' }
              ]} 
            />

          </div>
        </Reveal>
      </div>
    </section>
  );
};

const ToolsSection = () => {
  const testingTools = [
    "Selenium (Java)", "Playwright (JS)", "Appium", "Postman", 
    "JMeter", "k6", "TestNG", "JUnit"
  ];
  
  const devTools = [
    "Java", "JavaScript", "TypeScript", "Node.JS", 
    "HTML/CSS", "MySQL", "Git/GitHub", "Jira"
  ];

  return (
    <section className="container" style={{ paddingBottom: '120px' }}>
       <Reveal>
         <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '80px' }}>
           <div style={{ marginBottom: '60px' }}>
             <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 400 }}>Technical Skills</h2>
           </div>
           
           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '80px' }}>
             
             <div style={{ flex: '1 1 300px' }}>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '30px', opacity: 0.5 }}>Testing & Automation</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {testingTools.map((tool, i) => (
                    <div key={i} style={{ 
                      padding: '12px 24px', 
                      border: '1px solid rgba(0,0,0,0.1)', 
                      borderRadius: '100px', 
                      fontSize: '14px', 
                      fontWeight: 500,
                      transition: 'all 0.3s ease',
                      cursor: 'default',
                      background: 'rgba(255,255,255,0.5)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#111';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                    >
                      {tool}
                    </div>
                  ))}
                </div>
             </div>

             <div style={{ flex: '1 1 300px' }}>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '30px', opacity: 0.5 }}>Languages & Tools</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {devTools.map((tool, i) => (
                    <div key={i} style={{ 
                      padding: '12px 24px', 
                      border: '1px solid rgba(0,0,0,0.1)', 
                      borderRadius: '100px', 
                      fontSize: '14px', 
                      fontWeight: 500,
                      transition: 'all 0.3s ease',
                      cursor: 'default',
                      background: 'rgba(255,255,255,0.5)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#111';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                    >
                      {tool}
                    </div>
                  ))}
                </div>
             </div>

           </div>
         </div>
       </Reveal>
    </section>
  );
};

const SocialLinks = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const links = [
    { name: 'LinkedIn', url: 'https://linkedin.com/in/sohel-rana-showrov-a7b24b266' },
    { name: 'GitHub', url: 'https://github.com/Sohel-Rana5510' }
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
      {links.map((item, index) => (
        <a 
          key={item.name} 
          href={item.url} 
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{
            padding: '12px 24px',
            border: `1px solid ${hoveredIndex === index ? '#dafe00' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: '100px',
            fontSize: '14px',
            textDecoration: 'none',
            color: hoveredIndex === index ? '#111' : '#111',
            transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
            background: hoveredIndex === index ? '#dafe00' : 'transparent',
            fontWeight: 500,
            letterSpacing: '0.02em',
            transform: hoveredIndex === index ? 'translateY(-2px)' : 'translateY(0)'
          }}
        >
          {item.name}
        </a>
      ))}
    </div>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="container" style={{ 
      minHeight: '80vh', 
      paddingTop: '120px',
      paddingBottom: '60px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <InteractiveShape type="asterisk" style={{ top: '10%', right: '20%', width: '200px', height: '200px' }} factor={0.08} />

      <Reveal>
        <h1 style={{ 
          fontSize: 'clamp(60px, 12vw, 150px)', 
          fontWeight: 600, 
          letterSpacing: '-0.03em',
          marginBottom: '20px',
          lineHeight: 0.9
        }}>
          Contact
        </h1>
        <p style={{ 
          fontSize: 'clamp(18px, 2vw, 24px)', 
          maxWidth: '600px', 
          margin: '0 auto 60px', 
          opacity: 0.6,
          fontWeight: 300,
          lineHeight: 1.5
        }}>
           Got a question, proposal, or testing project? I'm open for new opportunities.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <a 
          href="mailto:sohelranashowrov@gmail.com" 
          className="email-link" 
          style={{ 
             display: 'inline-flex', 
             alignItems: 'center',
             gap: '20px',
             fontSize: 'clamp(24px, 4vw, 60px)', 
             fontWeight: 500, 
             letterSpacing: '-0.02em',
             color: '#111',
             textDecoration: 'none',
             marginBottom: '60px'
          }}
        >
          sohelranashowrov@gmail.com
          <span className="arrow-circle" style={{
            width: '1em',
            height: '1em',
            backgroundColor: '#111',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#F5F5F5',
            fontSize: '0.4em',
            transformOrigin: 'center'
          }}>
            ↗
          </span>
        </a>
      </Reveal>

      <Reveal delay={0.2}>
         <div style={{ display: 'flex', gap: '24px', marginBottom: '80px', justifyContent: 'center' }}>
            <ContactIconButton href="https://linkedin.com/in/sohel-rana-showrov-a7b24b266" icon={<LinkedInIcon />} label="LinkedIn" />
            <ContactIconButton href="https://github.com/Sohel-Rana5510" icon={<GitHubIcon />} label="GitHub" />
            <ContactIconButton href="tel:+8801795190514" icon={<PhoneIcon />} label="Phone" />
         </div>
      </Reveal>

      <Reveal delay={0.3}>
        <div style={{ width: '100%', maxWidth: '800px', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '40px', margin: '0 auto' }}>
          <SocialLinks />
        </div>
      </Reveal>
      
    </section>
  );
};

const Footer = () => (
  <footer style={{ padding: '0 40px 40px 40px', borderTop: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
    <Reveal>
      <div style={{ paddingTop: '80px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: 'clamp(40px, 15vw, 250px)', 
          fontWeight: 800, 
          letterSpacing: '-0.06em', 
          lineHeight: 0.8, 
          color: 'rgba(0,0,0,0.05)',
          marginBottom: '40px',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          pointerEvents: 'none'
        }}>
          SOHEL RANA
        </h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <span>© 2026</span>
          <span>Designed & Built in React</span>
        </div>
      </div>
    </Reveal>
  </footer>
);

const App = () => {
  return (
    <div style={{ minHeight: '100vh', fontFamily: '"Inter", sans-serif' }}>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes spin-reverse { 100% { transform: rotate(-360deg); } }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } 60% { transform: translateY(-5px); } }
        html { scroll-behavior: smooth; }
        body { margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .container { max-width: 1400px; margin: 0 auto; padding: 0 40px; }
        .hero-name { line-height: 0.8; }
        .cta-button:hover { background: #dafe00 !important; color: #111 !important; border-color: #dafe00 !important; transform: scale(1.02) !important; }
        .nav-link { color: #111; text-decoration: none; opacity: 0.7; transition: opacity 0.2s; }
        .nav-link:hover { opacity: 1; }
        .email-link:hover .arrow-circle { transform: scale(1.1); transition: transform 0.3s; }
      `}</style>
      <NavBar />
      <Hero />
      <WorkSection />
      <AboutDataSection />
      <ToolsSection />
      <Contact />
      <Footer />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);