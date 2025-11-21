import { 
  Wand2, 
  MessageSquare, 
  Languages, 
  Mic, 
  Smile, 
  FileJson, 
  Image as ImageIcon, 
  Scissors, 
  QrCode, 
  Palette, 
  Code2, 
  FileText, 
  Cpu, 
  Zap, 
  Lock,
  Database,
  Plane,
  Utensils,
  Briefcase
} from 'lucide-react';
import { Tool, ToolCategory, ToolStatus } from './types';

export const TOOLS: Tool[] = [
  // --- User's Existing Tools (AI) ---
  {
    id: 'ai-img-edit',
    title: 'Editor Mágico',
    description: 'Edita y transforma imágenes usando comandos de texto natural.',
    icon: Wand2,
    category: ToolCategory.AI,
    tags: ['Imágenes', 'Edición', 'GenAI'],
    status: ToolStatus.READY
  },
  {
    id: 'ai-chat',
    title: 'Chat Asistente',
    description: 'Conversa con modelos avanzados. Soporte para contexto largo.',
    icon: MessageSquare,
    category: ToolCategory.AI,
    tags: ['Chat', 'Texto', 'LLM'],
    status: ToolStatus.READY
  },
  {
    id: 'ai-translate',
    title: 'Traductor Neural',
    description: 'Traducción contextual de alta precisión entre 100+ idiomas.',
    icon: Languages,
    category: ToolCategory.AI,
    tags: ['Idiomas', 'Texto'],
    status: ToolStatus.READY
  },
  {
    id: 'ai-transcribe',
    title: 'Voz a Texto Pro',
    description: 'Transcribe reuniones y audios con detección de hablantes.',
    icon: Mic,
    category: ToolCategory.AI,
    tags: ['Audio', 'Whisper', 'Notas'],
    status: ToolStatus.READY
  },
  {
    id: 'ai-memes',
    title: 'Generador de Memes',
    description: 'Crea memes virales a partir de ideas o situaciones.',
    icon: Smile,
    category: ToolCategory.AI,
    tags: ['Diversión', 'Social'],
    status: ToolStatus.BETA
  },

  // --- New Local Tool Ideas (JS Processing) ---
  {
    id: 'local-json',
    title: 'JSON Formatter',
    description: 'Valida, embellece y minifica JSON sin enviar datos al servidor.',
    icon: FileJson,
    category: ToolCategory.LOCAL,
    tags: ['Dev', 'Datos', 'Privado'],
    status: ToolStatus.READY
  },
  {
    id: 'local-img-convert',
    title: 'Conversor Img',
    description: 'Convierte WebP, PNG, JPG localmente en tu navegador.',
    icon: ImageIcon,
    category: ToolCategory.LOCAL,
    tags: ['Imágenes', 'Utilidad'],
    status: ToolStatus.READY
  },
  {
    id: 'local-svg',
    title: 'Optimizador SVG',
    description: 'Reduce el tamaño de archivos SVG eliminando metadatos extra.',
    icon: Scissors,
    category: ToolCategory.LOCAL,
    tags: ['Diseño', 'Web'],
    status: ToolStatus.BETA
  },
  {
    id: 'local-qr',
    title: 'Generador QR',
    description: 'Crea códigos QR personalizables para WiFi, URLs y vCards.',
    icon: QrCode,
    category: ToolCategory.LOCAL,
    tags: ['Marketing', 'Utilidad'],
    status: ToolStatus.READY
  },
  {
    id: 'local-palette',
    title: 'Extractor de Color',
    description: 'Sube una imagen y extrae su paleta de colores dominante.',
    icon: Palette,
    category: ToolCategory.LOCAL,
    tags: ['Diseño', 'Colores'],
    status: ToolStatus.CONCEPT
  },
  {
    id: 'local-pwd',
    title: 'Generador Passwords',
    description: 'Crea contraseñas criptográficamente seguras al instante.',
    icon: Lock,
    category: ToolCategory.LOCAL,
    tags: ['Seguridad', 'Privado'],
    status: ToolStatus.READY
  },

  // --- New AI Tool Ideas (Gemini) ---
  {
    id: 'ai-code',
    title: 'Refactorizador Código',
    description: 'Mejora, comenta y arregla bugs en tu código automáticamente.',
    icon: Code2,
    category: ToolCategory.AI,
    tags: ['Dev', 'Programación'],
    status: ToolStatus.CONCEPT
  },
  {
    id: 'ai-resume',
    title: 'Revisor de CV',
    description: 'Analiza tu currículum y sugiere mejoras para pasar filtros ATS.',
    icon: Briefcase,
    category: ToolCategory.AI,
    tags: ['Carrera', 'Documentos'],
    status: ToolStatus.CONCEPT
  },
  {
    id: 'ai-sql',
    title: 'Texto a SQL',
    description: 'Genera consultas de base de datos complejas usando lenguaje natural.',
    icon: Database,
    category: ToolCategory.AI,
    tags: ['Dev', 'Datos'],
    status: ToolStatus.BETA
  },
  {
    id: 'ai-travel',
    title: 'Planner de Viajes',
    description: 'Genera itinerarios completos basados en tu destino y gustos.',
    icon: Plane,
    category: ToolCategory.AI,
    tags: ['Lifestyle', 'Viajes'],
    status: ToolStatus.CONCEPT
  },
  {
    id: 'ai-recipe',
    title: 'Chef de Nevera',
    description: 'Sube foto de tus ingredientes y obtén recetas posibles.',
    icon: Utensils,
    category: ToolCategory.AI,
    tags: ['Cocina', 'Visión'],
    status: ToolStatus.CONCEPT
  },
];