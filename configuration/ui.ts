import { AI_NAME, OWNER_NAME } from "@/configuration/identity";
import { FAQ_QUESTIONS } from './faq';

export const CHAT_HEADER: string = "Socrates - Learning from Language lab's Research Assistant";
export const FOOTER_MESSAGE: string = `Socrates provides information about Language and Learning Lab's research from the past 3 years. For older publications or specific inquiries, please contact the lab directly.`;
export const MESSAGE_PLACEHOLDER: string = `Ask about our research, publications, or lab members...`;
export const CLEAR_BUTTON_TEXT: string = `Clear Chat`;
export const PAGE_TITLE: string = `Learning from Language Research Lab Assistant`;
export const PAGE_DESCRIPTION: string = `Chat with Socrates, the UNC CS Learning from Language lab's AI assistant.`;

export const EMPTY_CITATION_MESSAGE: string = "Unspecified source";

export const WELCOME_MESSAGE: string = `
# Welcome to the Learning from Language Lab Assistant

I'm Socrates, your guide to the UNC CS Learning from Language lab's research and publications from the past 3 years.

## Frequently Asked Questions:

${FAQ_QUESTIONS.map(question => `- ${question}`).join('\n')}

Feel free to ask me any of these questions or your own questions about the lab's work!
`;
