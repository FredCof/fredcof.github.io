const MEM = {name:"Asm Emulator Memery IO", version:"1.0.0", desciption:"ASM 16 bit emulator memery io system based on JavaScript."};

//creat a buffer space for Emulator memery system;
var buffer = new ArrayBuffer(65536);

function Memio(cmdout, cmdin, cmdstat, point){
    this.ram = new Uint8Array(buffer);
    for (var i = 0; i < this.ram.length; i++) {
        this.ram[i] = 0;
    }

    this.db = null;
    this.drv = 0;
    this.trk = 0;
    this.sec = 1;   //sector start number
    this.dma = 0x0000;
    this.dskstat = 0;
    this.iocount = 0;
    this.wirteCompleteCB = null;

    //tracks started 0, contains sector started with 1 and unique
    this.drives = [{tracks:77, sector:26, name:"dsk0.cpm"},
                   {tracks:77, sector:26, name:"dsk1.cpm"},
                   {tracks:77, sector:26, name:"dsk2.cpm"},
                   {tracks:77, sector:26, name:"dsk3.cpm"}];

    // out, in, stat, point
    this.cmdout = cmdout;
    this.cmdin = cmdin;
    this.cmdstat = cmdstat;
    this.pointor = point;

    this.dumpdata = "";
}

//pair rd
Memio.prototype.read = function(n){
    return this.ram[n];
}

//pair wr
Memio.prototype.write = function(n,data){
    this.ram[n & 0xffff] = data & 0xff;
    return this.ram[n & 0xffff];
}

//pair load
Memio.prototype.writeBuffer = function(address, data){
    if (data.length == 0) return false;
    if (typeof data[0] == 'string'){
        for (let i = 0; i < data.length; i++) {
            this.write(address+i, parseInt(data[i],16));
        }
    } else {
        for (let i = 0; i < data.length; i++) {
            this.write(address+i, data[i]);
        }
    }
    return true;
}

Memio.prototype.loadIntelHex = function(buf){
    var res = {
        ok: true,
        saddr:  0x0000,
        eaddr:  0x0000,
        len:    0x0000,
    }

    let count = 0;
    let addr = 0;
    let saddr = this.ram.length;
    let eaddr = 0;
    let data;
    let s = 0;
    while (s < buf.length) {
        while (buf[s++] != ":") {
            if (s >= buf.length) {
                res.ok = false;
                return res;
            }
        }
        let chk = 0;
        let s1 = s;
        while ((c = buf[s1]) >= '0') {
            chk += parseInt(buf.substr(s1, 2),16);s1+=2;
        }
        if (chk & 0xff != 0) {
            res.ok = false;
            return res;
        }
        count = parseInt(buf.substr(s,2),16);
        s += 2;
        if (count == 0)
            break;
        addr = parseInt(buf.substr(s,4),16);
        s += 2;
        if (addr < saddr)
            saddr = addr;
        eaddr = addr + count + 1;
        s += 2;
        for (let i = 0; i < count; i++) {
            data = parseInt(buf.substr(s,2),16);
            s += 2;
            this.write(addr + i, data);
        }
        res.saddr = saddr;
        res.eaddr = eaddr;
        res.len = eaddr - saddr + 1;
        return res;
    }
}

Memio.prototype.initTape = function(){
    this.tapename = 'EOT';
    this.tapepos = 0;
    this.tape = '';
}

Memio.prototype.mountTape = function(name, content){
    this.tapename = name;
    this.tapepos = 0;
    this.tape = content;
}

Memio.rewindTape = function(){
    this.tapepos = 0;
}

Memio.prototype.initPuncher = function(name){
    this.punchername = name ? name:'puncher.txt';
    this.puncher = '';
}

Memio.prototype.input = function(port){
    switch (port) {
        case 0:
            break;
        case 1:
            break;
        case 4:
            return 0xff;
        case 5:
            if (this.tapepos >= this.tape.length) return 0x1a;
            return this.tape.charCodeAt(this.tapepos++) & 0xff;
        case 10:
            return this.drv;
        case 11:
            return this.trk;
        case 12:
            return this.sec;
        case 13:
            return this.iocount == 0 ? 0xff : 0x00;
        case 14:
            return this.dskstat;
        case 15:
            return this.dma & 0xff;
        case 16:
            return (this.dma & 0xff00) >> 8;
    }
    return 0x1a;
}

