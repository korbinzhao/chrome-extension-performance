import { useEffect, useState, useMemo } from 'react';
import { InputNumber, Select } from 'antd';
import { VcpInfo } from '@src/types/vcp';

interface UserInputProps {
  resources: { [key: string]: string }[];
  onChange?: (value: VcpInfo) => void;
}

const VIP_INFO_KEYS = {
  resourceUrl: 'MATTER_PERF_RESOURCE_URL',
  timestamp: 'MATTER_PERF_TIMESTAMP',
  interfaceUrl: 'MATTER_PERF_INTERFACE_URL',
};

export default function UserInput({ resources, onChange }: UserInputProps) {
  const INIT_VALUES = {
    resourceUrl: localStorage.getItem(VIP_INFO_KEYS.resourceUrl) || '',
    timestamp: localStorage.getItem(VIP_INFO_KEYS.timestamp) || '',
    interfaceUrl: localStorage.getItem(VIP_INFO_KEYS.interfaceUrl) || '',
  };

  const [vcpInfo, setVcpInfo] = useState<VcpInfo>(INIT_VALUES);

  useEffect(() => {
    onChange?.(vcpInfo);

    if (vcpInfo) {
      localStorage.setItem(VIP_INFO_KEYS.resourceUrl, vcpInfo.resourceUrl);
      localStorage.setItem(VIP_INFO_KEYS.timestamp, vcpInfo.timestamp);
      localStorage.setItem(VIP_INFO_KEYS.interfaceUrl, vcpInfo.interfaceUrl);
    }
  }, [vcpInfo, onChange]);

  const resourcesOptions = useMemo(() => {
    return resources.map((resource, index) => {
      return {
        key: `${resource.name}_${resource.startTime}`,
        label: `${index + 1}. ${resource.name} - ${resource.startTime}`,
        value: resource.name,
      };
    });
  }, [resources]);

  return (
    <div className="w-[1000px] text-sm">
      <div className="flex items-center mb-2">
        <span className="w-[180px]">VCP 资源地址:</span>
        <Select
          className="w-[800px]"
          value={vcpInfo?.resourceUrl}
          showSearch
          options={resourcesOptions}
          onChange={value => {
            setVcpInfo({ ...vcpInfo, resourceUrl: value });
          }}
        />
      </div>
      <div className="flex items-center mb-4">
        <span className="w-[180px]">VCP 时间戳 (ms):</span>
        <InputNumber
          className="w-[200px]"
          value={vcpInfo?.timestamp}
          onChange={value => {
            setVcpInfo({
              ...vcpInfo,
              timestamp: value || '',
            });
          }}
        />
      </div>
      <div className="flex items-center mb-4">
        <span className="w-[180px]">VCP 接口地址:</span>
        <Select
          className="w-[800px]"
          value={vcpInfo?.interfaceUrl}
          options={resourcesOptions}
          showSearch
          onChange={value => {
            setVcpInfo({ ...vcpInfo, interfaceUrl: value });
          }}
        />
      </div>
    </div>
  );
}
