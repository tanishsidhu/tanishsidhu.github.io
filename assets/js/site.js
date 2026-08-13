(function () {
  var themeColor = document.querySelector('meta[name="theme-color"]');
  var systemTheme = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var handwriting = document.querySelector('[data-handwriting]');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setTheme(theme) {
    var isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (themeColor) themeColor.setAttribute('content', isDark ? '#212121' : '#faf9f5');
  }

  function revealSite() {
    document.documentElement.classList.add('site-revealed');
  }

  setTheme(systemTheme && systemTheme.matches ? 'dark' : 'light');
  if (systemTheme) {
    var syncSystemTheme = function (event) {
      setTheme(event.matches ? 'dark' : 'light');
    };
    if (systemTheme.addEventListener) {
      systemTheme.addEventListener('change', syncSystemTheme);
    } else if (systemTheme.addListener) {
      systemTheme.addListener(syncSystemTheme);
    }
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
      revealSite();
      return;
    }

    handwriting.classList.add('writing');
    var index = 0;

    function finishHandwriting() {
      handwriting.classList.remove('writing');
      handwriting.classList.add('complete');
      revealSite();
    }

    function writeCharacter() {
      if (index >= spans.length) {
        finishHandwriting();
        return;
      }

      var character = spans[index];
      character.classList.add('inked');
      var x = character.offsetLeft + character.offsetWidth - (pen.offsetWidth * 0.25);
      var y = character.offsetTop + (character.offsetHeight * 0.58);
      pen.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(-28deg)';
      index += 1;
      if (index >= spans.length) {
        finishHandwriting();
        return;
      }
      window.setTimeout(writeCharacter, character.textContent === ' ' ? 38 : 78);
    }

    window.setTimeout(writeCharacter, 320);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(startHandwriting);
  } else {
    startHandwriting();
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

  var projectCards = document.querySelectorAll('.project-card');
  var projectDialog = document.querySelector('#project-dialog');
  if (projectDialog && projectCards.length) {
    var projectDialogType = projectDialog.querySelector('#project-dialog-type');
    var projectDialogTitle = projectDialog.querySelector('#project-dialog-title');
    var projectDialogDescription = projectDialog.querySelector('#project-dialog-description');
    var projectDialogMeta = projectDialog.querySelector('#project-dialog-meta');
    var projectDialogLinks = projectDialog.querySelector('#project-dialog-links');
    var projectDialogVisual = projectDialog.querySelector('#project-dialog-visual');
    var projectDialogClose = projectDialog.querySelector('.project-dialog-close');
    var activeProjectCard = null;

    function closeProjectDialog() {
      if (projectDialog.open && typeof projectDialog.close === 'function') {
        projectDialog.close();
      } else {
        projectDialog.removeAttribute('open');
        if (activeProjectCard) activeProjectCard.focus();
      }
    }

    function openProjectDialog(card) {
      var copy = card.querySelector('.project-copy');
      var visual = card.querySelector('.project-visual');
      if (!copy) return;

      activeProjectCard = card;
      projectDialogType.textContent = copy.querySelector('.project-type').textContent;
      projectDialogTitle.textContent = copy.querySelector('h3').textContent;
      projectDialogDescription.textContent = copy.querySelector('.project-description').textContent;
      projectDialogMeta.textContent = copy.querySelector('.project-meta').textContent;
      projectDialogLinks.replaceChildren();
      projectDialogVisual.replaceChildren();

      var links = copy.querySelector('.project-links');
      if (links) projectDialogLinks.appendChild(links.cloneNode(true));
      if (visual) projectDialogVisual.appendChild(visual.cloneNode(true));

      if (typeof projectDialog.showModal === 'function') {
        projectDialog.showModal();
      } else {
        projectDialog.setAttribute('open', '');
      }
      projectDialogClose.focus();
    }

    projectCards.forEach(function (card) {
      card.addEventListener('click', function (event) {
        var interactiveTarget = event.target.closest && event.target.closest('a, button');
        if (interactiveTarget) return;
        openProjectDialog(card);
      });

      card.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openProjectDialog(card);
      });
    });

    projectDialogClose.addEventListener('click', closeProjectDialog);
    projectDialog.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      closeProjectDialog();
    });
    projectDialog.addEventListener('click', function (event) {
      if (event.target === projectDialog) closeProjectDialog();
    });
    projectDialog.addEventListener('close', function () {
      if (activeProjectCard) activeProjectCard.focus();
    });
  }

  var experienceCards = document.querySelectorAll('.experience-card');
  var experienceDialog = document.querySelector('#experience-dialog');
  if (experienceDialog && experienceCards.length) {
    var experienceDialogTitle = experienceDialog.querySelector('#experience-dialog-title');
    var experienceDialogSummary = experienceDialog.querySelector('#experience-dialog-summary');
    var experienceDialogBody = experienceDialog.querySelector('#experience-dialog-body');
    var experienceDialogClose = experienceDialog.querySelector('.experience-dialog-close');
    var activeExperienceCard = null;

    function closeExperienceDialog() {
      if (experienceDialog.open && typeof experienceDialog.close === 'function') {
        experienceDialog.close();
      } else {
        experienceDialog.removeAttribute('open');
        if (activeExperienceCard) activeExperienceCard.focus();
      }
    }

    function openExperienceDialog(card) {
      var source = card.querySelector('.experience-card-source');
      if (!source) return;

      activeExperienceCard = card;
      experienceDialogTitle.textContent = card.getAttribute('data-experience-title');
      experienceDialogSummary.textContent = card.getAttribute('data-experience-summary');
      experienceDialogBody.replaceChildren();

      var content = source.firstElementChild && source.firstElementChild.cloneNode(true);
      if (content) {
        content.removeAttribute('id');
        experienceDialogBody.appendChild(content);
      }

      if (typeof experienceDialog.showModal === 'function') {
        experienceDialog.showModal();
      } else {
        experienceDialog.setAttribute('open', '');
      }
      experienceDialogClose.focus();
    }

    experienceCards.forEach(function (card) {
      card.addEventListener('click', function (event) {
        var interactiveTarget = event.target.closest && event.target.closest('a, button');
        if (interactiveTarget) return;
        openExperienceDialog(card);
      });

      card.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openExperienceDialog(card);
      });
    });

    experienceDialogClose.addEventListener('click', closeExperienceDialog);
    experienceDialog.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      closeExperienceDialog();
    });
    experienceDialog.addEventListener('click', function (event) {
      if (event.target === experienceDialog) closeExperienceDialog();
    });
    experienceDialog.addEventListener('close', function () {
      if (activeExperienceCard) activeExperienceCard.focus();
    });
  }


  // Tanish on the Beat overlay
  var beatButtons = document.querySelectorAll('.hero-beat-link, .off-clock-link');
  var beatDialog = document.querySelector('#beat-dialog');
  if (beatButtons.length && beatDialog) {
    var activeBeatButton = null;
    var beatDialogClose = beatDialog.querySelector('.beat-dialog-close');
    var beatDialogLoading = beatDialog.querySelector('.beat-dialog-loading');
    var beatFrame = beatDialog.querySelector('.beat-dialog-iframe');

    function openBeatDialog(event) {
      activeBeatButton = event.currentTarget;
      if (typeof beatDialog.showModal === 'function') {
        beatDialog.showModal();
      } else {
        beatDialog.setAttribute('open', '');
      }
      beatDialogClose.focus();
    }

    function closeBeatDialog() {
      if (beatDialog.open && typeof beatDialog.close === 'function') {
        beatDialog.close();
      } else {
        beatDialog.removeAttribute('open');
      }
      if (activeBeatButton) activeBeatButton.focus();
    }

    beatButtons.forEach(function (beatButton) {
      beatButton.addEventListener('click', openBeatDialog);
    });
    beatDialogClose.addEventListener('click', closeBeatDialog);
    beatDialog.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      closeBeatDialog();
    });
    beatDialog.addEventListener('click', function (event) {
      if (event.target === beatDialog) closeBeatDialog();
    });
    beatDialog.addEventListener('close', function () {
      if (activeBeatButton) activeBeatButton.focus();
    });
    if (beatFrame) {
      beatFrame.addEventListener('load', function () {
        if (beatDialogLoading) beatDialogLoading.style.display = 'none';
      });
    }
  }

  // Section scroll arrows flip when the next section is active
  var scrollArrows = document.querySelectorAll('.scroll-arrow');
  var arrowSections = Array.prototype.map.call(document.querySelectorAll('.section[id]'), function (el) {
    return el;
  });

  function flipArrows() {
    var threshold = window.innerHeight * 0.34;
    var active = null;
    for (var i = 0; i < arrowSections.length; i += 1) {
      var rect = arrowSections[i].getBoundingClientRect();
      if (rect.top <= threshold && rect.bottom > 0) active = arrowSections[i];
    }
    scrollArrows.forEach(function (arrow) {
      var next = arrow.getAttribute('data-next');
      if (active && active.id === next) {
        arrow.classList.add('flipped');
      } else {
        arrow.classList.remove('flipped');
      }
    });
  }

  if (scrollArrows.length) {
    var sectionIds = Array.prototype.map.call(arrowSections, function (s) { return s.id; });
    scrollArrows.forEach(function (arrow) {
      arrow.addEventListener('click', function () {
        var next = arrow.getAttribute('data-next');
        if (arrow.classList.contains('flipped')) {
          var idx = sectionIds.indexOf(next);
          var prev = idx > 0 ? sectionIds[idx - 1] : 'top';
          var target = prev === 'top' ? document.getElementById('top') : document.getElementById(prev);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          var target = document.getElementById(next);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
    window.addEventListener('scroll', flipArrows, { passive: true });
    window.addEventListener('resize', flipArrows);
    flipArrows();
  }


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
