let devtoolsPort: chrome.runtime.Port;
let contentPort: chrome.runtime.Port;

const onPort = function (port: chrome.runtime.Port) {
  console.log('--- onPort Connect in playground', port);

  if (port.name === 'devtools') {
    devtoolsPort = port;

    devtoolsPort.onMessage.addListener(function (msg) {
      console.log('recieve message in playground', msg);
      contentPort?.postMessage(msg);
      console.log('send message to content in playground', msg);
    });
  } else if (port.name === 'content') {
    contentPort = port;

    contentPort.onMessage.addListener(msg => {
      console.log('recieve message from content in playground', msg);
      devtoolsPort?.postMessage(msg);
      console.log('send message to devtools in playground', msg);
    });
  }
};

chrome.runtime.onConnect.addListener(onPort);

// 关键资源的URL（可以根据实际情况替换）
const KEY_RESOURCE_URL = 'path/to/your-key-resource.js';

// 查找浏览器加载的所有资源
const allResources = performance.getEntriesByType('resource');

// 识别关键资源
const keyResource = allResources.find(resource => resource.name.includes(KEY_RESOURCE_URL));

if (keyResource) {
  // 提取有关关键资源的性能信息
  console.log(`Key resource found: ${keyResource.name}`);
  console.log(`Start time: ${keyResource.startTime.toFixed(2)} ms`);
  console.log(`Duration: ${keyResource.duration.toFixed(2)} ms`);

  // 在关键资源加载前发生的请求
  const requestsBeforeKeyResource = allResources.filter(resource => resource.startTime < keyResource.startTime);

  // 求取最耗时的网络请求
  const longestRequest = requestsBeforeKeyResource.reduce((a, b) => (a.duration > b.duration ? a : b));

  console.log('The most time-consuming request before the key resource:');
  console.log(longestRequest);

  // 检查主线程任务
  const longTasks = performance.getEntriesByType('longtask');
  const longTasksBeforeKeyResource = longTasks.filter(task => task.startTime < keyResource.startTime);

  // 求取最耗时的主线程任务
  const longestTask = longTasksBeforeKeyResource.reduce((a, b) => (a.duration > b.duration ? a : b));

  console.log('The most time-consuming task on the main thread before the key resource:');
  console.log(longestTask);
} else {
  console.log('Key resource not found.');
}
