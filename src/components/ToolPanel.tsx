import React from 'react';
import { Box, Circle, Cylinder, Square } from 'lucide-react';

interface ToolPanelProps {
  onAddObject: (type: 'cube' | 'sphere' | 'cylinder' | 'plane') => void;
}

export const ToolPanel: React.FC<ToolPanelProps> = ({ onAddObject }) => {
  const tools = [
    { type: 'cube' as const, icon: Box, label: '立方体' },
    { type: 'sphere' as const, icon: Circle, label: '球体' },
    { type: 'cylinder' as const, icon: Cylinder, label: '圆柱体' },
    { type: 'plane' as const, icon: Square, label: '平面' },
  ];

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white font-semibold text-lg">工具面板</h2>
      </div>
      
      <div className="p-4">
        <h3 className="text-gray-300 text-sm font-medium mb-3">基本几何体</h3>
        <div className="grid grid-cols-2 gap-2">
          {tools.map((tool) => (
            <button
              key={tool.type}
              onClick={() => onAddObject(tool.type)}
              className="flex flex-col items-center gap-2 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group"
            >
              <tool.icon 
                size={24} 
                className="text-gray-300 group-hover:text-white transition-colors" 
              />
              <span className="text-xs text-gray-300 group-hover:text-white transition-colors">
                {tool.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-700 mt-auto">
        <div className="text-xs text-gray-500">
          <p>提示：</p>
          <p className="mt-1">• 鼠标拖拽旋转视角</p>
          <p>• 滚轮缩放场景</p>
          <p>• 点击对象进行选择</p>
        </div>
      </div>
    </div>
  );
};