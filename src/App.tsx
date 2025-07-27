import React, { useRef } from 'react';
import { useThreeJS } from './hooks/useThreeJS';
import { Toolbar } from './components/Toolbar';
import { ModelToolPanel } from './components/ModelToolPanel';
import { ProjectTree } from './components/ProjectTree';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Viewport } from './components/Viewport';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    addModel,
    deleteModel,
    updateModelProperty,
    selectModel,
    toggleAssistantMode,
    models,
    selectedModel,
    assistantMode,
  } = useThreeJS(containerRef);

  const handleUndo = () => {
    console.log('撤销操作');
  };

  const handleRedo = () => {
    console.log('重做操作');
  };

  const handleSave = () => {
    const sceneData = {
      models: models.map(model => ({
        id: model.id,
        name: model.name,
        type: model.type,
        category: model.category,
        properties: model.properties,
      })),
      assistantMode,
    };
    
    const dataStr = JSON.stringify(sceneData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scene.json';
    link.click();
    
    URL.revokeObjectURL(url);
    console.log('场景已保存');
  };

  const handleExport = () => {
    handleSave();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const sceneData = JSON.parse(e.target?.result as string);
            console.log('导入场景数据:', sceneData);
            // 这里可以添加导入逻辑
          } catch (error) {
            console.error('导入失败:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      <Toolbar
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        onExport={handleExport}
        onImport={handleImport}
        assistantMode={assistantMode}
        onToggleAssistantMode={toggleAssistantMode}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <ProjectTree
          models={models}
          selectedModel={selectedModel}
          onSelectModel={selectModel}
        />
        
        <ModelToolPanel
          onAddModel={addModel}
          assistantMode={assistantMode}
          onToggleAssistantMode={toggleAssistantMode}
        />
        
        <Viewport 
          containerRef={containerRef}
          assistantMode={assistantMode}
          selectedModel={selectedModel}
        />
        
        <PropertiesPanel
          selectedModel={selectedModel}
          models={models}
          onUpdateProperty={updateModelProperty}
          onDeleteModel={deleteModel}
          onSelectModel={selectModel}
          assistantMode={assistantMode}
        />
      </div>
    </div>
  );
}

export default App;