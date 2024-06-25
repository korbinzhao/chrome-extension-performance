import { Table } from 'antd';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';

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

const columns = [
  { key: 'no', title: 'no', dataIndex: 'no' },
  { key: 'name', title: 'name', dataIndex: 'name' },
  { key: 'initiatorType', title: 'initiatorType', dataIndex: 'initiatorType' },
  { key: 'startTime', title: 'startTime', dataIndex: 'startTime' },
  { key: 'duration', title: 'duration', dataIndex: 'duration' },
  { key: 'renderBlockingStatus', title: 'renderBlockingStatus', dataIndex: 'renderBlockingStatus' },
  { key: 'responseEnd', title: 'responseEnd', dataIndex: 'responseEnd' },
];

export default function AnalysisResult({ resources, result }: AnalysisResultProps) {
  return (
    <div>
      <div>
        <div className="text-lg mb-2 font-medium">Result:</div>
        <JsonView className="h-[300px] overflow-y-auto" src={result} />
      </div>
      <div>
        <div className="text-lg mb-2 font-medium">Resources:</div>
        <Table
          columns={columns}
          dataSource={resources.map((item, index) => {
            return { ...item, no: index + 1 };
          })}
          pagination={{ pageSize: 20 }}
          size="small"
        />
      </div>
    </div>
  );
}