Memio.prototype.output = function(port, value){
    switch (port) {
        case 1:
            this.cmdout(String.fromCharCode(value));
            break;
        case 3:
            this.pointor(String.fromCharCode(value));
            break;
        case 4:
            if (value & 0x01) this.rewindTape();
            break;
        case 5:
            this.puncher += String.fromCharCode(value);
            break;
        case 10:
            this.drv = value & 0xff;
            break;
        case 11:
            this.trk = value & 0xff;
            break;
        case 12:
            this.sec = value & 0xff;
            break;
        case 13:
            if (this.drv >= this.drives.length) {
                this.dskstatus = 1; // illegal drive
                return null;
            }
            if (this.trk >= this.drives[this.drv].tracks) {
                this.dskstatus = 2; // illegal track
                return null;
            }
            if (this.sec == 0 || this.sec > this.drives[this.drv].sectors) {
                this.dskstatus = 3; // illegal sector
                return null;
            }
            if (value == 0) {        // read
                if (this.dma > this.ram.length - 128) {
                    this.dskstatus = 5;  // read error
                } else {
                    this.readSector(this.drv, this.trk, this.sec, this.dma, this.dma + 128);
                    // dskstatus set by readSector
                }
            } else if (value == 1) { // write
                if (this.dma > this.ram.length - 128) {
                    this.dskstatus = 6;  // write error
                } else {
                    this.writeSector(this.drv, this.trk, this.sec, this.dma, this.dma + 128);
                    // dskstatus set by writeSector
                }
            } else {
                this.dskstatus = 7;    // illegal command
            }
            break;
        case 15:
            this.dma = (this.dma & 0xff00) | (value & 0xff);
            break;
        case 16:
            this.dma = (this.dma & 0x00ff) | ((value & 0xff) << 8);
            break;
    }
    return null;
}

Memio.prototype.dbInit = function(){
    try{
        var shortName = 'emu8086';
        var version = '1.0';
        var displayName = 'i8086 Emulator DB';
        var maxSize = 4*251*4*1024;
        var myDB = openDatabase(shortName,version,displayName,maxSize);
        this.db = myDB;
    }catch(e){
        if(e instanceof ReferenceError){
            alert('This brower not support WebDB');
            myDB = null;
            return [false, 'No WebDB available.'];
        }else if(e == INVALID_STATE_ERR){
            return [false, "Invalid database version"];
        }else{
            return [false,"Unknow error"+e+"."];
        }
    }

    var memio = this;
    var createDrives = 'CREATE TABLE IF NOT EXISTS drives('+
        ' drive     INTEGER NOT NULL PRIMARY KEY' + // drive number
        ',url       STRING  NOT NULL' +          // drive URL
        ',maxtrack  INTEGER NOT NULL' +          // starts at 0
        ',maxsector INTEGER NOT NULL' +          // starts at 1
        ');';
    var createSectors = 'CREATE TABLE IF NOT EXISTS sectors(' +
        ' id     INTEGER NOT NULL PRIMARY KEY' + // constructed
        ',drive  INTEGER NOT NULL' +             // drive number
        ',track  INTEGER NOT NULL' +             // starts at 0
        ',sector INTEGER NOT NULL' +             // starts at 1
        ',dirty  INTEGER NOT NULL DEFAULT 0' +   // needed for writeback
        ',data   BLOB    NOT NULL DEFAULT ""' +
        ');';
    this.db.transaction(
        function(transaction){
            transaction.executeSql(createDrives,  [], nullDataHandler, killTransaction);
            transaction.executeSql(createSectors, [], nullDataHandler, errorHandler);
            transaction.executeSql(
                'SELECT drive, url, maxtrack, maxsector FROM drives;',
                [],
                function(transaction, result){
                    for (let cur = 0; cur < result.rows.length; cur++) {
                        let row = result.rows.item(cur);
                        let drv = row['drive'];
                        memio.drives[drv].tracks = row['maxtrack'];
                        memio.drives[drv].sectors = row['maxsector'];
                        memio.drives[drv].name = row['url'];
                    }
                },
                function(transaction, error){
                    alert('disk initicalization error'+ error);
                });
        });
    return [true, 'OK'];
}

Memio.prototype.loadDriveBin = function(drv, url, bin){
    if(drv < 0 || drv >= this.drives.length) return false;
    var maxtrack = this.drives[drv].tracks;
    var maxsector = this.drives[drv].sectors;
    this.drives[drv].name = url;

    this.db.transaction(
        function(transaction){
            transaction.executeSql(
                'INSERT OR REPLACE INTO DRIVES('+
                'drive, url, maxtrack, maxsector'+
                ') VALUES (?,?,?,?);',
                [drv, url, maxtrack, maxsector],
                nullDataHandler, errorHandler);
        });
    var ix = 0;
    for (let i = 0; i < maxtrack; i++) {
        for (let j = 0; j < maxsector; j++) {
            var data = [];
            for (let k = 0; k < 128; k++) {
                data[i] = bin.charCodeAt(ix++) & 0xff;
            }
            this._writeSector(drv,i,j,data,0);
        }
    }
}

Memio.prototype.callCB = function(res){
    var cb = this.writeCompleteCB;
    if(cb){
        this.writeCompleteCB = null;
        cb(res);
    }
}

