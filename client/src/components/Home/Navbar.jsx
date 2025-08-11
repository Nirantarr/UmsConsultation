import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, User, ChevronDown, LogIn, UserPlus, Home as HomeIcon, Info, Phone, DollarSign, BookOpen, LogOut, LayoutDashboard } from 'lucide-react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import Logo from './logo.jpg';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const authDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navbarRef = useRef(null);
  const magicBgRef = useRef(null);
  const navLinksContainerRef = useRef(null);
  const activeLinkIndicatorRef = useRef(null);
  const navigate = useNavigate();

  // ... (useEffect and other functions remain the same) ...
    // --- Logic from old navbar.jsx ---
    useEffect(() => {
        // Check for logged-in user in localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
        setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthDropdownOpen(false); // Close dropdown on logout
        setIsMobileMenuOpen(false); // Close mobile menu on logout
        navigate('/');
    };

    // --- GSAP Animations (from new code) ---
    useEffect(() => {
        gsap.to(navbarRef.current, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.2 });

        const handleMouseMove = (e) => {
        if (magicBgRef.current) {
            gsap.to(magicBgRef.current, { duration: 0.7, x: e.clientX, y: e.clientY, ease: 'power2.out' });
        }
        };
        window.addEventListener('mousemove', handleMouseMove);

        const magneticElements = navbarRef.current.querySelectorAll('.magnetic');
        magneticElements.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = el.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);
            gsap.to(el, { x: x * 0.2, y: y * 0.4, duration: 0.8, ease: 'power3.out' });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
        });
        });
        
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    
    useEffect(() => {
        const navLinks = navLinksContainerRef.current?.querySelectorAll('a');
        const indicator = activeLinkIndicatorRef.current;
        if (!navLinks || !indicator) return;

        const handleLinkHover = (e) => {
        const link = e.currentTarget;
        gsap.to(indicator, { width: link.offsetWidth, x: link.offsetLeft, duration: 0.4, ease: 'power3.inOut', opacity: 1 });
        };

        const handleLinkLeave = () => {
        gsap.to(indicator, { opacity: 0, duration: 0.3, ease: 'power3.inOut' });
        }

        navLinks.forEach(link => link.addEventListener('mouseenter', handleLinkHover));
        navLinksContainerRef.current.addEventListener('mouseleave', handleLinkLeave);

        return () => {
        navLinks.forEach(link => link.removeEventListener('mouseenter', handleLinkHover));
        if(navLinksContainerRef.current) {
            navLinksContainerRef.current.removeEventListener('mouseleave', handleLinkLeave);
        }
        }
    }, []);

    // --- Event Handlers & State Management ---
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (authDropdownRef.current && !authDropdownRef.current.contains(event.target)) {
            setIsAuthDropdownOpen(false);
        }
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && isMobileMenuOpen && !mobileMenuButton?.contains(event.target)) {
            setIsMobileMenuOpen(false);
        }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const toggleAuthDropdown = () => setIsAuthDropdownOpen(!isAuthDropdownOpen);

    const handleNavigate = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
        setIsAuthDropdownOpen(false);
    };

    // --- Sub-components ---
    const NavLink = ({ href, children, icon: Icon }) => (
        <a
        href={href}
        onClick={(e) => { e.preventDefault(); handleNavigate(href); }}
        // FIX: Adjusted padding for better responsiveness on tablets
        className="relative flex items-center px-2 md:px-3 py-2 rounded-lg text-base font-medium text-[var(--text-primary)] transition-colors duration-300
                    md:text-sm md:inline-flex md:items-center md:py-1 md:bg-transparent md:hover:text-[var(--theme-primary)] md:font-semibold"
        >
        {Icon && <Icon className="mr-3 h-5 w-5 text-gray-500 md:hidden" />}
        {children}
        </a>
    );

    const DropdownItem = ({ icon: Icon, text, onClick }) => (
        <a
        href="#"
        onClick={(e) => { e.preventDefault(); onClick(); }}
        className="flex items-center px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--light-bg-color)] hover:text-[var(--theme-primary)] transition-all duration-200 ease-in-out rounded-lg"
        >
        {Icon && <Icon className="mr-3 h-4 w-4 text-[var(--text-secondary)]" />}
        <span className="font-medium">{text}</span>
        </a>
    );

    // --- Logic from old navbar.jsx ---
    const renderDashboardButton = (isMobile = false) => {
        if (!user) return null;

        let path, text;
        if (user.type === 'consultant') {
            path = '/dashboardC';
            text = 'Consultant Dashboard';
        } else if (user.type === 'employee') {
            path = user.isAdmin ? '/dashboardA' : '/dashboardE';
            text = user.isAdmin ? 'Admin Dashboard' : 'Employee Dashboard';
        } else {
            return null;
        }
        
        if (isMobile) {
            return (
                <button className="w-full flex items-center justify-center px-4 py-3 border border-[var(--theme-primary)] text-[var(--theme-primary)] rounded-lg hover:bg-white transition duration-300 font-medium" onClick={() => handleNavigate(path)}>
                    <LayoutDashboard className="mr-3 h-5 w-5" /> {text}
                </button>
            )
        }

        return <DropdownItem icon={LayoutDashboard} text={text} onClick={() => handleNavigate(path)} />;
    };


  return (
    <>
      <div ref={magicBgRef} className="magic-mouse-bg"></div>

      <nav ref={navbarRef} className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl mx-auto bg-white/100 shadow-lg rounded-2xl z-50 border border-white/20 opacity-0 -translate-y-16 font-[var(--secondary-font)]">
        {/* FIX: Added gap for spacing between elements */}
        <div className="container mx-auto flex justify-between items-center p-2 md:p-3 gap-2 md:gap-4">
          
          {/* FIX: Added flex-shrink-0 to prevent the logo from getting squashed */}
          <a href="/" onClick={(e) => { e.preventDefault(); handleNavigate('/'); }} className="transform hover:scale-105 flex items-center transition-transform duration-300 magnetic -my-2 flex-shrink-0">
            <img 
              src={Logo} 
              alt="tajpe Logo" 
              // FIX: Responsive logo size
              className="h-16 w-16 lg:h-20 lg:w-20 rounded-full object-cover" 
            />
            {/* FIX: Responsive font size */}
            <span className="text-2xl lg:text-3xl font-bold text-[var(--theme-primary)] tracking-tight font-[var(--primary-font)] ml-2">
                Tajpe
            </span>
          </a>

          {/* FIX: Adjusted spacing for tablets */}
          <div ref={navLinksContainerRef} className="hidden md:flex relative space-x-1 md:space-x-2 lg:space-x-4 items-center bg-blue-100/70 p-1 rounded-full border border-black/50">
            <div ref={activeLinkIndicatorRef} className="active-link-indicator"></div>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/services">Services</NavLink>
            <NavLink href="/pricingpage">Pricing</NavLink>
            <NavLink href="/aboutus">About Us</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="relative" ref={authDropdownRef}>
              {user ? (
                // --- Logged-in User View ---
                <>
                  <button
                    onClick={toggleAuthDropdown}
                    className="magnetic flex items-center space-x-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/50 focus:ring-offset-2 rounded-full p-2.5 transition-all duration-300 bg-white/80 hover:bg-white/100 shadow-sm border border-transparent hover:border-gray-200"
                    aria-haspopup="true" aria-expanded={isAuthDropdownOpen}
                  >
                    <span className="font-semibold text-sm hidden sm:inline px-2">{user.name}</span>
                    <User className="h-5 w-5 text-[var(--theme-primary)]" />
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${isAuthDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`absolute right-0 mt-4 w-64 bg-white/100 backdrop-blur-10xl border border-gray-200/50 rounded-xl shadow-2xl p-2 origin-top-right transition-all duration-300 ease-in-out ${isAuthDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                      {renderDashboardButton()}
                      <div className="h-px bg-gray-200/80 my-1"></div>
                      <DropdownItem icon={LogOut} text="Logout" onClick={handleLogout} />
                  </div>
                </>
              ) : (
                // --- Logged-out User View ---
                <>
                   <button
                    onClick={toggleAuthDropdown}
                    className="magnetic flex items-center space-x-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/50 focus:ring-offset-2 rounded-full p-2.5 transition-all duration-300 bg-white/80 hover:bg-white/100 shadow-sm border border-transparent hover:border-gray-200"
                    aria-haspopup="true" aria-expanded={isAuthDropdownOpen}
                  >
                    <User className="h-5 w-5 text-[var(--theme-primary)]" />
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${isAuthDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`absolute right-0 mt-4 w-64 bg-white/100 backdrop-blur-10xl border border-gray-200/50 rounded-xl shadow-2xl p-2 origin-top-right transition-all duration-300 ease-in-out ${isAuthDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                     <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">For Consultant</div>
                     <DropdownItem icon={LogIn} text="Consultant Login" onClick={() => handleNavigate('/login')} />
                     <DropdownItem icon={UserPlus} text="Consultant Signup" onClick={() => handleNavigate('/signup')} />
                     <div className="h-px bg-gray-200/80 my-2"></div>
                     <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">For Employees</div>
                     <DropdownItem icon={LogIn} text="Employee Login" onClick={() => handleNavigate('/login')} />
                     <DropdownItem icon={UserPlus} text="Employee Signup" onClick={() => handleNavigate('/signup')} />
                  </div>
                </>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="magnetic mobile-menu-button text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/50 focus:ring-offset-2 rounded-full p-2.5 transition-all duration-200 bg-white/80 hover:bg-white/100 shadow-sm border border-transparent hover:border-gray-200"
                aria-label="Toggle navigation"
              >
                <div className={`transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? 'rotate-90' : ''}`}>
                    {isMobileMenuOpen ? <X className="h-6 w-6 text-[var(--theme-primary)]" /> : <Menu className="h-6 w-6 text-[var(--theme-primary)]" />}
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'max-h-[600px] py-4' : 'max-h-0'}`}
        >
          <div className="flex flex-col space-y-2 px-4 border-t border-gray-200/80">
            <NavLink href="/" icon={HomeIcon}>Home</NavLink>
            <NavLink href="/services" icon={BookOpen}>Services</NavLink>
            <NavLink href="/pricingpage" icon={DollarSign}>Pricing</NavLink>
            <NavLink href="/aboutus" icon={Info}>About Us</NavLink>
            <NavLink href="/contact" icon={Phone}>Contact</NavLink>
            
            <div className="pt-4 border-t border-gray-200/80 mt-4">
              {user ? (
                 // --- Mobile Logged-in View ---
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-600 mb-3 px-3">Welcome, {user.name}</p>
                  {renderDashboardButton(true)}
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 font-medium shadow-lg" onClick={handleLogout}>
                    <LogOut className="mr-3 h-5 w-5" /> Logout
                  </button>
                </div>
              ) : (
                 // --- Mobile Logged-out View ---
                <>
                  <p className="text-sm font-semibold text-gray-500 mb-3 px-3">Account Access</p>
                  <div className="space-y-3">
                     <button className="w-full flex items-center justify-center px-4 py-3 border border-[var(--theme-primary)] text-[var(--theme-primary)] rounded-lg hover:bg-white transition duration-300 font-medium" onClick={() => handleNavigate('/login')}>Consultant Login</button>
                     <button className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity duration-300 font-medium shadow-lg" onClick={() => handleNavigate('/signup')}>Consultant Signup</button>
                     <button className="w-full flex items-center justify-center px-4 py-3 border border-[var(--theme-secondary)] text-[var(--theme-secondary)] rounded-lg hover:bg-white transition duration-300 font-medium" onClick={() => handleNavigate('/login')}>Employee Login</button>
                     <button className="w-full flex items-center justify-center px-4 py-3 bg-[var(--theme-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity duration-300 font-medium shadow-md" onClick={() => handleNavigate('/signup')}>Employee Signup</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

// import React, { useState, useRef, useEffect } from 'react';
// import { Menu, X, User, ChevronDown, LogIn, UserPlus, Home as HomeIcon, Info, Phone, DollarSign, BookOpen, LogOut, LayoutDashboard } from 'lucide-react';
// import { gsap } from 'gsap';
// import { useNavigate } from 'react-router-dom';
// import Logo from './logo.jpg';
// const Navbar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
//   const [user, setUser] = useState(null); // From old code
//   const authDropdownRef = useRef(null);
//   const mobileMenuRef = useRef(null);
//   const navbarRef = useRef(null);
//   const magicBgRef = useRef(null);
//   const navLinksContainerRef = useRef(null);
//   const activeLinkIndicatorRef = useRef(null);
//   const navigate = useNavigate();

//   // --- Logic from old navbar.jsx ---
//   useEffect(() => {
//     // Check for logged-in user in localStorage
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//     setUser(null);
//     setIsAuthDropdownOpen(false); // Close dropdown on logout
//     setIsMobileMenuOpen(false); // Close mobile menu on logout
//     navigate('/');
//   };

//   // --- GSAP Animations (from new code) ---
//   useEffect(() => {
//     gsap.to(navbarRef.current, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.2 });

//     const handleMouseMove = (e) => {
//       if (magicBgRef.current) {
//         gsap.to(magicBgRef.current, { duration: 0.7, x: e.clientX, y: e.clientY, ease: 'power2.out' });
//       }
//     };
//     window.addEventListener('mousemove', handleMouseMove);

//     const magneticElements = navbarRef.current.querySelectorAll('.magnetic');
//     magneticElements.forEach((el) => {
//       el.addEventListener('mousemove', (e) => {
//         const { clientX, clientY } = e;
//         const { left, top, width, height } = el.getBoundingClientRect();
//         const x = clientX - (left + width / 2);
//         const y = clientY - (top + height / 2);
//         gsap.to(el, { x: x * 0.2, y: y * 0.4, duration: 0.8, ease: 'power3.out' });
//       });
//       el.addEventListener('mouseleave', () => {
//         gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
//       });
//     });
    
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, []);
  
//   useEffect(() => {
//     const navLinks = navLinksContainerRef.current?.querySelectorAll('a');
//     const indicator = activeLinkIndicatorRef.current;
//     if (!navLinks || !indicator) return;

//     const handleLinkHover = (e) => {
//       const link = e.currentTarget;
//       gsap.to(indicator, { width: link.offsetWidth, x: link.offsetLeft, duration: 0.4, ease: 'power3.inOut', opacity: 1 });
//     };

//     const handleLinkLeave = () => {
//        gsap.to(indicator, { opacity: 0, duration: 0.3, ease: 'power3.inOut' });
//     }

//     navLinks.forEach(link => link.addEventListener('mouseenter', handleLinkHover));
//     navLinksContainerRef.current.addEventListener('mouseleave', handleLinkLeave);

//     return () => {
//       navLinks.forEach(link => link.removeEventListener('mouseenter', handleLinkHover));
//       if(navLinksContainerRef.current) {
//          navLinksContainerRef.current.removeEventListener('mouseleave', handleLinkLeave);
//        }
//     }
//   }, []);

//   // --- Event Handlers & State Management ---
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (authDropdownRef.current && !authDropdownRef.current.contains(event.target)) {
//         setIsAuthDropdownOpen(false);
//       }
//       const mobileMenuButton = document.querySelector('.mobile-menu-button');
//       if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && isMobileMenuOpen && !mobileMenuButton?.contains(event.target)) {
//         setIsMobileMenuOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [isMobileMenuOpen]);

//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
//   const toggleAuthDropdown = () => setIsAuthDropdownOpen(!isAuthDropdownOpen);

//   const handleNavigate = (path) => {
//     navigate(path);
//     setIsMobileMenuOpen(false);
//     setIsAuthDropdownOpen(false);
//   };

//   // --- Sub-components ---
//   const NavLink = ({ href, children, icon: Icon }) => (
//     <a
//       href={href}
//       onClick={(e) => { e.preventDefault(); handleNavigate(href); }}
//       className="relative flex items-center px-4 py-2 rounded-lg text-base font-medium text-[var(--text-primary)] transition-colors duration-300
//                  md:text-sm md:inline-flex md:items-center md:px-3 md:py-1 md:bg-transparent md:hover:text-[var(--theme-primary)] md:font-semibold"
//     >
//       {Icon && <Icon className="mr-3 h-5 w-5 text-gray-500 md:hidden" />}
//       {children}
//     </a>
//   );

//   const DropdownItem = ({ icon: Icon, text, onClick }) => (
//     <a
//       href="#"
//       onClick={(e) => { e.preventDefault(); onClick(); }}
//       className="flex items-center px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--light-bg-color)] hover:text-[var(--theme-primary)] transition-all duration-200 ease-in-out rounded-lg"
//     >
//       {Icon && <Icon className="mr-3 h-4 w-4 text-[var(--text-secondary)]" />}
//       <span className="font-medium">{text}</span>
//     </a>
//   );

//   // --- Logic from old navbar.jsx ---
//   const renderDashboardButton = (isMobile = false) => {
//     if (!user) return null;

//     let path, text;
//     if (user.type === 'consultant') {
//         path = '/dashboardC';
//         text = 'Consultant Dashboard';
//     } else if (user.type === 'employee') {
//         path = user.isAdmin ? '/dashboardA' : '/dashboardE';
//         text = user.isAdmin ? 'Admin Dashboard' : 'Employee Dashboard';
//     } else {
//         return null;
//     }
    
//     if (isMobile) {
//         return (
//              <button className="w-full flex items-center justify-center px-4 py-3 border border-[var(--theme-primary)] text-[var(--theme-primary)] rounded-lg hover:bg-white transition duration-300 font-medium" onClick={() => handleNavigate(path)}>
//                 <LayoutDashboard className="mr-3 h-5 w-5" /> {text}
//             </button>
//         )
//     }

//     return <DropdownItem icon={LayoutDashboard} text={text} onClick={() => handleNavigate(path)} />;
//   };


//   return (
//     <>
//       <div ref={magicBgRef} className="magic-mouse-bg"></div>

//       <nav ref={navbarRef} className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl mx-auto bg-white/100 shadow-lg rounded-2xl z-50 border border-white/20 opacity-0 -translate-y-16 font-[var(--secondary-font)]">
//         <div className="container mx-auto flex justify-between items-center p-3">
// <a href="/" onClick={(e) => { e.preventDefault(); handleNavigate('/'); }} className="transform hover:scale-105 flex items-center transition-transform duration-300 magnetic -my-2">
//     <img 
//         src={Logo} 
//         alt="tajpe Logo" 
//         className="h-20 w-20 rounded-full object-cover" 
//     />
//     {/* --- FIX IS HERE: The inner <a> tag is now a <span> --- */}
//     <span className="text-3xl font-bold text-[var(--theme-primary)] tracking-tight font-[var(--primary-font)] ml-2">
//         Tajpe
//     </span>
// </a>

//           <div ref={navLinksContainerRef} className="hidden md:flex relative space-x-2 lg:space-x-4 items-center bg-blue-100/70 p-1 rounded-full border border-black/50">
//             <div ref={activeLinkIndicatorRef} className="active-link-indicator"></div>
//             <NavLink href="/">Home</NavLink>
//             <NavLink href="/services">Services</NavLink>
//             <NavLink href="/pricingpage">Pricing</NavLink>
//             <NavLink href="/aboutus">About Us</NavLink>
//             <NavLink href="/contact">Contact</NavLink>
//           </div>

//           <div className="flex items-center space-x-3">
//             <div className="relative" ref={authDropdownRef}>
//               {user ? (
//                 // --- Logged-in User View ---
//                 <>
//                   <button
//                     onClick={toggleAuthDropdown}
//                     className="magnetic flex items-center space-x-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/50 focus:ring-offset-2 rounded-full p-2.5 transition-all duration-300 bg-white/80 hover:bg-white/100 shadow-sm border border-transparent hover:border-gray-200"
//                     aria-haspopup="true" aria-expanded={isAuthDropdownOpen}
//                   >
//                     <span className="font-semibold text-sm hidden sm:inline px-2">{user.name}</span>
//                     <User className="h-5 w-5 text-[var(--theme-primary)]" />
//                     <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${isAuthDropdownOpen ? 'rotate-180' : ''}`} />
//                   </button>
//                   <div className={`absolute right-0 mt-4 w-64 bg-white/100 backdrop-blur-10xl border border-gray-200/50 rounded-xl shadow-2xl p-2 origin-top-right transition-all duration-300 ease-in-out ${isAuthDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
//                       {renderDashboardButton()}
//                       <div className="h-px bg-gray-200/80 my-1"></div>
//                       <DropdownItem icon={LogOut} text="Logout" onClick={handleLogout} />
//                   </div>
//                 </>
//               ) : (
//                 // --- Logged-out User View ---
//                 <>
//                    <button
//                     onClick={toggleAuthDropdown}
//                     className="magnetic flex items-center space-x-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/50 focus:ring-offset-2 rounded-full p-2.5 transition-all duration-300 bg-white/80 hover:bg-white/100 shadow-sm border border-transparent hover:border-gray-200"
//                     aria-haspopup="true" aria-expanded={isAuthDropdownOpen}
//                   >
//                     <User className="h-5 w-5 text-[var(--theme-primary)]" />
//                     <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${isAuthDropdownOpen ? 'rotate-180' : ''}`} />
//                   </button>
//                   <div className={`absolute right-0 mt-4 w-64 bg-white/100 backdrop-blur-10xl border border-gray-200/50 rounded-xl shadow-2xl p-2 origin-top-right transition-all duration-300 ease-in-out ${isAuthDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
//                      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">For Consultant</div>
//                      <DropdownItem icon={LogIn} text="Consultant Login" onClick={() => handleNavigate('/login')} />
//                      <DropdownItem icon={UserPlus} text="Consultant Signup" onClick={() => handleNavigate('/signup')} />
//                      <div className="h-px bg-gray-200/80 my-2"></div>
//                      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">For Employees</div>
//                      <DropdownItem icon={LogIn} text="Employee Login" onClick={() => handleNavigate('/login')} />
//                      <DropdownItem icon={UserPlus} text="Employee Signup" onClick={() => handleNavigate('/signup')} />
//                   </div>
//                 </>
//               )}
//             </div>

//             <div className="md:hidden">
//               <button
//                 onClick={toggleMobileMenu}
//                 className="magnetic mobile-menu-button text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/50 focus:ring-offset-2 rounded-full p-2.5 transition-all duration-200 bg-white/80 hover:bg-white/100 shadow-sm border border-transparent hover:border-gray-200"
//                 aria-label="Toggle navigation"
//               >
//                 <div className={`transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? 'rotate-90' : ''}`}>
//                     {isMobileMenuOpen ? <X className="h-6 w-6 text-[var(--theme-primary)]" /> : <Menu className="h-6 w-6 text-[var(--theme-primary)]" />}
//                 </div>
//               </button>
//             </div>
//           </div>
//         </div>
        
//         {/* Mobile Menu */}
//         <div
//           ref={mobileMenuRef}
//           className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'max-h-[600px] py-4' : 'max-h-0'}`}
//         >
//           <div className="flex flex-col space-y-2 px-4 border-t border-gray-200/80">
//             <NavLink href="/" icon={HomeIcon}>Home</NavLink>
//             <NavLink href="/services" icon={BookOpen}>Services</NavLink>
//             <NavLink href="/pricingpage" icon={DollarSign}>Pricing</NavLink>
//             <NavLink href="/aboutus" icon={Info}>About Us</NavLink>
//             <NavLink href="/contact" icon={Phone}>Contact</NavLink>
            
//             <div className="pt-4 border-t border-gray-200/80 mt-4">
//               {user ? (
//                  // --- Mobile Logged-in View ---
//                 <div className="space-y-3">
//                   <p className="text-sm font-semibold text-gray-600 mb-3 px-3">Welcome, {user.name}</p>
//                   {renderDashboardButton(true)}
//                   <button className="w-full flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 font-medium shadow-lg" onClick={handleLogout}>
//                     <LogOut className="mr-3 h-5 w-5" /> Logout
//                   </button>
//                 </div>
//               ) : (
//                  // --- Mobile Logged-out View ---
//                 <>
//                   <p className="text-sm font-semibold text-gray-500 mb-3 px-3">Account Access</p>
//                   <div className="space-y-3">
//                      <button className="w-full flex items-center justify-center px-4 py-3 border border-[var(--theme-primary)] text-[var(--theme-primary)] rounded-lg hover:bg-white transition duration-300 font-medium" onClick={() => handleNavigate('/login')}>Consultant Login</button>
//                      <button className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity duration-300 font-medium shadow-lg" onClick={() => handleNavigate('/signup')}>Consultant Signup</button>
//                      <button className="w-full flex items-center justify-center px-4 py-3 border border-[var(--theme-secondary)] text-[var(--theme-secondary)] rounded-lg hover:bg-white transition duration-300 font-medium" onClick={() => handleNavigate('/login')}>Employee Login</button>
//                      <button className="w-full flex items-center justify-center px-4 py-3 bg-[var(--theme-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity duration-300 font-medium shadow-md" onClick={() => handleNavigate('/signup')}>Employee Signup</button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default Navbar;

