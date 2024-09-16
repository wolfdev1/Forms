import { GoogleGenerativeAI } from "@google/generative-ai";

export async function textGenTextOnlyPrompt() {
    // [START text_gen_text_only_prompt]
    // Make sure to include these imports:
    // import { GoogleGenerativeAI } from "@google/generative-ai";
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
    const prompt = `Generate a json file with the following structure {
  "name": "Form Title",
  "temporal": false,
  "start": null,
  "end": null,
  "active": true,
  "description": "Form description here.",
  "author": "Author Name",
  "isPublic": true,
  "questions": [
    {
      "question": "What is your name?",
      "type": "short-answer",
      "options": [],
      "required": true
    },
    {
      "question": "What are your hobbies?",
      "type": "long-answer",
      "options": [],
      "required": false
    },
    {
      "question": "Select your preferred options",
      "type": "multiple-choice",
      "options": [
        "Option 1",
        "Option 2",
        "Option 3"
      ],
      "required": true
    },
    {
      "question": "Choose your favorite colors",
      "type": "checkbox",
      "options": [
        "Red",
        "Green",
        "Blue",
        "Yellow"
      ],
      "required": false
    },
    {
      "question": "Rate the service",
      "type": "dropdown",
      "options": [
        "1 - Poor",
        "2 - Fair",
        "3 - Good",
        "4 - Very Good",
        "5 - Excellent"
      ],
      "required": true
    }
  ]
}
but with the tematical of Favorite Foods`;
  
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    
  }