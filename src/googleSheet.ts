export async function sendOrderToSheet(orderData: any) {
  try {
    console.log("📦 Sending order:", orderData);

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycby3aGGkbRziDlTE3ZBcBJ8dSEeslwnl0_O4oVohZ2pybtvSxneHGXZ0keLEPlTwDs-0/exec",
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
