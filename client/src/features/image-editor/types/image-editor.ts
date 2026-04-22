// apps/client/src/types/editor.ts
export type CropStrategy =
  | 'maintain_ratio'
  | 'pad_resize'
  | 'force'
  | 'at_max'
  | 'at_least'
  | 'extract';

export type FocusMode =
  | 'auto'
  | 'face'
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top_left'
  | 'top_right'
  | 'bottom_left'
  | 'bottom_right'
  | 'custom';

export type AITransformation =
  | 'none'
  | 'removedotbg'     // remove.bg integration
  | 'bgremove'        // cheaper IK native bg removal
  | 'dropshadow'
  | 'retouch'
  | 'upscale'
  | 'genvar';

export type TextTypography = 'b' | 'i' | 'strikethrough' | 'b_i';

export interface ResizeParams {
  width?: number;
  height?: number;
  aspectRatio?: string;        // e.g. "16-9"
  dpr?: number;
}

export interface CropParams {
  strategy: CropStrategy;
  focus?: FocusMode;
  objectFocus?: string;        // e.g. "car", "person"
  x?: number;
  y?: number;
  zoom?: number;
}

export interface TextOverlayParams {
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;               // hex without #
  backgroundColor?: string;
  padding?: string;            // e.g. "10" or "10_20"
  positionX?: number;
  positionY?: number;
  typography?: TextTypography;
  innerAlign?: 'left' | 'right' | 'center';
  width?: number;
  rotation?: number;
}

export interface AITransformParams {
  type: AITransformation;
  changeBackground?: {
    prompt: string;
  };
  editImage?: {
    prompt: string;
  };
  generativeFill?: {
    width: number;
    height: number;
    prompt?: string;
  };
  dropShadow?: {
    azimuth?: number;    // 0-360
    elevation?: number;  // 0-90
    saturation?: number; // 0-100
  };
}

export interface TransformState {
  imageUrl: string;
  resize: ResizeParams;
  crop: CropParams;
  textOverlay: TextOverlayParams | null;
  ai: AITransformParams;
}