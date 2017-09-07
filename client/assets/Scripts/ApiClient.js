


/**
 * @param {String} _EndPoint: API url
 */
function ApiClient(_EndPoint) {
    this.endPoint = _EndPoint;

    var elem = document.getElementById('GameCanvas');
    var at = elem.getAttribute('gof-access-token') || localStorage.getItem('gof-access-token');
    var channel = elem.getAttribute('gof-channel-id') || localStorage.getItem('gof-channel-id');
    
    if(at) {
        this.accessToken = at;
    }

    if (channel) {
        this.channelId = channel;
    }
}

function params(payload) {
    if(!payload) {
        return '';
    }
    var p = '';
    var keys = Object.keys(payload);
    for(var i=0;i<keys.length;++i) {
        if(i > 0) {
            p += '&';
        }
        p += keys[i] + '=' + encodeURIComponent(payload[keys[i]]);
    }
    return p.length > 0 ? p : null;
}

function get(client, path, query, callback) {
    return buildRequest(client, 'GET', path, query, callback);
}

function post(client, path, callback) {
    var req = buildRequest(client, 'POST', path, null, callback);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    return req;
}

function buildRequest(client, method, path, query, callback) {
    var req = new XMLHttpRequest();
    var qs = params(query);
    var p = client.endPoint + path + (qs.length ? '?' + qs : '');
    req.open(method, p, true);

    if(client.accessToken) {
        req.setRequestHeader('Authorization', 'Bearer ' + client.accessToken);
    }

    req.onreadystatechange = function(event) {
        if(req.readyState != 4) {
            return;
        }

        var json = null;
        try {
            json = JSON.parse(req.responseText);
        } catch(e) {}

        if(req.status !== 200) {
            if(callback) {
                callback(json, null, client);
                return;
            }
        }
        if(callback) {
            callback(null, json, client);
        }
    };
    return req;
}

/**
 * Check if user is logged in
 * @method checkAuth
 * @param {Callback} callback - callback(error, response, client) triggered with the response or error 
  */
ApiClient.prototype.checkAuth = function(callback) {
    var req = get(this, '/auth/check', null, callback);
    req.send(null);
}

/**
 * Login
 * @method login
 * @param email - the email of the user
 * @param password - the password in clear 
 * @param {Callback} callback - callback(error, response, client) triggered with the response or error 
  */
ApiClient.prototype.login = function(email, password, callback) {

    var req = post(this, '/auth/login', 
        function(error, response, client) {
            if(response) {
                client.accessToken = response.payload.accessToken;
            }

            callback(error, response, client);
    });
    var p = params({
        email : email,
        password: password
    });
    req.send(p);
}

/**
 * @method getPlant
 * @param id - the mongoId of the plant
 * @param {Callback} callback - callback(error, response, client) triggered with the response or error 
 */
ApiClient.prototype.getPlant = function(id, callback) {
    var req = get(this, '/plants/'+encodeURIComponent(id), null, callback);
    req.send();
}

/**
 * @method getPlants
 * @param options - object of query string parameters, each field of the Plant schema could be used
 * @param {Callback} callback - callback(error, response, client) triggered with the response or error 
 */
ApiClient.prototype.getPlants = function(options, callback) {
    var req = get(this, '/plants', options, callback);
    req.send();
}

/**
 * @method getScenarios
 * @param uid - The name of the scenario or null/undefined if you want to get the list of scenarios
 * @param {Callback} callback - callback(error, response, client) triggered with the response or error 
 */
ApiClient.prototype.getScenarios = function(uid, callback) {
    var req = null;
    if(uid) {
        req = get(this, '/scenarios/' + encodeURIComponent(uid), null, callback);
    } else {
        req = get(this, '/scenarios', null, callback);
    }
    req.send();
}

/**
 * @method getGameData
 * @param {Callback} callback - callback(error, response, client) triggered with the response or error 
 */
ApiClient.prototype.getGameData = function(callback) {

    if (!this.channelId) {
        cc.error('Missing channel id');
        return;
    }

    var req = null;
    req = get(this, '/channel/getgamedata/'+encodeURIComponent(this.channelId), null, callback);
    req.send();
}

/**
 * @method setGameData
 * @param {String} data
 * @param {Callback} callback - callback(error, response, client) triggered with the response or error 
 */
ApiClient.prototype.setGameData = function(data, callback) {
    if (!this.channelId) {
        cc.error('Missing channel id');
        return;
    }

    var req = null;
    req = post(this, '/channel/setgamedata', callback);
    var p = params({
        chanId : this.channelId,
        gameData: data
    });
    req.send(p);
}

module.exports = ApiClient;