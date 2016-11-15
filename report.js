'use strict';
var fs = require('fs');
/*
class to parse data from log file.
Will only work with log files with format of

ip domain

*/
var ParseLog = (function () {
    function ParseLog(dnsLog) {
        this.contents = dnsLog;
    }
    ParseLog.prototype.getDomain = function () {
        var domain = [];
        var raw = this.contents.split('\n');
        raw.forEach(function (curretValue) {
            var data = curretValue.split(' ');
            domain.push(data[1]);
        });
        return domain;
    };
    ParseLog.prototype.getIp = function () {
        var ip = [];
        var raw = this.contents.split('\n');
        raw.forEach(function (curretValue) {
            var data = curretValue.split(' ');
            ip.push(data[0]);
        });
        return ip;
    };
    return ParseLog;
}()); // end of class domainAnalytic
var contents = fs.readFileSync('log/data_log.txt').toString();
var whitelist = fs.readFileSync('whitelist.conf').toString();
var whitelist2 = whitelist.split("\r\n");
var data = new ParseLog(contents);
//-------------------- Group each identical data ---------------------------//
////parse unique requested domains and get number of request for each.
function requestedDomain(data) {
    var groupDomain = [];
    var arr = data;
    var domain;
    var count;
    var i;
    var newArr = arr.filter(function (item, index, inputArray) {
        return inputArray.indexOf(item) == index;
    });
    newArr.forEach(function (item, index) {
        var domain = item;
        var find = arr.filter(function (eqToArr) {
            return eqToArr == item;
        });
        var no_of_req = find.length;
        groupDomain.push({ no_of_req: no_of_req, domain: domain });
    });
    return groupDomain;
}
var domain = data.getDomain();
requestedDomain(domain);
//sort from Top requested to least
function topDomain() {
    var domain = data.getDomain();
    var reqDomain = [];
    reqDomain = requestedDomain(domain);
    reqDomain.sort(function (a, b) {
        return b.no_of_req - a.no_of_req;
    });
    return reqDomain;
}
var comment = /^#/;
var list = [];
function white() {
    whitelist2.forEach(function (val, index) {
        if (val.match(comment)) {
            list.splice(index);
        }
        else {
            list.push(val);
        }
    });
    console.log(list);
    //comment on whitelist.conf
}
white();
//requestedDomain() are only names
//topDomain() domains sorted from top requested to least 
