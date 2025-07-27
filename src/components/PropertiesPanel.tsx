import React from 'react';
import { ModelObject } from '../types';
import { Trash2, Settings } from 'lucide-react';

interface PropertiesPanelProps {
  selectedModel: ModelObject | null;
  models: ModelObject[];
  onUpdateProperty: (id: string, property: string, value: any) => void;
  onDeleteModel: (id: string) => void;
  onSelectModel: (model: ModelObject | null) => void;
  assistantMode: boolean;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedModel,
  models,
  onUpdateProperty,
  onDeleteModel,
  onSelectModel,
  assistantMode,
}) => {
  const formatNumber = (value: number) => Math.round(value * 100) / 100;

  const getModelsByCategory = () => {
    const categories = new Map<string, ModelObject[]>();
    models.forEach(model => {
      const category = model.category || '未分类';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(model);
    });
    return categories;
  };

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Settings size={18} className="text-gray-400" />
          <h2 className="text-white font-semibold text-lg">属性面板</h2>
        </div>
      </div>
      
      {/* 模型管理 */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-gray-300 text-sm font-medium mb-3">模型管理</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {Array.from(getModelsByCategory().entries()).map(([category, categoryModels]) => (
            <div key={category}>
              <div className="text-xs text-gray-500 font-medium mb-1 px-2">
                {category} ({categoryModels.length})
              </div>
              {categoryModels.map((model) => (
                <div
                  key={model.id}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                    selectedModel?.id === model.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => onSelectModel(model)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`w-2 h-2 rounded-full ${
                      model.isSelected && assistantMode ? 'bg-green-400' : 'bg-gray-500'
                    }`} />
                    <span className="text-sm truncate">{model.name}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteModel(model.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ))}
          {models.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">
              场景中没有模型
            </p>
          )}
        </div>
      </div>

      {/* 选中模型属性编辑 */}
      {selectedModel && (
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-3 h-3 rounded-full ${
              selectedModel.isSelected && assistantMode ? 'bg-green-400' : 'bg-gray-500'
            }`} />
            <h3 className="text-gray-300 text-sm font-medium">
              {selectedModel.name}
            </h3>
          </div>
          
          <div className="space-y-4">
            {/* 基本信息 */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">基本信息</label>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">类型</label>
                  <div className="px-2 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600">
                    {selectedModel.type}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">分类</label>
                  <div className="px-2 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600">
                    {selectedModel.category}
                  </div>
                </div>
              </div>
            </div>

            {/* 位置 */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">位置坐标</label>
              <div className="grid grid-cols-3 gap-2">
                {['X', 'Y', 'Z'].map((axis, index) => (
                  <div key={axis}>
                    <label className="block text-xs text-gray-500 mb-1">{axis}</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formatNumber(selectedModel.properties.position[axis.toLowerCase() as 'x' | 'y' | 'z'])}
                      onChange={(e) => onUpdateProperty(
                        selectedModel.id,
                        `position${axis}`,
                        parseFloat(e.target.value)
                      )}
                      className="w-full px-2 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 旋转 */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">旋转角度 (弧度)</label>
              <div className="grid grid-cols-3 gap-2">
                {['X', 'Y', 'Z'].map((axis, index) => (
                  <div key={axis}>
                    <label className="block text-xs text-gray-500 mb-1">{axis}</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formatNumber(selectedModel.properties.rotation[axis.toLowerCase() as 'x' | 'y' | 'z'])}
                      onChange={(e) => onUpdateProperty(
                        selectedModel.id,
                        `rotation${axis}`,
                        parseFloat(e.target.value)
                      )}
                      className="w-full px-2 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 缩放 */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">缩放比例</label>
              <div className="grid grid-cols-3 gap-2">
                {['X', 'Y', 'Z'].map((axis, index) => (
                  <div key={axis}>
                    <label className="block text-xs text-gray-500 mb-1">{axis}</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={formatNumber(selectedModel.properties.scale[axis.toLowerCase() as 'x' | 'y' | 'z'])}
                      onChange={(e) => onUpdateProperty(
                        selectedModel.id,
                        `scale${axis}`,
                        parseFloat(e.target.value)
                      )}
                      className="w-full px-2 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 材质颜色 */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">材质颜色</label>
              <input
                type="color"
                value={selectedModel.properties.color}
                onChange={(e) => onUpdateProperty(selectedModel.id, 'color', e.target.value)}
                className="w-full h-8 bg-gray-700 rounded border border-gray-600 cursor-pointer"
              />
            </div>

            {/* 状态信息 */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">状态信息</label>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">选中状态:</span>
                  <span className={selectedModel.isSelected ? 'text-green-400' : 'text-gray-400'}>
                    {selectedModel.isSelected ? '已选中' : '未选中'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">辅助模式:</span>
                  <span className={assistantMode ? 'text-green-400' : 'text-gray-400'}>
                    {assistantMode ? '开启' : '关闭'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!selectedModel && models.length > 0 && (
        <div className="p-4 flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-sm text-center">
            从左侧项目树或模型列表中<br />选择一个模型来编辑其属性
          </p>
        </div>
      )}
    </div>
  );
};