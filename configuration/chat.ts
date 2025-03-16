import { OWNER_NAME, AI_NAME } from "./identity";

export const INITIAL_MESSAGE: string = "Hello, I'm Max, Eta Omega Chi's AI assistant. Let me know if you have any questions about investment banking recruiting";
export const DEFAULT_RESPONSE_MESSAGE: string = `Hmmm, this is a good question! Let me think for a while. Please try again later.`;
export const WORD_CUTOFF: number = 8000; // Number of words until bot says it needs a break
export const WORD_BREAK_MESSAGE: string = "Let's take a quick breather—just like in a long investment banking case study! Feel free to ask your next question when you're ready.";
export const HISTORY_CONTEXT_LENGTH: number = 7; // Number of messages to use for context when generating a response
