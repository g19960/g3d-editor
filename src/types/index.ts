export interface ModelObject {
  id: string;
  name: string;
  mesh: THREE.Mesh;
  type: 'cube' | 'sphere' | 'cylinder' | 'plane';
  category: string;
  isSelected: boolean;
  isAssistantMode: boolean;
  properties: {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
    color: string;
  };
}

export interface ProjectNode {
  id: string;
  name: string;
  type: 'folder' | 'model';
  children?: ProjectNode[];
  modelId?: string;
  category?: string;
  isExpanded?: boolean;
}

export interface ModelCategory {
  id: string;
  name: string;
  icon: string;
  models: ModelObject[];
}
</parameter>