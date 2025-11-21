import { LucideIcon } from 'lucide-react';

export enum ToolCategory {
  ALL = 'all',
  LOCAL = 'local',
  AI = 'ai',
}

export enum ToolStatus {
  READY = 'ready',
  BETA = 'beta',
  CONCEPT = 'concept',
}

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: ToolCategory;
  tags: string[];
  status: ToolStatus;
  color?: string; // Custom accent color
}