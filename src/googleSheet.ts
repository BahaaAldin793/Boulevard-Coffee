export async function sendOrderToSheet(orderData: any) {
  try {
    console.log("📦 Sending order:", orderData);

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzHnp5ffKM0YHVLHnt4olRi2aVec36p9k6lDeatFBH85zaeZXlZ0OIhEeJppzQhJkA/exec",
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
