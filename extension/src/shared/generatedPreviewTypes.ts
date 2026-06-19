export type GeneratedPreviewImage = {
  id: string;
  createdAt: string;
  sourceUrl?: string;
  sourceTitle?: string;
  patternId?: string;
  patternName?: string;
  sectionType?: string;
  layoutType?: string;
  imageBase64: string;
  sourceScreenshotBase64?: string;
  promptUsed?: string;
  model?: string;
  provider?: "gemini";
  uncodixifyScore?: number;
  uncodixifyFindings?: string[];
};
