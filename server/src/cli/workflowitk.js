#!/usr/bin/env node

'use strict';

const Constants = require('../../../common/constants');

var fs = require('fs');
var google = require('googleapis');
var DOMParser = require('xmldom').DOMParser;
var Activity = require('../models/activity');

const XML_FOLDER_ID = '0BwdC1SOUI5qMcFNjN24yQTUtTlE';       // Google Drive folder id containing the xml files

var TMP_FOLDER = './cli/tmp/';
var NEXT_PAGE_TOKEN = null;   // in case of multiple pages returned by 'files.list'
var DL_FILES_LIST = [];           // array of files {name, id} to download
var CRITICAL_ERROR = null;
var PARSE_ERRORS = [];


function _checkTmpFolder() {
    try {
        fs.mkdirSync(TMP_FOLDER);       
    }
    catch (_e) {
        if (_e.code != 'EEXIST') {
            throw _e;
          }
    }
}

/**
 * Downloads files from Google Drive, listed in DL_FILES_LIST
 * @param {Object} auth - google authentification token
 * @param {Number} index - index in DL_FILES_LIST
 * @param {Function} callback - callback(err) to call after all files are downloaded
 */
function _dlFile(auth, index, callback) {
    if (CRITICAL_ERROR) {
        callback(CRITICAL_ERROR);
    };

    var drive = google.drive('v3');
    
    if (DL_FILES_LIST.length > index) {
        var file = DL_FILES_LIST[index];
        if (file && file.name && file.id) {         
            console.log('DL file: ', file.name, file.id);            
            var dest=fs.createWriteStream(TMP_FOLDER+file.name);
            dest.on('close', function ()
            {
                if (!CRITICAL_ERROR) {
                    //_dlFile(auth, index+1, callback);
                    _parseXML(file.name, function() {_dlFile(auth, index+1, callback);});                
                }
            });
            drive.files.get( {
                auth: auth,
                fileId: file.id,
                alt: 'media'
            })
            .on('error', function (err) {
                CRITICAL_ERROR = 'Error during download' + err;
                //callback(CRITICAL_ERROR);
            })
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
    _checkTmpFolder();
    
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

/**
 * For debug purposes
 * parses local xml files and export to json files
 */
function exportLocalFiles() {
    _checkTmpFolder();
    
    var files = fs.readdirSync(TMP_FOLDER);
    for (var i=0; i<files.length; i++) {
        var filename = files[i];
        if (filename.endsWith('.xml')) {
            _parseXML(filename, function(){}, true);
        }
    }
    console.log('workflowitk.exportLocalFiles done!');    
}


/**
 * Parses an 'indicator' xml element (for tools, inputs, etc.)
 * @param {Element} element - an 'indicator' xml element
 * @return {Object}
 */
function _parseIndicator(element) {
    var ind = {};
    ind.name = element.getAttribute('name');
    ind.value = element.getAttribute('value');
    ind.unit = element.getAttribute('unit');
    return ind;
}

/**
 * Parses an 'input' or 'ouput' xml element
 * @param {Element} element - an 'input' or 'output' xml element
 * @return {Object}
 */
function _parseInputOutput(element) {
    var json = {};
    var errors = [];

    if (element.hasAttributes()) {
        for (var i=0; i<element.attributes.length; i++) {
            var node = element.attributes[i];
            switch (node.nodeName) {
                case 'name':
                json.name = node.nodeValue;
                break;
                case 'quantity-per-size-unit':
                json.quantityPerSizeUnit = node.nodeValue;
                break;
                case 'unit-per-size-unit':
                json.unitPerSizeUnit = node.nodeValue;
                break;
                default:
                errors.push('Unknown attribute of '+element.nodeName+': '+node.nodeName);
                break;
            }
        }
    }

    if (!json.name) {
        errors.push('Missing name of '+element.nodeName);
    }

    if (element.hasChildNodes()) {
        var indicators = [];

        for (var i=0; i<element.childNodes.length; i++) {
            var node = element.childNodes[i];
            if (node.nodeType == 1) {
                switch (node.nodeName) {
                    case 'indicator':
                        indicators.push(_parseIndicator(node));
                        break;
                    default:
                        errors.push('Unknown child of '+element.nodeName+': '+node.nodeName);
                        break;
                }
            }
        }
        
        if (indicators.length>0) {
            json.indicators = indicators;
        }
    }

    if (errors.length>0) {
        json.errors = errors;
        PARSE_ERRORS = PARSE_ERRORS.concat(errors);       
    }

    return json;
}

/**
 * Parses a 'tool' xml element
 * @param {Element} element - a 'tool' xml element
 * @return {Object}
 */
function _parseTool(element) {
    var json = {};
    var errors = [];

    if (element.hasAttributes()) {
        for (var i=0; i<element.attributes.length; i++) {
            var node = element.attributes[i];
            switch (node.nodeName) {
                case 'name':
                    json.name = node.nodeValue;
                    break;
                default:
                    errors.push('Unknown attribute of tool: '+node.nodeName);
                    break;
            }
        }
    }

    if (!json.name) {
        errors.push('Missing tool name');
    }

    if (element.hasChildNodes()) {
        var indicators = [];

        for (var i=0; i<element.childNodes.length; i++) {
            var node = element.childNodes[i];
            if (node.nodeType == 1) {
                switch (node.nodeName) {
                    case 'indicator':
                        indicators.push(_parseIndicator(node));
                        break;
                    default:
                        errors.push('Unknown tool child: '+node.nodeName);
                        break;
                }
            }
        }
        
        if (indicators.length>0) {
            json.indicators = indicators;
        }
    }

    if (errors.length>0) {
        json.errors = errors;
        PARSE_ERRORS = PARSE_ERRORS.concat(errors);       
    }

    return json;
}

/**
 * Parses a working group xml element
 * @param {Element} group - a working-group xml element
 * @return {Object}
 */
function _parseWorkingGroup(group) {
    var json = {};
    var errors = [];

    if (group.hasAttributes()) {
        var label = {};

        for (var i=0; i<group.attributes.length; i++) {
            var node = group.attributes[i];
            switch (node.nodeName) {
                case 'working-time-per-size-unit':
                    json.workingTimePerSizeUnit = node.nodeValue;
                    break;
                case 'label_fr':
                    label.fr = node.nodeValue;
                    break;
                default:
                    errors.push('Unknown attribute of working group: '+node.nodeName);
                    break;
            }
        }

        if (Object.keys(label).length !== 0) {
            json.label = label;
        }
   
    }
        
    if (group.hasChildNodes()) {
        var tools = [];
        var doers = [];

        for (var i=0; i<group.childNodes.length; i++) {
            var node = group.childNodes[i];
            if (node.nodeType == 1) {
                //subelements
                switch (node.nodeName) {
                    case 'tool':
                        tools.push(_parseTool(node));
                        break;
                    case 'doer':
                        doers.push(node.getAttribute('name'));
                        break;
                    default:
                        errors.push('Unknown element in working group: '+node.nodeName);
                        break;
                }
            }
        }

        if (tools.length>0) {
            json.tools = tools;
        }
        if (doers.length>0) {
            json.doers = doers;
        }
    }

    if (errors.length>0) {
        json.errors = errors;
        PARSE_ERRORS = PARSE_ERRORS.concat(errors);       
    }
    
    return json;
}


/**
 * Parses a procedure xml element
 * @param {Element} procedure - a 'procedure' xml element
 * @return {Object}
 */
function _parceProcedure(procedure) {
    var json = {};
    var errors = [];

    json.name = procedure.getAttribute('name');

    // get parameters
    var xparams = procedure.getElementsByTagName('parameters');
    var params = null;
    if (xparams && xparams.length>0) {
        params = xparams[0];
    }
    if (params && params.hasChildNodes()) {      
        var groups = [];
        var inputs = [];
        var outputs = [];
        for (var i=0; i<params.childNodes.length; i++) {
            var node = params.childNodes[i];
            if (node.nodeType == 1) {
                //subelements
                switch (node.nodeName) {
                    case 'working-group':
                    groups.push(_parseWorkingGroup(node));
                    break;
                    case 'input':
                    inputs.push(_parseInputOutput(node));
                    break;
                    case 'output':
                    outputs.push(_parseInputOutput(node));
                    break;
                    default:
                    errors.push('Unknown element in working group: '+node.nodeName);
                    break;
                }
            }
        }

        if (groups.length>0) {
            json.workingGroups = groups;
        }
        if (inputs.length>0) {
            json.inputs = inputs;
        }
        if (outputs.length>0) {
            json.outputs = outputs;
        }
    }

    if (errors.length>0) {
        json.errors = errors;
        PARSE_ERRORS = PARSE_ERRORS.concat(errors);       
    }
    return json;
}

/**
 * Parses an itk xml element
 * @param {String} filename - filename of xml containing the itk
 * @param {Element} itk - an 'itk' xml element
 * @return {Object}
 */
function _exportITK(filename, itk) {

    var json = {};
   
    json.supportType = itk.getAttribute('support-type');
    if (json.supportType == 'land-parcel') {
        json.sizeIndicatorName= itk.getAttribute('size-indicator-name');
        json.sizeUnitName = itk.getAttribute('size-unit-name');

        var ids = itk.getAttribute('name').split('_');

        json.culture = {
            variety: itk.getAttribute('varieties'),
            species: ids[1]
        };
        switch (ids[0]) {
            case 'conventionnal':
            json.culture.mode = Constants.CultureModeEnum.NORMAL;
            break;
            case 'bio':
            json.culture.mode = Constants.CultureModeEnum.BIO;
            break;
            case 'reasoned':
            json.culture.mode = Constants.CultureModeEnum.REASONED;
            break;
            case 'permaculture':
            json.culture.mode = Constants.CultureModeEnum.PERMACULTURE;
            break;
            default:
            PARSE_ERRORS.push('Unknown culture mode: '+ids[0]);
            break;
        }     

    } else {
        PARSE_ERRORS.push('Unknown support mode: '+json.supportType);
    }

    var xprocedures = itk.getElementsByTagName('procedures');
    if (xprocedures) {
        json.procedures = [];
        var procedures = xprocedures[0].getElementsByTagName('procedure');
        for (var p=0; p<procedures.length; p++) {
            var jp = _parceProcedure(procedures[p]);
            json.procedures.push(jp);
        }
    }

    if (PARSE_ERRORS.length>0) {
        for (var i=0; i<PARSE_ERRORS.length; i++) {
            console.error(filename+': '+PARSE_ERRORS[i]);
        }
    }

    return json;
}

/**
 * Parses a xml and stores the result in the 'Activity' database
 * @param {String} filename - the filename of the xml to parse
 * @param {Function} callback - called after parse is complete
 * @param {Boolean} saveJSon - (debug) true to save the result to a file (instead of saving to database)
 */
function _parseXML(filename, callback, saveJSon) {
    var parser = new DOMParser();

    try {
        console.log('Converting '+filename);
        var xmlstr = fs.readFileSync(TMP_FOLDER+filename, 'utf8');
        var xml = parser.parseFromString(xmlstr, 'application/xml');   

        var itks = xml.getElementsByTagName('itk');
        if (itks) {
            for (var i=0; i<itks.length; i++) {
                var json = _exportITK(filename, itks[i]);
                var last = i === itks.length-1;
                if (json.culture) {
                    if (saveJSon) {
                        // save to file (for debug purposes)
                        var saveName = json.culture.species+'.'+json.culture.mode;
                
                        if (saveName.length>0) {
                            console.log('Writing '+saveName+'.json');
                            fs.writeFileSync(TMP_FOLDER+saveName+'.json', JSON.stringify(json), 'utf8');
                        }
                        
                        if (last && callback) {
                            callback();
                        }                        
                    } else {
                        // Update database
                        Activity.findOne({species: json.culture.species, cultureMode: json.culture.mode }, (err, res) => 
                        {
                            if (!err) {
                                res.itk = json;
                                res.markModified('itk');
                                res.save(()=>{
                                    if (last && callback) {
                                        callback();
                                    } 
                                });
                            } else {
                                console.log('Could not find activity: '+json.culture.species+' '+json.culture.mode);
                            }
                             
                        });
                    }
                }
            }
        }
    
    }
    catch (_e) {
        CRITICAL_ERROR = filename+': Exception '+_e;
        console.error(filename+': Exception '+_e);

        if (callback) {
            callback();
        }        
    }
      
}

module.exports = { exportFiles: exportFiles, exportLocalFiles: exportLocalFiles };