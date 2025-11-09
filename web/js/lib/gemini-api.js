/**
 * Gemini API Client - Cliente ligero para Google Gemini API
 * Uso: const gemini = new GeminiAPI(apiKey);
 */
class GeminiAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    this.model = 'gemini-2.0-flash-exp';
  }

  /**
   * Envía un mensaje al modelo y obtiene respuesta
   * @param {string} prompt - Texto del usuario
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<string>} - Respuesta del modelo
   */
  async chat(prompt, options = {}) {
    const url = `${this.baseUrl}/models/${this.model}:generateContent`;
    
    const body = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxTokens || 2048,
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-goog-api-key': this.apiKey
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const errorMsg = error.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      console.error('Gemini API Error:', error);
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  /**
   * Envía un mensaje con una imagen al modelo (solo análisis)
   * @param {string} prompt - Texto del usuario
   * @param {string} imageBase64 - Imagen en base64
   * @param {string} mimeType - Tipo MIME de la imagen
   * @returns {Promise<string>} - Respuesta del modelo
   */
  async chatWithImage(prompt, imageBase64, mimeType) {
    const url = `${this.baseUrl}/models/${this.model}:generateContent`;
    
    const body = {
      contents: [{
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: imageBase64
            }
          }
        ]
      }]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-goog-api-key': this.apiKey
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const errorMsg = error.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      console.error('Gemini API Error:', error);
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  /**
   * Edita una imagen con instrucciones de texto (Nano Banana)
   * @param {string} prompt - Instrucciones de edición
   * @param {string} imageBase64 - Imagen en base64
   * @param {string} mimeType - Tipo MIME de la imagen
   * @returns {Promise<Object>} - {text: string, image: string|null}
   */
  async editImage(prompt, imageBase64, mimeType) {
    const url = `${this.baseUrl}/models/gemini-2.5-flash-image:generateContent`;
    
    const body = {
      contents: [{
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: imageBase64
            }
          }
        ]
      }]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-goog-api-key': this.apiKey
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const errorMsg = error.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      console.error('Gemini API Error:', error);
      throw new Error(errorMsg);
    }

    const data = await response.json();
    const parts = data.candidates[0].content.parts;
    
    let text = '';
    let image = null;
    
    for (const part of parts) {
      if (part.text) text += part.text;
      if (part.inline_data?.data) image = part.inline_data.data;
    }
    
    return { text, image };
  }

  /**
   * Valida si la API key es correcta
   * @returns {Promise<boolean>}
   */
  async validateKey() {
    try {
      await this.chat('Hola', { maxTokens: 10 });
      return true;
    } catch {
      return false;
    }
  }
}

// Gestión de API Key en localStorage
const GeminiStorage = {
  KEY: 'gemini_api_key',
  
  save(apiKey) {
    localStorage.setItem(this.KEY, apiKey);
  },
  
  get() {
    return localStorage.getItem(this.KEY) || '';
  },
  
  remove() {
    localStorage.removeItem(this.KEY);
  },
  
  exists() {
    return !!this.get();
  }
};
