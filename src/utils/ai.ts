import { LLMRequest, LLMResponse, LLMConfig } from "../types/ai.js";

export async function callLLM(
  config: LLMConfig,
  prompt: string,
): Promise<string> {
  const request: LLMRequest = {
    model: config.model,
    messages: [
      {
        role: "system",
        content: `Transform the following raw thoughts into a well-structured blog post in Markdown format.
- Correct grammar and sentence structure
- Improve readability and flow
- Add appropriate headings (H2, H3) for sections
- Preserve the user's original writing style and vocabulary
- DO NOT add new content or expand beyond what's provided
- DO NOT change the meaning or intent of the original text
- Use Markdown syntax for formatting
- Keep the tone consistent with the original`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    };

    if (config.siteUrl) {
      headers["HTTP-Referer"] = config.siteUrl;
    }

    if (config.siteName) {
      headers["X-Title"] = config.siteName;
    }

    const response = await fetch(config.endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `LLM API request failed: ${response.status} ${response.statusText}\n${errorText}`,
      );
    }

    const data: LLMResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error("LLM API returned no choices");
    }

    const generatedContent = data.choices[0].message.content;

    if (!generatedContent) {
      throw new Error("LLM API returned empty content");
    }
    return generatedContent;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`LLM processing failed: ${error.message}`);
    }
    throw new Error("LLM processing failed");
  }
}

export async function generateBlogPost(
  config: LLMConfig,
  rawText: string,
): Promise<string> {
  if (!rawText || rawText.trim().length === 0) {
    throw new Error("Raw text cannot be empty");
  }

  return await callLLM(config, rawText);
}
