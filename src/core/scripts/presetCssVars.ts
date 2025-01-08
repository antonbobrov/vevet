export const presetCssVars = `var presetVevetCss = function update() {
  if (window.vevet5) {
    return;
  }

  var doc = document.documentElement;

  var styles = document.createElement('style');
  styles.id = 'vevet_css_preset';
  document.body.appendChild(styles);

  var w = window.innerWidth;
  var h = window.innerHeight;
  var sh = doc.clientHeight;

  styles.innerHTML = 'html { --vw: ' + w / 100 + 'px; --vh: ' + h / 100 + 'px; --svh: ' + sh / 100 + 'px; }';
};

window.addEventListener('resize', presetVevetCss);

presetVevetCss();`;
