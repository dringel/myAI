import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

const ChatInput = ({ handleInputChange, handleSubmit, input, isLoading }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  // Submit handler to send image + text to API
  const handleSubmitWithImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input && !image) {
      alert("Please enter a prompt or upload an image!");
      return;
    }

    setLoading(true); // Show loading state

    const formData = new FormData();
    formData.append("prompt", input);
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch("/api/image-chat", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("API request failed");
      }

      const data = await res.json();
      setResponse(data.response); // Show API response

      console.log("AI Response:", data.response);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Check the console for details.");
    } finally {
      setLoading(false);
      setImage(null);
      setPreview(null);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 w-full p-5 bg-white shadow text-base">
        <div className="max-w-screen-lg w-full">
          <Form {...form}>
            <form
              onSubmit={handleSubmitWithImage}
              className={`flex w-full p-1 border rounded-full shadow-sm ${
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
                        className="bg-transparent border-none"
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
                disabled={loading || (input.trim() === "" && !image)}
              >
                {loading ? "..." : <ArrowUp className="w-5 h-5" />}
              </Button>
            </form>
          </Form>
        </div>

        {/* Display AI Response */}
        {response && (
          <div className="mt-4 p-3 border rounded-lg shadow-sm bg-gray-100 max-w-screen-md w-full">
            <p className="text-sm font-medium">{response}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatInput;
