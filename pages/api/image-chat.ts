import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary"; // Cloudinary setup
import fs from "fs";
import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";

// OpenAI API Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is set in .env
});

// Cloudinary Setup (replace with your credentials)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Disable bodyParser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const form = new formidable.IncomingForm({
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form data:", err);
      return res.status(500).json({ error: "Error parsing form data" });
    }

    const prompt = Array.isArray(fields.prompt) ? fields.prompt[0] : fields.prompt || "Describe this image.";
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

    // Ensure we have an image
    if (!imageFile || !("filepath" in imageFile)) {
      return res.status(400).json({ error: "No image provided." });
    }

    try {
      // ✅ Upload Image to Cloudinary
      const uploadedImage = await cloudinary.uploader.upload(imageFile.filepath, {
        folder: "chatbot_images", // Optional folder for better organization
      });

      // ✅ Send Image URL to OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt }, // Text prompt
              { type: "image_url", image_url: uploadedImage.secure_url }, // Image URL from Cloudinary
            ],
          },
        ],
      });

      res.status(200).json({ response: response.choices[0]?.message?.content || "No response from AI" });
    } catch (error) {
      console.error("Error processing image with OpenAI:", error);
      res.status(500).json({ error: "Error processing image with OpenAI." });
    }
  });
}
