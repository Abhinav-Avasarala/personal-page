(async function () {
  const qs = (sel) => document.querySelector(sel);

  async function loadJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return res.json();
  }

  function renderProfile(profile) {
    if (qs('#name')) qs('#name').textContent = profile.name;
    if (qs('#tagline')) qs('#tagline').textContent = profile.tagline;
    if (qs('#hero-photo')) {
      const wrap = qs('#hero-photo');
      if (profile.photo) {
        const img = document.createElement('img');
        img.src = profile.photo;
        img.alt = `${profile.name} headshot`;
        wrap.appendChild(img);
        wrap.style.display = 'block';
      }
    }
    if (qs('#location')) qs('#location').textContent = profile.location;
    if (qs('#headline')) qs('#headline').textContent = profile.headline;
    if (qs('#about-text')) qs('#about-text').textContent = profile.about;
    if (qs('#resume-link')) {
      qs('#resume-link').href = profile.contact.resume || '#';
      qs('#resume-link').textContent = 'Resume';
    }
    if (qs('#email-link')) qs('#email-link').href = `mailto:${profile.contact.email || ''}`;
    if (qs('#linkedin-link')) {
      qs('#linkedin-link').href = profile.contact.linkedin || '#';
      qs('#linkedin-link').textContent = profile.contact.linkedin && profile.contact.linkedin !== '#' ? 'LinkedIn' : 'Add LinkedIn URL';
    }
    if (qs('#github-link')) {
      qs('#github-link').href = profile.contact.github || '#';
      qs('#github-link').textContent = profile.contact.github ? profile.contact.github.replace('https://', '') : 'Add GitHub URL';
    }

    if (qs('#skills-grid')) {
      const grid = qs('#skills-grid');
      profile.skills.forEach((group) => {
        const card = document.createElement('div');
        card.className = 'card';
        const h = document.createElement('h3');
        h.textContent = group.title;
        const ul = document.createElement('ul');
        ul.className = 'list';
        group.items.forEach((i) => {
          const li = document.createElement('li');
          li.textContent = i;
          ul.appendChild(li);
        });
        card.appendChild(h);
        card.appendChild(ul);
        grid.appendChild(card);
      });
    }

    if (qs('#experience-list')) {
      const wrap = qs('#experience-list');
      profile.experience.forEach((exp) => {
        const item = document.createElement('div');
        item.className = 'experience-card';
        const title = document.createElement('h3');
        title.textContent = `${exp.role} · ${exp.company}`;
        const meta = document.createElement('div');
        meta.className = 'meta';
        meta.textContent = `${exp.timeframe} • ${exp.location}`;
        const ul = document.createElement('ul');
        ul.className = 'list';
        exp.bullets.forEach((b) => {
          const li = document.createElement('li');
          li.textContent = b;
          ul.appendChild(li);
        });
        const tags = document.createElement('div');
        tags.className = 'stack';
        (exp.tags || []).forEach((t) => {
          const pill = document.createElement('div');
          pill.className = 'pill';
          pill.textContent = t;
          tags.appendChild(pill);
        });
        const footer = document.createElement('div');
        footer.className = 'experience-footer';
        footer.appendChild(tags);
        const deepDiveUrl = exp.detailLink && exp.detailLink !== '#'
          ? exp.detailLink
          : exp.deepDive && exp.id
            ? `experience.html?id=${encodeURIComponent(exp.id)}`
            : null;
        if (deepDiveUrl) {
          const dive = document.createElement('a');
          dive.className = 'link-pill';
          dive.href = deepDiveUrl;
          dive.textContent = 'Deep dive';
          footer.appendChild(dive);
        }
        item.append(title, meta, ul, footer);
        wrap.appendChild(item);
      });
    }

    if (qs('#education-block')) {
      const wrap = qs('#education-block');
      const ed = profile.education;
      const item = document.createElement('div');
      item.className = 'item';
      const title = document.createElement('h3');
      title.textContent = `${ed.degree} · ${ed.school}`;
      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = `${ed.timeframe} • ${ed.location}`;
      const ul = document.createElement('ul');
      ul.className = 'list';
      (ed.bullets || []).forEach((b) => {
        const li = document.createElement('li');
        li.textContent = b;
        ul.appendChild(li);
      });
      item.append(title, meta, ul);
      wrap.appendChild(item);
    }
  }

  function renderExperienceDetail(profile) {
    const container = qs('#experience-detail');
    if (!container) return;
    const experiences = profile.experience || [];
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const exp = experiences.find((e) => e.id === id) || experiences.find((e) => e.deepDive) || experiences[0];
    if (!exp) {
      container.textContent = 'Experience not found.';
      return;
    }

    const dive = exp.deepDive || {};
    container.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'detail-header';

    const h1 = document.createElement('h1');
    h1.textContent = dive.title || `${exp.role} · ${exp.company}`;
    header.appendChild(h1);

    const metaRow = document.createElement('div');
    metaRow.className = 'meta-row';
    const metaParts = [
      dive.timeframe || exp.timeframe,
      dive.location || exp.location
    ].filter(Boolean);
    metaParts.forEach((part) => {
      const pill = document.createElement('span');
      pill.className = 'meta-pill';
      pill.textContent = part;
      metaRow.appendChild(pill);
    });
    if (metaRow.children.length) header.appendChild(metaRow);

    container.appendChild(header);

    if (dive.summary || exp.bullets?.length) {
      const lead = document.createElement('p');
      lead.className = 'lead';
      lead.textContent = dive.summary || exp.bullets[0];
      container.appendChild(lead);
    }

    const narrative = dive.body || exp.bullets || [];
    if (narrative.length) {
      const section = document.createElement('div');
      section.className = 'detail-section';
      const h3 = document.createElement('h3');
      h3.textContent = 'How I approached it';
      const list = document.createElement('ul');
      list.className = 'point-list';
      narrative.forEach((paragraph) => {
        if (!paragraph) return;
        const li = document.createElement('li');
        li.textContent = paragraph;
        list.appendChild(li);
      });
      section.append(h3, list);
      container.appendChild(section);
    }

    const focusItems = dive.focusAreas || exp.bullets || [];
    if (focusItems.length) {
      const focus = document.createElement('div');
      focus.className = 'detail-section';
      const h3 = document.createElement('h3');
      h3.textContent = 'Focus areas';
      const grid = document.createElement('div');
      grid.className = 'focus-grid';
      focusItems.forEach((f) => {
        const item = document.createElement('div');
        item.className = 'focus-chip';
        item.textContent = f;
        grid.appendChild(item);
      });
      focus.append(h3, grid);
      container.appendChild(focus);
    }

    if ((exp.tags || []).length) {
      const tags = document.createElement('div');
      tags.className = 'tag-row';
      exp.tags.forEach((t) => {
        const pill = document.createElement('div');
        pill.className = 'pill';
        pill.textContent = t;
        tags.appendChild(pill);
      });
      container.appendChild(tags);
    }
  }

  function renderProjects(projects) {
    if (!qs('#project-cards')) return;
    const grid = qs('#project-cards');
    const visibleProjects = projects.filter((p) => !p.hidden);
    visibleProjects.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      if (p.image) {
        const img = document.createElement('img');
        img.className = 'project-image';
        img.src = p.image;
        img.alt = `${p.title} cover`;
        card.appendChild(img);
      }
      const body = document.createElement('div');
      body.className = 'project-body';
      const title = document.createElement('h3');
      title.textContent = p.title;
      const time = document.createElement('div');
      time.className = 'time';
      time.textContent = p.timeframe;
      const summary = document.createElement('p');
      summary.textContent = p.summary;
      const outcome = document.createElement('div');
      outcome.className = 'highlight';
      outcome.textContent = p.outcome;
      const stack = document.createElement('div');
      stack.className = 'stack';
      (p.stack || []).forEach((s) => {
        const pill = document.createElement('div');
        pill.className = 'pill';
        pill.textContent = s;
        stack.appendChild(pill);
      });
      const cta = document.createElement('div');
      cta.className = 'cta';
      const detail = document.createElement('a');
      detail.className = 'link-pill';
      detail.href = `project.html?id=${encodeURIComponent(p.id)}`;
      detail.textContent = 'Deep dive';
      cta.appendChild(detail);
      if (p.links?.repo && p.links.repo !== '#') {
        const repo = document.createElement('a');
        repo.className = 'link-pill';
        repo.href = p.links.repo;
        repo.target = '_blank';
        repo.rel = 'noopener';
        repo.textContent = 'Repo';
        cta.appendChild(repo);
      }
      body.append(title, time, summary, outcome, stack, cta);
      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  function renderProjectDetail(projects) {
    const container = qs('#project-detail');
    if (!container) return;
    const visibleProjects = projects.filter((p) => !p.hidden);
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const project = projects.find((p) => p.id === id) || visibleProjects[0] || projects[0];
    if (!project) {
      container.textContent = 'Project not found.';
      return;
    }
    container.innerHTML = '';
    if (project.image) {
      const img = document.createElement('img');
      img.className = 'cover';
      img.src = project.image;
      img.alt = `${project.title} cover`;
      container.appendChild(img);
    }
    const h1 = document.createElement('h1');
    h1.textContent = project.title;
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = project.timeframe;
    const summary = document.createElement('p');
    summary.textContent = project.summary;
    const outcome = document.createElement('div');
    outcome.className = 'highlight';
    outcome.textContent = project.outcome;

    const stack = document.createElement('div');
    stack.className = 'stack';
    (project.stack || []).forEach((s) => {
      const pill = document.createElement('div');
      pill.className = 'pill';
      pill.textContent = s;
      stack.appendChild(pill);
    });

    const highlights = document.createElement('div');
    const h2 = document.createElement('h3');
    h2.textContent = 'Highlights';
    const ul = document.createElement('ul');
    (project.highlights || []).forEach((h) => {
      const li = document.createElement('li');
      li.textContent = h;
      ul.appendChild(li);
    });
    highlights.append(h2, ul);

    const lessons = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.textContent = 'Lessons & Notes';
    const ul2 = document.createElement('ul');
    (project.lessons || []).forEach((l) => {
      const li = document.createElement('li');
      li.textContent = l;
      ul2.appendChild(li);
    });
    lessons.append(h3, ul2);

    const links = document.createElement('div');
    links.className = 'cta';
    if (project.links?.demo && project.links.demo !== '#') {
      const demo = document.createElement('a');
      demo.className = 'link-pill';
      demo.href = project.links.demo;
      demo.target = '_blank';
      demo.rel = 'noopener';
      demo.textContent = 'Demo';
      links.appendChild(demo);
    }
    if (project.links?.repo && project.links.repo !== '#') {
      const repo = document.createElement('a');
      repo.className = 'link-pill';
      repo.href = project.links.repo;
      repo.target = '_blank';
      repo.rel = 'noopener';
      repo.textContent = 'Repo';
      links.appendChild(repo);
    }

    container.append(h1, meta, summary, outcome, stack, highlights, lessons, links);
  }

  function renderCertifications(profile) {
    if (!qs('#cert-grid')) return;
    const grid = qs('#cert-grid');
    (profile.certifications || []).forEach((c) => {
      const card = document.createElement('div');
      card.className = 'cert-card';
      const title = document.createElement('h3');
      title.textContent = c.title;
      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = [c.issuer, c.date].filter(Boolean).join(' • ');
      card.append(title, meta);
      if (c.link && c.link !== '#') {
        const link = document.createElement('a');
        link.className = 'link-pill';
        link.href = c.link;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = 'Show credential';
        card.appendChild(link);
      }
      grid.appendChild(card);
    });
  }

  try {
    const profile = await loadJSON('data/profile.json');
    renderProfile(profile);
    renderCertifications(profile);
    renderExperienceDetail(profile);
  } catch (err) {
    console.error(err);
  }

  let projects = [];
  try {
    projects = await loadJSON('data/projects.json');
    renderProjects(projects);
    renderProjectDetail(projects);
  } catch (err) {
    console.error(err);
  }
})();
