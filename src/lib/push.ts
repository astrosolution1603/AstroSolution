import webpush from "web-push";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

if (env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY && env.VAPID_SUBJECT) {
  webpush.setVapidDetails(
    env.VAPID_SUBJECT,
    env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    env.VAPID_PRIVATE_KEY
  );
}

export async function sendPushNotification(userId: string, title: string, body: string, url: string = "/") {
  if (!env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY) {
    console.warn("Push notifications not configured.");
    return;
  }

  const subscriptions = await prisma.notificationSubscription.findMany({
    where: { userId }
  });

  if (subscriptions.length === 0) return;

  const payload = JSON.stringify({ title, body, url });

  const notifications = subscriptions.map(sub => {
    return webpush.sendNotification(
      {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth }
      },
      payload
    ).catch(async (err) => {
      if (err.statusCode === 404 || err.statusCode === 410) {
        // Subscription expired or unsubscribed
        await prisma.notificationSubscription.delete({ where: { id: sub.id } });
      } else {
        console.error("Error sending push to", sub.endpoint, err);
      }
    });
  });

  await Promise.allSettled(notifications);
}
