const EMU = {name:"Asm Emulator", version:"1.0.0", desciption:"ASM 16 bit emulator based on JavaScript."};

function Register(){
    //value
    this.value = 0b0000000000000000;

    //func
    this.setValue = function(val){
        this.value = parseInt(val,2);
    }
    this.getHight = function(){
        let result = this.value;
        return result >>> 8;
    }
    this.getLow = function(){
        let result = this.value;
        return result & 0x00ff;
    }
}

function Computer(){
    this.AX = new Register();
    this.BX = new Register();
    this.CX = new Register();
    this.DX = new Register();

    this.AX = new Register();
}
