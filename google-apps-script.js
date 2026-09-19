/**
 * GOOGLE APPS SCRIPT FOR SPIN & WHEEL — RENAISSANCE 2026
 * 
 * ARCHITECTURE (EXACTLY 2 SPREADSHEETS):
 * 1. Renaissance 2026 — 1st Year (Spreadsheet 1)
 *    ├── Main (List of all 1st Year teams)
 *    ├── Team Alpha (Inner tab for Team Alpha)
 *    ├── Team Beta (Inner tab for Team Beta)
 *    └── ...
 * 
 * 2. Renaissance 2026 — 2nd Year (Spreadsheet 2)
 *    ├── Main (List of all 2nd Year teams)
 *    ├── Elements (Inner tab for Team Elements)
 *    ├── Avengers (Inner tab for Team Avengers)
 *    └── ...
 * 
 * RULES:
 * - EXACTLY 2 Google Spreadsheet files in Google Drive.
 * - ONE single Web App URL in .env (VITE_GOOGLE_SCRIPT_URL).
 * - React sends { year: "1st Year" / "2nd Year", teamName, member1Roll, member2Roll, ... }.
 * - Apps Script routes to the correct year spreadsheet, finds/creates ONE team tab, updates Main, and appends spin history rows.
 * - NEVER creates duplicate tabs or multiple spreadsheet files.
 */

// =========================================================================
// 1. CONFIGURE YOUR 2 SPREADSHEET IDs HERE
// =========================================================================
var SPREADSHEET_IDS = {
  "1st Year": "", // e.g. "1aBcD1234567890XYZ_FIRST_YEAR_ID"
  "2nd Year": ""  // e.g. "2xYzW1234567890ABC_SECOND_YEAR_ID"
};

