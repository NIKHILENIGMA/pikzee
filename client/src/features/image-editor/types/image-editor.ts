export type ResizeTransformation = {
  type: "resize";
  width: number;
  height: number;
};

export type CropMode = "at_max" | "at_least" | "maintain_ratio";

export type CropTransformation = {
  type: "crop";
  mode: CropMode;
};

export type EffectType =
  | "grayscale"
  | "contrast"
  | "sharpen"
  | "blur";

export type EffectTransformation = {
  type: "effect";
  effect: EffectType;
  value?: number; // optional for intensity-based effects
};

export type BackgroundTransformation = {
  type: "background";
  action: "remove" | "change";
  color?: string; // required if change
};

export type OverlayTextTransformation = {
  type: "overlay_text";
  text: string;
};

export type OverlayImageTransformation = {
  type: "overlay_image";
  url: string;
};

export type Transformation =
  | ResizeTransformation
  | CropTransformation
  | EffectTransformation
  | BackgroundTransformation
  | OverlayTextTransformation
  | OverlayImageTransformation;