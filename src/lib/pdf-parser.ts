'use server';

import pdf from 'pdf-parse';

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error('[PDF Parser] Error extracting text:', error);
    throw new Error('Failed to extract text from PDF.');
  }
}
