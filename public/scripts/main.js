var yPoke;
var oPoke;
var yMove;
var mType;

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

function getData(url, code) {
    inputValidate();
    if (code == 1) {
        document.getElementById("yBall").style.display = "block";
        document.getElementById("yStats").style.display = "block"
    }
    if (code == 2) {
        document.getElementById("oBall").style.display = "block";
        document.getElementById("oStats").style.display = "block"
    }
    if (code == 3) {
        document.getElementById("dBall").style.display = "block";
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            switch(code) {
                case 1:
                    document.getElementById("yPNameErr").innerHTML = ""
                    yPoke = JSON.parse(this.response);
                    calcYStats();
                    popMoves();
                    break;
                case 2:
                    document.getElementById("oPNameErr").innerHTML = ""
                    oPoke = JSON.parse(this.response);
                    calcOStats();
                    break;
                case 3:
                    yMove = JSON.parse(this.response);
                    getData('https://pokeapi.co/api/v2/type/' + yMove.type.name + '/', 4)
                    break;
                case 4:
                    mType = JSON.parse(this.response);
                    calcDamage();
                    break;
            }
        }
        else if (this.readyState == 4 && this.status != 200) {
            switch(code) {
                case 1:
                    document.getElementById("yPNameErr").innerHTML = "Pokemon not found"
                    document.getElementById("yBall").style.display = "none";
                    break;
                case 2:
                    document.getElementById("oPNameErr").innerHTML = "Pokemon not found"
                    document.getElementById("oBall").style.display = "none";
                    break;
                case 3:
                    document.getElementById("dBall").style.display = "none";
                    break;
                case 4:
                    document.getElementById("dBall").style.display = "none";
                    break;
            }
        }
      };
    xhr.send();
}

function calcYStats() {
    document.getElementById("yStats").style.animationPlayState = "running";
    document.getElementById("oInput").style.display = "block";
    document.getElementById("oInput").style.animationPlayState = "running";
    document.getElementById("yT2Stat").style.display = "none";
    var lvl = parseInt(document.getElementById("yLevel").value);
    var name = yPoke.name;
    var type1 = yPoke.types[0].type.name;
    var type2;
    if (yPoke.types[1] == undefined) {
        type2 = null;
    }
    else {
        type2 = yPoke.types[1].type.name;
    }

    var HP_Base = yPoke.stats[5].base_stat;
    var Attack_Base = yPoke.stats[4].base_stat;
    var Defense_Base = yPoke.stats[3].base_stat;
    var S_Attack_Base = yPoke.stats[2].base_stat;
    var S_Defense_Base = yPoke.stats[1].base_stat;
    var Speed_Base = yPoke.stats[0].base_stat;
    
    var HP_IV = parseInt(document.getElementById("yHPIV").value);
    var Attack_IV = parseInt(document.getElementById("yAttackIV").value);
    var Defense_IV = parseInt(document.getElementById("yDefenseIV").value);
    var S_Attack_IV = parseInt(document.getElementById("yS_AttackIV").value);
    var S_Defense_IV = parseInt(document.getElementById("yS_DefenseIV").value);
    var Speed_IV = parseInt(document.getElementById("ySpeedIV").value);
    
    var HP_EV = parseInt(document.getElementById("yHPEV").value);
    var Attack_EV = parseInt(document.getElementById("yAttackEV").value);
    var Defense_EV = parseInt(document.getElementById("yDefenseEV").value);
    var S_Attack_EV = parseInt(document.getElementById("yS_AttackEV").value);
    var S_Defense_EV = parseInt(document.getElementById("yS_DefenseEV").value);
    var Speed_EV = parseInt(document.getElementById("ySpeedEV").value);

    var HP = ((((2 * HP_Base) + HP_IV + (HP_EV / 4)) * lvl) / 100) + lvl + 10;
    var Attack = ((((2 * Attack_Base) + Attack_IV + (Attack_EV / 4)) * lvl) / 100) + 5;
    var Defense = ((((2 * Defense_Base) + Defense_IV + (Defense_EV / 4)) * lvl) / 100) + 5;
    var S_Attack = ((((2 * S_Attack_Base) + S_Attack_IV + (S_Attack_EV / 4)) * lvl) / 100) + 5;
    var S_Defense = ((((2 * S_Defense_Base) + S_Defense_IV + (S_Defense_EV / 4)) * lvl) / 100) + 5;
    var Speed = ((((2 * Speed_Base) + Speed_IV + (Speed_EV / 4)) * lvl) / 100) + 5;


    document.getElementById("yBall").style.display = "none";
    document.getElementById("yStatName").innerHTML = name;
    document.getElementById("yStatT1").innerHTML = type1;
    if (type2 != null) {
        document.getElementById("yStatT2").innerHTML = type2;
        document.getElementById("yT2Stat").style.display = "table-row";
    }
    document.getElementById("yHPBar").innerHTML = Math.floor(HP);
    document.getElementById("yAttackBar").innerHTML = Math.floor(Attack);
    document.getElementById("yDefenseBar").innerHTML = Math.floor(Defense);
    document.getElementById("yS_AttackBar").innerHTML = Math.floor(S_Attack);
    document.getElementById("yS_DefenseBar").innerHTML = Math.floor(S_Defense);
    document.getElementById("ySpeedBar").innerHTML = Math.floor(Speed);
    document.getElementById("yHPBarGraph").style.width = Math.floor(HP) + "px";
    document.getElementById("yAttackBarGraph").style.width = Math.floor(Attack) + "px";
    document.getElementById("yDefenseBarGraph").style.width = Math.floor(Defense) + "px";
    document.getElementById("yS_AttackBarGraph").style.width = Math.floor(S_Attack) + "px";
    document.getElementById("yS_DefenseBarGraph").style.width = Math.floor(S_Defense) + "px";
    document.getElementById("ySpeedBarGraph").style.width = Math.floor(Speed) + "px";
    
    changeColors("y");
}

