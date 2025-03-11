import formidable from "formidable";
import fs from "fs";
import { Configuration, OpenAIApi } from "openai";

// OpenAI API Setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Disable bodyParser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = "./public/uploads"; // Store images temporarily
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing form data" });
    }

    const prompt = fields.prompt || "Describe this image.";
    const imagePath = files.image?.filepath;

    if (!imagePath) {
      return res.status(400).json({ error: "No image provided." });
    }

    // Convert image to Base64 for OpenAI API
    const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });

    try {
      const response = await openai.createChatCompletion({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: `data:image/png;base64,${imageBase64}` }
            ]
          }
        ],
      });

      res.status(200).json({ response: response.data.choices[0].message.content });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error processing image with OpenAI." });
    }
  });
}
