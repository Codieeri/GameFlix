// Fetch screenshots from Steam API asynchronously
try {
  const result = await fetchScreenshots(game.id);
  if (result.screenshots && result.screenshots.length > 0) {
    const ssSection = document.getElementById('detail-screenshots-section');
    if (ssSection) {
      ssSection.style.display = '';
      const ssContainer = ssSection.querySelector('.gf-detail-screenshots');
      if (ssContainer) {
        ssContainer.innerHTML = result.screenshots.map((s: any) =>
          `<img src="${s.path_thumbnail}" alt="Screenshot" onclick="window._openLightbox('${s.path_full}')" loading="lazy" style="cursor:pointer;border-radius:6px;transition:transform .2s">`
        ).join('');
      }
    }
  }
  if (result.fullDescription) {
    const descEl = document.getElementById('detail-full-desc');
    if (descEl) {
      descEl.innerHTML = result.fullDescription;
      descEl.style.display = '';
    }
  }
} catch(e) {}