Hola, tengo una duda sobre gemini api con nano banana (gemini-2-5-flash-image). ¿Podrías investigar si este modelo permite editar y modificar imágenes mediante comandos de texto? y si es así, ¿cómo se usa la api con javascript?

---

¡Sí! “Nano Banana” es el apodo popular de Gemini 2.5 Flash Image, y este modelo sí permite editar y modificar imágenes con instrucciones de texto (text+image→image), además de componer varias imágenes y refinar resultados por turnos. Google lo documenta como “Image generation with Gemini (aka Nano Banana)”. 

Qué modelo usar
- Usa el id gemini-2.5-flash-image (no confundir con gemini-2.5-flash, que no genera imágenes). El modelo acepta texto e imágenes como entrada y devuelve imágenes (y texto si procede). 

Cómo hacerlo con JavaScript (Node.js)
1) Instala el SDK oficial:
- npm i @google/genai 

2) Configura tu API key:
- Exporta una de estas variables: GEMINI_API_KEY o GOOGLE_API_KEY (el SDK las detecta automáticamente). 

3) Edición básica: pasar imagen + prompt y guardar el resultado
- Ejemplo: “cámbiale el fondo, añade un objeto, ajusta color/grading”, etc.

```js
import { GoogleGenAI } from "@google/genai";
import fs from "node:fs";

const ai = new GoogleGenAI({}); // Lee GEMINI_API_KEY / GOOGLE_API_KEY del entorno

async function editImage() {
  // 1) Carga la imagen base y codifícala en base64
  const inputPath = "input/cat.png";
  const base64Image = fs.readFileSync(inputPath).toString("base64");

  // 2) Construye el prompt (texto + la imagen como inlineData)
  const contents = [
    { text: "Añade un sombrero de mago tejido y cambia el fondo a un restaurante elegante con luces cálidas." },
    {
      inlineData: {
        mimeType: "image/png", // o image/jpeg/webp/… (ver formatos soportados)
        data: base64Image,
      },
    },
  ];

  // 3) Llama al modelo de edición/generación de imágenes
  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents,
  });

  // 4) Extrae la imagen resultante y guárdala
  for (const part of res.parts ?? []) {
    if (part.inlineData?.data) {
      const out = Buffer.from(part.inlineData.data, "base64");
      fs.writeFileSync("output/edited.png", out);
      console.log("Guardado en output/edited.png");
    }
  }
}

editImage().catch(console.error);
```

4) Componer varias imágenes (p. ej., “pon este vestido en este modelo”)
```js
import { GoogleGenAI } from "@google/genai";
import fs from "node:fs";

const ai = new GoogleGenAI({});

async function composeImages() {
  const imgA = fs.readFileSync("assets/dress.png").toString("base64");
  const imgB = fs.readFileSync("assets/model.png").toString("base64");

  const contents = [
    { text: "Vístela con el vestido y crea una foto de ecommerce en fondo neutro y luz suave." },
    { inlineData: { mimeType: "image/png", data: imgA } },
    { inlineData: { mimeType: "image/png", data: imgB } },
  ];

  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents,
  });

  for (const part of res.parts ?? []) {
    if (part.inlineData?.data) {
      fs.writeFileSync("output/lookbook.png", Buffer.from(part.inlineData.data, "base64"));
      console.log("Guardado en output/lookbook.png");
    }
  }
}

composeImages().catch(console.error);
```

Notas útiles y límites
- Entradas y salidas: puedes pasar texto + 1 o varias imágenes, y recibirás la(s) imagen(es) generada(s) en los “parts” como inlineData (base64). La propia guía incluye ejemplos JS para text→image y text+image→image. 
- Formatos de imagen soportados para entrada: PNG, JPEG, WEBP, HEIC, HEIF. Si usas “inlineData”, el tamaño total de la petición (texto + bytes) debe ser < 20 MB. Para archivos más grandes o para reutilizar imágenes, sube primero con la Files API y luego referencia el archivo en generateContent. 
- Los resultados incluyen marca de agua invisible SynthID. 

Importante para evitar confusiones
- gemini-2.5-flash no genera imágenes; gemini-2.5-flash-image sí genera y edita imágenes (también puedes ver su ficha de capacidades y código de modelo en la tabla de “Models”). 

¿Quieres que te deje un snippet adaptado a tu caso (por ejemplo, cambio de fondo, retoque de ropa/color, “figurine style”, etc.) o que te lo prepare para un entorno serverless específico (Vercel, Cloud Run, etc.)? Pásame tu caso de uso y lo ajustamos.


---

# Documentación de google
https://ai.google.dev/gemini-api/docs/image-generation?hl=es-419


## Generación de imágenes con Gemini (también conocido como Nano Banana)

Gemini puede generar y procesar imágenes de forma conversacional. Puedes darle instrucciones a Gemini con texto, imágenes o una combinación de ambos, lo que te permite crear, editar y realizar iteraciones en elementos visuales con un control sin precedentes:

- Text-to-Image: Genera imágenes de alta calidad a partir de descripciones de texto simples o complejas.
- Imagen + Imagen a partir de texto (edición): Proporciona una imagen y usa instrucciones de texto para agregar, quitar o modificar elementos, cambiar el estilo o ajustar la clasificación de color.
- De varias imágenes a una imagen (composición y transferencia de estilo): Usa varias imágenes de entrada para componer una escena nueva o transferir el estilo de una imagen a otra.
- Refinamiento iterativo: Participa en una conversación para refinar progresivamente tu imagen en varios turnos y realizar pequeños ajustes hasta que quede perfecta.
- Renderización de texto de alta fidelidad: Genera con precisión imágenes que contienen texto legible y bien ubicado, ideal para logotipos, diagramas y pósteres.

Todas las imágenes generadas incluyen una marca de agua de SynthID.

```js
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({});

  const prompt =
    "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
  });
  for (const part of response.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("gemini-native-image.png", buffer);
      console.log("Image saved as gemini-native-image.png");
    }
  }
}

main();
```


## Generación de imágenes (texto a imagen)

En el siguiente código, se muestra cómo generar una imagen a partir de una instrucción descriptiva.


Edición de imágenes (de texto y de imagen a imagen)

Recordatorio: Asegúrate de tener los derechos necesarios de las imágenes que subas. No generes contenido que infrinja los derechos de otras personas, incluidos videos o imágenes que engañen, hostiguen o dañen. El uso de este servicio de IA generativa está sujeto a nuestra Política de Uso Prohibido.

En el siguiente ejemplo, se muestra cómo subir imágenes codificadas en Base64. Para obtener información sobre varias imágenes, cargas útiles más grandes y tipos de MIME admitidos, consulta la página Comprensión de imágenes.

```js
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({});

  const imagePath = "path/to/cat_image.png";
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString("base64");

  const prompt = [
    { text: "Create a picture of my cat eating a nano-banana in a" +
            "fancy restaurant under the Gemini constellation" },
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image,
      },
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
  });
  for (const part of response.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("gemini-native-image.png", buffer);
      console.log("Image saved as gemini-native-image.png");
    }
  }
}

main();
```

