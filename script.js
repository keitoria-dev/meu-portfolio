const projects = [
  {
    name: 'Âmbar Café',
    text: 'Site de cafeteria com visual quente e cardápio em destaque.',
    url: 'https://keitoria-dev.github.io/ambar-cafe/'
  },
  {
    name: 'Malva Acessórios',
    text: 'Loja de joias e bijuterias em tons de lilás.',
    url: 'https://keitoria-dev.github.io/malva-acessorios/'
  },
  {
    name: 'Autopeças',
    text: 'Landing page para loja de peças e serviços automotivos.',
    url: 'https://keitoria-dev.github.io/projeto-autopecas/'
  },
  {
    name: 'Casa Rossa',
    text: 'Página gastronômica pensada para dar vontade de reservar.',
    url: 'https://keitoria-dev.github.io/projeto-casa-rossa/'
  },
  {
    name: 'Moura Advocacia',
    text: 'Site institucional sóbrio, com contato rápido por WhatsApp.',
    url: 'https://keitoria-dev.github.io/projeto-moura-advocacia/'
  },
  {
    name: 'Glacê Confeitaria',
    text: 'Vitrine de bolos e doces com pedidos direto no WhatsApp.',
    url: 'https://keitoria-dev.github.io/projeto-glace-confeitaria/'
  },
  {
    name: 'Declaração Romântica',
    text: 'Página interativa para declarar o que as palavras não alcançam.',
    url: 'https://keitoria-dev.github.io/declara-o-romantica/'
  },
  {
    name: 'Tela de Login',
    text: 'Estudo de interface para autenticação, simples e clara.',
    url: 'https://keitoria-dev.github.io/projeto-login/'
  }
];

const frameBaseWidth = 1280;

function renderProjects() {
  const grid = document.getElementById('projectGrid');

  grid.innerHTML = projects.map(function (project, index) {
    const delay = (index % 2) * 90;

    return `
      <article class="project reveal" style="transition-delay: ${delay}ms;">
        <div class="frame">
          <div class="bar"><span></span><span></span><span></span></div>
          <div class="screen">
            <iframe data-src="${project.url}" title="Prévia do site ${project.name}" tabindex="-1" loading="lazy" sandbox="allow-scripts allow-same-origin"></iframe>
            <a class="cover" href="${project.url}" target="_blank" rel="noopener" aria-label="Abrir ${project.name}"></a>
          </div>
        </div>
        <div class="info">
          <div>
            <h3>${project.name}</h3>
            <p>${project.text}</p>
          </div>
          <a class="btn-arrow" href="${project.url}" target="_blank" rel="noopener" aria-label="Visitar ${project.name}">
            <p>Visitar</p>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l-1.4 1.4 5.6 5.6H4v2h12.2l-5.6 5.6L12 20l8-8z"></path></svg>
          </a>
        </div>
      </article>
    `;
  }).join('');
}

function fitFrame(screen) {
  const iframe = screen.querySelector('iframe');
  const scale = screen.clientWidth / frameBaseWidth;

  iframe.style.width = frameBaseWidth + 'px';
  iframe.style.height = (screen.clientHeight / scale) + 'px';
  iframe.style.transform = 'scale(' + scale + ')';
}

function loadFrame(iframe) {
  iframe.addEventListener('load', function () {
    iframe.classList.add('loaded');
  });
  iframe.src = iframe.dataset.src;
}

function initFrames() {
  const screens = document.querySelectorAll('.screen');
  const supportsObservers = 'IntersectionObserver' in window && 'ResizeObserver' in window;

  screens.forEach(fitFrame);

  if (!supportsObservers) {
    screens.forEach(function (screen) {
      loadFrame(screen.querySelector('iframe'));
    });
    return;
  }

  const resizeObserver = new ResizeObserver(function (entries) {
    entries.forEach(function (entry) {
      fitFrame(entry.target);
    });
  });

  const loadObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        loadFrame(entry.target.querySelector('iframe'));
        loadObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '300px 0px' });

  screens.forEach(function (screen) {
    resizeObserver.observe(screen);
    loadObserver.observe(screen);
  });
}

