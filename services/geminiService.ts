// @ts-ignore
// Cách truy cập biến môi trường an toàn để không bị lỗi build TypeScript
const API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiInsights = async (summary: string) => {
  if (!API_KEY) return "Chưa cấu hình API Key trên Vercel.";
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Dưới đây là dữ liệu vận hành bê tông: ${summary}. Hãy đưa ra 1 nhận xét ngắn gọn, chuyên nghiệp.`);
    return result.response.text();
  } catch (error) {
    return "AI đang bận, vui lòng thử lại sau.";
  }
};

export const analyzePumpingSlipPhoto = async (base64: string) => {
  if (!API_KEY) return null;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Phân tích ảnh phiếu bơm này. Trả về JSON: {customerName, projectName, volume, address}";
    const imagePart = { inlineData: { data: base64.split(",")[1], mimeType: "image/jpeg" } };
    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text().replace(/```json|```/g, ""); // Xử lý nếu AI trả về markdown
    return JSON.parse(text);
  } catch (e) {
    console.error("AI Analysis Error", e);
    return null;
  }
};

// Thêm hàm này để fix lỗi ở file ExpenseManagement.tsx
export const analyzeExpensePhoto = async (base64: string) => {
  if (!API_KEY) return null;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Phân tích hóa đơn này và trả về JSON: { amount: số, category: chuỗi, date: chuỗi }";
    const imagePart = { inlineData: { data: base64.split(",")[1], mimeType: "image/jpeg" } };
    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text().replace(/```json|```/g, "");
    return JSON.parse(text);
  } catch (e) {
    console.error("AI Expense Analysis Error", e);
    return null;
  }
};
