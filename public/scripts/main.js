function initialize() {
    document.getElementById("yAdvOpt").addEventListener("click", yExpand);
    document.getElementById("oAdvOpt").addEventListener("click", oExpand);
}

function yExpand() {
    var rows = document.getElementsByClassName("yAdv");
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].style.display != "table-row") {
            rows[i].style.display = "table-row"
        }
        else {
            rows[i].style.display = "none"
        }
    }
    var opt = document.getElementById("yAdvOptTxt");
    var adv = document.getElementsByClassName("yAdv")[0].style.display;
    if (adv == "none") {
        opt.innerHTML = "&#9660&#9660Advanced Options&#9660&#9660";
    }
    else {
    opt.innerHTML = "&#9650&#9650Basic Options&#9650&#9650";
    }
}

function oExpand() {
    var rows = document.getElementsByClassName("oAdv");
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].style.display != "table-row") {
            rows[i].style.display = "table-row"
        }
        else {
            rows[i].style.display = "none"
        }
    }
    var opt = document.getElementById("oAdvOptTxt");
    var adv = document.getElementsByClassName("oAdv")[0].style.display;
    if (adv == "none") {
        opt.innerHTML = "&#9660&#9660Advanced Options&#9660&#9660";
    }
    else {
    opt.innerHTML = "&#9650&#9650Basic Options&#9650&#9650";
    }
}

function inputValidate() {
    var levels = document.getElementsByClassName("levels");
    var evs = document.getElementsByClassName("ev");
    var ivs = document.getElementsByClassName("iv");
    for (var i = 0; i < levels.length; i++) {
        if (levels[i].value < 1){
            levels[i].value = 1;
        }
        else if (levels[i].value > 100) {
            levels[i].value = 100;
        }
    }
    for (var i = 0; i < evs.length; i++) {
        if (evs[i].value < 0){
            evs[i].value = 0;
        }
        else if (evs[i].value > 252) {
            evs[i].value = 252;
        }
    }
    for (var i = 0; i < ivs.length; i++) {
        if (ivs[i].value < 0){
            ivs[i].value = 0;
        }
        else if (ivs[i].value > 31) {
            ivs[i].value = 31;
        }
    }
}

function getObject(code) {
    inputValidate();
    var JO;
    if (code == 1) {
        document.getElementById("yBall").style.display = "block";
        document.getElementById("yStats").style.display = "block";
        JO = getJO(code);
    }
    if (code == 2) {
        document.getElementById("oBall").style.display = "block";
        document.getElementById("oStats").style.display = "block";
        JO = getJO(code);
    }
    if (code == 3) {
        document.getElementById("dBall").style.display = "block";
        JO = getJO(code);
    }
    return JO;
}

function getJO(code) {
    var input = {};
    if (code == 1) {
        input.block = 'y';
        input.name = document.getElementById("yourPokemon").value;
        input.level = document.getElementById("yLevel").value;
        input.hpEV = document.getElementById("yHPEV").value;
        input.hpIV = document.getElementById("yHPIV").value;
        input.attackEV = document.getElementById("yAttackEV").value;
        input.attackIV = document.getElementById("yAttackIV").value;
        input.defenseEV = document.getElementById("yDefenseEV").value;
        input.defenseIV = document.getElementById("yDefenseIV").value;
        input.sAttackEV = document.getElementById("yS_AttackEV").value;
        input.sAttackIV = document.getElementById("yS_AttackIV").value;
        input.sDefenseEV = document.getElementById("yS_DefenseEV").value;
        input.sDefenseIV = document.getElementById("yS_DefenseIV").value;
        input.speedEV = document.getElementById("ySpeedEV").value;
        input.speedIV = document.getElementById("ySpeedIV").value;
    }
    else if (code == 2) {
        input.block = 'o';
        input.name = document.getElementById("oppPokemon").value;
        input.level = document.getElementById("oLevel").value;
        input.hpEV = document.getElementById("oHPEV").value;
        input.hpIV = document.getElementById("oHPIV").value;
        input.attackEV = document.getElementById("oAttackEV").value;
        input.attackIV = document.getElementById("oAttackIV").value;
        input.defenseEV = document.getElementById("oDefenseEV").value;
        input.defenseIV = document.getElementById("oDefenseIV").value;
        input.sAttackEV = document.getElementById("oS_AttackEV").value;
        input.sAttackIV = document.getElementById("oS_AttackIV").value;
        input.sDefenseEV = document.getElementById("oS_DefenseEV").value;
        input.sDefenseIV = document.getElementById("oS_DefenseIV").value;
        input.speedEV = document.getElementById("oSpeedEV").value;
        input.speedIV = document.getElementById("oSpeedIV").value;
    }
    else if (code == 3) {
        input.move = document.getElementById("moves").selectedOptions[0].innerHTML;
        input.crit = document.getElementById("critical").value;
        input.yT1 = document.getElementById("yStatT1").innerHTML;
        input.yT2 = document.getElementById("yStatT2").innerHTML;
        input.oT1 = document.getElementById("oStatT1").innerHTML;
        input.oT2 = document.getElementById("oStatT2").innerHTML;
        input.level = document.getElementById("yLevel").value;
        input.atk = document.getElementById("yAttackBar").innerHTML;
        input.sAtk = document.getElementById("yS_AttackBar").innerHTML;
        input.def = document.getElementById("oDefenseBar").innerHTML;
        input.sDef = document.getElementById("oS_DefenseBar").innerHTML;
    }
    return input;
}