function extractSpreadsheetId(input) {
  if (!input) return "";
  var str = input.toString().trim();
  // If user pasted full URL like https://docs.google.com/spreadsheets/d/XXXXX/edit
  var match = str.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  // Otherwise clean any quotes or whitespace
  return str.replace(/["']/g, "").trim();
}

function getSpreadsheetForYear(year) {
  var isFirstYear = (year === "1st Year" || year === "1" || year === 1);
  var targetKey = isFirstYear ? "1st Year" : "2nd Year";
  var rawValue = SPREADSHEET_IDS[targetKey];
  var targetId = extractSpreadsheetId(rawValue);

  if (targetId && targetId.length > 5) {
    try {
      return SpreadsheetApp.openById(targetId);
    } catch (e) {
      Logger.log("Error opening spreadsheet by ID (" + targetId + "): " + e.toString());
      try {
        if (rawValue.indexOf("http") === 0) {
          return SpreadsheetApp.openByUrl(rawValue.trim());
        }
      } catch (urlErr) {
        Logger.log("Error opening spreadsheet by URL: " + urlErr.toString());
      }
    }
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function sanitizeSheetName(name) {
  if (!name) return "Team";
  // Google Sheets tab names cannot exceed 100 chars and cannot contain: : \ / ? * [ ]
  var clean = name.toString().replace(/[:\\\/\?\*\[\]]/g, "").trim();
  return clean.substring(0, 50) || "Team";
}

// =========================================================================
// 2. POST HANDLER: REGISTRATION & SPIN RESULTS
// =========================================================================
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action || "spin_result"; // "register_team" or "spin_result"
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

    // ------------------------------------------------------------------
    // A. ENSURE "Main" OVERVIEW SHEET EXISTS & HAS HEADERS
    // ------------------------------------------------------------------
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
      // Style headers
      mainSheet.getRange("A1:I1").setFontWeight("bold").setBackground("#E23636").setFontColor("#FFFFFF");
    }

    // ------------------------------------------------------------------
    // B. FIND OR CREATE TEAM ROW IN "Main" SHEET (Duo Identity)
    // ------------------------------------------------------------------
    var mainData = mainSheet.getDataRange().getValues();
    var existingMainRowIndex = -1;
    var currentQuestionCount = 0;
    var recordedTeamName = teamName;

    for (var r = 1; r < mainData.length; r++) {
      var r1 = (mainData[r][3] || "").toString().trim().toUpperCase();
      var r2 = (mainData[r][5] || "").toString().trim().toUpperCase();
      var tName = (mainData[r][1] || "").toString().trim();

      // Check duo match (order-independent)
      var isRollMatch = (member1Roll && member2Roll) &&
        ((r1 === member1Roll && r2 === member2Roll) || (r1 === member2Roll && r2 === member1Roll));
      var isNameMatch = (teamName && tName.toLowerCase() === teamName.toLowerCase());

      if (isRollMatch || isNameMatch) {
        existingMainRowIndex = r + 1; // 1-indexed row
        currentQuestionCount = parseInt(mainData[r][7], 10) || 0;
        recordedTeamName = tName || teamName;
        break;
      }
    }

    // If new team in Main sheet, append overview row
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
      // Increment question count in Main sheet
      currentQuestionCount++;
      mainSheet.getRange(existingMainRowIndex, 8).setValue(currentQuestionCount);
    }

    // ------------------------------------------------------------------
    // C. FIND OR CREATE EXACTLY ONE INNER TAB FOR THIS TEAM
    // ------------------------------------------------------------------
    var tabName = sanitizeSheetName(recordedTeamName || teamName);
    var teamSheet = ss.getSheetByName(tabName);

    // If tab doesn't exist by name, check all sheets for this team's duo info
    if (!teamSheet) {
      var allSheets = ss.getSheets();
      for (var s = 0; s < allSheets.length; s++) {
        var sName = allSheets[s].getName();
        if (sName !== "Main") {
          var preview = allSheets[s].getRange("A1:D5").getValues();
          var combinedStr = preview.map(function(row) { return row.join(" "); }).join(" ").toUpperCase();
          if ((member1Roll && combinedStr.indexOf(member1Roll) !== -1) &&
              (member2Roll && combinedStr.indexOf(member2Roll) !== -1)) {
            teamSheet = allSheets[s];
            break;
          }
        }
      }
    }

    // If still doesn't exist, create it once
    if (!teamSheet) {
      teamSheet = ss.insertSheet(tabName);
    }

    // ------------------------------------------------------------------
    // D. INITIALIZE TEAM SHEET TEMPLATE (IF EMPTY)
    // ------------------------------------------------------------------
    if (teamSheet.getLastRow() === 0) {
      teamSheet.appendRow(["TEAM DETAILS — RENAISSANCE 2026", "", "", "", "", "", ""]);
      teamSheet.appendRow(["Team Name:", recordedTeamName || teamName, "Year Track:", year, "Entry Time:", entryTime, ""]);
      teamSheet.appendRow(["Member 1:", member1Name, "Roll Number:", member1Roll, "", "", ""]);
      teamSheet.appendRow(["Member 2:", member2Name, "Roll Number:", member2Roll, "", "", ""]);
      teamSheet.appendRow(["", "", "", "", "", "", ""]);
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

      // Style team headers
      teamSheet.getRange("A1:H1").setFontWeight("bold").setBackground("#0c142c").setFontColor("#FFFFFF");
      teamSheet.getRange("A6:H6").setFontWeight("bold").setBackground("#E23636").setFontColor("#FFFFFF");
    }

    // ------------------------------------------------------------------
    // E. IF SPIN RESULT: APPEND ONE ROW DIRECTLY TO THIS TEAM TAB
    // ------------------------------------------------------------------
    if (action === "spin_result" && data.questionNumber) {
      var spinSNo = Math.max(1, teamSheet.getLastRow() - 5); // rows after row 6
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

    // ------------------------------------------------------------------
    // F. IF SOLVE TIME RESULT: UPDATE TIME TAKEN & STATUS
    // ------------------------------------------------------------------
    if (action === "solve_time" && data.questionNumber) {
      var lastRow = teamSheet.getLastRow();
      var tData = teamSheet.getDataRange().getValues();
      for (var rowIdx = tData.length - 1; rowIdx >= 6; rowIdx--) {
        if (tData[rowIdx][1] === data.questionNumber) {
          teamSheet.getRange(rowIdx + 1, 7).setValue(data.timeTaken || "Completed");
          teamSheet.getRange(rowIdx + 1, 8).setValue("Completed");
          break;
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      year: year,
      teamName: recordedTeamName,
      questionCount: currentQuestionCount
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// =========================================================================
// 3. GET HANDLER: LOOKUPS & DUPLICATE CHECKS
// =========================================================================
function doGet(e) {
  try {
    var action = e.parameter.action;
    var year = e.parameter.year || "2nd Year";
    var ss = getSpreadsheetForYear(year);

    // 1. Participant lookup by name or roll
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

    // 2. Check if duo already participated
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

    return ContentService.createTextOutput(JSON.stringify({ status: "ready", year: year })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
