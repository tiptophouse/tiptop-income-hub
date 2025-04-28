
import React from 'react';

interface Hotspot {
  id: string;
  position: string;
  normal: string;
  label: string;
  active?: boolean;
}

interface ModelHotspotsProps {
  hotspots: Hotspot[];
}

const ModelHotspots: React.FC<ModelHotspotsProps> = ({ hotspots }) => {
  return (
    <>
      {hotspots.map(hotspot => (
        <button
          key={hotspot.id}
          className={`hotspot ${hotspot.active ? 'active' : ''}`}
          slot={`hotspot-${hotspot.id}`}
          data-position={hotspot.position}
          data-normal={hotspot.normal}
          data-visibility-attribute="visible"
        >
          <div className="annotation">{hotspot.label}</div>
        </button>
      ))}
      
      <style>
        {`
          .hotspot {
            display: block;
            width: 24px;
            height: 24px;
            border-radius: 12px;
            border: none;
            background-color: #8B5CF6;
            box-sizing: border-box;
            pointer-events: none;
            transition: all 0.3s ease;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
          }
          
          .hotspot.active {
            background-color: #ef4444;
            transform: scale(1.2);
          }

          .hotspot[data-visibility-attribute]:not([visible]) {
            background-color: transparent;
            border: 3px solid #8B5CF6;
          }
          
          .annotation {
            background-color: #ffffff;
            position: absolute;
            transform: translate(12px, 12px);
            border-radius: 10px;
            padding: 10px;
            width: max-content;
            max-width: 250px;
            color: rgba(0, 0, 0, 0.8);
            font-size: 12px;
            display: none;
            pointer-events: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          
          .hotspot:hover .annotation {
            display: block;
          }
        `}
      </style>
    </>
  );
};

export default ModelHotspots;
