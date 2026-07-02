const BAD_WORDS = [
  "fuck", "shit", "bitch", "asshole", "bastard", "cunt", "dick", "pussy",
  "madarchod", "bhenchod", "chutiya", "bhosdike", "randi", "gandu", "kamina",
  "whore", "slut", "motherfucker", "mc", "bc", "bsdk"
];

export function containsProfanity(text: string): boolean {
  if (!text) return false;
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const words = normalized.split(/\s+/);
  return words.some(word => BAD_WORDS.includes(word));
}
