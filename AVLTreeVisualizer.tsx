
import React from 'react';
import { AVLNode } from '../types';

interface AVLTreeVisualizerProps {
  root: AVLNode | null;
  highlightedIds: string[];
}

const AVLTreeVisualizer: React.FC<AVLTreeVisualizerProps> = ({ root, highlightedIds }) => {
  const nodeRadius = 24;
  const verticalSpacing = 80;

  // Function to calculate layout coordinates
  const calculateLayout = (node: AVLNode | null, x: number, y: number, spread: number) => {
    if (!node) return;
    node.x = x;
    node.y = y;
    calculateLayout(node.left, x - spread, y + verticalSpacing, spread * 0.5);
    calculateLayout(node.right, x + spread, y + verticalSpacing, spread * 0.5);
  };

  calculateLayout(root, 500, 50, 250);

  const renderLines = (node: AVLNode | null) => {
    if (!node) return null;
    // Explicitly use React.JSX.Element to avoid "Cannot find namespace 'JSX'" error
    const elements: React.JSX.Element[] = [];
    if (node.left) {
      elements.push(
        <line
          key={`line-${node.player.id}-${node.left.player.id}`}
          x1={node.x} y1={node.y}
          x2={node.left.x} y2={node.left.y}
          stroke="#475569"
          strokeWidth="2"
        />
      );
      elements.push(...(renderLines(node.left) || []));
    }
    if (node.right) {
      elements.push(
        <line
          key={`line-${node.player.id}-${node.right.player.id}`}
          x1={node.x} y1={node.y}
          x2={node.right.x} y2={node.right.y}
          stroke="#475569"
          strokeWidth="2"
        />
      );
      elements.push(...(renderLines(node.right) || []));
    }
    return elements;
  };

  const renderNodes = (node: AVLNode | null) => {
    if (!node) return null;
    const isHighlighted = highlightedIds.includes(node.player.id);
    const balance = (node.left?.height || 0) - (node.right?.height || 0);

    return (
      <React.Fragment key={`node-frag-${node.player.id}`}>
        <g 
          className="transition-all duration-500 ease-in-out"
          style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
        >
          <circle
            r={nodeRadius}
            className={`${isHighlighted ? 'fill-blue-500' : 'fill-slate-800'} stroke-slate-600 stroke-2 transition-colors duration-300`}
          />
          <text
            textAnchor="middle"
            dy=".3em"
            className="fill-white text-[10px] font-bold select-none"
          >
            {node.player.rating}
          </text>
          {/* Height and BF Badges */}
          <g transform={`translate(${nodeRadius}, -${nodeRadius})`}>
            <circle r="10" className="fill-indigo-600" />
            <text textAnchor="middle" dy=".35em" className="fill-white text-[8px] font-bold">H{node.height}</text>
          </g>
          <g transform={`translate(-${nodeRadius}, -${nodeRadius})`}>
            <circle r="10" className={`${Math.abs(balance) > 1 ? 'fill-red-500' : 'fill-emerald-500'}`} />
            <text textAnchor="middle" dy=".35em" className="fill-white text-[8px] font-bold">B{balance}</text>
          </g>
          <text
            y={nodeRadius + 15}
            textAnchor="middle"
            className="fill-slate-400 text-[9px]"
          >
            {node.player.name}
          </text>
          <text
            y={nodeRadius + 26}
            textAnchor="middle"
            className="fill-slate-600 text-[7px] font-mono"
          >
            {node.player.id}
          </text>
        </g>
        {renderNodes(node.left)}
        {renderNodes(node.right)}
      </React.Fragment>
    );
  };

  return (
    <div className="w-full h-full bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl relative">
      <div className="absolute top-4 left-4 z-10 bg-slate-800/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-slate-300 border border-slate-700">
        AVL Tree Topology
      </div>
      <svg 
        viewBox="0 0 1000 600" 
        className="w-full h-full"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <g>
          {renderLines(root)}
          {renderNodes(root)}
        </g>
      </svg>
    </div>
  );
};

export default AVLTreeVisualizer;
