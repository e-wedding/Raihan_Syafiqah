// ========================================
// OPTIMIZED WEDDING INVITATION API
// Turbo-charged for mobile performance
// ========================================

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ucapan');
    const data = JSON.parse(e.postData.contents);
    
    // Simpan ucapan baru
    sheet.appendRow([new Date(), data.nama, data.ucapan]);
    
    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // ========================================
  // OPTIMIZATION 1: Specific range (not entire sheet)
  // ========================================
  
  // 1. Ambil Data Ucapan
  const sheetUcapan = ss.getSheetByName('Ucapan');
  const lastRowUcapan = sheetUcapan.getLastRow();

  // OPTIMIZATION 2: Only read rows with data (skip header row)
  const wishes = lastRowUcapan > 1 ? 
    sheetUcapan.getRange(2, 1, lastRowUcapan - 1, 3).getValues().map(r => ({
      t: r[0], // tarikh (raw date)
      n: r[1], // nama
      u: r[2]  // ucapan
    })).reverse() : [];

  // 2. Ambil Data Kenalan
  const sheetKenalan = ss.getSheetByName('Kenalan');
  const lastRowKenalan = sheetKenalan.getLastRow();
  
  // OPTIMIZATION 4: Specific range for contacts
  const rawContacts = lastRowKenalan > 1 ? 
    sheetKenalan.getRange(2, 1, lastRowKenalan - 1, 4).getValues() : [];
  
  // OPTIMIZATION 5: Minimal mapping - no WhatsApp logic in GAS
  const contacts = rawContacts.map(r => ({
    k: r[0], // kategori
    n: r[1], // nama
    p: r[2], // peranan
    a: r[3]  // paparan (phone)
  }));
  
  // OPTIMIZATION 6: Compressed JSON keys (smaller payload)
  const responseData = {
    w: wishes,    // wishes
    c: contacts   // contacts
  };

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}
