import { Input, Button } from 'antd';

export default function UserInput() {
  return (
    <div className="w-[600px] pb-4 text-sm">
      <div className="flex items-center mb-2">
        <span className="w-[180px]">VCP 资源地址:</span>
        <Input />
      </div>
      <div className="flex items-center mb-4">
        <span className="w-[180px]">VCP 时间戳 (ms):</span>
        <Input />
      </div>
      <Button type="primary">分析</Button>
    </div>
  );
}