$(document).ready(function(){

    $("#yData").click(function(){
        JO = getObject(1);
        $.post("http://localhost:5000/pokemon", JO,  function(data, status){
            console.log(data);
            calcYStats(data);
            popMoves(data.moves, data.Speed);
        });
    });
    $("#oData").click(function(){
        JO = getObject(2);
        $.post("http://localhost:5000/pokemon", JO,  function(data, status){
            console.log(data);
            calcOStats(data);
        });
    });
    $("#moveData").click(function(){
        JO = getObject(3);
        $.post("http://localhost:5000/move", JO,  function(data, status){
            console.log(data);
            calcDamage(data);
        });
    });
 
});

function calcYStats(data) { 
    document.getElementById("yStats").style.animationPlayState = "running";
    document.getElementById("oInput").style.display = "block";
    document.getElementById("oInput").style.animationPlayState = "running";
    document.getElementById("yT2Stat").style.display = "none";
    document.getElementById("yBall").style.display = "none";
    document.getElementById("yStatName").innerHTML = data.name;
    document.getElementById("yStatT1").innerHTML = data.t1;
    if (data.t2 != null) {
        document.getElementById("yStatT2").innerHTML = data.t2;
        document.getElementById("yT2Stat").style.display = "table-row";
    }
    document.getElementById("yHPBar").innerHTML = Math.floor(data.HP);
    document.getElementById("yAttackBar").innerHTML = Math.floor(data.Attack);
    document.getElementById("yDefenseBar").innerHTML = Math.floor(data.Defense);
    document.getElementById("yS_AttackBar").innerHTML = Math.floor(data.S_Attack);
    document.getElementById("yS_DefenseBar").innerHTML = Math.floor(data.S_Defense);
    document.getElementById("ySpeedBar").innerHTML = Math.floor(data.Speed);
    document.getElementById("yHPBarGraph").style.width = Math.floor(data.HP) + "px";
    document.getElementById("yAttackBarGraph").style.width = Math.floor(data.Attack) + "px";
    document.getElementById("yDefenseBarGraph").style.width = Math.floor(data.Defense) + "px";
    document.getElementById("yS_AttackBarGraph").style.width = Math.floor(data.S_Attack) + "px";
    document.getElementById("yS_DefenseBarGraph").style.width = Math.floor(data.S_Defense) + "px";
    document.getElementById("ySpeedBarGraph").style.width = Math.floor(data.Speed) + "px";
    
    changeColors(data.block);
}

function calcOStats(data) {
    document.getElementById("oStats").style.animationPlayState = "running";
    document.getElementById("moveAndFactors").style.display = "block";
    document.getElementById("moveAndFactors").style.animationPlayState = "running";
    document.getElementById("oT2Stat").style.display = "none";
    document.getElementById("oBall").style.display = "none";
    document.getElementById("oStatName").innerHTML = data.name;
    document.getElementById("oStatT1").innerHTML = data.t1;
    if (data.t2 != null) {
        document.getElementById("oStatT2").innerHTML = data.t2;
        document.getElementById("oT2Stat").style.display = "table-row";
    }
    document.getElementById("oHPBar").innerHTML = Math.floor(data.HP);
    document.getElementById("oAttackBar").innerHTML = Math.floor(data.Attack);
    document.getElementById("oDefenseBar").innerHTML = Math.floor(data.Defense);
    document.getElementById("oS_AttackBar").innerHTML = Math.floor(data.S_Attack);
    document.getElementById("oS_DefenseBar").innerHTML = Math.floor(data.S_Defense);
    document.getElementById("oSpeedBar").innerHTML = Math.floor(data.Speed);
    document.getElementById("oHPBarGraph").style.width = Math.floor(data.HP) + "px";
    document.getElementById("oAttackBarGraph").style.width = Math.floor(data.Attack) + "px";
    document.getElementById("oDefenseBarGraph").style.width = Math.floor(data.Defense) + "px";
    document.getElementById("oS_AttackBarGraph").style.width = Math.floor(data.S_Attack) + "px";
    document.getElementById("oS_DefenseBarGraph").style.width = Math.floor(data.S_Defense) + "px";
    document.getElementById("oSpeedBarGraph").style.width = Math.floor(data.Speed) + "px";
    
    changeColors(data.block);
}

