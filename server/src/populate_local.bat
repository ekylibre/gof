@echo off
if %1a == a goto default
node cli\workflow.js -c "mongodb://localhost:27017/gof" %1 %2 %3
goto end
:default
node cli\workflow.js -c "mongodb://localhost:27017/gof" -p
:end
echo Done