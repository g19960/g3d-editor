import React, { useState } from 'react';
import { Box, Circle, Cylinder, Square, Plus, ChevronDown, ChevronRight } from 'lucide-react';

interface ModelCategory {
  id: string;
  name: string;
  models: Array<{
    type: 'cube' | 'sphere' | 'cylinder' | 'plane';
    icon: React.ComponentType<any>;
    label: string;
  }>;
}

interface ModelToolPanelProps {
  onAddModel: (type: 'cube' | 'sphere' | 'cylinder' | 'plane', category: string) => void;
  assistantMode: boolean;
  onToggleAssistantMode: () => void;
}

export const ModelToolPanel: React.FC<ModelToolPanelProps> = ({
  onAddModel,
  assistantMode,
  onToggleAssistantMode,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['basic', 'advanced']));

  const modelCategories: ModelCategory[] = [
    {
      id: 'basic',
      name: '基础模型',
      models: [
        { type: 'cube', icon: Box, label: '立方体' },
        { type: 'sphere', icon: Circle, label: '球体' },
      ],
    },
    {
      id: 'advanced',
      name: '高级模型',
      models: [
        { type: 'cylinder', icon: Cylinder, label: '圆柱体' },
        { type: 'plane', icon: Square, label: '平面' },
      ],
    },
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white font-semibold text-lg">模型工具</h2>
      </div>
      
      {/* 辅助模式控制 */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">辅助模式</span>
          <button
            onClick={onToggleAssistantMode}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              assistantMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            {assistantMode ? '开启' : '关闭'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {assistantMode ? '点击模型可选中并拖拽移动' : '辅助功能已关闭'}
        </p>
      </div>

      {/* 模型分类 */}
      <div className="flex-1 overflow-y-auto">
        {modelCategories.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          
          return (
            <div key={category.id} className="border-b border-gray-700">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700 transition-colors"
              >
                <span className="text-gray-300 font-medium">{category.name}</span>
                {isExpanded ? (
                  <ChevronDown size={16} className="text-gray-400" />
                ) : (
                  <ChevronRight size={16} className="text-gray-400" />
                )}
              </button>
              
              {isExpanded && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-2 gap-2">
                    {category.models.map((model) => (
                      <button
                        key={model.type}
                        onClick={() => onAddModel(model.type, category.name)}
                        className="flex flex-col items-center gap-2 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group"
                      >
                        <model.icon 
                          size={24} 
                          className="text-gray-300 group-hover:text-white transition-colors" 
                        />
                        <span className="text-xs text-gray-300 group-hover:text-white transition-colors">
                          {model.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-500">
          <p>操作提示：</p>
          <p className="mt-1">• 点击模型图标添加到场景</p>
          <p>• 开启辅助模式后可拖拽移动</p>
          <p>• 鼠标拖拽旋转视角</p>
          <p>• 滚轮缩放场景</p>
        </div>
      </div>
    </div>
  );
};