import { prisma } from "@/lib/prisma";
import ThemeSettingsClient from "./ThemeSettingsClient";

export default async function ThemeSettingsPage() {
  let initialTheme = "cosmic";
  
  try {
    const settings = await prisma.platformSettings.findUnique({
      where: { id: "global" }
    });
    if (settings) {
      initialTheme = settings.themeName;
    }
  } catch (e) {
    console.error("Failed to fetch initial theme:", e);
  }

  return <ThemeSettingsClient initialTheme={initialTheme} />;
}