function calcOStats() {
    document.getElementById("oStats").style.animationPlayState = "running";
    document.getElementById("moveAndFactors").style.display = "block";
    document.getElementById("moveAndFactors").style.animationPlayState = "running";
    document.getElementById("oT2Stat").style.display = "none";
    var lvl = parseInt(document.getElementById("oLevel").value);
    var name = oPoke.name;
    var type1 = oPoke.types[0].type.name;
    var type2;
    if (oPoke.types[1] == undefined) {
        type2 = null;
    }
    else {
        type2 = oPoke.types[1].type.name;
    }

    var HP_Base = oPoke.stats[5].base_stat;
    var Attack_Base = oPoke.stats[4].base_stat;
    var Defense_Base = oPoke.stats[3].base_stat;
    var S_Attack_Base = oPoke.stats[2].base_stat;
    var S_Defense_Base = oPoke.stats[1].base_stat;
    var Speed_Base = oPoke.stats[0].base_stat;
    
    var HP_IV = parseInt(document.getElementById("oHPIV").value);
    var Attack_IV = parseInt(document.getElementById("oAttackIV").value);
    var Defense_IV = parseInt(document.getElementById("oDefenseIV").value);
    var S_Attack_IV = parseInt(document.getElementById("oS_AttackIV").value);
    var S_Defense_IV = parseInt(document.getElementById("oS_DefenseIV").value);
    var Speed_IV = parseInt(document.getElementById("oSpeedIV").value);
    
    var HP_EV = parseInt(document.getElementById("oHPEV").value);
    var Attack_EV = parseInt(document.getElementById("oAttackEV").value);
    var Defense_EV = parseInt(document.getElementById("oDefenseEV").value);
    var S_Attack_EV = parseInt(document.getElementById("oS_AttackEV").value);
    var S_Defense_EV = parseInt(document.getElementById("oS_DefenseEV").value);
    var Speed_EV = parseInt(document.getElementById("oSpeedEV").value);

    var HP = ((((2 * HP_Base) + HP_IV + (HP_EV / 4)) * lvl) / 100) + lvl + 10;
    var Attack = ((((2 * Attack_Base) + Attack_IV + (Attack_EV / 4)) * lvl) / 100) + 5;
    var Defense = ((((2 * Defense_Base) + Defense_IV + (Defense_EV / 4)) * lvl) / 100) + 5;
    var S_Attack = ((((2 * S_Attack_Base) + S_Attack_IV + (S_Attack_EV / 4)) * lvl) / 100) + 5;
    var S_Defense = ((((2 * S_Defense_Base) + S_Defense_IV + (S_Defense_EV / 4)) * lvl) / 100) + 5;
    var Speed = ((((2 * Speed_Base) + Speed_IV + (Speed_EV / 4)) * lvl) / 100) + 5;


    document.getElementById("oBall").style.display = "none";
    document.getElementById("oStatName").innerHTML = name;
    document.getElementById("oStatT1").innerHTML = type1;
    if (type2 != null) {
        document.getElementById("oStatT2").innerHTML = type2;
        document.getElementById("oT2Stat").style.display = "table-row";
    }
    document.getElementById("oHPBar").innerHTML = Math.floor(HP);
    document.getElementById("oAttackBar").innerHTML = Math.floor(Attack);
    document.getElementById("oDefenseBar").innerHTML = Math.floor(Defense);
    document.getElementById("oS_AttackBar").innerHTML = Math.floor(S_Attack);
    document.getElementById("oS_DefenseBar").innerHTML = Math.floor(S_Defense);
    document.getElementById("oSpeedBar").innerHTML = Math.floor(Speed);
    document.getElementById("oHPBarGraph").style.width = Math.floor(HP) + "px";
    document.getElementById("oAttackBarGraph").style.width = Math.floor(Attack) + "px";
    document.getElementById("oDefenseBarGraph").style.width = Math.floor(Defense) + "px";
    document.getElementById("oS_AttackBarGraph").style.width = Math.floor(S_Attack) + "px";
    document.getElementById("oS_DefenseBarGraph").style.width = Math.floor(S_Defense) + "px";
    document.getElementById("oSpeedBarGraph").style.width = Math.floor(Speed) + "px";

    changeColors("o");
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

function popMoves() {
    var p = document.getElementById("moves");
    for (var i = 0; i < p.childElementCount; i++) {
        p.removeChild(p.childNodes[i]);
    }
    var mvs = yPoke.moves;
    for (var i = 0; i < mvs.length; i++) {
        var m = mvs[i].move.name;
        var u = mvs[i].move.url;
        var o = document.createElement("option");
        o.value = u;
        o.innerHTML = m;
        p.appendChild(o);
    }
    document.getElementById("critChance").innerHTML = ((yPoke.stats[0].base_stat / 512) * 100).toFixed(2);
}

function calcDamage() {
    document.getElementById("outcome").style.display = "block";
    document.getElementById("outcome").style.animationPlayState = "running";
    var type = yMove.type.name;
    var typeColor = getColor(type);
    var power = yMove.power;
    var accuracy = yMove.accuracy;
    var dType1 = oPoke.types[0].type.name;
    var dType2;
    if (oPoke.types[1] == undefined) {
        dType2 = null;
    }
    else {
        dType2 = oPoke.types[1].type.name;
    }
    var lvl = parseInt(document.getElementById("yLevel").value);
    var atk = parseInt(document.getElementById("yAttackBar").innerHTML);
    var def = parseInt(document.getElementById("oDefenseBar").innerHTML);
    var bDamage = ((((((2 * lvl) / 5) + 2) * power * atk / def) / 50) + 2);
    var tDamage = bDamage;
    var STAB = checkStab(type);
    tDamage *= STAB;
    var typeEffect = calcType(dType1, dType2);
    tDamage *= typeEffect;

    document.getElementById("dBall").style.display = "none";
    document.getElementById("moveType").innerHTML = type;
    document.getElementById("accuracy").innerHTML = accuracy;
    document.getElementById("power").innerHTML = power;
    document.getElementById("baseDamage").innerHTML = Math.floor(bDamage);
    if (document.getElementById("critical").value == "Yes") {
        tDamage *= 2;
        document.getElementById("critMult").innerHTML = 2;                         
    }
    else {
        document.getElementById("critMult").innerHTML = 1; 
    }
    document.getElementById("STABMult").innerHTML = STAB;
    document.getElementById("typeMult").innerHTML = typeEffect;
    if (typeEffect == 0) {
        document.getElementById("tType").innerHTML = "Ineffective"
    }
    else if (typeEffect < 1) {
        document.getElementById("tType").innerHTML = "Not very Effective"
    }
    else if (typeEffect == 1) {
        document.getElementById("tType").innerHTML = "Normal Effect"
    }
    else if (typeEffect > 1) {
        document.getElementById("tType").innerHTML = "Super Effective"
    }
    document.getElementById("totalDamage").innerHTML = Math.floor(tDamage);
    document.getElementById("KO").innerHTML = Math.ceil(parseInt(document.getElementById("oHPBar").innerHTML) / tDamage);
    document.getElementById("moveAndFactors").style.backgroundColor = typeColor;
    document.getElementById("outcome").style.backgroundColor = typeColor;
}

function calcType(dType1, dType2) {
    var f1 = 1;
    var f2 = 1;
    var mult = mType.damage_relations;
    for (var i = 0; i < mult.no_damage_to.length; i++) {
        if (mult.no_damage_to[i].name == dType1) {
            f1 = 0;
        }
    }
    for (var i = 0; i < mult.half_damage_to.length; i++) {
        if (mult.half_damage_to[i].name == dType1) {
            f1 = 0.5;
        }
    }
    for (var i = 0; i < mult.double_damage_to.length; i++) {
        if (mult.double_damage_to[i].name == dType1) {
            f1 = 2;
        }
    }
    if (dType2 != null) {
        for (var i = 0; i < mult.no_damage_to.length; i++) {
            if (mult.no_damage_to[i].name == dType2) {
                f2 = 0;
            }
        }
        for (var i = 0; i < mult.half_damage_to.length; i++) {
            if (mult.half_damage_to[i].name == dType2) {
                f2 = 0.5;
            }
        }
        for (var i = 0; i < mult.double_damage_to.length; i++) {
            if (mult.double_damage_to[i].name == dType2) {
                f2 = 2;
            }
        }
        return f1 * f2;
    }
    return f1;
}

function checkStab(type) {
    var t1 = document.getElementById("yStatT1").innerHTML;
    var t2 = document.getElementById("yStatT2").innerHTML;
    if (type == t1 || type == t2) {
        return 1.5;
    }
    else {
        return 1;
    }
}