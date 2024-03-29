#!/usr/bin/env node

'use strict';
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var mongoose = require('mongoose');
var program = require('commander');
var Activity = require('../models/activity');
var Tool = require('../models/tool');
var Additive = require('../models/additive');
var Equipment = require('../models/equipment');
var Rotation = require('../models/rotation');

var workflowitk = require('./workflowitk');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly', 'https://www.googleapis.com/auth/drive.readonly' ];
var TOKEN_DIR = './cli/.credentials/';
var TOKEN_FILE = '.googleapis.com-nodejs.json';

function deleteDocument(model, conditions, callback) {
    model.remove(conditions, (err) => {
        if(err) {
            callback(err);
        } else {
            callback();
        }
    });
}
function updateOrCreateDocument(model, conditions, header, row, callback) {
    model.findOne(conditions, (err, res) => {
        if(err) {
            callback(err, null);
            return;
        }
        if(!res) {
            res = new model();
        }
        var fields = model.schema.paths;
        var keys = Object.keys(fields);
        keys.forEach(function(e, id, array) {
            if(!Array.isArray(res[e])) {
                var index = header.indexOf(e);
                if(index != -1) {
                    res[e] = row[index];
                }
            } else {
                // we are in a Array situation
                //empty the array before pushing values
                var c = 0;
                for(var i=0;i<header.length;++i) {
                    if(header[i] === e) {
                        if(!row[i]) {
                            break;
                        }
                        if(res.length-1 < c || res[e][c] !== row[i]){
                            res[e].set(c,row[i]);
                        }
                        c++;
                    }
                }
            }
        });
        res.save( function onSaveModel(err) {
            callback(err);
        });
    });
}

function parseData(model, data, callback) {
    var v = data.values;
    var header = v[0];
    v.forEach(function(row, id, array) {
        var link = parseInt(row[0]);
        if(isNaN(link)) {
            return;
        }

        var f = null;
        if(id >= array.length-1) {
            f = function doneParsingData(err) {
                callback(err);
            } 
        } else {
            f = function documentCallback(err) {
                if(err) {
                    console.error(err);
                }
            }
        }
        if(link < 0) {
            deleteDocument(
                model,
                {linkDbId: -link},
                f
            );
        } else {
            updateOrCreateDocument(
                model, 
                {linkDbId: link}, 
                header, 
                row,
                f
            );
        }
    });
}

var parser = {
    
    Plants : function parseActivities(data, callback) {
        parseData(Activity, data, function(err) {
            console.log('Done parsing plants');
            callback(err);
        });
    },

    Tools: function parseTools(data, callback) {
        parseData(Tool, data, function(err) {
            console.log('Done parsing tools');
            callback(err);
        });
    },

    Additives: function parseAdditives(data, callback) {
        parseData(Additive, data, function(err) {
            console.log('Done parsing additives');
            callback(err);
        });
    },

    Equipments: function parseEquipments(data, callback) {
        parseData(Equipment, data, function(err) {
            console.log('Done parsing equipments');
            callback(err);
        });
    },

    Rotations: function parseRotations(data, callback) {
        parseData(Rotation, data, function(err) {
            console.log('Done parsing rotations');
            callback(err);
        });
    }
};

function readSheet(auth, sheet, callback) {
    var sheets = google.sheets('v4');
    var sheetId = sheet.properties.title;
    sheets.spreadsheets.values.get({
        auth:auth,
        spreadsheetId: '1fdK0QgUaPKegwSSS99dWsHAvuqJFml6DE8jboWJxf0E',
        range: sheetId,
        valueRenderOption: 'UNFORMATTED_VALUE'
    }, function (err, response) {
        if(err) {
            console.error(err);
            callback(err, null);
            return;
        }

        var parseFunc = parser[sheetId];
        if(parseFunc){
            parseFunc(response, callback);
        } else {
            console.warn('Missing implementation of \"parse'+sheetId+'\" in parser module');
            callback(null); //don't return error here, otherwise the flow of import will be stopped
        }
    });
}

function getLanguageCode(s) {
    switch(s.toLowerCase()) {
        case 'french':
            return 'fr';
    }

    throw new Error('Unknown language identifier ' + s);
}

