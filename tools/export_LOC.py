#!python3

import io
import sys
import os
import argparse
import xlrd #excel reader

ROOT = ""

SOURCE_DIR = ""
EXPORT_DIR = ""

LANGUAGES_ID = {
    'english': 'en',
    'french': 'fr',
    'italian': 'it',
    'german': 'de',
    'spanish': 'sp',
    'russian': 'ru',
    'brazilian (portuguese)': 'pt',
    'simplified chinese': 'sp-cn',
    'traditional chinese': 'tr-cn',
    'korean': 'kr'       
}

def cleanupText(_text):
    return _text.replace("’", "'").replace('"', "'") #.replace('«', "'").replace('»',"'")

def PHPEscapeString(string):
    return string.replace("'", "\\'")

def ExportServerStrings(_sheet):
    #parse cols
    for c in range(2, _sheet.ncols):
        name = _sheet.cell(1, c).value
        #create php file
        f = open(os.path.join(EXPORT_DIR, name + ".php"), "wt", encoding="utf-8")
        
        #<?php
        #    return array(
        #        'id' => 'value \'quoted\' ',
        #    );
        
        f.write("<?php\n");
        f.write("return array(\n");
  
        for r in range(2, _sheet.nrows):
            uid = _sheet.cell(r, 1).value
            if (len(uid)>0):            
                if(uid.find("server_")==0):
                    value = _sheet.cell(r,c).value
                    f.write("\t'"+uid+"' => '"+PHPEscapeString(value)+"',\n")
        
        f.write(");\n")
        f.close()

def ExportGameStrings(_sheet):
    #parse cols
    for c in range(2, _sheet.ncols):
        langname = _sheet.cell(1, c).value.lower()
        if langname.find("[off]")<0:
            #create json file
            langcode = langname
            if langname in LANGUAGES_ID:
                langcode = LANGUAGES_ID[langname]
            print(langname+' => '+langcode)

            f = open(os.path.join(EXPORT_DIR, 'i18n', langcode + ".js"), "wt", encoding="utf-8")
            f.write("if (!window.i18n) window.i18n = {};\nif (!window.i18n.languages) window.i18n.languages = {};\nwindow.i18n.languages."+langcode+"={\n")
            
            for r in range(2, _sheet.nrows):
                uid = _sheet.cell(r, 1).value
                if (len(uid)>0 and uid.find("server_")!=0):
                    value = cleanupText(_sheet.cell(r,c).value)
                    f.write("\t\""+uid+"\": \""+value+"\",\n")
            
            f.write("};\n")
            f.close()

def main():

    global ROOT
    global EXPORT_DIR
    global SOURCE_DIR

    ROOT = os.path.join(os.getcwd(), '..')  # project root folder
    
    EXPORT_DIR = os.path.join(ROOT, 'client', 'assets', 'resources')
    SOURCE_DIR = os.getcwd()
    
    parser = argparse.ArgumentParser()
    parser.add_argument('--server', action='store_true', default=False)
    args = parser.parse_args(sys.argv[1:])

    #open xls file
    xlsName = "Localization.xls"
    xlsFileName = os.path.join(SOURCE_DIR, xlsName)
     
    print("*************************************")
    print("*** DB Path: "+xlsFileName)
    print("*** Data Path: "+EXPORT_DIR)
    print("***")


    book = xlrd.open_workbook(xlsFileName)
        
    #get the first sheet in it
    sheet = book.sheet_by_index(0)     
    ExportGameStrings(sheet)
    
    #if(args.server):
    #    ExportServerStrings(sheet)
    
#entry point
main()
print("Done!")
