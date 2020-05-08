const EDT = {name:"Asm Code Editor", version:"1.0.0", desciption:"ASM code editor and highligter"};

$(document).ready(function() {
    var EditorApp = new Application('asm_editor','ASM Editor');
    var editor = new Editor();
    EditorApp.windowList.push(editor);
    EditorApp.init();
    editor.initEditor();
});

var _RESERVE_KEY = [
    'AREA','SPACE','PRESERVE8','EXPORT','DCD','IMPORT','B',
    'IF','ELSE','ENDIF','WEAK','ALIGN',
    //16bits key
    'DW','DB','DD','DQ','DT','SEGMENT','ENDS','END','EQU',
    'BYTE','WORD','DUP','ASSUME','$','$$','DWORD',
    'FAR','NEAR','PROC','ENDP',
    'LABEL','EVEN','ORG','STACK','CODE','PAGE','PARA',"'STACK'",
    'PUBLIC','EXTERN'
];

var _FUNC_KEY = [
    //16bits data trans
    'IN','MOV','OUT','PUSH','POP','XCHG','XLAT','LEA','LDS',
    'LES','LAHF','SAHF','PUSHF','POPF','PUSH','POP',
    //16bits arithmetic operation
    'ADD','ADC','INC','AAA','DAA','SUB','SBB','DEC','NEG','CMP',
    'AAS','DAS','MUL','IMUL','AAM','DIV','IDIV','AAD','CBW','CWD',
    //16bits logical operator
    'NOT','AND','OR','XOR','TEST','SHL','SAL','SHR','SAR','ROL',
    'ROR','RCL','RCR',
    //16bits string handler
    'MOVSB','MOVSW','MOVS','CMPSB','CMPSW','CMPS','SCASB','SCASW',
    'SCAS','LODSB','LODSW','LODS','STOSB','STOSW','STOS','REPE',
    'REPZ','REPNE','REPNZ','REP','CLD',
    //16bits transfer control
    'JNZ','JMP','CALL','RET','JZ','JE','JAE','JA','JNBE','JC','JNC',
    'JNE','JS','JNS','JO','JNO','JP','JPE','JNP','JPO','JNB','JB',
    'JNAE','JBE','JNA','JG','JNLE','JGE','JNL','JL','JNGE','JLE','JNG',
    //16bits loop
    'LOOP','LOOPE','LOOPZ','LOOPNE','LOOPNZ','JCXZ',
    //16bits interrupt
    'INT','INTO','IRET',
    //16bits processor control instruction
    'CLC','CMC','STC','CLD','STD','CLI','STI',
    'ESC','WAIT','LOCK',
    'HLT','NOP'
];

var _OPERATOR_KEY = [
    '+','-','*','/','MOD','SHL','SHR',
    'NOT','AND','OR','XOR',
    'EQ','NE','LT','LE','GT','GE',
    'SEG','OFFSET','LENGTH','TYPE','SIZE',
    'PTR','THIS',
    'HIGH','LOW','SHORT'
];

var _REGISTER_KEY = [
    //Register of 16bits
    'AX','AL','AH','BX','BH','BL','CX','CH','CL','DX','DH','DL',
    'BP','CS','DI','DS','ES','SI','SP','SS','IP','FLAG'
];

var _DATA_KEY_REG = [/[0-9][0-9,a-f,A-F]*[h,H]/,/[01]+[b,B]/,/[0-9]+/]

function Editor(width_vw, height_vh, top_px, left_px){
    Window.call(this, 'ASM Editor', 500, 300, 200, 300);
    this.text = '';
}

Editor.prototype = Object.create(Window.prototype);
Editor.prototype.constructor = Editor;

Editor.prototype.Code = function(){
    return false;
}

Editor.prototype.initEditor = function(){
    $this = this;
    //$this.body.css('display', 'block');
    return false;
}
