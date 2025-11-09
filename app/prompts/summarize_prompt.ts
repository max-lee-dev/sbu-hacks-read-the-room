export const buildSummarizePrompt = (pass1Json: string) => `
You are given a JSON object extracted from a previous step. Convert it into a smaller, UI-ready JSON object with these EXACT keys:

{
  "mood": string,
  "noiseLevel": "low" | "medium" | "high" | null,
  "suggestions": [{"text": string, "frame": number | null}],
  "transcription": string
}

Rules:

1. "mood"
   - 1–2 sentences explaining how people typically behave in this setting and how the user should act to fit in.
   - NOT an emotion word like "focused" — it is practical behavior guidance.
   - Example for a library: "Libraries are quiet, focused spaces where most people are reading or studying, so it's best to keep your voice low and avoid interrupting others."

2. "noiseLevel"
   - Copy directly from the input JSON's "noiseLevel" field.
   - This field is REQUIRED and MUST be included in your output.
   - Use the exact value: "low", "medium", "high", or null.

3. "suggestions"
   - Use up to 3 approachable people and up to 3 avoid targets.
   - Each item MUST be: { "text": string, "frame": number | null }.
   - "frame" must come from \`"first_seen"\` of that person.
   - If the suggestion is general (not tied to a person), \`"frame": null\`.
   - Do NOT include person IDs in the text, only clothing color + location.

4. "transcription"
   - A short paragraph that:
     * Starts with the mood,
     * Describes visible people using clothing + location + action,
     * Briefly restates who is good to approach vs avoid,
     * No person IDs.

5. Output ONLY valid JSON. No markdown, no intro text, no extra keys.

----------------------------------------

📌 EXAMPLE PASS 2 OUTPUT (based on the Pass 1 library example above)

{
  "mood": "You appear to be in a library. Libraries are quiet, focused spaces where most people are reading or studying, so it's best to keep your voice low and avoid interrupting others.",
  "noiseLevel": "low",
  "suggestions": [
    {
      "text": "You could try talking to the person in the blue shirt near the entrance — they're looking around and seem open to a brief interaction.",
      "frame": 4
    },
    {
      "text": "Avoid the person in the gray shirt at the table — they're focused on reading.",
      "frame": 0
    },
    {
      "text": "Avoid the person in black by the window — they're typing on a laptop and appear busy.",
      "frame": 2
    },
    {
      "text": "If you do speak, keep your volume low to match the environment.",
      "frame": null
    }
  ],
  "transcription": "You appear to be in a library, where most people are reading or studying quietly. One person in a gray shirt is sitting at a table reading, another in a blue shirt is near the entrance looking around, and someone in black is working on a laptop by the window. The person near the entrance seems most open to approach, while the others are focused and best left alone."
}

----------------------------------------

Now generate the UI-ready JSON using this input:

<<<
${pass1Json}
>>>
`;

