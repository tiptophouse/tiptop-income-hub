
/// <reference types="vite/client" />

declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      alt?: string;
      'auto-rotate'?: boolean;
      'camera-controls'?: boolean;
      'shadow-intensity'?: string;
      'shadow-softness'?: string;
      'environment-image'?: string;
      exposure?: string;
      poster?: string;
      bounds?: string;
      'enable-pan'?: boolean;
      autoplay?: boolean;
      ar?: boolean;
      'ar-modes'?: string;
      'rotation-per-second'?: string;
      'camera-orbit'?: string;
      'interaction-prompt'?: string;
      'touch-action'?: string;
      style?: React.CSSProperties;
    };
  }
}
