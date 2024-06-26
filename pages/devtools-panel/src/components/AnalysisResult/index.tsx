import { Table, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import JsonView from 'react-json-view';

interface Resource {
  name: string;
  initiatorType: string;
  deliveryType: string;
  startTime: number;
  requestStart: number;
  responseStart: number;
  responseStatus: number;
  responseEnd: number;
  renderBlockingStatus: string;
  duration: number;
}

interface AnalysisResultProps {
  resources: Resource[];
  result: { [key: string]: string | number } | undefined;
}

const columns: ColumnsType<Resource> = [
  { key: 'no', title: 'no', dataIndex: 'no' },
  {
    key: 'name',
    title: 'name',
    dataIndex: 'name',
    render: value => <span className="w-[400px] inline-block">{value}</span>,
  },
  { key: 'initiatorType', title: 'initiatorType', dataIndex: 'initiatorType' },
  { key: 'startTime', title: 'startTime', dataIndex: 'startTime' },
  { key: 'duration', title: 'duration', dataIndex: 'duration' },
  { key: 'responseEnd', title: 'responseEnd', dataIndex: 'responseEnd' },
  { key: 'renderBlockingStatus', title: 'renderBlockingStatus', dataIndex: 'renderBlockingStatus' },
];

export default function AnalysisResult({ resources, result }: AnalysisResultProps) {
  const [searchKey, setSearchKey] = useState<string>('');

  const onSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target?.value);
  }, []);

  const handledResources = useMemo(() => {
    const resourcesWithNo = resources.map((item, index) => {
      return { ...item, no: index + 1 };
    });

    if (!searchKey) return resourcesWithNo;

    return resourcesWithNo.filter(item => item.name.includes(searchKey));
  }, [searchKey, resources]);

  return (
    <div>
      <div>
        <div className="text-lg mb-2 font-medium">Result:</div>
        <div className="h-[600px] overflow-y-auto">
          <JsonView src={result || {}} collapsed />
        </div>
      </div>
      <div>
        <div className="text-lg mb-4 font-medium">Resources({resources.length}):</div>
        <Input className="mb-2 w-[800px]" placeholder="Search" onChange={onSearch} />
        <Table
          rowKey={record => `${record.name}_${record.startTime}`}
          columns={columns}
          dataSource={handledResources}
          pagination={{ pageSize: 100 }}
          size="small"
        />
      </div>
    </div>
  );
}