function changeColors(who) {
    var div1 = document.getElementById(who + "Input");
    var div2 = document.getElementById(who + "Stats");
    var type1 = document.getElementById(who + "StatT1").innerHTML;
    var type2 = document.getElementById(who + "StatT2").innerHTML;
    var color1 = getColor(type1);
    var color2;
    if (type2 != "")
        color2 = getColor(type2);
    else
        color2 = color1;
    div1.style.backgroundColor = color1;
    div2.style.backgroundColor = color2;
}

function popMoves(mvs, spd) {
    var p = document.getElementById("moves");
    for (var i = 0; i < p.childElementCount; i++) {
        p.removeChild(p.childNodes[i]);
    }
    for (var i = 0; i < mvs.length; i++) {
        var m = mvs[i].move.name;
        var u = mvs[i].move.url;
        var o = document.createElement("option");
        o.value = u;
        o.innerHTML = m;
        p.appendChild(o);
    }
    document.getElementById("critChance").innerHTML = ((spd / 512) * 100).toFixed(2);
}

function getColor(type) {
    var color;
    switch(type) {
        case 'normal': color = "#A8A878"
        break;
        case 'fighting': color = "#C03028"
        break;
        case 'flying': color = "#A890F0"
        break;
        case 'poison': color = "#A040A0"
        break;
        case 'ground': color = "#E0C068"
        break;
        case 'rock': color = "#B8A038"
        break;
        case 'bug': color = "#A8B820"
        break;
        case 'ghost': color = "#705898"
        break;
        case 'steel': color = "#B8B8D0"
        break;
        case 'fire': color = "#F08030"
        break;
        case 'water': color = "#6890F0"
        break;
        case 'grass': color = "#78C850"
        break;
        case 'electric': color = "#F8D030"
        break;
        case 'psychic': color = "#F85888"
        break;
        case 'ice': color = "#98D8D8"
        break;
        case 'dragon': color = "#7038F8"
        break;
        case 'dark': color = "#705848"
        break;
        case 'fairy': color = "#EE99AC"
        break;
    }
    return color;
}

function calcDamage(data) {
    document.getElementById("outcome").style.display = "block";
    document.getElementById("outcome").style.animationPlayState = "running";
    document.getElementById("dBall").style.display = "none";
    document.getElementById("moveType").innerHTML = data.type;
    document.getElementById("accuracy").innerHTML = data.accuracy;
    document.getElementById("power").innerHTML = data.power;
    document.getElementById("baseDamage").innerHTML = Math.floor(data.bDamage);
    if (data.crit == "Yes") {
        data.tDamage *= 2;
        document.getElementById("critMult").innerHTML = 2;                         
    }
    else {
        document.getElementById("critMult").innerHTML = 1; 
    }
    document.getElementById("STABMult").innerHTML = data.STAB;
    document.getElementById("typeMult").innerHTML = data.typeEffect;
    if (data.typeEffect == 0) {
        document.getElementById("tType").innerHTML = "Ineffective"
    }
    else if (data.typeEffect < 1) {
        document.getElementById("tType").innerHTML = "Not very Effective"
    }
    else if (data.typeEffect == 1) {
        document.getElementById("tType").innerHTML = "Normal Effect"
    }
    else if (data.typeEffect > 1) {
        document.getElementById("tType").innerHTML = "Super Effective"
    }
    document.getElementById("totalDamage").innerHTML = Math.floor(data.tDamage);
    document.getElementById("KO").innerHTML = Math.ceil(parseInt(document.getElementById("oHPBar").innerHTML) / data.tDamage);
    document.getElementById("moveAndFactors").style.backgroundColor = data.typeColor;
    document.getElementById("outcome").style.backgroundColor = data.typeColor;
}