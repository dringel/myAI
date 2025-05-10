"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowUp } from "lucide-react";
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
  const form = useForm({
    defaultValues: {
      message: "",
    },
  });

  return (
    <>
      <div className="z-10 flex flex-col justify-center items-center fixed bottom-0 w-full p-5 bg-white shadow-[0_-10px_15px_-2px_rgba(255,255,255,1)] text-base">
        <div className="max-w-screen-lg w-full">
          <Form {...form}>
            <form
              onSubmit={handleSubmit}
              className={`flex-0 flex w-full p-1 border rounded-full shadow-sm ${
                isFocused ? "ring-2 ring-ring ring-offset-2" : ""
              }`}
            >
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
                        placeholder="Type your question about investment banking here..."
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
                disabled={input.trim() === "" || isLoading}
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
