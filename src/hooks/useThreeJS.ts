import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ModelObject } from '../types';

export const useThreeJS = (containerRef: React.RefObject<HTMLDivElement>) => {
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const raycasterRef = useRef<THREE.Raycaster>();
  const mouseRef = useRef<THREE.Vector2>();
  
  const [models, setModels] = useState<ModelObject[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelObject | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [assistantMode, setAssistantMode] = useState(false);
  
  const animationFrameRef = useRef<number>();
  const dragPlaneRef = useRef<THREE.Plane>();
  const dragOffsetRef = useRef<THREE.Vector3>();

  // 初始化场景
  useEffect(() => {
    if (!containerRef.current) return;

    // 创建场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2a2a2a);
    sceneRef.current = scene;

    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 创建射线投射器和鼠标向量
    raycasterRef.current = new THREE.Raycaster();
    mouseRef.current = new THREE.Vector2();
    dragPlaneRef.current = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    dragOffsetRef.current = new THREE.Vector3();

    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // 添加网格和坐标轴
    const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0x444444);
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // 相机控制变量
    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    let cameraDistance = 8.66;
    let cameraTheta = Math.PI / 4;
    let cameraPhi = Math.PI / 4;

    // 鼠标事件处理
    const handleMouseDown = (event: MouseEvent) => {
      if (!mouseRef.current || !raycasterRef.current || !cameraRef.current) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(
        models.map(model => model.mesh)
      );

      if (intersects.length > 0) {
        // 选中模型
        const intersectedMesh = intersects[0].object as THREE.Mesh;
        const selectedModel = models.find(model => model.mesh === intersectedMesh);
        
        if (selectedModel) {
          setSelectedModel(selectedModel);
          setAssistantMode(true);
          setIsDragging(true);

          // 计算拖拽偏移
          const intersectionPoint = intersects[0].point;
          dragOffsetRef.current!.copy(intersectionPoint).sub(selectedModel.mesh.position);
          
          event.preventDefault();
          return;
        }
      }

      // 相机控制
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging && selectedModel && dragPlaneRef.current && raycasterRef.current && cameraRef.current) {
        // 模型拖拽
        const rect = renderer.domElement.getBoundingClientRect();
        mouseRef.current!.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current!.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        
        const intersectionPoint = new THREE.Vector3();
        raycasterRef.current.ray.intersectPlane(dragPlaneRef.current, intersectionPoint);
        
        if (intersectionPoint) {
          intersectionPoint.sub(dragOffsetRef.current!);
          selectedModel.mesh.position.copy(intersectionPoint);
          
          // 更新模型属性
          setModels(prev => prev.map(model => 
            model.id === selectedModel.id 
              ? {
                  ...model,
                  properties: {
                    ...model.properties,
                    position: {
                      x: intersectionPoint.x,
                      y: intersectionPoint.y,
                      z: intersectionPoint.z
                    }
                  }
                }
              : model
          ));
        }
        return;
      }

      if (!isMouseDown) return;

      // 相机旋转
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;

      cameraTheta -= deltaX * 0.01;
      cameraPhi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraPhi + deltaY * 0.01));

      mouseX = event.clientX;
      mouseY = event.clientY;

      updateCameraPosition();
    };

    const handleMouseUp = () => {
      isMouseDown = false;
      setIsDragging(false);
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      cameraDistance = Math.max(2, Math.min(50, cameraDistance + event.deltaY * 0.01));
      updateCameraPosition();
    };

    const updateCameraPosition = () => {
      const x = cameraDistance * Math.sin(cameraPhi) * Math.cos(cameraTheta);
      const y = cameraDistance * Math.cos(cameraPhi);
      const z = cameraDistance * Math.sin(cameraPhi) * Math.sin(cameraTheta);
      
      camera.position.set(x, y, z);
      camera.lookAt(0, 0, 0);
    };

    // 添加事件监听器
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel);

    // 动画循环
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // 更新选中模型的视觉效果
      models.forEach(model => {
        if (model.isSelected && assistantMode) {
          // 添加选中高亮效果
          const material = model.mesh.material as THREE.MeshLambertMaterial;
          material.emissive.setHex(0x333333);
        } else {
          const material = model.mesh.material as THREE.MeshLambertMaterial;
          material.emissive.setHex(0x000000);
        }
      });
      
      renderer.render(scene, camera);
    };
    animate();

    // 处理窗口大小变化
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [models, selectedModel, isDragging, assistantMode]);

  const addModel = useCallback((type: 'cube' | 'sphere' | 'cylinder' | 'plane', category: string = '基础模型') => {
    if (!sceneRef.current) return;

    let geometry: THREE.BufferGeometry;
    let name: string;

    switch (type) {
      case 'cube':
        geometry = new THREE.BoxGeometry(1, 1, 1);
        name = `立方体模型 ${models.length + 1}`;
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(0.5, 32, 32);
        name = `球体模型 ${models.length + 1}`;
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        name = `圆柱体模型 ${models.length + 1}`;
        break;
      case 'plane':
        geometry = new THREE.PlaneGeometry(2, 2);
        name = `平面模型 ${models.length + 1}`;
        break;
    }

    const material = new THREE.MeshLambertMaterial({
      color: Math.random() * 0xffffff,
    });

    const mesh = new THREE.Mesh(geometry, material);
    const position = {
      x: (Math.random() - 0.5) * 4,
      y: Math.random() * 2 + 0.5,
      z: (Math.random() - 0.5) * 4
    };
    
    mesh.position.set(position.x, position.y, position.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const modelObject: ModelObject = {
      id: `${type}_${Date.now()}`,
      name,
      mesh,
      type,
      category,
      isSelected: false,
      isAssistantMode: false,
      properties: {
        position,
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        color: `#${material.color.getHexString()}`,
      },
    };

    sceneRef.current.add(mesh);
    setModels(prev => [...prev, modelObject]);
  }, [models]);

  const deleteModel = useCallback((id: string) => {
    if (!sceneRef.current) return;

    const modelToDelete = models.find(model => model.id === id);
    if (modelToDelete) {
      sceneRef.current.remove(modelToDelete.mesh);
      modelToDelete.mesh.geometry.dispose();
      if (Array.isArray(modelToDelete.mesh.material)) {
        modelToDelete.mesh.material.forEach(mat => mat.dispose());
      } else {
        modelToDelete.mesh.material.dispose();
      }
      
      setModels(prev => prev.filter(model => model.id !== id));
      if (selectedModel?.id === id) {
        setSelectedModel(null);
        setAssistantMode(false);
      }
    }
  }, [models, selectedModel]);

  const updateModelProperty = useCallback((id: string, property: string, value: any) => {
    const model = models.find(model => model.id === id);
    if (!model) return;

    switch (property) {
      case 'positionX':
        model.mesh.position.x = value;
        break;
      case 'positionY':
        model.mesh.position.y = value;
        break;
      case 'positionZ':
        model.mesh.position.z = value;
        break;
      case 'rotationX':
        model.mesh.rotation.x = value;
        break;
      case 'rotationY':
        model.mesh.rotation.y = value;
        break;
      case 'rotationZ':
        model.mesh.rotation.z = value;
        break;
      case 'scaleX':
        model.mesh.scale.x = value;
        break;
      case 'scaleY':
        model.mesh.scale.y = value;
        break;
      case 'scaleZ':
        model.mesh.scale.z = value;
        break;
      case 'color':
        (model.mesh.material as THREE.MeshLambertMaterial).color.setHex(parseInt(value.replace('#', '0x')));
        break;
    }

    // 更新模型属性状态
    setModels(prev => prev.map(m => 
      m.id === id 
        ? {
            ...m,
            properties: {
              ...m.properties,
              position: {
                x: model.mesh.position.x,
                y: model.mesh.position.y,
                z: model.mesh.position.z
              },
              rotation: {
                x: model.mesh.rotation.x,
                y: model.mesh.rotation.y,
                z: model.mesh.rotation.z
              },
              scale: {
                x: model.mesh.scale.x,
                y: model.mesh.scale.y,
                z: model.mesh.scale.z
              },
              color: property === 'color' ? value : m.properties.color
            }
          }
        : m
    ));
  }, [models]);

  const selectModel = useCallback((model: ModelObject | null) => {
    // 清除之前选中的模型状态
    setModels(prev => prev.map(m => ({ ...m, isSelected: false })));
    
    if (model) {
      setSelectedModel(model);
      setAssistantMode(true);
      // 设置新选中的模型状态
      setModels(prev => prev.map(m => 
        m.id === model.id ? { ...m, isSelected: true } : m
      ));
    } else {
      setSelectedModel(null);
      setAssistantMode(false);
    }
  }, []);

  const toggleAssistantMode = useCallback(() => {
    setAssistantMode(prev => {
      const newMode = !prev;
      if (!newMode) {
        setSelectedModel(null);
        setModels(prev => prev.map(m => ({ ...m, isSelected: false })));
      }
      return newMode;
    });
  }, []);

  return {
    addModel,
    deleteModel,
    updateModelProperty,
    selectModel,
    toggleAssistantMode,
    models,
    selectedModel,
    assistantMode,
  };
};
</parameter>