


function ApiClient(_EndPoint) {
    this.endPoint = _EndPoint;
}

function params(payload) {
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

function get(client, path, callback) {
    return buildRequest(client, 'GET', path, callback);
}

function post(client, path, callback) {
    var req = buildRequest(client, 'POST', path, callback);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    return req;
}

function buildRequest(client, method, path, callback) {
    var req = new XMLHttpRequest();
    req.open(method, client.endPoint + path, true);

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
 * @param callback: the callback which will be fired when we got a response
  */
ApiClient.prototype.checkAuth = function(callback) {
    var req = get(this, '/auth/check', callback);
    req.send(null);
}

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

module.exports = ApiClient;