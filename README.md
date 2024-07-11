# PromptPay QR Code Generator

This project is a web-based application to generate PromptPay QR codes for different types of PromptPay IDs. The application supports generating QR codes for Phone Numbers, National IDs, Tax IDs, Wallet IDs, and Biller IDs.

โปรเจคนี้เป็นแอพพลิเคชั่นบนเว็บที่ใช้สร้าง QR Code ของ PromptPay สำหรับ PromptPay ID หลายประเภท แอพพลิเคชั่นนี้รองรับการสร้าง QR Code สำหรับหมายเลขโทรศัพท์, เลขบัตรประชาชน, เลขที่ผู้เสียภาษี, เลขที่กระเป๋าเงิน และเลขที่ผู้เรียกเก็บเงิน

## Features

- Generate PromptPay QR codes for various types of PromptPay IDs
- Option to include an amount for payment
- Additional fields for Biller ID including Merchant Name, Reference 1, and Reference 2
- Displays generated QR code and payload for easy copy-pasting

![Demo](https://github.com/golangler/promptpay-qr-tool/blob/main/video-to-gif-converter.gif)

## Getting Started

### Prerequisites

To run this project, you need a web browser with JavaScript enabled.

เพื่อใช้งานโปรเจคนี้ คุณต้องมีเว็บเบราว์เซอร์ที่รองรับการใช้งาน JavaScript

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/promptpay-qr-tool.git
    ```

2. Navigate to the project directory:
    ```sh
    cd promptpay-qr-tool
    ```

3. Open `index.html` in your web browser:
    ```sh
    open index.html
    ```

## Usage

1. Select the type of PromptPay ID from the dropdown menu.
2. Enter the PromptPay ID in the provided field.
3. If you select "Biller ID," additional fields for Merchant Name, Reference 1, and Reference 2 will appear.
4. Optionally, enter the amount for the payment.
5. Click "Generate QR Code" to generate the QR code and see the payload.

1. เลือกประเภทของ PromptPay ID จากเมนูดรอปดาวน์
2. กรอก PromptPay ID ในช่องที่ให้ไว้
3. ถ้าคุณเลือก "Biller ID" ช่องเพิ่มเติมสำหรับ Merchant Name, Reference 1, และ Reference 2 จะปรากฏขึ้น
4. เลือกใส่จำนวนเงินสำหรับการชำระเงินได้ตามต้องการ
5. คลิก "Generate QR Code" เพื่อสร้าง QR Code และดู payload

## Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PromptPay QR Code Generator</title>
  <script src="qrcode.min.js"></script>
  <script src="qrcode_generator.js"></script>
  <style>
    .extra-fields {
      display: none;
    }
  </style>
</head>
<body>
  <h1>PromptPay QR Code Generator</h1>
  <form id="promptpay-form">
    <label for="pp-type">PromptPay Type:</label>
    <select id="pp-type" name="pp-type">
      <option value="01">Phone Number</option>
      <option value="02">National ID</option>
      <option value="03">Reg No. or Tax ID</option>
      <option value="04">Wallet ID</option>
      <option value="05">Biller ID</option>
    </select>
    <br>
    <label for="pp-value">PromptPay ID:</label>
    <input type="text" id="pp-value" name="pp-value" required>
    <br>
    <div class="extra-fields" id="extra-fields">
      <label for="pp-merchant-name">Merchant Name:</label>
      <input type="text" id="pp-merchant-name" name="pp-merchant-name">
      <br>
      <label for="pp-ref1">Reference 1:</label>
      <input type="text" id="pp-ref1" name="pp-ref1">
      <br>
      <label for="pp-ref2">Reference 2:</label>
      <input type="text" id="pp-ref2" name="pp-ref2">
      <br>
    </div>
    <label for="pp-amount">Amount (optional):</label>
    <input type="number" id="pp-amount" name="pp-amount" step="0.01">
    <br>
    <button type="submit">Generate QR Code</button>
  </form>
  <div id="qrcode"></div>
  <div id="payload"></div>

  <script>
    document.getElementById('pp-type').addEventListener('change', function() {
      var extraFields = document.getElementById('extra-fields');
      if (this.value === '05') {
          extraFields.style.display = 'block';
      } else {
          extraFields.style.display = 'none';
      }
    });

    document.getElementById('promptpay-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const ppType = document.getElementById('pp-type').value;
      const ppValue = document.getElementById('pp-value').value;
      const ppAmount = document.getElementById('pp-amount').value ? parseFloat(document.getElementById('pp-amount').value) : null;
      const ppRef1 = document.getElementById('pp-ref1').value;
      const ppRef2 = document.getElementById('pp-ref2').value;
      const ppMerchantName = document.getElementById('pp-merchant-name').value;

      let payload;

      if (ppType === '05') {
        payload = generateBillPaymentQRCode(ppValue, ppMerchantName, ppRef1, ppRef2, ppAmount);
      } else {
        payload = generatePayload(ppType, ppValue, ppAmount, ppRef1, ppRef2);
      }

      var qrcodeContainer = document.getElementById('qrcode');
      qrcodeContainer.innerHTML = '';
      new QRCode(qrcodeContainer, {
        text: payload,
        width: 256,
        height: 256
      });

      document.getElementById("payload").innerText = payload;
    });
  </script>
</body>
</html>

```

License
ถ้าแก้ก็แบ่งมา share กันด้วย จะได้ช่วยกัน update นะ

mail me at krit@enersys.co.th
