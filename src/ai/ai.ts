import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateForm(subject: string, n: number, lang: string) {

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
    const prompt = `Generate a raw json file with excactly the following structure {
  "name": "Form Title",
  "temporal": true or false (depending if the form is temporal or not),
  "start": (if temporal is true, the start date of the form in ISO format, if not temporal, this field should be null),
  "end": (if temporal is true, the end date of the form in ISO format, if not temporal, this field should be null),
  "active": true or false (depending if the form is active or not),
  "description": "Form description here.",
  "author": "Google AI",
  "isPublic": true,
  "questions": [
    {
      "question": "Question here",
      "type": "(it could be "multiple-choice" , "short-answer", "long-answer", "checkbox", "dropdown")",
      "options": [],
      "required": true
    }
  ]
}
but with the subject "${subject}", only ${n} questions and in ${lang} language.`;
  
    const result = await model.generateContent(prompt);

    const regex = new RegExp("`", 'gi');
    const a = result.response.text().replace(regex, '');
    const b = a.replace('json', '')
    return b
  }