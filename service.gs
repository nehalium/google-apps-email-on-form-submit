var SHEET_CONFIG = "Config";

var config = getConfig();

function onFormSubmit(e) {
  let params = {
    'name': getName(e),
    'email': getEmail(e),
    'plan': getPlan(e),
    'language': getLanguage(e)
  }
  Logger.log(params);
  notifyRecipient(params);
}

function getName(e) {
  return e.namedValues["Your name"];
}

function getEmail(e) {
  return e.namedValues["Email Address"];
}

function getPlan(e) {
  return e.namedValues["Plan you are interested in"];
}

function getLanguage(e) {
  return e.namedValues["Language"];
}

function getConfig() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(SHEET_CONFIG);
  var numRows = sheet.getLastRow();
  if (numRows == 0) return;
  var values = sheet.getRange(1, 1, numRows, 2).getValues();
  var cfg = [];
  values.forEach(function(value) {
    cfg[value[0]] = value[1];
  });
  return cfg;
}

function buildEmailSubject(params) {
  return "Chatterbug Signup Request // " + params["name"];
}

function buildEmailBody(params) {
  return "The following person is requesting access to Chatterbug: \n\n " + 
    " NAME: " + params["name"] + "\n" +
    " EMAIL: " + params["email"] + "\n" +
    " PLAN: " + params["plan"] + "\n" +
    " LANGUAGE: " + params["language"];
}

function notifyRecipient(params) {
  var message = {};
  if (config["Debug"]) {
    message = {
      name: config["SenderName"],
      to: config["Debug.RecipientsTo"],
      subject: "[DEBUG] " + buildEmailSubject(params),
      body: buildEmailBody(params)
    };
  }
  else {
    message = {
      name: config["SenderName"],
      to: config["RecipientsTo"],
      cc: config["RecipientsCc"],
      subject: buildEmailSubject(params),
      body: buildEmailBody(params)
    };
  }
  MailApp.sendEmail(message);
}
