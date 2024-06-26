import { useEffect, useState } from 'react';

const onMessage = function (msg: string) {
  console.log('recieved message from playground', msg);
};

export default function usePort() {
  console.log('run usePort');

  const [port, setPort] = useState(chrome.runtime.connect({ name: 'devtools' }));

  useEffect(() => {
    port.onDisconnect.addListener(() => {
      console.warn('port devtools disconnected, retry connect!!!');
      const _port = chrome.runtime.connect({ name: 'devtools' });
      setPort(_port);
    });

    port.onMessage.addListener(onMessage);

    console.log('use Port useEffect port', port);

    return port.onMessage.removeListener(onMessage);
  }, [port]);

  return port;
}