function initReveal() {
  const items = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    items.forEach(function (item) {
      item.classList.add('visible');
    });
    return;
  }

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(function (item) {
    revealObserver.observe(item);
  });
}

function initCards() {
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('click', function () {
      card.classList.toggle('flipped');
    });

    card.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });
}

function initStars() {
  const canvas = document.getElementById('stars');
  const context = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const density = window.innerWidth < 720 ? 90 : 200;
  const speed = 0.6;
  const twinkle = 0.6;
  const colors = ['#7c3aed', '#b58cff', '#ffffff'];
  const fullCircle = Math.PI * 2;
  let width = 0;
  let height = 0;
  let stars = [];

  function fit() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createStars() {
    stars = Array.from({ length: density }, function () {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        layer: Math.floor(Math.random() * 3),
        phase: Math.random() * fullCircle
      };
    });
  }

  function draw(time) {
    context.clearRect(0, 0, width, height);

    stars.forEach(function (star) {
      const depth = star.layer + 1;
      const flicker = 1 - twinkle * (0.5 + 0.5 * Math.sin(time * 2 + star.phase));

      star.x -= speed * depth * 0.4;

      if (star.x < 0) {
        star.x += width;
        star.y = Math.random() * height;
      }

      context.globalAlpha = (0.2 + depth * 0.22) * flicker;
      context.fillStyle = colors[star.layer];
      context.beginPath();
      context.arc(star.x, star.y, 0.5 + depth * 0.5, 0, fullCircle);
      context.fill();
    });

    context.globalAlpha = 1;
  }

  const startTime = performance.now();

  function loop() {
    draw((performance.now() - startTime) / 1000);
    requestAnimationFrame(loop);
  }

  fit();
  createStars();

  window.addEventListener('resize', function () {
    fit();

    if (reduceMotion) {
      draw(0);
    }
  });

  if (reduceMotion) {
    draw(0);
  } else {
    loop();
  }
}

function initHeroPreview() {
  const frame = document.getElementById('heroFrame');
  const cover = document.getElementById('heroCover');
  const label = document.getElementById('heroName');
  const tabs = document.getElementById('heroTabs');
  const featured = projects.slice(0, 4);

  tabs.innerHTML = featured.map(function (project, index) {
    const active = index === 0 ? ' active' : '';

    return `<button type="button" class="hero-tab${active}" data-index="${index}">${project.name}</button>`;
  }).join('');

  tabs.addEventListener('click', function (event) {
    const button = event.target.closest('.hero-tab');

    if (!button) {
      return;
    }

    const project = featured[Number(button.dataset.index)];

    tabs.querySelectorAll('.hero-tab').forEach(function (tab) {
      tab.classList.toggle('active', tab === button);
    });

    frame.classList.remove('loaded');
    frame.addEventListener('load', function () {
      frame.classList.add('loaded');
    }, { once: true });
    frame.src = project.url;

    cover.href = project.url;
    cover.setAttribute('aria-label', 'Abrir ' + project.name);
    label.textContent = project.name;
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const model = document.getElementById('model');
  const pickField = document.getElementById('pickField');
  const pick = document.getElementById('pick');
  const phone = '5585988149571';

  pick.innerHTML = projects.map(function (project) {
    return `<option value="${project.name}">${project.name}</option>`;
  }).join('');

  model.addEventListener('change', function () {
    const showPick = model.selectedIndex === 1;

    pickField.hidden = !showPick;
    pick.required = showPick;
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const details = document.getElementById('details').value.trim();
    const chosen = pickField.hidden ? '' : ' (' + pick.value + ')';
    const lines = [
      'Olá! Vim pelo seu portfólio e quero um orçamento.',
      'Nome: ' + document.getElementById('name').value.trim(),
      'Negócio: ' + document.getElementById('business').value.trim(),
      'Modelo: ' + model.value + chosen,
      details ? 'Detalhes: ' + details : ''
    ].filter(Boolean);

    const link = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(lines.join('\n'));

    window.open(link, '_blank', 'noopener');
  });
}

initStars();
renderProjects();
initHeroPreview();
initContactForm();
initFrames();
initReveal();
initCards();

document.getElementById('year').textContent = new Date().getFullYear();