
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiInsights = async (dataSummary: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Dựa trên dữ liệu sau, hãy đưa ra tóm tắt 3 dòng về tình hình DVC: ${dataSummary}`,
      config: {
        systemInstruction: "Bạn là trợ lý quản lý DVC chuyên nghiệp. Trả lời súc tích, chuyên sâu.",
      },
    });
    return response.text || "Đang cập nhật...";
  } catch (error) {
    return "Không thể lấy phân tích.";
  }
};

export const analyzePumpingSlipPhoto = async (base64Image: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] || base64Image } },
          { text: "Trích xuất thông tin phiếu bơm bê tông: khách hàng, dự án, địa chỉ, khối lượng (volume), mét ống (pipeLength)." },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            customerName: { type: Type.STRING },
            projectName: { type: Type.STRING },
            address: { type: Type.STRING },
            volume: { type: Type.NUMBER },
            pipeLength: { type: Type.NUMBER },
          },
        },
      },
    });
    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    return null;
  }
};

export const analyzeExpensePhoto = async (base64Image: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] || base64Image } },
          { text: "Trích xuất hóa đơn: số tiền (amount), loại chi phí (category: Dầu, Ăn uống, Sửa chữa, Khác), ghi chú (notes)." },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            category: { type: Type.STRING },
            notes: { type: Type.STRING },
          },
        },
      },
    });
    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    return null;
  }
};
