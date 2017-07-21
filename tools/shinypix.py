
class ItxWriter:
    
    m_Class = ""
    m_Name = ""
    m_Level = 0
    m_Data = ""
    
    def __init__(self, _class, _name):
        self.m_Level = 0
        self.m_Class = _class
        self.m_Name = _name
        self.m_Data = ""
        self.writeLine(_class)
        self.writeLine("{")
        self.writeLine('name "'+_name+'"')
        
    def writeLine(self, _line):
        if(_line == '}'):
            self.m_Level-=1
        
        for i in range(self.m_Level):
            self.m_Data += "\t"
            
        self.m_Data += _line + "\n"
        
        if(_line == '{'):
            self.m_Level+=1
        
    def writeString(self, _name, _value):
        self.writeLine(_name +' "'+str(_value)+'"')
    
    def writeFloat(self, _name, _value):
        self.writeLine(_name +' '+str(float(_value)))
    
    def writeInt(self, _name, _value):
        self.writeLine(_name +' '+str(int(_value)))
    
    def save(self, _path):
        f = open(_path, "wt")
        
        while (self.m_Level > 0):
            self.writeLine("}")
        
        f.write(self.m_Data)
        f.close()
        
        self.m_Data = ""

class JSonWriter:
    m_Level = 0
    m_Data = ""

    def __init__(self):
        self.m_Level = 0
        self.m_Data = ""
        self.writeLine("{")
        
    def writeLine(self, _line):
        if(_line == '}'):
            self.m_Level-=1
        
        for i in range(self.m_Level):
            self.m_Data += "\t"
            
        if (_line == '{'):
            self.m_Data += _line + "\n"
            self.m_Level+=1
        else:
            self.m_Data += _line + ",\n"
       
    
    def openNode(self, _name):
        self.writeLine('"'+_name +'":')
        self.writeLine("{")

    def closeNode(self):
        self.writeLine("}")

    def writeString(self, _name, _value):
        self.writeLine('"'+_name +'": "'+str(_value)+'"')
    
    def writeFloat(self, _name, _value):
        self.writeLine('"'+_name +'": '+str(float(_value)))
    
    def writeInt(self, _name, _value):
        self.writeLine('"'+_name +'": '+str(int(_value)))
    
    def save(self, _path):
        f = open(_path, "wt")
        
        while (self.m_Level > 0):
            self.writeLine("}")
        
        f.write(self.m_Data)
        f.close()
        
        self.m_Data = ""
