'use strict'
declare function require( name:string );
let fs = require( 'fs' );
/*
class to parse data from log file.
Will only work with log files with format of

ip domain

*/
class ParseLog{
contents:String;
    constructor(dnsLog:string){
        this.contents = dnsLog;
    }
    getDomain(){
        let domain = [];
        let raw = this.contents.split('\n');
        raw.forEach( ( curretValue ) => {
            let data = curretValue.split(' ');
            domain.push( data[ 1 ] );
         });
         return domain;
    }
    getIp(){
        let ip = [];
        let raw = this.contents.split('\n');
        raw.forEach( ( curretValue ) => {
            let data = curretValue.split( ' ' );
            ip.push( data[ 0 ] );
         });
         return ip; 
    }
} // end of class domainAnalytic

let contents:string = fs.readFileSync( 'log/data_log.txt' ).toString();
let whitelist:string = fs.readFileSync( 'whitelist.conf' ).toString();
let whitelist2 = whitelist.split("\r\n");
let data = new ParseLog( contents );
//-------------------- Group each identical data ---------------------------//
////parse unique requested domains and get number of request for each.
function requestedDomain( data ){
    let groupDomain = [];
    let arr = data;
    let domain:string;
    let count:number;
    let i:number;
    let newArr = arr.filter( ( item, index, inputArray ) => {
           return inputArray.indexOf(item) == index;
    });
   
   newArr.forEach( ( item, index ) => {
    let domain = item;
    let find = arr.filter( ( eqToArr ) => {
       return eqToArr == item;
    });
    let no_of_req = find.length;
     groupDomain.push( { no_of_req, domain } );
   }); 
   return groupDomain;
}
let domain = data.getDomain();
requestedDomain( domain );
   

//sort from Top requested to least
function topDomain(){
    let domain = data.getDomain();
    let reqDomain= [];
    reqDomain = requestedDomain( domain );
    reqDomain.sort( function( a,b ){
        return b.no_of_req - a.no_of_req;
    } );
    return reqDomain;
}
let comment = /^#/;
let list = [];
function white() {
    whitelist2.forEach( ( val,index ) => {
        if ( val.match( comment )){
          list.splice( index );
        }else{
          list.push( val );
        }
    });
console.log(list);
//comment on whitelist.conf
}

white();
//requestedDomain() are only names
//topDomain() domains sorted from top requested to least
