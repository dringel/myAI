import { OWNER_NAME, AI_NAME } from "./identity";

export const INITIAL_MESSAGE: string = `Hello, I'm ${AI_NAME}, your Chicago restaurant guide! Whether you're craving deep-dish pizza, 
a rooftop spot, or a hidden gem, I've got you covered. What are you in the mood for today?`;
export const DEFAULT_RESPONSE_MESSAGE: string = `Sorry, I'm having trouble generating a response. Please try again later.`;
export const WORD_CUTOFF: number = 8000; // Number of words until bot says it needs a break
export const WORD_BREAK_MESSAGE: string = `...loading more results...]`;
export const HISTORY_CONTEXT_LENGTH: number = 15; // Number of messages to use for context when generating a response
