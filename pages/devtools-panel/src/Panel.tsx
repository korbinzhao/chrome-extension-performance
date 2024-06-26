import { withErrorBoundary, withSuspense } from '@chrome-extension-matter-perf/shared';
import { ConfigProvider, Button, message } from 'antd';
import Topbar from './components/Topbar';
import UserInput from './components/UserInput/index';
import AnalysisResult from './components/AnalysisResult/index';

import '@src/Panel.css';
import { useEffect, useState } from 'react';
import { VcpInfo } from '@src/types/vcp';

const DEFAULT_PORT = chrome.runtime.connect({ name: 'devtools' });

const Panel = () => {
  const [port, setPort] = useState(DEFAULT_PORT);

  useEffect(() => {
    port.onDisconnect.addListener(() => {
      console.warn('Port disconnect', port);
      message.info('Port disconnect');
      const _port = chrome.runtime.connect({ name: 'devtools' });
      setPort(_port);
    });
  }, [port]);

  console.log('this is panel', port);

  const [resources, setResources] = useState([]);
  const [vcpInfo, setVcpInfo] = useState<VcpInfo>();
  const [vcpResult, setVcpResult] = useState();

  useEffect(() => {
    message.info('addListener to Port');

    // Listen for messages from the background script
    port.onMessage.addListener(msg => {
      console.log('panel onMessage', msg);

      message.info(`message recieved: ${msg.type}`);

      if (msg.type === 'resources') {
        setResources(msg.data);
      } else if (msg.type === 'vcp') {
        setVcpResult(msg.data);
      }
    });
  }, [port]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#000',
        },
      }}>
      <Topbar />
      <div className="p-8">
        <UserInput
          resources={resources}
          onChange={info => {
            setVcpInfo(info);
          }}
        />
        <div>
          <Button
            className="mr-2"
            onClick={async () => {
              console.log('send message in Panel');

              port.postMessage({ type: 'getResources' });
              message.info(`message send: getResources`);
            }}>
            拉取资源
          </Button>
          <Button
            type="primary"
            onClick={async () => {
              console.log('send message in Panel');

              port.postMessage({ type: 'vcpAnalysis', data: vcpInfo });
              message.info(`message send: vcpAnalysis`);
            }}>
            分析
          </Button>
        </div>

        <div className="border-b my-4"></div>
        <AnalysisResult resources={resources} result={vcpResult} />
      </div>
    </ConfigProvider>
  );
};

export default withErrorBoundary(withSuspense(Panel, <div> Loading ... </div>), <div> Error Occur </div>);
