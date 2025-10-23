// src/googleSheet.ts (النسخة المعدلة)

export async function sendOrderToSheet(orderData: any): Promise<boolean> { // <--- غيرنا هنا عشان يرجع boolean
  try {
    console.log("📦 Sending order:", orderData);

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbydyy1bJ63TMzZnkJGA9HbmS-5XemerOvLSjQ_dI4fUofFzmm_6r-6A503Ymfuhyw/exec", // <--- غيّر الرابط ده بالرابط الجديد
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData), // اتأكد إن orderData فيها البيانات صح
      }
    );

    // هنقرأ الرد من السيرفر عشان نعرف إذا كان نجح ولا لأ
    const responseData = await response.json(); 
    console.log("📄 Google Script Response:", responseData); // اطبع الرد عشان تشوفه

    // اتأكد إن response.ok وإن الرد اللي راجع فيه result: 'success'
    if (response.ok && responseData.result === 'success') { 
      return true; // <--- رجع true لو نجح
    } else {
      // لو السيرفر رجع خطأ أو response مش ok
      console.error("❌ Google Sheet Error:", responseData.message || 'Unknown error from script');
      alert(`⚠️ حصل خطأ أثناء تسجيل الطلب: ${responseData.message || 'خطأ غير معروف'}`);
      return false; // <--- رجع false لو فشل
    }
  } catch (error: any) {
    // خطأ في الاتصال نفسه (زي CORS اللي كان بيحصل، أو نت فاصل)
    console.error("❌ Fetch Error:", error);
    // ممكن نطبع رسالة الخطأ للمستخدم لو هي CORS
    let alertMessage = "⚠️ حصل خطأ أثناء إرسال البيانات، حاول مرة تانية.";
    if (error.message && error.message.includes('Failed to fetch')) {
        alertMessage = "⚠️ فشل الاتصال بالسيرفر (قد يكون بسبب CORS أو مشكلة في الشبكة). تأكد من إعدادات النشر وحاول مرة أخرى.";
    }
    alert(alertMessage);
    return false; // <--- رجع false لو فشل
  }
}