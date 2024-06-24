import { analysisPerformanceByVCP, longTaskObserver } from './performance';

const vcpResourceUrl = 'https://g.alicdn.com/aone/aonepro-web-next-resource/0.0.419/js/pipeline.js';
const vcp = 5500;

window.addEventListener('load', () => {
  console.log('content load');

  longTaskObserver();

  const port = chrome.runtime.connect({ name: 'content' });

  port.onMessage.addListener(message => {
    console.log('contentjs onMessage', message);

    const perfData = analysisPerformanceByVCP(vcpResourceUrl, vcp);

    port.postMessage({ type: 'performanceData', data: perfData });
  });
});
