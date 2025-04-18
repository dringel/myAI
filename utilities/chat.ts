import { HYDE_MODEL, HYDE_TEMPERATURE } from "@/configuration/models";
import { QUESTION_RESPONSE_TOP_K } from "@/configuration/pinecone";
import {
  HYDE_PROMPT,
  RESPOND_TO_QUESTION_SYSTEM_PROMPT,
} from "@/configuration/prompts";
import {
  Chat,
  Chunk,
  chunkSchema,
  Citation,
  citationSchema,
  CoreMessage,
  DisplayMessage,
  Source,
} from "@/types";
import OpenAI from "openai";

export function stripMessagesOfCitations(
  messages: DisplayMessage[]
): DisplayMessage[] {
  return messages.map((msg) => ({
    ...msg,
    content: msg.content.replace(/\[\d+\]/g, ""),
  }));
}

export function convertToCoreMessages(
  messages: DisplayMessage[]
): CoreMessage[] {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
}

export function addSystemMessage(
  messages: CoreMessage[],
  systemMessage: string
): CoreMessage[] {
  return [{ role: "system", content: systemMessage }, ...messages];
}

export async function embedHypotheticalData(
  value: string,
  openai: OpenAI
): Promise<{ embedding: number[] }> {
  try {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: value,
    });

    return { embedding: embedding.data[0].embedding };
  } catch (error) {
    throw new Error("Error embedding hypothetical data");
  }
}

// Hypothetical Document Embedding (HyDe)
export async function generateHypotheticalData(
  chat: Chat,
  openai: OpenAI
): Promise<string> {
  try {
    console.log(
      "Generating hypothetical data...",
      HYDE_MODEL,
      HYDE_TEMPERATURE,
      HYDE_PROMPT(chat)
    );
    const response = await openai.chat.completions.create({
      model: HYDE_MODEL,
      temperature: HYDE_TEMPERATURE,
      messages: await convertToCoreMessages([
        {
          role: "system",
          content: HYDE_PROMPT(chat),
          citations: [],
        },
      ]),
    });

    return response.choices[0].message.content ?? "";
  } catch (error) {
    console.error("Error generating hypothetical data:", error);
    throw new Error("Error generating hypothetical data");
  }
}

export async function searchForChunksUsingEmbedding(
  embedding: number[],
  pineconeIndex: any,
  intentCategory?: string // optional intent tag like "technical", "networking"
): Promise<Chunk[]> {
  try {
    const { matches } = await pineconeIndex.query({
      vector: embedding,
      topK: QUESTION_RESPONSE_TOP_K,
      includeMetadata: true,
    });

    // Parse all chunks as before
    const allChunks = matches.map((match: any) =>
      chunkSchema.parse({
        text: match.metadata?.text ?? "",
        pre_context: match.metadata?.pre_context ?? "",
        post_context: match.metadata?.post_context ?? "",
        source_url: match.metadata?.source_url ?? "",
        source_description: match.metadata?.source_description ?? "",
        order: match.metadata?.order ?? 0,
        category: match.metadata?.category ?? "general",
      })
    );

    if (!intentCategory) return allChunks;

    // Rank chunks: put exact-category matches at top
    const rankedChunks = allChunks.sort((a, b) => {
      const aMatch = a.category === intentCategory ? 1 : 0;
      const bMatch = b.category === intentCategory ? 1 : 0;
      return bMatch - aMatch;
    });

    return rankedChunks;
  } catch (error) {
    throw new Error(
      "Error searching for chunks using embedding with category filtering."
    );
  }
}


export function aggregateSources(chunks: Chunk[]): Source[] {
  const sourceMap = new Map<string, Source>();

  chunks.forEach((chunk) => {
    if (!sourceMap.has(chunk.source_url)) {
      sourceMap.set(chunk.source_url, {
        chunks: [],
        source_url: chunk.source_url,
        source_description: chunk.source_description,
      });
    }
    sourceMap.get(chunk.source_url)!.chunks.push(chunk);
  });

  return Array.from(sourceMap.values());
}

export function sortChunksInSourceByOrder(source: Source): Source {
  source.chunks.sort((a, b) => a.order - b.order);
  return source;
}

export function getSourcesFromChunks(chunks: Chunk[]): Source[] {
  const sources = aggregateSources(chunks);
  return sources.map((source) => sortChunksInSourceByOrder(source));
}

export function buildContextFromOrderedChunks(
  chunks: Chunk[],
  citationNumber: number
): string {
  let context = "";
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    context += chunk.pre_context;
    context += " " + chunk.text + ` [${citationNumber}] `;
    if (
      i === chunks.length - 1 ||
      chunk.post_context !== chunks[i + 1].pre_context
    ) {
      context += chunk.post_context;
    }
    if (i < chunks.length - 1) {
      context += "\n\n";
    }
  }
  return context.trim();
}

export function getContextFromSource(
  source: Source,
  citationNumber: number
): string {
  return `
    <excerpt>
    Source Description: ${source.source_description}
    Source Citation: [${citationNumber}]
    Excerpt from Source [${citationNumber}]:
    ${buildContextFromOrderedChunks(source.chunks, citationNumber)}
    </excerpt>
  `;
}

export function getContextFromSources(sources: Source[]): string {
  return sources
    .map((source, index) => getContextFromSource(source, index + 1))
    .join("\n\n\n");
}

export function buildPromptFromContext(context: string): string {
  // TODO: yes, this is redundant
  return RESPOND_TO_QUESTION_SYSTEM_PROMPT(context);
}

export function getCitationsFromChunks(chunks: Chunk[]): Citation[] {
  return chunks.map((chunk) =>
    citationSchema.parse({
      source_url: chunk.source_url,
      source_description: chunk.source_description,
    })
  );
}
