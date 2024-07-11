// qrcode_generator.js
function crc16xmodem(str) {
    const crcTable = [
        0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50A5, 0x60C6, 0x70E7,
        0x8108, 0x9129, 0xA14A, 0xB16B, 0xC18C, 0xD1AD, 0xE1CE, 0xF1EF
    ];
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
        let byte = str.charCodeAt(i);
        let c = ((crc >> 12) ^ (byte >> 4)) & 0x0F;
        crc = crcTable[c] ^ (crc << 4);
        c = ((crc >> 12) ^ (byte & 0x0F)) & 0x0F;
        crc = crcTable[c] ^ (crc << 4);
    }
    return crc & 0xFFFF;
  }
  
  function generatePayload(type, value, amount, ref1, ref2) {
    const ID_PAYLOAD_FORMAT = '00';
    const ID_POI_METHOD = '01';
    const ID_MERCHANT_INFORMATION_BOT = '29';
    const ID_TRANSACTION_CURRENCY = '53';
    const ID_TRANSACTION_AMOUNT = '54';
    const ID_COUNTRY_CODE = '58';
    const ID_CRC = '63';
    const ID_ADDITIONAL_DATA_FIELD = '62';
  
    const PAYLOAD_FORMAT_EMV_QRCPS_MERCHANT_PRESENTED_MODE = '01';
    const POI_METHOD_STATIC = '11';
    const POI_METHOD_DYNAMIC = '12';
    const MERCHANT_INFORMATION_TEMPLATE_ID_GUID = '00';
    const BOT_ID_MERCHANT_PHONE_NUMBER = '01';
    const BOT_ID_MERCHANT_TAX_ID = '02';
    const BOT_ID_MERCHANT_EWALLET_ID = '03';
    const BOT_ID_MERCHANT_REGISTRATION_ID = '30';
    const BOT_ID_MERCHANT_BILLER_ID = '05';
    const GUID_PROMPTPAY = 'A000000677010111';
    const TRANSACTION_CURRENCY_THB = '764';
    const COUNTRY_CODE_TH = 'TH';
  
    value = sanitizeTarget(value);
  
    let targetType;
    if (type === '05') {
      targetType = BOT_ID_MERCHANT_BILLER_ID;
    } else if (value.length >= 15) {
      targetType = BOT_ID_MERCHANT_EWALLET_ID;
    } else if (value.length === 13) {
      targetType = BOT_ID_MERCHANT_TAX_ID;
    } else {
      targetType = BOT_ID_MERCHANT_PHONE_NUMBER;
    }
  
    let data = [
        f(ID_PAYLOAD_FORMAT, PAYLOAD_FORMAT_EMV_QRCPS_MERCHANT_PRESENTED_MODE),
        f(ID_POI_METHOD, amount ? POI_METHOD_DYNAMIC : POI_METHOD_STATIC),
        f(ID_MERCHANT_INFORMATION_BOT, serialize([
            f(MERCHANT_INFORMATION_TEMPLATE_ID_GUID, GUID_PROMPTPAY),
            f(targetType, formatTarget(value))
        ])),
        f(ID_COUNTRY_CODE, COUNTRY_CODE_TH),
        f(ID_TRANSACTION_CURRENCY, TRANSACTION_CURRENCY_THB),
        amount && f(ID_TRANSACTION_AMOUNT, formatAmount(amount))
    ];
  
    if (type === '05' && ref1 && ref2) {
        data.push(f(ID_ADDITIONAL_DATA_FIELD, serialize([
            f('01', ref1),
            f('02', ref2)
        ])));
    }
  
    let dataToCrc = serialize(data) + ID_CRC + '04';
    data.push(f(ID_CRC, formatCrc(crc16xmodem(dataToCrc))));
    return serialize(data);
  }
  
  function f(id, value) {
    return [id, ('00' + value.length).slice(-2), value].join('');
  }
  
  function serialize(xs) {
    return xs.filter(function (x) { return x }).join('');
  }
  
  function sanitizeTarget(id) {
    return id.replace(/[^0-9]/g, '');
  }
  
  function formatTarget(id) {
    const numbers = sanitizeTarget(id);
    if (numbers.length >= 13) return numbers;
    return ('0000000000000' + numbers.replace(/^0/, '66')).slice(-13);
  }
  
  function formatAmount(amount) {
    return amount.toFixed(2);
  }
  
  function formatCrc(crcValue) {
    return ('0000' + crcValue.toString(16).toUpperCase()).slice(-4);
  }
  
  function formatQRField(prefix, value) {
    if (value.length < 10) {
      value = prefix + "0" + value.length + value;
    } else {
      value = prefix + value.length + value;
    }
    return value;
  }
  
  function formatReceiverIDForQR(value) {
    let checkAmount = value.split(".");
  
    if (checkAmount.length > 1) {
      if (checkAmount[1] === "" || checkAmount[1].length === 0) {
        checkAmount[1] = "00";
      } else if (checkAmount[1].length === 1) {
        checkAmount[1] += "0";
      } else if (checkAmount[1].length > 2) {
        checkAmount[1] = checkAmount[1].slice(0, 2);
      }
  
      value = checkAmount[0] + "." + checkAmount[1];
    } else if (checkAmount.length === 1) {
      value = value + ".00";
    }
  
    value = formatQRField("54", value);
    return value;
  }
  
  function generateBillPaymentQRCode(recipientId, merchantName, reference1, reference2, amount) {
    const amountStr = formatReceiverIDForQR(amount.toFixed(2));
  
    reference1 = reference1.toUpperCase();
    reference2 = reference2.toUpperCase();
  
    const PFI = formatQRField("00", "01");
    const PIM = formatQRField("01", "11");
  
    const AID = formatQRField("00", "A000000677010112");
    const billerId = formatQRField("01", recipientId);
    const ref1 = formatQRField("02", reference1);
    const ref2 = formatQRField("03", reference2);
  
    const merchantSum = AID + billerId + ref1 + ref2;
    const merchantIdentifier = formatQRField("30", merchantSum);
  
    const Currency = formatQRField("53", "764");
    const Amount = amountStr;
    const Country = formatQRField("58", "TH");
    const Name = formatQRField("59", merchantName);
  
    const sum = PFI + PIM + merchantIdentifier + Currency + Amount + Country + Name;
    const crc = crc16xmodem(sum + "6304").toString(16).toUpperCase();
    const crcField = formatQRField("63", crc);
  
    const payload = sum + crcField;
  
    return payload;
  }
  