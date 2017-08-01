


function ApiClient(_EndPoint) {
    this.endPoint = _EndPoint;

    var at = getCookie('access_token');
    if(at) {
        this.accessToken = at;
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
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
 * @param callback: the callback which will be fired when we got a response
  */
ApiClient.prototype.checkAuth = function(callback) {
    var req = get(this, '/auth/check', null, callback);
    req.send(null);
}

/**
 * Login
 * @method login
 * @param email: the email of the user
 * @param password: the password in clear 
 * @param callback: the callback which will be fired when we got a response
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
 * @method: getPlant
 * @param id: the mongoId of the plant
 * @callback: the callback triggered with the response or error
 */
ApiClient.prototype.getPlant = function(id, callback) {
    var req = get(this, '/plants/'+encodeURIComponent(id), null, callback);
    req.send();
}

/**
 * @method getPlants
 * @param options: object of query string parameters, each field of the Plant schema could be used
 * @param callback: the callback triggered with the response or error
 */
ApiClient.prototype.getPlants = function(options, callback) {
    var req = get(this, '/plants', options, callback);
    req.send();
}

module.exports = ApiClient;