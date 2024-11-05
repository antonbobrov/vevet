export const viewportCssVarsScript = `var updateVevetViewport = function update() {
  if (window.vevetApp) {
    return;
  }

  var w = window.innerWidth;
  var h = window.innerHeight;
  var sh = document.documentElement.clientHeight;

  document.documentElement.style.setProperty('--vw', w / 100 + "px");
  document.documentElement.style.setProperty('--vh', h / 100 + "px");
  document.documentElement.style.setProperty('--svh', sh / 100 + "px");
};

window.addEventListener('resize', updateVevetViewport);

updateVevetViewport();`;
