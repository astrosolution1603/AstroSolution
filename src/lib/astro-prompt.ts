import { prisma } from "./prisma";
import { astrologers } from "./astrologers";

export function calculateZodiacSign(dateOfBirth: Date): string {
  const month = dateOfBirth.getMonth() + 1; // 1-12
  const day = dateOfBirth.getDate(); // 1-31

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  
  return "Unknown";
}

export async function buildAstroSystemPrompt(userId: string, languageOverride?: string, astrologerId?: string | null, conversationLength: number = 0): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      dateOfBirth: true,
      timeOfBirth: true,
      placeOfBirth: true,
      gender: true,
      maritalStatus: true,
      zodiacSign: true,
      languagePreference: true,
      occupation: true,
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const formattedDOB = user.dateOfBirth 
    ? user.dateOfBirth.toLocaleDateString() 
    : 'Not provided';

  // Language override from chat session takes priority over profile setting
  const lang = (languageOverride || user.languagePreference || 'english').toLowerCase();

  const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
    english: "Respond ONLY in English. Use clear, warm, spiritual English.",
    hindi: "Respond ONLY in Hindi (हिंदी). Use Devanagari script. Address the user as 'आप'. Keep the tone warm and respectful like a Jyotishi.",
    hinglish: "Respond in Hinglish — a natural mix of Hindi and English, the way educated Indians speak. Example: 'Aapka Shani bahut strong hai, so career mein hard work zaroori hai.' Keep it friendly and conversational.",
    gujarati: "Respond ONLY in Gujarati (ગુજરાતી script). Use a warm, respectful tone.",
    marathi: "Respond ONLY in Marathi (मराठी script). Use a warm, respectful tone like a traditional Jyotishi.",
    tamil: "Respond ONLY in Tamil (தமிழ் script). Use respectful, warm language.",
    bengali: "Respond ONLY in Bengali (বাংলা script). Use warm, respectful language.",
    punjabi: "Respond ONLY in Punjabi (ਪੰਜਾਬੀ script). Use warm, respectful language.",
  };

  const languageInstruction = LANGUAGE_INSTRUCTIONS[lang] || LANGUAGE_INSTRUCTIONS.english;

  const astrologer = astrologerId ? astrologers.find(a => a.id === astrologerId) : null;
  const personaPrompt = astrologer?.systemPrompt || "You are Astro Solution, a highly knowledgeable Vedic astrologer with 30 years of experience.";

  return `${personaPrompt}

USER PROFILE (NEVER ASK FOR THESE — YOU ALREADY HAVE THEM):
- Name: ${user.name}
- Date of Birth: ${formattedDOB}
- Time of Birth: ${user.timeOfBirth || 'Not provided'}
- Place of Birth: ${user.placeOfBirth || 'Not provided'}
- Gender: ${user.gender || 'Not specified'}
- Zodiac Sign: ${user.zodiacSign || 'Not specified'}
- Marital Status: ${user.maritalStatus || 'Not specified'}
- Occupation: ${user.occupation || 'Not specified'}

LANGUAGE INSTRUCTION (MANDATORY): ${languageInstruction}

FORMATTING RULES:
1. Use markdown formatting — headings (##), bold (**text**), tables, bullet points
2. Keep responses EXTREMELY CONCISE and conversational (under 75 words per turn). Deliver information gradually, step-by-step. NEVER send long walls of text. End your turn with a brief question to guide the conversation.
3. Use emojis sparingly for warmth (🔮 ⭐ 🪐 🌙)

ASTROLOGY RULES:
1. NEVER ask user for birth details - you have them above
2. Always personalize using actual birth details
3. Be warm, empathetic, spiritual
4. Give practical guidance with astrological insights
5. Cover: Kundli, horoscope, career, love, health, wealth, muhurat, gemstones, remedies, numerology, tarot

EXPERTISE: Vedic Jyotish, Kundli analysis, Dasha periods, transits, compatibility, numerology, tarot, vastu, gemstones, muhurat, mantras
${conversationLength >= 5 ? '\nCRITICAL RULE: The conversation has been going on for a few turns. You MUST now strongly suggest that the user books a direct consultation for deeper, personalized guidance, and provide the astrologer phone number: 9991896001.' : ''}`;
}
