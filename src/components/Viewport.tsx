import React from 'react';

interface ViewportProps {
  containerRef: React.RefObject<HTMLDivElement>;
  assistantMode: boolean;
  selectedModel: any;
  cameraMode: 'orbit' | 'free';
  models?: any[];
}

export const Viewport: React.FC<ViewportProps> = ({ 
  containerRef, 
  assistantMode, 
  selectedModel,
  cameraMode,
  models
}) => {
  return (
    <div className="flex-1 bg-gray-900 relative">
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {/* 视口状态指示器 */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white text-xs p-3 rounded-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${cameraMode === 'free' ? 'bg-green-400' : 'bg-blue-400'}`} />
            <span>相机模式: {cameraMode === 'free' ? '自由视角' : '轨道视角'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${assistantMode ? 'bg-green-400' : 'bg-gray-400'}`} />
            <span>辅助模式: {assistantMode ? '开启' : '关闭'}</span>
          </div>
          {selectedModel && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span>已选中: {selectedModel.name}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* 视口控制提示 */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white text-xs p-3 rounded-lg">
        <div className="space-y-1">
          <div>模型总数: {models?.length || 0}</div>
          {models && models.length > 0 && (
            <div>最新模型: {models[models.length - 1]?.name}</div>
          )}
          {cameraMode === 'orbit' ? (
            <>
              <div>鼠标拖拽：旋转视角</div>
              <div>滚轮：缩放场景</div>
            </>
          ) : (
            <>
              <div>点击锁定鼠标：自由视角</div>
              <div>WASD：移动相机</div>
              <div>空格/Shift：上升/下降</div>
              <div>ESC：退出自由视角</div>
            </>
          )}
          {assistantMode && (
            <>
              <div>左键点击：选中模型</div>
              <div>拖拽选中模型：移动位置</div>
            </>
          )}
        </div>
      </div>

      {/* 坐标系指示器 */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-red-500"></div>
            <span>X</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-green-500"></div>
            <span>Y</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            <span>Z</span>
          </div>
        </div>
      </div>
    </div>
  );
};