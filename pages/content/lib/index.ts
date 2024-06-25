import { analysisPerformanceByVCP, postResources } from './performance';

window.addEventListener('load', () => {
  console.log('content load');

  const port = chrome.runtime.connect({ name: 'content' });

  setTimeout(() => {
    postResources(port);
  }, 1000);

  port.onMessage.addListener(message => {
    console.log('contentjs onMessage', message);

    const { resourceUrl, timestamp, interfaceUrl } = message.data;

    let data;

    switch (message.type) {
      case 'vcpAnalysis':
        data = analysisPerformanceByVCP(resourceUrl, timestamp, interfaceUrl);

        port.postMessage({ type: 'vcp', data });
        break;
      case 'getResources':
        postResources(port);
        break;
    }
  });
});
