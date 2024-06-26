import { analysisPerformanceByVCP, postResources } from './performance';
import cache from './cache';

const port = chrome.runtime.connect({ name: 'content' });

port.onMessage.addListener(message => {
  console.log('contentjs onMessage2', message);

  if (message.type === 'vcpAnalysis') {
    const { resourceUrl, timestamp, interfaceUrl } = message.data;

    const data = analysisPerformanceByVCP(resourceUrl, timestamp, interfaceUrl);

    port.postMessage({ type: 'vcp', data });
  } else if (message.type === 'getResources') {
    postResources(port);
  }
});

window.addEventListener('load', () => {
  console.log('content load');

  setTimeout(() => {
    const resources = performance.getEntriesByType('resource');
    cache.set('resources', resources);
    postResources(port);
  }, 1000);
});
