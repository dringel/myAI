"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowUp, Image as ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import ChatFooter from "@/components/chat/footer";

interface ChatInputProps {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  isLoading: boolean;
}

export default function ChatInput({
  handleInputChange,
  handleSubmit,
  input,
  isLoading,
}: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const form = useForm({
    defaultValues: {
      message: "",
    },
  });

  // Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show preview
    }
  };

  // Modified submit handler to send image with text
  const handleSubmitWithImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input && !image) return; // Prevent empty submission

    const formData = new FormData();
    formData.append("prompt", input);
    if (image) {
      formData.append("image", image);
    }

    const response = await fetch("/api/image-chat", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Response:", data);

    // Clear input and image
    setImage(null);
    setPreview(null);
  };

  return (
    <>
      <div className="z-10 flex flex-col justify-center items-center fixed bottom-0 w-full p-5 bg-white shadow-[0_-10px_15px_-2px_rgba(255,255,255,1)] text-base">
        <div className="max-w-screen-lg w-full">
          <Form {...form}>
            <form
              onSubmit={handleSubmitWithImage} // Use modified submit function
              className={`flex-0 flex w-full p-1 border rounded-full shadow-sm ${
                isFocused ? "ring-2 ring-ring ring-offset-2" : ""
              }`}
            >
              {/* Image Upload Button */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button
                  type="button"
                  className="rounded-full w-10 h-10 p-0 flex items-center justify-center mr-2"
                >
                  <ImageIcon className="w-5 h-5" />
                </Button>
              </label>

              {/* Image Preview */}
              {preview && <img src={preview} alt="Preview" className="w-10 h-10 rounded-full mr-2" />}

              {/* Text Input */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input
                        {...field}
                        onChange={handleInputChange}
                        value={input}
                        className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Type your message here..."
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
                disabled={input.trim() === "" && !image}
              >
                <ArrowUp className="w-5 h-5" />
              </Button>
            </form>
          </Form>
        </div>
        <ChatFooter />
      </div>
    </>
  );
}
