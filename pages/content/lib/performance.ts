import cache from './cache';
import { message } from 'antd';

let longTasks: PerformanceEntry[] = [];

let resourcesObserved = [];

export function analysisPerformanceByVCP(resourceUrl: string, timestamp: number, interfaceUrl: string) {
  // const resources = performance.getEntriesByType('resource');
  const resources = cache.get('resources') || performance.getEntriesByType('resource');

  const vcpResource = resources.find(resource => resource.name === resourceUrl);
  const vcpInterface = resources.find(resource => resource.name === interfaceUrl);

  if (!vcpResource) {
    console.warn('Cannot find key resource', resourceUrl);
    return { resources, message: `Cannot find key resource: ${resourceUrl}` };
  }

  const resourcesBeforeVcpResourceFetch = resources.filter(resource => resource.startTime < vcpResource.startTime);
  const resourcesBetweenVcpResourceLoadAndVcp = resources.filter(resource => {
    const endTime = resource.startTime + resource.duration;
    if (endTime > vcpResource.startTime + vcpResource.duration && resource.startTime < timestamp) {
      return true;
    }
    return false;
  });

  const longTasksBeforeVcpResourceFetch = longTasks.filter(task => task.startTime < vcpResource.startTime);
  const longTasksBetweenVcpResourceLoadAndVcp = longTasks.filter(task => {
    const endTime = task.startTime + task.duration;
    if (endTime > vcpResource.startTime + vcpResource.duration && task.startTime < timestamp) {
      return true;
    }
    return false;
  });

  let vcpInterfaceDelayAfterVcpResourceLoad;
  let vcpDelayAfterVcpInterfaceLoad;

  if (vcpInterface) {
    vcpInterfaceDelayAfterVcpResourceLoad = vcpInterface.startTime - vcpResource.startTime - vcpResource.duration;
    vcpDelayAfterVcpInterfaceLoad = timestamp - vcpInterface.startTime - vcpInterface.duration;
  }

  const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  return {
    version: 'v1',
    message: !vcpInterface ? `vcp 接口不存在: ${interfaceUrl}` : 'success',
    vcpTimestamp: timestamp,
    vcpResource,
    vcpInterface,
    stages: {
      ttfb: timing.responseStart,
      vcpResourceDelay: vcpResource.startTime - timing.responseStart,
      vcpResourceDuration: vcpResource.duration,
      vcpInterfaceDelay: vcpInterface?.startTime
        ? vcpInterface?.startTime - vcpResource.startTime - vcpResource.duration
        : null,
      vcpInterfaceDuration: vcpInterface?.duration,
      vcpDelay: vcpInterface?.startTime ? timestamp - vcpInterface.startTime - vcpInterface.duration : null,
      vcpRenderDelay: timestamp - vcpResource.startTime - vcpResource.duration,
    },
    timing,
    resourcesBeforeVcpResourceFetch,
    resourcesBetweenVcpResourceLoadAndVcp,
    longTasksBeforeVcpResourceFetch,
    longTasksBetweenVcpResourceLoadAndVcp,
    vcpInterfaceDelayAfterVcpResourceLoad,
    vcpDelayAfterVcpInterfaceLoad,
    resources,
  };
}

export function postResources(port: chrome.runtime.Port) {
  // let resources = performance.getEntriesByType('resource');
  let resources = cache.get('resources') || performance.getEntriesByType('resource');
  resources = resources.sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
  port.postMessage({ type: 'resources', data: resources });
}

function longTaskObserver() {
  longTasks = [];

  const observer = new PerformanceObserver(list => {
    list.getEntries().forEach(entry => {
      console.log('--- longtask ---', entry);

      longTasks.push(entry);
    });
  });

  observer.observe({ type: 'longtask', buffered: true });

  return longTasks;
}

longTaskObserver();

function resourcesObserver() {
  resourcesObserved = [];
  const observer = new PerformanceObserver(list => {
    list.getEntries().forEach(entry => {
      console.log('--- resource ---', entry?.name);
      resourcesObserved.push(entry);
    });
  });
  observer.observe({ type: 'resource', buffered: true });
}

resourcesObserver();
