let longTasks: PerformanceEntry[] = [];

export function analysisPerformanceByVCP(vcpResourceUrl: string, vcp: number) {
  const resources = performance.getEntriesByType('resource');

  const vcpResource = resources.find(resource => resource.name === vcpResourceUrl);

  if (!vcpResource) {
    console.warn('Cannot find key resource', vcpResourceUrl);
    return null;
  }

  const resourcesBeforeVcpResourceFetch = resources.filter(resource => resource.startTime < vcpResource.startTime);
  const resourcesBetweenVcpResourceLoadAndVcp = resources.filter(resource => {
    const endTime = resource.startTime + resource.duration;
    if (endTime > vcpResource.startTime + vcpResource.duration && resource.startTime < vcp) {
      return true;
    }
    return false;
  });

  // const longTasks = performance.getEntriesByType('longtask');

  const longTasksBeforeVcpResourceFetch = longTasks.filter(task => task.startTime < vcpResource.startTime);
  const longTasksBetweenVcpResourceLoadAndVcp = longTasks.filter(task => {
    const endTime = task.startTime + task.duration;
    if (endTime > vcpResource.startTime + vcpResource.duration && task.startTime < vcp) {
      return true;
    }
    return false;
  });

  return {
    vcpResource,
    resourcesBeforeVcpResourceFetch,
    resourcesBetweenVcpResourceLoadAndVcp,
    longTasksBeforeVcpResourceFetch,
    longTasksBetweenVcpResourceLoadAndVcp,
  };
}

export function longTaskObserver() {
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
