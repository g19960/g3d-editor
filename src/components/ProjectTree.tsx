import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, File, Box, Circle, Cylinder, Square } from 'lucide-react';
import { ModelObject, ProjectNode } from '../types';

interface ProjectTreeProps {
  models: ModelObject[];
  selectedModel: ModelObject | null;
  onSelectModel: (model: ModelObject) => void;
}

export const ProjectTree: React.FC<ProjectTreeProps> = ({
  models,
  selectedModel,
  onSelectModel,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root', 'models']));

  // 根据模型分类生成项目树结构
  const projectTree = useMemo(() => {
    const categories = new Map<string, ModelObject[]>();
    
    models.forEach(model => {
      const category = model.category || '未分类';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(model);
    });

    const categoryNodes: ProjectNode[] = Array.from(categories.entries()).map(([categoryName, categoryModels]) => ({
      id: `category_${categoryName}`,
      name: categoryName,
      type: 'folder',
      category: categoryName,
      children: categoryModels.map(model => ({
        id: model.id,
        name: model.name,
        type: 'model',
        modelId: model.id,
      })),
    }));

    return {
      id: 'root',
      name: '项目资源',
      type: 'folder' as const,
      children: [
        {
          id: 'models',
          name: '模型资源',
          type: 'folder' as const,
          children: categoryNodes,
        },
      ],
    };
  }, [models]);

  const toggleExpanded = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const getModelIcon = (type: string) => {
    switch (type) {
      case 'cube': return Box;
      case 'sphere': return Circle;
      case 'cylinder': return Cylinder;
      case 'plane': return Square;
      default: return File;
    }
  };

  const handleNodeClick = (node: ProjectNode) => {
    if (node.type === 'folder') {
      toggleExpanded(node.id);
    } else if (node.type === 'model' && node.modelId) {
      const model = models.find(m => m.id === node.modelId);
      if (model) {
        onSelectModel(model);
      }
    }
  };

  const renderNode = (node: ProjectNode, level: number = 0): React.ReactNode => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = node.type === 'model' && selectedModel?.id === node.modelId;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-700 transition-colors ${
            isSelected ? 'bg-blue-600 text-white' : 'text-gray-300'
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => handleNodeClick(node)}
        >
          {hasChildren && (
            <button className="p-0.5 hover:bg-gray-600 rounded">
              {isExpanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
          )}
          
          {!hasChildren && <div className="w-5" />}
          
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {node.type === 'folder' ? (
              isExpanded ? (
                <FolderOpen size={16} className="text-blue-400 flex-shrink-0" />
              ) : (
                <Folder size={16} className="text-blue-400 flex-shrink-0" />
              )
            ) : (
              (() => {
                const model = models.find(m => m.id === node.modelId);
                const IconComponent = model ? getModelIcon(model.type) : File;
                return <IconComponent size={16} className="text-green-400 flex-shrink-0" />;
              })()
            )}
            
            <span className="text-sm truncate">{node.name}</span>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white font-semibold text-lg">项目资源</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {renderNode(projectTree)}
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-500">
          <p>项目统计：</p>
          <p className="mt-1">• 模型总数: {models.length}</p>
          <p>• 已选中: {selectedModel ? 1 : 0}</p>
        </div>
      </div>
    </div>
  );
};
</parameter>