export async function sendOrderToSheet(orderData: any) {
  try {
    console.log("📦 Sending order:", orderData);

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbyY4roNk1IXXM5fm6anIbEws9mFgCGjSU93X0d4BXpJ2eMK_4qHoAgxfxS-1spSEKA/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      }
    );

    if (response.ok) {
      alert("✅ تم إرسال الطلب بنجاح!");
    } else {
      alert("⚠️ حصل خطأ أثناء تسجيل الطلب.");
    }
  } catch (error) {
    console.error("❌ Google Sheet Error:", error);
    alert("⚠️ حصل خطأ أثناء إرسال البيانات، حاول مرة تانية.");
  }
}