function exportClientLocalisation(auth, callback) {
    var sheets = google.sheets('v4');
    sheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: '1__axFDc3iluBsWWFd-OU3BuYxyoeacCqrRu8cqxg8hY',
        range: 'Strings',
        valueRenderOption: 'UNFORMATTED_VALUE'
    }, function(err, response) {
        if(err) {
            console.error(err);
            callback(err);
            return;
        }
        
        var rows = response.values;
        var header = rows[0];
        for(var c=2;c<header.length;++c) {
            var langCode = getLanguageCode(header[c]);
            var stream = fs.createWriteStream('../../client/assets/resources/i18n/' + langCode + '.js');
            // var stream2 = fs.createWriteStream('public/web-desktop/src/assets/resources/i18n/' + langCode + '.js');           
            stream.write('if (!window.i18n) window.i18n = {};\n');
            stream.write('if (!window.i18n.languages) window.i18n.languages = {};\n');
            stream.write('window.i18n.languages.'+langCode+'={\n');
            // stream2.write('window.i18n||(window.i18n={}),window.i18n.languages||(window.i18n.languages={}),');
            // stream2.write('window.i18n.languages.'+langCode+'={');           
            for(var l=1;l<rows.length;++l){
                if(l > 1) {
                    stream.write(',\n');
                    // stream2.write(',');
                }
                var uid = rows[l][1];
                var txt = rows[l][c];
                stream.write('\t"' + uid.replace(/\n+$/, '') + '":"' + txt.replace(/\n+$/, '') + '"');
                // stream2.write('"' + uid.replace(/\n+$/, '') + '":"' + txt.replace(/\n+$/, '') + '"');
            }
            stream.write('\n};');
            stream.end();
            // stream2.write('};');
            // stream2.end();
        }
    });
}

function readSpreadSheet(auth, callback) {
    var sheets = google.sheets('v4');
    sheets.spreadsheets.get({
        auth: auth,
        spreadsheetId: '1fdK0QgUaPKegwSSS99dWsHAvuqJFml6DE8jboWJxf0E',
        includeGridData: false
    }, function(err, response) {
        if(err) {
            console.error(err);
            callback(err);
            return;
        }
        var sheets = response.sheets;
        var errors = null;
        var promises = sheets.map(function(element) {
            return new Promise(function(resolve, reject){
                readSheet(auth, element, function(err) {
                    if(err){
                        return reject(err);
                    }
                    resolve();
                });
            });
        });

        Promise.all(promises).then(function(){
            callback();
        }).catch(callback);
    });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {String} type The type of authorization (sheets, drive)
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(type, credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_DIR+type+TOKEN_FILE, function(err, token) {
    if (err) {
      getNewToken(type, oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(type, oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.error(err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(type, token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(type, token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_DIR+type+TOKEN_FILE, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_DIR+type+TOKEN_FILE);
}

function populateComplete(err) {
    if(err) {
        console.error(err);
        process.exit(-1);
        return;
    }
    console.log('Good bye');
    process.exit(0);
}

function exportLocComplete(err) {
    var a = 0;
}

function exportITK(err) {
    if (err) {
        populateComplete(err);
        return;
    }

    if (!program.xml) {
        populateComplete();
        return;
    }

    fs.readFile('./cli/client_secret_drive.json', function processClientSecrets(err, content) {
        if (err) {
            console.error(err);
            return;
        }
        // Authorize a client with the loaded credentials, then call the
        // Google Drive API.
        authorize('drive', JSON.parse(content), function onAuthorized(auth) {
            workflowitk.exportFiles(auth, populateComplete);
            });
    });
}

function main() {

    program
    .version('0.0.2')
    .usage('[options]')
    .option('-c, --connection <connection>', 'The mongoDB connection string https://docs.mongodb.com/manual/reference/connection-string/')
    .option('-p, --populate', 'Populate the database with initial data')
    .option('-l, --localisation', 'Build the client localisation file')
    .option('-x, --xml', 'Exports itk xml files')
    .option('-y, --localxml', 'Exports itk xml local files')
    .parse(process.argv);

    if(program.populate) {
        if(program.connection) {
            mongoose.Promise = global.Promise;
            mongoose.connect(program.connection, {useMongoClient: true},
                (err) => {
                    if(err) {
                        console.error(err);
                        return;
                    }
                    // Load client secrets from a local file.
                    fs.readFile('./cli/client_secret.json', function processClientSecrets(err, content) {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        // Authorize a client with the loaded credentials, then call the
                        // Google Sheets API.
                        authorize('sheets', JSON.parse(content), function onAuthorized(auth) {
                            readSpreadSheet(auth, exportITK);
                        });
                    });
            });
        }
    }

    if(program.localisation) {
        // Load client secrets from a local file.
        fs.readFile('./cli/client_secret.json', function processClientSecrets(err, content) {
            if (err) {
                console.error(err);
                return;
            }
            // Authorize a client with the loaded credentials, then call the
            // Google Sheets API.
            authorize('sheets', JSON.parse(content), function onAuthorized(auth) {
                exportClientLocalisation(auth, exportLocComplete);
            });
        });
    }

    if(!program.populate && program.xml) {
        // this will download the xml files, but won't export them to database (no connection)
        // use -px to also save to database
        exportITK();
    }

    if (program.localxml) {
        if(program.connection) {
            mongoose.Promise = global.Promise;
            mongoose.connect(program.connection, {useMongoClient: true},
                (err) => {
                    if(err) {
                        console.error(err);
                        return;
                    }

                    workflowitk.exportLocalFiles(populateComplete, false);                    
            });
        }
        else {
            workflowitk.exportLocalFiles(populateComplete, true);
        }
    }
}

main();