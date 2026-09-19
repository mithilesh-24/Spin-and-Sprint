/**
 * GOOGLE APPS SCRIPT FOR SPIN & WHEEL — RENAISSANCE 2026
 */

// Full Exact Google Sheet URLs (Avoids any ID copy-paste typo):
var SPREADSHEETS = {
  "1st Year": "https://docs.google.com/spreadsheets/d/1FyEnYQsyq_xTi0iGVl-EWEv5599tSzsm-YTG15MKNgc/edit",
  "2nd Year": "https://docs.google.com/spreadsheets/d/1s55VQBx_LxNHcHkx1UP7wfeoBPffpJIb8ce-FQFOEyM/edit"
};

function getSpreadsheetForYear(year) {
  var yearStr = (year || "2nd Year").toString().toLowerCase();
  var isFirstYear = (yearStr.indexOf("1") !== -1 || yearStr.indexOf("first") !== -1);
  var targetKey = isFirstYear ? "1st Year" : "2nd Year";
  var targetUrl = SPREADSHEETS[targetKey];

  try {
    return SpreadsheetApp.openByUrl(targetUrl);
  } catch (urlErr) {
    var match = targetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      return SpreadsheetApp.openById(match[1]);
    }
    throw new Error("Unable to open " + targetKey + " Spreadsheet. Please verify Drive access. Error: " + urlErr.message);
  }
}

// =========================================================================
// TEST FUNCTION: Select 'testConnection' and click ▶️ Run
// =========================================================================
function testConnection() {
  Logger.log("=========================================");
  Logger.log("Testing 1st Year Spreadsheet...");
  var ss1 = getSpreadsheetForYear("1st Year");
  Logger.log("✅ SUCCESS 1st Year: " + ss1.getName());

  Logger.log("-----------------------------------------");
  Logger.log("Testing 2nd Year Spreadsheet...");
  var ss2 = getSpreadsheetForYear("2nd Year");
  Logger.log("✅ SUCCESS 2nd Year: " + ss2.getName());
  Logger.log("=========================================");
}

function sanitizeSheetName(name) {
  if (!name) return "Team";
  var clean = name.toString().replace(/[:\\\/\?\*\[\]]/g, "").trim();
  return clean.substring(0, 50) || "Team";
}

