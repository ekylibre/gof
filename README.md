## Game of Farms

Game of Farms is an HTML5 game where the player have to manage a virtual farm through educational scenarios.
It's written with the following Javascript stack:
* Cocos Creator for the WebGL/Canvas front-end 
* NodeJS / HapiJS / MongoDB for the back-end

Some libraries dependencies:
* mongoose
* handlebars
* ...

Tools:
* Tiled
* TexturePacker

You can see how it works on https://game-of-farms.ekylibre.com

## Installation

Pre-requisites:
* NodeJS 6.11.x
* NPM 3.10.10
* MongoDB 3.4.x
* Cocos Creator 1.6.1

First things you need to do to get ready:
* Clone the project
* cd to server/src/
* Install needed packages: ```npm install```
* Edit the config files in server/src/config to setup your project (more info [here](https://github.com/ekylibre/gof/blob/master/README.md#configuration))
* populate your db (you need to have granted access to google sheets & drive): ```nodejs cli/workflow.js -c "mongodb://localhost:27017/gof" -px```
* start server: ```NODE_ENV=[development|production] nodejs server.js```
* alternatively you could use pm2 to start the server with: ```pm2 start gof.json --env=[development|production]```

## Configuration
You need to have at least one configuration file named like your current environment (development.json for development environment...), for obvious security reasons you should not push it to github
```
{
    "Server" : {
        "connectionOptions" : {
            "port" : 3000
        }
    },

    "Database" : {
        "connectionUrl" : "mongodb://yourip:yourport/yourdatabase",
        "options" : {
            "useMongoClient" : true
        }
    },

    "Jwt" : {
        "key": "your JWT key"
    },

    "Nodemailer" : {
        "transport" : {
            "service": "Gmail",
            "auth": {
                "user": "youremail@example.com",
                "pass": "yourpassword"
            }
        }
    }
}
```
Your Nodemailer config may be different, please check [Nodemailer website](https://nodemailer.com) on how to configure transport

To generate a new JWT secret key:
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
```

You could copy/paste the [sample.json](https://github.com/ekylibre/gof/blob/master/server/src/config/sample.json) as a starting point

## See also
* [Cocos Creator](http://cocos2d-x.org/creator)
* [Nodejs](https://nodejs.org)
* [MongoDB](https://www.mongodb.com/)
* [Mongoose](http://mongoosejs.com/)
* [hapi](https://hapijs.com/)
* [Tiled](http://www.mapeditor.org/)
* [TexturePacker](https://www.codeandweb.com/texturepacker)

## License

Game of Farms is released under the [GNU/AGPLv3](https://opensource.org/licenses/AGPL-3.0) license.
