import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  let fast2smsKey = "";
  let otpTemplate = "Your Astro Solution OTP is {#OTP#}. Do not share this.";
  let inAppNotificationsEnabled = true;
  
  try {
    const settings = await prisma.platformSettings.findUnique({
      where: { id: "global" }
    });
    if (settings) {
      fast2smsKey = settings.fast2smsKey || "";
      inAppNotificationsEnabled = settings.inAppNotificationsEnabled;
      if (settings.otpMessageTemplate) {
        otpTemplate = settings.otpMessageTemplate;
      }
    }
  } catch (e) {
    console.error("Failed to fetch settings:", e);
  }

  return <SettingsClient 
    initialFast2smsKey={fast2smsKey} 
    initialOtpTemplate={otpTemplate} 
    initialInAppNotificationsEnabled={inAppNotificationsEnabled}
  />;
}
