try {
  console.log("Edit 'pages/devtools/src/index.ts' and save to reload.");
  chrome.devtools.panels.create('Matter Perf', 'icon-34.png', 'devtools-panel/index.html');
} catch (e) {
  console.error(e);
}
