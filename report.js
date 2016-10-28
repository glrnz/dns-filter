'use strict';
var fs = require('fs');
var domainAnalytic = (function () {
    function domainAnalytic(dnsLog) {
        this.contents = dnsLog;
    }
    domainAnalytic.prototype.getDomain = function () {
        var domain = [];
        var raw = this.contents.split('\n');
        raw.forEach(function (curretValue) {
            var data = curretValue.split(' ');
            domain.push(data[1]);
        });
        return domain;
    };
    domainAnalytic.prototype.getIp = function () {
        var ip = [];
        var raw = this.contents.split('\n');
        raw.forEach(function (curretValue) {
            var data = curretValue.split(' ');
            ip.push(data[0]);
        });
        return ip;
    };
    return domainAnalytic;
}());
var contents = fs.readFileSync('data_log.txt').toString();
var data = new domainAnalytic(contents);
//console.log(data.getIp());
//-------------------- Group each identical data ---------------------------//
function requestedDomain(data) {
    /*
    */
    var groupDomain = [];
    var arr = data;
    var domain;
    var count;
    var i;
    var newArr = arr.filter(function (item, index, inputArray) {
        return inputArray.indexOf(item) == index;
    });
    for (i = 0; i <= newArr.length - 1; i++) {
        domain = newArr[i];
        count = arr.indexOf(domain) + 1;
        groupDomain.push({ domain: domain, count: count });
    }
    return groupDomain;
}
//sort from Top requested to least
function topDomain() {
    var domain = data.getDomain();
    var reqDomain = [];
    reqDomain = requestedDomain(domain);
    reqDomain.sort(function (a, b) {
        return b.count - a.count;
    });
    return reqDomain;
    //console.log( reqDomain );
}
console.log(topDomain());
//requestedDomain() are only names
//topDomain() are names with number of request. 
