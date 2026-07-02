export interface UserProfile {
  id: string;
  name: string;
  email: string;
  dateOfBirth?: Date;
  timeOfBirth?: string;
  placeOfBirth?: string;
  zodiacSign?: string;
  gender?: string;
  maritalStatus?: string;
  occupation?: string;
  languagePreference: string;
  profileComplete: boolean;
}

export interface ChatMessageType {
  id: string;
  role: string;
  content: string;
  createdAt: Date;
}

export interface ChatSessionWithMessages {
  id: string;
  title: string;
  updatedAt: Date;
  messages: ChatMessageType[];
}
