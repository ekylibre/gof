#!/usr/bin/env node

'use strict';

var fs = require('fs');
var google = require('googleapis');

const XML_FOLDER_ID = '0BwdC1SOUI5qMcFNjN24yQTUtTlE';       // Google Drive folder id containing the xml files

var NEXT_PAGE_TOKEN = null;   // in case of multiple pages returned by 'files.list'
var DL_FILES_LIST = [];           // array of files {name, id} to download

/**
 * Downloads files from Google Drive, listed in DL_FILES_LIST
 * @param {Object} auth - google authentification token
 * @param {Number} index - index in DL_FILES_LIST
 * @param {Function} callback - callback(err) to call after all files are downloaded
 */
function _dlFile(auth, index, callback) {
    var drive = google.drive('v3');
    
    if (DL_FILES_LIST.length > index) {
        var file = DL_FILES_LIST[index];
        if (file && file.name && file.id) {         
            console.log('DL file: ', file.name, file.id);            
            var dest=fs.createWriteStream('./'+file.name);
            drive.files.get( {
                auth: auth,
                fileId: file.id,
                alt: 'media'
            })
            .on('error', function (err) {
                console.log('Error during download', err);
              })          
            .on('end', function () {_dlFile(auth, index+1, callback);})
            .pipe(dest); 
        }
    } else {
        // done with current list
        if (NEXT_PAGE_TOKEN) {
            // request next page
            exportFiles(auth, callback);
        } else {
            // done!
            callback();           
        }
    }
}

/**
 * Downloads Game of Farms xml files from Google Drive
 * @param {Object} auth - google authentification token
 * @param {Function} callback - callback(err) to call after all files are downloaded
 */
function exportFiles(auth, callback) {
    var drive = google.drive('v3');

    // request list of XML files
    drive.files.list({
        auth: auth,
        q: "(mimeType='text/xml') and ('"+XML_FOLDER_ID+"' in parents)",
        corpora: 'user',
        pageToken: NEXT_PAGE_TOKEN
    }, function (err, res)
        {
            if (err) {
                console.error(err);
                callback(err);
            } else {
                // stores list of files and starts downloading
                NEXT_PAGE_TOKEN = res.nextPageToken;
                DL_FILES_LIST = res.files;
                _dlFile(auth, 0, callback);
            }
            
        });

}

// function parseXML(filename, callback) {
//     var parser = new DOMParser();
//     var xmlstr = fs.readFileSync(filename, 'utf8');
//     var xml = parser.parseFromString(xmlstr, 'application/xml');

// }

module.exports = { exportFiles: exportFiles };