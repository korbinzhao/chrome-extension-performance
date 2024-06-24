import { withErrorBoundary, withSuspense } from '@chrome-extension-matter-perf/shared';
import { ConfigProvider, Button } from 'antd';
import Topbar from './components/Topbar';
import UserInput from './components/UserInput/index';
import AnalysisResult from './components/AnalysisResult/index';

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
  useEffect(() => {
    // Listen for messages from the background script
    port.onMessage.addListener(message => {
      console.log('panel onMessage', message);
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

            port.postMessage('hello');
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
