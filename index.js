const express = require('express')
const path = require('path')
var bodyParser = require('body-parser');
var Pokedex = require('pokedex-promise-v2');
const PORT = process.env.PORT || 5000

express()
    .use(express.static(path.join(__dirname, 'public')))
    .use(bodyParser.json()) // for parsing application/json
    .use(bodyParser.urlencoded({
        extended: true
    })) // for parsing application/x-www-form-urlencoded
    .set('views', path.join(__dirname, 'views'))
    .get('/', (req, res) => res.send('index.html'))
    .post('/pokemon', function (req, res) {
        calcStats(req.body, res);
    })
    .post('/move', function (req, res) {
        calcMove(req.body, res);
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))

function calcStats(inp, res) {
    var pkm;
    var P = new Pokedex();
    P.getPokemonByName(inp.name, function (response, error) {
        if (!error) {
            pkm = response;
            var Stats = {};
            var lvl = parseInt(inp.level);
            var name = pkm.name;
            var type1 = pkm.types[0].type.name;
            var type2;
            if (pkm.types[1] == undefined) {
                type2 = null;
            } else {
                type2 = pkm.types[1].type.name;
            }

            var HP_Base = pkm.stats[5].base_stat;
            var Attack_Base = pkm.stats[4].base_stat;
            var Defense_Base = pkm.stats[3].base_stat;
            var S_Attack_Base = pkm.stats[2].base_stat;
            var S_Defense_Base = pkm.stats[1].base_stat;
            var Speed_Base = pkm.stats[0].base_stat;

            var HP_IV = parseInt(inp.hpIV);
            var Attack_IV = parseInt(inp.attackIV);
            var Defense_IV = parseInt(inp.defenseIV);
            var S_Attack_IV = parseInt(inp.sAttackIV);
            var S_Defense_IV = parseInt(inp.sDefenseIV);
            var Speed_IV = parseInt(inp.speedIV);

            var HP_EV = parseInt(inp.hpEV);
            var Attack_EV = parseInt(inp.attackEV);
            var Defense_EV = parseInt(inp.defenseEV);
            var S_Attack_EV = parseInt(inp.sAttackEV);
            var S_Defense_EV = parseInt(inp.sDefenseEV);
            var Speed_EV = parseInt(inp.speedEV);

            Stats.moves = pkm.moves;
            Stats.block = inp.block;
            Stats.name = pkm.name;
            Stats.t1 = type1;
            Stats.t2 = type2;
            Stats.HP = ((((2 * HP_Base) + HP_IV + (HP_EV / 4)) * lvl) / 100) + lvl + 10;
            Stats.Attack = ((((2 * Attack_Base) + Attack_IV + (Attack_EV / 4)) * lvl) / 100) + 5;
            Stats.Defense = ((((2 * Defense_Base) + Defense_IV + (Defense_EV / 4)) * lvl) / 100) + 5;
            Stats.S_Attack = ((((2 * S_Attack_Base) + S_Attack_IV + (S_Attack_EV / 4)) * lvl) / 100) + 5;
            Stats.S_Defense = ((((2 * S_Defense_Base) + S_Defense_IV + (S_Defense_EV / 4)) * lvl) / 100) + 5;
            Stats.Speed = ((((2 * Speed_Base) + Speed_IV + (Speed_EV / 4)) * lvl) / 100) + 5;

            res.send(Stats);
            res.end();

        } else {
            console.log(error)
        }
    });
}

function calcMove(inp, res) {

    var P = new Pokedex();
    P.getMoveByName(inp.move, function (response, error) {
        if (!error) {
            
            var yMove = response;
            
            P.getTypeByName(yMove.type.name, function(response, error) {
                if(!error) {
                  
                  var mType = response;
                  
                  var move = inp.move;
                  var crit = inp.crit;
                  var yT1 = inp.yT1;
                  var yT2 = inp.yT2;
                  var oT1 = inp.oT1;
                  var oT2 = inp.oT2;
                  var level = inp.level;
                  var atk = inp.atk;
                  var sAtk = inp.sAtk;
                  var def = inp.def;
                  var sDef = inp.sDef;
                  var type = yMove.type.name;
                  var typeColor = getColor(type);
                  var power = yMove.power;
                  var accuracy = yMove.accuracy;
                  var lvl = parseInt(inp.level);
                  var atk = parseInt(inp.atk);
                  var def = parseInt(inp.def);
                  var STAB = checkStab(type, yT1, yT2);
                  var typeEffect = calcType(mType, oT1, oT2);

                  var bDamage = ((((((2 * lvl) / 5) + 2) * power * atk / def) / 50) + 2);
                  var tDamage = bDamage;
                  tDamage *= STAB;
                  tDamage *= typeEffect;
      
                  var rData = {};
                  rData.inp = inp;
                  rData.move = move;
                  rData.crit = crit;
                  rData.yT1 = yT1;
                  rData.yT2 = yT2;
                  rData.oT1 = oT1;
                  rData.oT2 = oT2;
                  rData.level = level;
                  rData.atk = atk;
                  rData.sAtk = sAtk;
                  rData.def = def;
                  rData.sDef = sDef;
                  rData.type = type;
                  rData.typeColor = typeColor;
                  rData.power = power;
                  rData.accuracy = accuracy;
                  rData.lvl = lvl;
                  rData.atk = atk;
                  rData.def = def;
                  rData.STAB = STAB;
                  rData.typeEffect = typeEffect;
                  rData.bDamage = bDamage;
                  rData.tDamage = tDamage;

                  res.send(rData);
                  res.end();

                } else {
                  console.log(error)
                }
              });

        } else {
            console.log(error)
        }
    });


    function checkStab(type, t1, t2) {
        if (type == t1 || type == t2) {
            return 1.5;
        } else {
            return 1;
        }
    }


    function calcType(mType, dType1, dType2) {
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
        if (dType2 != null && dType2 != undefined) {
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
}