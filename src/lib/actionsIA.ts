"use server"
import { config } from "@/config/config";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
  
  const apiKey: string | undefined = config.geminiKeyGoogle;
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in the environment variables.");
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const fileManager = new GoogleAIFileManager(apiKey);
  
  async function uploadToGemini(path: string, mimeType: string): Promise<{ name: string; displayName: string; mimeType: string; uri: string }> {
    const uploadResult = await fileManager.uploadFile(path, {
      mimeType,
      displayName: path,
    });
    const file = uploadResult.file;
    const displayName = file.displayName || "defaultDisplayName";
  
    console.log(`Uploaded file ${displayName} as: ${file.name}`);
    return {
      name: file.name,
      displayName: displayName,
      mimeType: file.mimeType,
      uri: file.uri,
    };
  }
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
 export async function run() {
    const files = [
      await uploadToGemini("", "image/jpeg"),
    ];
  
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: files[0].mimeType,
                fileUri: files[0].uri,
              },
            },
            { text: "puedes analizar esta imagen?" },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text:
                "¡Claro! Aquí tienes un análisis de la imagen:\n\n**Descripción general:**\n\n*   La imagen es un retrato de un hombre joven, visto de frente, desde el pecho hacia arriba.\n*   El fondo es blanco o de un color claro neutro.\n\n**Características del hombre:**\n\n*   Tiene la piel de un tono medio.\n*   Su cabello es oscuro y corto, peinado hacia atrás.\n*   Tiene cejas pobladas y oscuras.\n*   Parece tener una barba incipiente o rastrojo.\n*   Sus ojos son oscuros.\n*   Tiene las orejas prominentes.\n\n**Expresión:**\n\n*   Su expresión es seria o neutra. No parece estar sonriendo.\n\n**Iluminación:**\n\n*   La iluminación parece ser uniforme, sin sombras muy marcadas en su rostro.\n\n¿Hay algo en particular que te interese saber sobre la imagen?",
            },
          ],
        },
      ],
    });
  
    const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    console.log(result.response.text());
  }
  

  /*importar archivos locales en base de 64*/

import fs from "fs"; // Para leer archivos locales



if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}


export async function runIa2() {
  const imagePath = "path/to/your/image.jpg"; // Reemplaza con la ruta real a tu imagen

  // Convierte el archivo de imagen local a Base64
  const imageBase64 = Buffer.from(fs.readFileSync(imagePath)).toString("base64");

  const prompt = "puedes analizar esta imagen?"; // Tu prompt

  const result = await model.generateContent([
    {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg", // O el tipo MIME correcto de tu imagen
      },
    },
    prompt,
  ]);

  console.log(result.response.text());
}

export async function analyzeImage(formData: FormData) {
  try {
    const prompt = formData.get('prompt') as string;
    const imageFile = formData.get('image') as File;
    
    if (!imageFile || !prompt) {
      throw new Error('Se requiere una imagen y un prompt');
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });
    
    console.log(((await imageFile.bytes()).byteLength) / 100000);

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const imageBase64 = buffer.toString('base64');

    const result = await model.generateContent([
      {
        inlineData: {
          data: imageBase64,
          mimeType: imageFile.type
        }
      },
      prompt
    ]);

    return result.response.text();
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Error al procesar la imagen');
  }
}