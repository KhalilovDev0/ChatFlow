async function sendInstagramMessage(botId, customerId, text, accessToken) {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${botId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        recipient: { id: customerId },
        message: { text },
      }),
    },
  );

  const result = await response.json();

  if (!response.ok || result.error) {
    console.error("❌ Instagram message send error:", result.error || result);
    throw new Error("Instagram message could not be sent.");
  }

  return result;
}

module.exports = { sendInstagramMessage };
