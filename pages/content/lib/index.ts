import { analysisPerformanceByVCP, postResources } from './performance';

window.addEventListener('load', () => {
  console.log('content load');

  const port = chrome.runtime.connect({ name: 'content' });

  setTimeout(() => {
    postResources(port);
  }, 1000);

  port.onMessage.addListener(message => {
    console.log('contentjs onMessage', message);

    if (message.type === 'vcpAnalysis') {
      const { resourceUrl, timestamp, interfaceUrl } = message.data;

      const data = analysisPerformanceByVCP(resourceUrl, timestamp, interfaceUrl);

      port.postMessage({ type: 'vcp', data });
    } else if (message.type === 'getResources') {
      postResources(port);
    }
  });
});
