exports.sendPushNotification = async (expoPushToken, message) => {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: expoPushToken,
      sound: "default",
      title: "Jobsy Notification",
      body: message,
    }),
  });
};
