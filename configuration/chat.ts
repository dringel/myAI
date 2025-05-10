import { OWNER_NAME, AI_NAME } from "./identity";
import { FAQ_QUESTIONS } from './faq';

// Updated to include numbered FAQs for easy selection
export const INITIAL_MESSAGE: string = `Hello, I'm ${AI_NAME}, ${OWNER_NAME}'s AI assistant. I can help you learn about our research papers published in the last 3 years, find information about our researchers, and discover recent lab news.

## Frequently Asked Questions:
Type a number to get an answer:
1️⃣ ${FAQ_QUESTIONS[0]}

2️⃣ ${FAQ_QUESTIONS[1]}

3️⃣ ${FAQ_QUESTIONS[2]}

4️⃣ ${FAQ_QUESTIONS[3]}

5️⃣ ${FAQ_QUESTIONS[4]}

Feel free to type a number or ask your own questions about the lab!`;

export const DEFAULT_RESPONSE_MESSAGE: string = `Sorry, I'm having trouble generating a response. Please try again later.`;
export const WORD_CUTOFF: number = 8000; // Number of words until bot says it needs a break
export const WORD_BREAK_MESSAGE: string = `[WORD BREAK MESSAGE]`;
export const HISTORY_CONTEXT_LENGTH: number = 7; // Number of messages to use for context when generating a response
