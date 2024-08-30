import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';

dotenv.config();

class Gemini{
  private prompt: string;
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  
  constructor(){
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('API key is not defined. Please set GEMINI_API_KEY in your .env file.');
    }

    this.prompt = "A imagem possi a leitura individualizada de consumo de um sensor de água ou gás quero apenas o numero inteiro sem contar os zeros a esquerda e nada mais na resposta. Qual o valor do leitor?";
    this.genAI  = new GoogleGenerativeAI (apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
  }
  
  async query (base64: string, imageType: string){
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: imageType
        }
      },
    ];
    
    const result = await this.model.generateContent([this.prompt, ...imageParts]);
    const text = result.response.text();
    return text;
  }
}

export default new Gemini();
