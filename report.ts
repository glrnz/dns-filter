'use strict'
declare function require( name:string );
let fs = require( 'fs' );

class domainAnalytic{
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
}

let contents:string = fs.readFileSync( 'data_log.txt' ).toString();

let data = new domainAnalytic( contents );

//console.log(data.getIp());


//-------------------- Group each identical data ---------------------------//
function requestedDomain( data ){
    /*
    */
    let groupDomain = [];
    let arr = data;
    let domain:string;
    let count:number;
    let i:number;
    let newArr = arr.filter( ( item, index, inputArray ) => {
           return inputArray.indexOf(item) == index;
    });
    for( i=0; i <= newArr.length - 1; i++  ){
            domain = newArr[i];
            count = arr.indexOf( domain ) + 1;
            groupDomain.push( { domain, count } );
        }
    return groupDomain;
}
//sort from Top requested to least
function topDomain(){
    let domain = data.getDomain();
    let reqDomain= [];
    reqDomain = requestedDomain( domain );
    reqDomain.sort( function( a,b ){
        return b.count - a.count;
    } );
    return reqDomain;
//console.log( reqDomain );
}
console.log(topDomain());

//requestedDomain() are only names
//topDomain() are names with number of request.