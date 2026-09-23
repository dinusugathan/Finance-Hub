import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('invoice') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');
    
    const mimeType = file.type;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze this invoice/bill and extract the following details in strict JSON format:
      {
        "date": "YYYY-MM-DD",
        "vendor": "String",
        "totalAmount": Number (just the numerical value),
        "tax": Number (just the numerical value, or 0 if not found),
        "category": "String (e.g., Office Supplies, Software, Travel, Food, Utilities)"
      }
      Respond with ONLY the JSON object, nothing else. No markdown formatting.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType
        }
      }
    ]);

    const responseText = result.response.text();
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const extractedData = JSON.parse(jsonStr);

    const expense = await prisma.expense.create({
      data: {
        date: new Date(extractedData.date || new Date()),
        vendor: extractedData.vendor || 'Unknown',
        totalAmount: extractedData.totalAmount || 0,
        tax: extractedData.tax || 0,
        category: extractedData.category || 'Other',
        receiptUrl: file.name
      }
    });

    return NextResponse.json({ success: true, data: expense });

  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong processing the invoice' }, { status: 500 });
  }
}
