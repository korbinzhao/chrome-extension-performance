// import { performanceStorage } from '@chrome-extension-matter-perf/storage';

// Send performance entries to the background script
// function sendPerformanceData() {
//   const perfData = {
//     longTasks: performance.getEntriesByType('longtask'),
//     networkRequests: performance.getEntriesByType('resource')
//   };

//   chrome.runtime.sendMessage({ type: 'performanceData', data: perfData });

//   console.log('sendPerformanceData', perfData);

//   performanceStorage.set(perfData)
// }

// sendPerformanceData();

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