Memio.prototype._writeSector = function(drv, trk, sec, data, dirty){
    var memio = this;
    this.iocount += 1;
    this.db.transaction(
        function(transaction){
            transaction.executeSql(
                'INSERT OR REPLACE INTO '+
                'sectors(id, drive, track, sector, dirty, data)'+
                'VALUES (?,?,?,?,?,?);',
                [drv*65536+trk*256+sec-1,drv,trk,sec,dirty,data],
                function(transaction,results){
                    memio.iocount -= 1;
                    memio.dskstat = 0;
                    if(memio.iocount == 0) memio.callCB(true);
                },
                function(transaction,error){
                    memio.iocount -= 1;
                    memio.dskstat = 8;
                    if(memio.iocount == 0) memio.callCB(false);
                    alert('disk write error'+error);
                });
        });
}

Memio.prototype.writeSector = function(drv, trk, sec, dma, end) {
  var data = this.ram.slice(dma, end);
  this._writeSector(drv, trk, sec, data, 1); // dirty write
}

Memio.prototype.readSector = function(drv, trk, sec, dma){
    var memio = this;
    this.iocount += 1;
    this.db.transaction(
        function(transaction){
            transaction.executeSql(
                'SELECT data FROM sectors WHERE id = ?;',
                [drv*65536+trk*256+sec-1],
                function(transaction,result){
                    if (results.rows.length != 1) {
                        memio.dskstat = 8;
                        memio.iocount -= 1;
                        alert('Sector not found d'+drv+' t'+trk+' s'+sec);
                        return;

                    }
                    var row = results.rows.item(0);
                    var data = row['data'].split(',');
                    for(let i = 0;i < data.length;i++)
                        memio.ram[dam+i] = parseInt(data[i],10);
                    memio.iocount -= 1;
                    memio.dskstat = 0;
                },
                function(transaction,error){
                    memio.iocount -= 1;
                    memio.dskstat = 8;
                    alert('disk error '+ error);
                });
        });
}

Memio.prototype.dumpDisk = function(drv, postAction) {
    if (drv < 0 || drv >= this.drives.length) return false;
    var maxtrack = this.drives[drv].tracks;
    var maxsector = this.drives[drv].sectors;
    var memio = this;
    this.dumpdata = "";
    this.iocount += 1;
    this.db.transaction(
        function (transaction) {
            transaction.executeSql(
                'SELECT track, sector, data FROM sectors WHERE drive = ? ORDER BY id ASC;',
                [ drv ],
                function(transaction, results) {
                    if (results.rows.length != maxtrack * maxsector) {
                        memio.dskstat = 8;
                        memio.iocount -= 1;
                        alert("disc error, wrong number of sectors " + results.rows.length);
                        return;
                    }
	                var idx = 0;
                    for (var t = 0; t < maxtrack; ++t) {
                        for (var s = 1; s <= maxsector; ++s) {
                            var row = results.rows.item(idx++);
                    	    //var row = results.rows.item(t*maxsector + s);
                    	    // check track and sector for match as debugging help
                    	    var data = row['data'].split(',');
                    	    for (var i = 0; i < data.length; ++i) {
                                // http://jsfromhell.com/classes/binary-parser
                                memio.dumpdata += String.fromCharCode(parseInt(data[i],10));
                            }
                        }
                    }
                	memio.iocount -= 1;
                    memio.dskstat = 0;
                	if (postAction)
                        postAction(memio.dumpdata); // normally opens the save window
                    },
                function(transaction, error) {
                    memio.iocount -= 1;
                    memio.dskstat = 8;
                    alert("disk error " + error)
                });
        });
}

// for development purposes
Memio.prototype.dbWipe = function() {
    if (this.db != null) {
        this.db.transaction(
            function (transaction) {
                transaction.executeSql('DROP TABLE drives;');
                transaction.executeSql('DROP TABLE sectors;');
            });
    }
}


//------ global functions as db callbacks
//
/* When passed as the error handler, this silently causes a
 * transaction to fail. */
function killTransaction(transaction, error) {
    return true; // fatal transaction error
}

// TBD errorHandler replace, must set iocount to zero again...

/* When passed as the error handler, this causes a transaction
 * to fail with a warning message. */
function errorHandler(transaction, error) {
    // error.message is a human-readable string.
    // error.code is a numeric error code
    alert('Oops.  Error was '+error.message+' (Code '+error.code+')');

    // Handle errors here
    var we_think_this_error_is_fatal = true;
    if (we_think_this_error_is_fatal) return true;
    return false;
}

/* This is used as a data handler for a request that should
 * return no data. */
function nullDataHandler(transaction, results) {
    return true;
}
/*
 * uncomplete:
 * iostatus
 * dump
 */
