import { withErrorBoundary, withSuspense } from '@chrome-extension-matter-perf/shared';
import { ConfigProvider, Button } from 'antd';
import Topbar from './components/Topbar';
import UserInput from './components/UserInput/index';
import AnalysisResult from './components/AnalysisResult/index';
// import usePort from './hooks/usePort';
// import { performanceStorage } from '@chrome-extension-matter-perf/storage';

import '@src/Panel.css';
import { useEffect } from 'react';

let port = chrome.runtime.connect({ name: 'devtools' });

port.onDisconnect.addListener(function () {
  console.warn('port disconnect');
  // 重连
  port = chrome.runtime.connect({ name: 'devtools' });
});

console.log('this is panel log');

const Panel = () => {
  // const { postMessage } = usePort();

  useEffect(() => {
    // Listen for messages from the background script
    port.onMessage.addListener(message => {
      // if (message.type === 'updatePanel') {
      // Update the panel with the received performance data
      // updatePanel(message.data);
      console.log('panel onMessage', message);
      // }
    });
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#000',
        },
      }}>
      <Topbar />
      <div className="p-8">
        <UserInput />
        <Button
          onClick={async () => {
            console.log('send message in Panel');

            // const resources = await performanceStorage.get();

            // console.log('resources', resources);

            port.postMessage('hello');

            // postMessage('aaa');
          }}>
          Send Message
        </Button>
        <div className="border-b"></div>
        <AnalysisResult />
      </div>
    </ConfigProvider>
  );
};

export default withErrorBoundary(withSuspense(Panel, <div> Loading ... </div>), <div> Error Occur </div>);
