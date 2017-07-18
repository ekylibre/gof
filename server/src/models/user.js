'use strict';

function User() {
    this.Clear();
}

function Clear() {
    this._id = null;
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.password = "";
}

User.prototype.Clear = Clear;

module.exports = User;