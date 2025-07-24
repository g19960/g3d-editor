import React from 'react';
import { Undo2, Redo2, Save, Download, Upload, Eye, EyeOff } from 'lucide-react';

interface ToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onExport: () => void;
  onImport: () => void;
  assistantMode: boolean;
  onToggleAssistantMode: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onUndo,
  onRedo,
  onSave,
  onExport,
  onImport,
  assistantMode,
  onToggleAssistantMode,
}) => {
  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center gap-2">
      <div className="flex items-center gap-1">
        <button
          onClick={onUndo}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          title="撤销"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={onRedo}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          title="重做"
        >
          <Redo2 size={18} />
        </button>
      </div>
      
      <div className="w-px h-6 bg-gray-600 mx-2" />
      
      <div className="flex items-center gap-1">
        <button
          onClick={onSave}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          title="保存场景"
        >
          <Save size={18} />
        </button>
        <button
          onClick={onExport}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          title="导出场景"
        >
          <Download size={18} />
        </button>
        <button
          onClick={onImport}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          title="导入场景"
        >
          <Upload size={18} />
        </button>
      </div>
      
      <div className="w-px h-6 bg-gray-600 mx-2" />
      
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleAssistantMode}
          className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
            assistantMode
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
          title={assistantMode ? '关闭辅助模式' : '开启辅助模式'}
        >
          {assistantMode ? <Eye size={16} /> : <EyeOff size={16} />}
          <span>{assistantMode ? '辅助模式' : '辅助模式'}</span>
        </button>
      </div>
      
      <div className="flex-1" />
      
      <div className="text-sm text-gray-400">
        3D 模型编辑器 v2.0
      </div>
    </div>
  );
};
</parameter>