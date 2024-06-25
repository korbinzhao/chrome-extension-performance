import { withErrorBoundary, withSuspense } from '@chrome-extension-matter-perf/shared';
import { ConfigProvider, Button } from 'antd';
import Topbar from './components/Topbar';
import UserInput from './components/UserInput/index';
import AnalysisResult from './components/AnalysisResult/index';

import '@src/Panel.css';
import { useEffect, useState } from 'react';
import usePort from './hooks/usePort';
import { VcpInfo } from '@src/types/vcp';

console.log('this is panel');

const Panel = () => {
  const port = usePort();
  const [resources, setResources] = useState([]);
  const [vcpInfo, setVcpInfo] = useState<VcpInfo>();
  const [vcpResult, setVcpResult] = useState();

  useEffect(() => {
    // Listen for messages from the background script
    port.onMessage.addListener(msg => {
      console.log('panel onMessage', msg);

      if (msg.type === 'resources') {
        setResources(msg.data);
      } else if (msg.type === 'vcp') {
        setVcpResult(msg.data);
      }
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
            }}>
            拉取资源
          </Button>
          <Button
            type="primary"
            onClick={async () => {
              console.log('send message in Panel');

              port.postMessage({ type: 'vcpAnalysis', data: vcpInfo });
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
