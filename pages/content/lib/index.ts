window.addEventListener('load', () => {
  console.log('content load');

  const port = chrome.runtime.connect({ name: 'content' });

  port.onMessage.addListener(message => {
    console.log('contentjs onMessage', message);

    const perfData = {
      longTasks: performance.getEntriesByType('longtask'),
      networkRequests: performance.getEntriesByType('resource'),
    };

    port.postMessage({ type: 'performanceData', data: perfData });
  });
});
