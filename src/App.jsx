import { useEffect } from "react";
import "./index.css";

function App() {
  useEffect(() => {
    // === Smooth scrolling for internal nav links ===
    const anchors = document.querySelectorAll('a[href^="#"]');
    const handleAnchorClick = (e) => {
      const href = e.currentTarget.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };
    anchors.forEach((a) => a.addEventListener("click", handleAnchorClick));

    // === Intersection Observer for section fade-ins ===
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(30px)";
      section.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      observer.observe(section);
    });

    // === Parallax hero + scroll-based opacity ===
    const hero = document.querySelector(".hero");
    const handleHeroScroll = () => {
      const scrolled = window.pageYOffset;
      if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = `${1 - scrolled / 700}`;
      }
    };
    window.addEventListener("scroll", handleHeroScroll);

    // === Active nav link on scroll + scroll progress bar ===
    const scrollProgress = document.getElementById("scrollProgress");

    const handleNavScroll = () => {
      const sectionsWithId = document.querySelectorAll("section[id]");
      const scrollY = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      // progress bar
      if (scrollProgress && docHeight > winHeight) {
        const progress = (scrollY / (docHeight - winHeight)) * 100;
        scrollProgress.style.width = `${progress}%`;
      }

      // active nav state
      sectionsWithId.forEach((section) => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 120;
        const sectionId = section.getAttribute("id");
        const navLink = document.querySelector(
          `.nav-links a[href="#${sectionId}"]`
        );

        if (
          navLink &&
          scrollY > sectionTop &&
          scrollY <= sectionTop + sectionHeight
        ) {
          document.querySelectorAll(".nav-links a").forEach((link) => {
            link.classList.remove("active");
          });
          navLink.classList.add("active");
        }
      });
    };
    window.addEventListener("scroll", handleNavScroll);

    // === Cursor glow effect ===
    const cursor = document.createElement("div");
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0, 245, 255, 0.3) 0%, transparent 70%);
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.15s ease, opacity 0.2s ease;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(cursor);

    const handleMouseMove = (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
      cursor.style.opacity = "1";
    };
    document.addEventListener("mousemove", handleMouseMove);

    const hoverTargets = document.querySelectorAll(
      "a, button, .glass-card, .skill-tag, .project-card, .coming-soon-card"
    );

    const enlarge = () =>
      (cursor.style.transform = "translate(-50%, -50%) scale(2)");
    const shrink = () =>
      (cursor.style.transform = "translate(-50%, -50%) scale(1)");

    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", enlarge);
      el.addEventListener("mouseleave", shrink);
    });

    // === Cleanup to avoid double-effects in React StrictMode ===
    return () => {
      anchors.forEach((a) => a.removeEventListener("click", handleAnchorClick));
      window.removeEventListener("scroll", handleHeroScroll);
      window.removeEventListener("scroll", handleNavScroll);
      document.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      cursor.remove();
      hoverTargets.forEach((el) => {
        el.removeEventListener("mouseenter", enlarge);
        el.removeEventListener("mouseleave", shrink);
      });
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" id="scrollProgress" />

      <nav>
        <div className="logo">Arya Manek</div>
        <ul className="nav-links">
          <li>
            <a href="#about" className="nav-pill">
              About
            </a>
          </li>
          <li>
            <a href="#skills">Skills</a>
          </li>
          <li>
            <a href="#projects">Work</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>

      <section className="hero">
        <div className="hero-bg-orbit" />
        <div>
          <div className="hero-badge-row">
            <span className="hero-badge">SOFTWARE DEVELOPER</span>
            <span className="hero-badge">SYSTEMS & CLOUD</span>
          </div>
          <h1>
            Building systems
            <br />
            that scale.
          </h1>
          <p className="subtitle">
            Software Developer • Problem Solver • System Architect
          </p>
          <p className="description">
            Toronto-based developer specializing in full-stack systems, cloud
            infrastructure, and scalable applications. Currently pursuing
            Honours Bachelor of Technology at Seneca College and seeking
            software engineering & IT internships.
          </p>
        </div>
        <div className="hero-side-card glass-card">
          <p className="hero-side-label">Now</p>
          <p className="hero-side-main">
            Designing technology that actually respects how humans think, feel,
            and work.
          </p>
          <div className="hero-side-grid">
            <div>
              <p className="hero-side-stat">2026 Summer</p>
              <p className="hero-side-caption">Internship availability</p>
            </div>
            <div>
              <p className="hero-side-stat">Full-stack</p>
              <p className="hero-side-caption">Python • JS • MongoDB</p>
            </div>
            <div>
              <p className="hero-side-stat">Toronto</p>
              <p className="hero-side-caption">Open to hybrid / remote</p>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">↓ Scroll to explore</div>
      </section>

      <section id="about">
        <h2 className="section-header">Beyond the terminal</h2>
        <p className="section-caption">Who I am when I'm not writing code</p>

        <div className="about-grid">
          <div className="about-content">
            <p>
              I'm a software developer from Toronto who believes the best
              solutions emerge from deep thinking and careful design. My
              approach combines technical precision with creative
              problem-solving—building systems that are as elegant under the
              hood as they are powerful in production.
            </p>

            <p>
              When I'm not architecting backend services or debugging
              deployment pipelines, you'll find me absorbed in Dostoevsky's
              existential narratives or exploring the psychological complexity
              of character-driven anime. I'm fascinated by how people think,
              which naturally led me to cognitive psychology and how we can
              build technology that truly serves human needs.
            </p>

            <p>
              I stay sharp through boxing and kickboxing—disciplines that
              mirror coding in their demand for focus, strategy, and continuous
              improvement. As president of the Seneca Science & Technology
              Club, I help fellow developers navigate their learning journeys
              and build community around shared curiosity.
            </p>
          </div>

          <div className="quick-facts">
            <div className="fact-item">
              <span className="fact-icon">📍</span>
              <div className="fact-content">
                <strong>Based in</strong>
                Toronto, Ontario
              </div>
            </div>
            <div className="fact-item">
              <span className="fact-icon">🎓</span>
              <div className="fact-content">
                <strong>Studying</strong>
                Honours Bachelor of Technology – Software Development at Seneca
                College
              </div>
            </div>
            <div className="fact-item">
              <span className="fact-icon">🥊</span>
              <div className="fact-content">
                <strong>Training in</strong>
                Boxing & Kickboxing
              </div>
            </div>
            <div className="fact-item">
              <span className="fact-icon">📚</span>
              <div className="fact-content">
                <strong>Reading</strong>
                Dostoevsky, Kafka, Paulo Coelho
              </div>
            </div>
            <div className="fact-item">
              <span className="fact-icon">🧠</span>
              <div className="fact-content">
                <strong>Exploring</strong>
                Cognitive psychology & human behavior
              </div>
            </div>
            <div className="fact-item">
              <span className="fact-icon">👥</span>
              <div className="fact-content">
                <strong>Leading</strong>
                Seneca Science & Technology Club
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills">
        <h2 className="section-header">Technical arsenal</h2>
        <p className="section-caption">
          Building with modern tools and proven technologies
        </p>

        <div className="skills-grid">
          <div className="skill-category glass-card">
            <h3>Languages</h3>
            <div className="skill-list">
              <span className="skill-tag">Java</span>
              <span className="skill-tag">JavaScript</span>
              <span className="skill-tag">Python</span>
              <span className="skill-tag">C++</span>
              <span className="skill-tag">SQL</span>
            </div>
          </div>

          <div className="skill-category glass-card">
            <h3>Frameworks & Libraries</h3>
            <div className="skill-list">
              <span className="skill-tag">React.js</span>
              <span className="skill-tag">Node.js</span>
              <span className="skill-tag">Spring Boot</span>
              <span className="skill-tag">Express.js</span>
            </div>
          </div>

          <div className="skill-category glass-card">
            <h3>Databases</h3>
            <div className="skill-list">
              <span className="skill-tag">MySQL</span>
              <span className="skill-tag">PostgreSQL</span>
              <span className="skill-tag">MongoDB</span>
            </div>
          </div>

          <div className="skill-category glass-card">
            <h3>Cloud & DevOps</h3>
            <div className="skill-list">
              <span className="skill-tag">REST APIs</span>
              <span className="skill-tag">Docker</span>
              <span className="skill-tag">AWS (basic)</span>
              <span className="skill-tag">Git & GitHub</span>
              <span className="skill-tag">Postman</span>
            </div>
          </div>

          <div className="skill-category glass-card">
            <h3>Core Competencies</h3>
            <div className="skill-list">
              <span className="skill-tag">System Architecture</span>
              <span className="skill-tag">API Development</span>
              <span className="skill-tag">Cloud Deployment</span>
              <span className="skill-tag">Database Design</span>
            </div>
          </div>

          <div className="skill-category glass-card">
            <h3>Human Skills</h3>
            <div className="skill-list">
              <span className="skill-tag">Collaboration</span>
              <span className="skill-tag">Communication</span>
              <span className="skill-tag">Problem Solving</span>
              <span className="skill-tag">Adaptability</span>
              <span className="skill-tag">Creativity</span>
              <span className="skill-tag">Organization</span>
            </div>
          </div>
        </div>
      </section>

      <section id="experience">
        <h2 className="section-header">Professional Experience</h2>
        <p className="section-caption">Where I've contributed and grown</p>

        <div className="experience-item">
          <h3 className="exp-title">Member Services Associate</h3>
          <div className="exp-company">Seneca Student Federation</div>
          <div className="exp-date">Toronto, ON | April 2024 – October 2025</div>
          <p>
            Delivered exceptional service to thousands of student members in a
            fast-paced campus environment. Managed transactions with accuracy,
            resolved complex inquiries through systematic problem-solving, and
            collaborated with cross-functional teams to enhance service
            reliability and efficiency.
          </p>

          <div className="exp-highlights">
            <div className="highlight-item">
              <strong>High-volume</strong>
              <br />
              Member support in busy campus spaces
            </div>
            <div className="highlight-item">
              <strong>Accuracy</strong>
              <br />
              Financial record management and tracking
            </div>
            <div className="highlight-item">
              <strong>Service</strong>
              <br />
              Clear, empathetic communication
            </div>
            <div className="highlight-item">
              <strong>Teamwork</strong>
              <br />
              Collaboration to improve operations
            </div>
          </div>
        </div>
      </section>

      <section id="projects">
        <h2 className="section-header">Selected Work</h2>
        <p className="section-caption">
          From concept to deployment—building solutions that matter
        </p>

        <div className="projects-container">
          <div className="project-card">
            <div>
              <div className="project-number">01</div>
              <h3 className="project-title">AidTrack</h3>
              <div className="project-subtitle">
                Disaster Relief Coordination System
              </div>
              <p className="project-description">
                Real-time logistics platform designed for NGOs responding to
                humanitarian crises. Streamlines resource allocation, volunteer
                coordination, and supply chain tracking during critical disaster
                response operations.
              </p>
              <div className="tech-stack">
                <span className="tech-item">React.js</span>
                <span className="tech-item">Node.js</span>
                <span className="tech-item">Express.js</span>
                <span className="tech-item">MongoDB</span>
                <span className="tech-item">REST APIs</span>
              </div>
            </div>
            <div className="glass-card">
              <h4 className="card-title">Impact</h4>
              <ul className="card-text">
                <li>Real-time tracking of supplies and personnel</li>
                <li>Centralized operations management dashboard</li>
                <li>Scalable multi-region architecture</li>
                <li>Mobile-responsive interface for field teams</li>
              </ul>
            </div>
          </div>

          <div className="project-card">
            <div className="glass-card">
              <h4 className="card-title">Key Features</h4>
              <ul className="card-text">
                <li>Immutable audit trail for each vote</li>
                <li>End-to-end encryption and anonymity</li>
                <li>Cryptographic verification of results</li>
                <li>Transparent yet privacy-preserving design</li>
              </ul>
            </div>
            <div>
              <div className="project-number">02</div>
              <h3 className="project-title">Civic Chain</h3>
              <div className="project-subtitle">Transparent Voting System</div>
              <p className="project-description">
                Blockchain-based voting platform that ensures electoral
                integrity through cryptographic verification while preserving
                voter anonymity. Reimagining democratic participation for the
                digital age.
              </p>
              <div className="tech-stack">
                <span className="tech-item">Blockchain</span>
                <span className="tech-item">Node.js</span>
                <span className="tech-item">PostgreSQL</span>
                <span className="tech-item">Cryptography</span>
              </div>
            </div>
          </div>

          <div className="project-card">
            <div>
              <div className="project-number">03</div>
              <h3 className="project-title">Fragments Microservice</h3>
              <div className="project-subtitle">Cloud-Native API</div>
              <p className="project-description">
                Production-grade microservice architecture demonstrating
                enterprise-level deployment patterns. Containerized Node.js API
                with authentication, tests, and deployment to cloud
                infrastructure.
              </p>
              <div className="tech-stack">
                <span className="tech-item">Node.js</span>
                <span className="tech-item">Express.js</span>
                <span className="tech-item">Docker</span>
                <span className="tech-item">AWS (basic)</span>
                <span className="tech-item">REST APIs</span>
              </div>
            </div>
            <div className="glass-card">
              <h4 className="card-title">Technical Highlights</h4>
              <ul className="card-text">
                <li>Docker-based containerization</li>
                <li>Health checks and observability</li>
                <li>Automated testing & CI foundations</li>
                <li>Cloud-ready configuration</li>
              </ul>
            </div>
          </div>

          <div className="project-card">
            <div className="glass-card">
              <h4 className="card-title">Features</h4>
              <ul className="card-text">
                <li>Interactive dynamic menu</li>
                <li>Real-time cart updates</li>
                <li>Mobile-first responsive layout</li>
                <li>Clean, accessible UI</li>
              </ul>
            </div>
            <div>
              <div className="project-number">04</div>
              <h3 className="project-title">Local Pizza Shop</h3>
              <div className="project-subtitle">E-Commerce Frontend</div>
              <p className="project-description">
                Restaurant website with real-time cart functionality and modern
                responsive design. Demonstrates front-end development skills,
                UX thinking, and component-based layout structure.
              </p>
              <div className="tech-stack">
                <span className="tech-item">HTML5</span>
                <span className="tech-item">CSS3</span>
                <span className="tech-item">JavaScript</span>
                <span className="tech-item">Responsive Design</span>
              </div>
            </div>
          </div>

          <div className="project-card">
            <div>
              <div className="project-number">05</div>
              <h3 className="project-title">LacedUp</h3>
              <div className="project-subtitle">Sneaker Marketplace</div>
              <p className="project-description">
                Full-stack marketplace concept showcasing authentication,
                product management, and modern e-commerce flows. Built to mirror
                real-world marketplace behavior and UX.
              </p>
              <div className="tech-stack">
                <span className="tech-item">React.js</span>
                <span className="tech-item">Node.js</span>
                <span className="tech-item">Express.js</span>
                <span className="tech-item">MySQL</span>
                <span className="tech-item">JWT Auth</span>
              </div>
            </div>
            <div className="glass-card">
              <h4 className="card-title">Core Functionality</h4>
              <ul className="card-text">
                <li>Secure user authentication</li>
                <li>Full CRUD for products</li>
                <li>Search & filter experience</li>
                <li>Responsive product gallery</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="coming-soon">
        <h2 className="section-header">Next builds</h2>
        <p className="section-caption">
          Exploring new territories in software development
        </p>

        <div className="coming-soon-grid">
          <div className="coming-soon-card">
            <span className="coming-tag">Coming Soon</span>
            <h3 className="card-heading">Python Automation Suite</h3>
            <p className="card-text">
              Intelligent automation scripts designed for IT support workflows.
              Building tools that eliminate repetitive tasks, automate system
              diagnostics, and streamline helpdesk operations.
            </p>
            <div className="tag-row">
              <span className="tech-item">Python</span>
              <span className="tech-item">Automation</span>
              <span className="tech-item">System Monitoring</span>
            </div>
          </div>

          <div className="coming-soon-card">
            <span className="coming-tag">Coming Soon</span>
            <h3 className="card-heading">RealConnect</h3>
            <p className="card-text">
              Real-time chat platform powered by WebSocket technology.
              Engineering instant messaging infrastructure with typing
              indicators, read receipts, and room-based conversations.
            </p>
            <div className="tag-row">
              <span className="tech-item">WebSockets</span>
              <span className="tech-item">Node.js</span>
              <span className="tech-item">Real-time</span>
            </div>
          </div>

          <div className="coming-soon-card">
            <span className="coming-tag">Coming Soon</span>
            <h3 className="card-heading">NLP Intelligence Suite</h3>
            <p className="card-text">
              Natural language processing applications exploring sentiment
              analysis, text summarization, and language understanding.
              Building tools that extract meaning from unstructured text.
            </p>
            <div className="tag-row">
              <span className="tech-item">Python</span>
              <span className="tech-item">NLP</span>
              <span className="tech-item">ML</span>
            </div>
          </div>

          <div className="coming-soon-card">
            <span className="coming-tag">Coming Soon</span>
            <h3 className="card-heading">Portfolio v2.0</h3>
            <p className="card-text">
              Next-generation portfolio featuring 3D environments, WebGL
              shaders, and advanced motion graphics. Pushing the boundaries of
              web experiences with immersive visual storytelling.
            </p>
            <div className="tag-row">
              <span className="tech-item">Three.js</span>
              <span className="tech-item">WebGL</span>
              <span className="tech-item">GSAP</span>
            </div>
          </div>
        </div>
      </section>

      <section id="leadership">
        <h2 className="section-header">Community & leadership</h2>
        <p className="section-caption">
          Building bridges between learning and impact
        </p>

        <div className="glass-card leadership-card">
          <h3 className="leadership-title">
            President, Seneca Science & Technology Club
          </h3>
          <div className="leadership-subtitle">2024 – Present</div>
          <p className="card-text">
            Leading a community of developers and technology enthusiasts,
            organizing workshops, mentoring peers through technical challenges,
            and fostering collaborative learning environments. Building bridges
            between academic learning and real-world application.
          </p>
        </div>
        <div className="glass-card" style={{ maxWidth: "900px", margin: "4rem auto" }}>
  <h3 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
    York University – Automotive Innovation Challenge (Hackathon)
  </h3>

  <div style={{ color: "var(--accent-cyan)", marginBottom: "1.5rem" }}>
    2025 • YSpace Toronto
  </div>

  <img 
    src="/hackathon-photo.jpg" 
    alt="York University Hackathon Team Photo"
    style={{
      width: "100%",
      height: "auto",
      borderRadius: "15px",
      marginBottom: "1.5rem",
      border: "1px solid var(--glass-border)"
    }}
  />

  <p style={{ color: "var(--text-muted)", lineHeight: "1.9", marginBottom: "1.5rem" }}>
    Participated in an interdisciplinary automotive innovation hackathon hosted at 
    York University’s YSpace. Our team focused on solving a real challenge in the 
    electric vehicle (EV) industry — <strong>low consumer trust and safety concerns</strong>.
  </p>

  <p style={{ color: "var(--text-muted)", lineHeight: "1.9", marginBottom: "1.5rem" }}>
    We designed a smart <strong>failsafe emergency door-release system</strong> for EVs. 
    The system detects high-risk thermal or chemical events (such as battery overheating 
    or a compromised cell) using embedded sensors. When triggered, it deploys an 
    <strong>automatic mechanical door-latch release</strong>, allowing safe exit even if the 
    main electrical system becomes unresponsive.
  </p>

  <p style={{ color: "var(--text-muted)", lineHeight: "1.9" }}>
    Inspired by aviation safety mechanisms, our concept blended <strong>real-time diagnostics</strong>, 
    <strong>redundant mechanical design</strong>, and a <strong>microcontroller-driven override</strong> — 
    creating a practical solution aimed at boosting consumer confidence in EV adoption.
  </p>
</div>
      </section>

      <section id="contact">
        <h2 className="section-header">Let&apos;s build something</h2>
        <p className="section-caption">Available for internships starting 2026</p>

        <div className="contact-grid">
          <div>
            <p className="contact-intro">
              Open to software engineering, full-stack development, backend, and
              IT internships. Looking for challenging projects, collaborative
              teams, and opportunities to create meaningful impact through
              well-designed systems.
            </p>
            <a href="mailto:ammanek@myseneca.ca" className="cta-button">
              Start a conversation →
            </a>
          </div>

          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div className="contact-details">
                <h4>Email</h4>
                <a
                  href="mailto:ammanek@myseneca.ca"
                  className="contact-link"
                >
                  ammanek@myseneca.ca
                </a>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon">📱</span>
              <div className="contact-details">
                <h4>Phone</h4>
                <a href="tel:4167325134" className="contact-link">
                  416-732-5134
                </a>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon">💼</span>
              <div className="contact-details">
                <h4>LinkedIn</h4>
                <a
                  href="https://linkedin.com/in/arya-manek-a21a632b5"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-link"
                >
                  linkedin.com/in/arya-manek-a21a632b5
                </a>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div className="contact-details">
                <h4>Location</h4>
                <span className="contact-link">Toronto, Ontario</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <p>© 2025 Arya Manek. Built with React, coffee, and curiosity.</p>
        <p className="footer-sub">Designed and deployed in Toronto.</p>
      </footer>
    </>
  );
}

export default App;
