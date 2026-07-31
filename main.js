/* ==========================================================================
   LENIS SMOOTH SCROLL + GSAP & SCROLLTRIGGER INTEGRATION
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Inicializar Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing fluido estilo e-commerce luxury
    smoothWheel: true,
    touchMultiplier: 2,
  });

  // Integrar Lenis no RAF (Request Animation Frame)
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sincronizar o ScrollTrigger do GSAP com as atualizações do Lenis
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0, 0);

  // 2. Animação de Mudança na Navbar no Scroll
  const navbar = document.getElementById("navbar");
  lenis.on('scroll', ({ scroll }) => {
    if (scroll > 80) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // 3. Animações de Entrada da Hero Section
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1.2 } });

  heroTl.from(".hero-anim", {
    y: 50,
    opacity: 0,
    stagger: 0.18,
    delay: 0.2
  })
  .from(".hero-bg-img", {
    scale: 1.15,
    duration: 1.8,
    ease: "power2.out"
  }, "-=1.2");

  // 4. Animações de Scroll (ScrollTrigger) para Seções Genericamente Reveladas
  const splitElements = document.querySelectorAll(".split-anim");
  splitElements.forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse"
      },
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
  });

  // 5. Animações de Entrada Genéricas por Scroll
  // (Apenas animação se o elemento estiver no fluxo normal)

  // 6. Submissão do formulário → Redireciona para WhatsApp com mensagem formatada
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name    = document.getElementById("name").value.trim();
      const phone   = document.getElementById("phone").value.trim();
      const service = document.getElementById("service").value.trim();
      const message = document.getElementById("message").value.trim();

      // Monta a mensagem formatada para o WhatsApp
      const text = `Olá, Cecília! 💜

Meu nome é *${name}* e tenho interesse em agendar uma consulta.

📦 *Pacote de interesse:* ${service}

📱 *Meu telefone:* ${phone}

💬 *Sobre mim:*
${message}

Aguardo seu retorno! 😊`;

      // Número do WhatsApp da Cecília (sem + e sem espaços)
      const whatsappNumber = "5583986668183";
      const encoded = encodeURIComponent(text);
      const url = `https://wa.me/${whatsappNumber}?text=${encoded}`;

      // Abre o WhatsApp numa nova aba
      window.open(url, "_blank");
    });
  }

  // 7. Navegação Suave (Smooth Anchor Scroll via Lenis.scrollTo)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          
          // Se o botão for de seleção de pacote, seleciona a opção no formulário de contato automaticamente!
          if (anchor.dataset.package) {
            const selectEl = document.getElementById('service');
            if (selectEl) {
              selectEl.value = anchor.dataset.package;
            }
          }

          // Executar rolagem suave ultra-fluida via Lenis
          lenis.scrollTo(targetElement, {
            offset: -60,       // Deslocamento para não cobrir sob o header
            duration: 1.6,     // Duração mais longa e elegante
            easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t) // Easing de desaceleração suave (Exponential Out)
          });
        }
      }
    });
  });

  // 8. Lógica do Menu Hambúrguer Mobile
  const mobileToggle = document.getElementById("mobile-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      mobileToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Fechar menu ao clicar em qualquer link
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileToggle.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }
});
