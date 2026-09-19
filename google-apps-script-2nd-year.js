/**
 * GOOGLE APPS SCRIPT FOR 2ND YEAR (SOPHOMORE TRACK) — RENAISSANCE 2026
 * Rolls start with '25' (e.g. 25CSR175, 25ITR023)
 *
 * Sheet: Renaissance 2026 — 2nd Year
 * Target URL: https://docs.google.com/spreadsheets/d/1s55VQBx_LxNHcHkx1UP7wfeoBPffpJIb8ce-FQFOEyM/edit
 */

var SPREADSHEET_URL_2ND = "https://docs.google.com/spreadsheets/d/1s55VQBx_LxNHcHkx1UP7wfeoBPffpJIb8ce-FQFOEyM/edit";

function getSpreadsheet() {
  try {
    return SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openByUrl(SPREADSHEET_URL_2ND);
  } catch (err) {
    var match = SPREADSHEET_URL_2ND.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      return SpreadsheetApp.openById(match[1]);
    }
    throw new Error("Unable to open 2nd Year Spreadsheet: " + err.message);
  }
}

function testConnection() {
  var ss = getSpreadsheet();
  Logger.log("✅ SUCCESS 2nd Year Sheet Connected: " + ss.getName() + " (" + ss.getUrl() + ")");
}

function sanitizeSheetName(name) {
  if (!name) return "Team";
  var clean = name.toString().replace(/[:\\\/\?\*\[\]]/g, "").trim();
  return clean.substring(0, 50) || "Team";
}

// POST HANDLER (Registration & Spin Results)
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action || "spin_result";
    var ss = getSpreadsheet();

    var teamName = (data.teamName || "Unnamed Team").trim();
    var member1Name = (data.member1Name || "").trim();
    var member1Roll = (data.member1Roll || "").trim().toUpperCase();
    var member2Name = (data.member2Name || "").trim();
    var member2Roll = (data.member2Roll || "").trim().toUpperCase();
    var entryTime = data.entryTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Ensure "Main" sheet exists
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

    // 2. Find or create team row in Main
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

    // 3. Find or create team tab
    var tabName = sanitizeSheetName(recordedTeamName || teamName);
    var teamSheet = ss.getSheetByName(tabName);

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

    if (!teamSheet) {
      teamSheet = ss.insertSheet(tabName);
    }

    // 4. Initialize team tab template if empty
    if (teamSheet.getLastRow() === 0) {
      teamSheet.appendRow(["TEAM DETAILS — RENAISSANCE 2026 (2ND YEAR)", "", "", "", "", "", "", ""]);
      teamSheet.appendRow(["Team Name:", recordedTeamName || teamName, "Track:", "2nd Year", "Entry Time:", entryTime, "", ""]);
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

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      year: "2nd Year",
      spreadsheetName: ss.getName(),
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

// GET HANDLER (Lookups & Duplicate Checks)
function doGet(e) {
  try {
    var action = e.parameter.action;
    var ss = getSpreadsheet();

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
      track: "2nd Year",
      spreadsheetName: ss.getName()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