// =========================================================================
// POST HANDLER: REGISTRATION & SPIN RESULTS
// =========================================================================
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Acquire script lock (wait up to 30 seconds for concurrent requests to queue safely)
    lock.waitLock(30000);

    var data = JSON.parse(e.postData.contents);
    var action = data.action || "spin_result";
    var year = data.year || "2nd Year";
    var ss = getSpreadsheetForYear(year);

    if (!ss) {
      throw new Error("Unable to access target spreadsheet for year: " + year);
    }

    var teamName = (data.teamName || "Unnamed Team").trim();
    var member1Name = (data.member1Name || "").trim();
    var member1Roll = (data.member1Roll || "").trim().toUpperCase();
    var member2Name = (data.member2Name || "").trim();
    var member2Roll = (data.member2Roll || "").trim().toUpperCase();
    var entryTime = data.entryTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Ensure "Main" overview sheet exists
    var mainSheet = ss.getSheetByName("Main");
    if (!mainSheet) {
      mainSheet = ss.insertSheet("Main", 0);
    }

    if (mainSheet.getLastRow() === 0) {
      mainSheet.appendRow([
        "S.No",
        "Team Name",
        "Team Member 1",
        "Member 1 Roll Number",
        "Team Member 2",
        "Member 2 Roll Number",
        "Entry Time",
        "Question Count",
        "Status"
      ]);
      mainSheet.getRange("A1:I1").setFontWeight("bold").setBackground("#E23636").setFontColor("#FFFFFF");
    }

    // 2. Find or create team row in "Main"
    var mainData = mainSheet.getDataRange().getValues();
    var existingMainRowIndex = -1;
    var currentQuestionCount = 0;
    var recordedTeamName = teamName;

    for (var r = 1; r < mainData.length; r++) {
      var r1 = (mainData[r][3] || "").toString().trim().toUpperCase();
      var r2 = (mainData[r][5] || "").toString().trim().toUpperCase();
      var tName = (mainData[r][1] || "").toString().trim();

      var isRollMatch = (member1Roll && member2Roll) &&
        ((r1 === member1Roll && r2 === member2Roll) || (r1 === member2Roll && r2 === member1Roll));
      var isNameMatch = (teamName && tName.toLowerCase() === teamName.toLowerCase());

      if (isRollMatch || isNameMatch) {
        existingMainRowIndex = r + 1;
        currentQuestionCount = parseInt(mainData[r][7], 10) || 0;
        recordedTeamName = tName || teamName;
        break;
      }
    }

    if (existingMainRowIndex === -1) {
      var newSNo = Math.max(1, mainSheet.getLastRow());
      mainSheet.appendRow([
        newSNo,
        teamName,
        member1Name,
        member1Roll,
        member2Name,
        member2Roll,
        entryTime,
        action === "spin_result" ? 1 : 0,
        "Active"
      ]);
      existingMainRowIndex = mainSheet.getLastRow();
      currentQuestionCount = action === "spin_result" ? 1 : 0;
    } else if (action === "spin_result") {
      currentQuestionCount++;
      mainSheet.getRange(existingMainRowIndex, 8).setValue(currentQuestionCount);
    }

    // 3. Find or create single team tab (Ultra-fast direct lookup for high concurrency)
    var tabName = sanitizeSheetName(recordedTeamName || teamName);
    var teamSheet = ss.getSheetByName(tabName);

    if (!teamSheet) {
      try {
        teamSheet = ss.insertSheet(tabName);
      } catch (insertErr) {
        teamSheet = ss.getSheetByName(tabName) || ss.insertSheet(tabName.substring(0, 40) + "_" + (new Date().getTime() % 10000));
      }
    }

    // 4. Initialize team tab template if empty
    if (teamSheet.getLastRow() === 0) {
      teamSheet.appendRow(["TEAM DETAILS — RENAISSANCE 2026", "", "", "", "", "", "", ""]);
      teamSheet.appendRow(["Team Name:", recordedTeamName || teamName, "Year Track:", year, "Entry Time:", entryTime, "", ""]);
      teamSheet.appendRow(["Member 1:", member1Name, "Roll Number:", member1Roll, "", "", "", ""]);
      teamSheet.appendRow(["Member 2:", member2Name, "Roll Number:", member2Roll, "", "", "", ""]);
      teamSheet.appendRow(["", "", "", "", "", "", "", ""]);
      teamSheet.appendRow([
        "S.No",
        "Question Number",
        "Question Name",
        "Question Pattern",
        "Difficulty",
        "Spin Time",
        "Time Taken",
        "Status"
      ]);

      teamSheet.getRange("A1:H1").setFontWeight("bold").setBackground("#0c142c").setFontColor("#FFFFFF");
      teamSheet.getRange("A6:H6").setFontWeight("bold").setBackground("#E23636").setFontColor("#FFFFFF");
    }

    // 5. Append spin row if action is spin_result
    if (action === "spin_result" && data.questionNumber) {
      var spinSNo = Math.max(1, teamSheet.getLastRow() - 5);
      var spinTime = data.spinTime || new Date().toLocaleTimeString();

      teamSheet.appendRow([
        spinSNo,
        data.questionNumber || "",
        data.questionName || "",
        data.questionPattern || "",
        data.difficulty || data.questionDifficulty || "Medium",
        spinTime,
        "Solving...",
        "In Progress"
      ]);
    }

    // 6. Update solve time if action is solve_time
    if (action === "solve_time" && data.questionNumber) {
      var tData = teamSheet.getDataRange().getValues();
      for (var rowIdx = tData.length - 1; rowIdx >= 6; rowIdx--) {
        if (tData[rowIdx][1] === data.questionNumber) {
          teamSheet.getRange(rowIdx + 1, 7).setValue(data.timeTaken || "Completed");
          teamSheet.getRange(rowIdx + 1, 8).setValue("Completed");
          break;
        }
      }
    }

    SpreadsheetApp.flush();

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      year: year,
      spreadsheetName: ss.getName(),
      teamName: recordedTeamName,
      questionCount: currentQuestionCount
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// =========================================================================
// GET HANDLER: LOOKUPS & DUPLICATE CHECKS
// =========================================================================
function doGet(e) {
  try {
    var action = e.parameter.action;
    var year = e.parameter.year || "2nd Year";
    var ss = getSpreadsheetForYear(year);

    if (action === "lookup") {
      var searchName = (e.parameter.name || "").trim().toLowerCase();
      var searchRoll = (e.parameter.roll || "").trim().toUpperCase();

      var mainSheet = ss.getSheetByName("Main") || ss.getActiveSheet();
      if (mainSheet) {
        var data = mainSheet.getDataRange().getValues();
        for (var i = 1; i < data.length; i++) {
          var m1Name = (data[i][2] || "").toString().trim().toLowerCase();
          var m1Roll = (data[i][3] || "").toString().trim().toUpperCase();
          var m2Name = (data[i][4] || "").toString().trim().toLowerCase();
          var m2Roll = (data[i][5] || "").toString().trim().toUpperCase();

          if (searchRoll) {
            if (m1Roll === searchRoll) {
              return ContentService.createTextOutput(JSON.stringify({
                found: true,
                participant: { name: data[i][2], rollNumber: m1Roll }
              })).setMimeType(ContentService.MimeType.JSON);
            }
            if (m2Roll === searchRoll) {
              return ContentService.createTextOutput(JSON.stringify({
                found: true,
                participant: { name: data[i][4], rollNumber: m2Roll }
              })).setMimeType(ContentService.MimeType.JSON);
            }
          }

          if (searchName) {
            if (m1Name === searchName) {
              return ContentService.createTextOutput(JSON.stringify({
                found: true,
                participant: { name: data[i][2], rollNumber: m1Roll }
              })).setMimeType(ContentService.MimeType.JSON);
            }
            if (m2Name === searchName) {
              return ContentService.createTextOutput(JSON.stringify({
                found: true,
                participant: { name: data[i][4], rollNumber: m2Roll }
              })).setMimeType(ContentService.MimeType.JSON);
            }
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ found: false })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "checkTeam") {
      var r1 = (e.parameter.roll1 || "").trim().toUpperCase();
      var r2 = (e.parameter.roll2 || "").trim().toUpperCase();

      var mainS = ss.getSheetByName("Main");
      if (mainS) {
        var mData = mainS.getDataRange().getValues();
        for (var k = 1; k < mData.length; k++) {
          var mr1 = (mData[k][3] || "").toString().trim().toUpperCase();
          var mr2 = (mData[k][5] || "").toString().trim().toUpperCase();
          if ((mr1 === r1 && mr2 === r2) || (mr1 === r2 && mr2 === r1)) {
            return ContentService.createTextOutput(JSON.stringify({
              alreadyParticipated: true,
              teamName: mData[k][1]
            })).setMimeType(ContentService.MimeType.JSON);
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ alreadyParticipated: false })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "ready",
      year: year,
      spreadsheetName: ss.getName()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
