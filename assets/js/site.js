(function () {
  var themeButton = document.querySelector('.theme-toggle');
  var themeColor = document.querySelector('meta[name="theme-color"]');
  var handwriting = document.querySelector('[data-handwriting]');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setTheme(theme) {
    var isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (themeColor) themeColor.setAttribute('content', isDark ? '#212121' : '#faf9f5');
    if (!themeButton) return;
    themeButton.querySelector('span').textContent = isDark ? '☀️' : '🌙';
    themeButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    themeButton.setAttribute('aria-pressed', String(isDark));
    themeButton.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }

  setTheme('light');
  if (themeButton) {
    themeButton.addEventListener('click', function () {
      setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  function startHandwriting() {
    if (!handwriting) return;

    var text = handwriting.getAttribute('data-handwriting');
    var characters = Array.from(text);
    handwriting.textContent = '';
    handwriting.setAttribute('aria-label', text);

    characters.forEach(function (character) {
      var span = document.createElement('span');
      span.className = 'handwritten-char';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = character;
      handwriting.appendChild(span);
    });

    var pen = document.createElement('span');
    pen.className = 'pen-cursor';
    pen.setAttribute('aria-hidden', 'true');
    pen.innerHTML = '<i class="ti ti-pencil"></i>';
    handwriting.appendChild(pen);
    handwriting.classList.add('ready');

    var spans = handwriting.querySelectorAll('.handwritten-char');
    if (reduceMotion) {
      spans.forEach(function (span) { span.classList.add('inked'); });
      handwriting.classList.add('complete');
      return;
    }

    handwriting.classList.add('writing');
    var index = 0;

    function writeCharacter() {
      if (index >= spans.length) {
        window.setTimeout(function () {
          handwriting.classList.remove('writing');
          handwriting.classList.add('complete');
        }, 420);
        return;
      }

      var character = spans[index];
      character.classList.add('inked');
      var x = character.offsetLeft + character.offsetWidth - (pen.offsetWidth * 0.25);
      var y = character.offsetTop + (character.offsetHeight * 0.58);
      pen.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(-28deg)';
      index += 1;
      window.setTimeout(writeCharacter, character.textContent === ' ' ? 38 : 78);
    }

    window.setTimeout(writeCharacter, 320);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(startHandwriting);
  } else {
    startHandwriting();
  }

  var menuButton = document.querySelector('.menu-toggle');
  var navigation = document.querySelector('.nav-links');

  if (menuButton && navigation) {
    menuButton.addEventListener('click', function () {
      var isOpen = navigation.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.querySelector('i').className = isOpen ? 'ti ti-x' : 'ti ti-menu-2';
    });

    navigation.addEventListener('click', function (event) {
      if (!event.target.closest('a')) return;
      navigation.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.querySelector('i').className = 'ti ti-menu-2';
    });
  }

  var clientTrack = document.querySelector('.client-track');
  var clientLogoSet = clientTrack && clientTrack.querySelector('.client-logo-set');
  if (clientTrack && clientLogoSet) {
    var clientLogoClone = clientLogoSet.cloneNode(true);
    clientLogoClone.setAttribute('aria-hidden', 'true');
    clientLogoClone.removeAttribute('role');
    clientLogoClone.querySelectorAll('[role="listitem"]').forEach(function (item) {
      item.removeAttribute('role');
    });
    clientLogoClone.querySelectorAll('img').forEach(function (image) {
      image.alt = '';
    });
    clientTrack.appendChild(clientLogoClone);
  }

  var galleryPhotos = document.querySelectorAll('.experience-gallery figure');
  galleryPhotos.forEach(function (photo) {
    function toggleColor() {
      var shouldActivate = !photo.classList.contains('is-color');
      galleryPhotos.forEach(function (item) { item.classList.remove('is-color'); });
      if (shouldActivate) photo.classList.add('is-color');
    }

    photo.addEventListener('click', function () {
      toggleColor();
      photo.blur();
    });
    photo.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toggleColor();
    });
  });

  var revealElements = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(function (element) { element.classList.add('in'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px' });

  revealElements.forEach(function (element) { observer.observe(element); });
})();
