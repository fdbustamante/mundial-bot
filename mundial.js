// Load Dependencies
var cheerio = require('cheerio');
var browser = require('browser');
var jquery  = require("jquery");
var _       = require("underscore");

var $b = new browser();

$b.submit({
  from : 'http://backoffice.despegar.com/wcdespegar/index.php/es/login-es',
  selector: ".form-horizontal",
  data : {
    username  : 'fbustamante@despegar.com',
    password  : 'paratic'
  }
});

$b.browse('http://backoffice.despegar.com/wcdespegar/index.php/es/predicciones').after();

$b.on("end", function(err, out) {

    $ = cheerio.load(out.result);

    var goals  = 0;

    var matchs = 0;

    var calculateCategory = function (team) {

        var teamsCategory = [];

        teamsCategory[0] = [ "brazil", "spain", "germany"];

        teamsCategory[1] = [ "england", "italy", "france", "argentina", "netherlands"];

        teamsCategory[2] = [ "mexico", "colombia", "uruguay", "portugal", "belgium", "russia"];

        teamsCategory[3] = [ "chile", "greece", "côte d\'ivoire", "switzerland", "ecuador", "bosnia-herzegovina", "nigeria", "usa"];

        teamsCategory[4] = [ "cameroon", "croatia", "australia", "japan", "costa rica", "honduras", "iran", "ghana", "algeria", "korea republic" ];

        for(var i = 0; i < teamsCategory.length; i++) {

            if ( teamsCategory[i].indexOf(team) >= 0) {

                return i;

            }

        }
    };

    var calculateMatch = function (matchId, home, away) {

        var homeCat = calculateCategory(home);

        var awayCat = calculateCategory(away);

        var matchId = matchId.replace("result-", "");

        var goalsForMatch = [
            [2, 3, 4, 5, 6],
            [2, 2, 3, 4, 5],
            [2, 2, 2, 3, 4],
            [2, 2, 2, 2, 3],
            [2, 2, 2, 2, 2]
        ];

        var goal1 = Math.round( (Math.random() * goalsForMatch[homeCat][awayCat]) );

        var goal2 = Math.round( (Math.random() * goalsForMatch[awayCat][homeCat]) );

        goals += goal1 + goal2;

        matchs += 1;

        return goal1 + " - " + goal2;

        var $b2 = new browser();

        $b2.submit({
          from : 'http://backoffice.despegar.com/wcdespegar/index.php/es/login-es',
          selector: ".form-horizontal",
          data : {
            username  : 'fbustamante@despegar.com',
            password  : 'paratic'
          }
        });

        $b2.browse("http://backoffice.despegar.com/wcdespegar/index.php/es/index.php?option=com_worldcup&controller=jquery&task=savePredictions&format=raw", {
          method: "POST",
          data: { league_id: 51, matchid: matchId, goals_team_1: goal1, goals_team_2: goal2 }
        }).after();

        $b2.on("end", function(err, out) {
            //console.log(out);
        });

        $b2.run();

        return goal1 + " - " + goal2;

    };

    var teams = [];

    $("tr", ".table").each( function() {

        var matchId  = $(".worldcup_predictions", this).attr("id");

        var teamHome = $(".flag", this).text().trim().toLowerCase();

        var teamAway = $(".flag_right", this).text().trim().toLowerCase();

        if( teamHome != "" && teamHome.indexOf("group") < 0 && teamHome.indexOf("match") < 0 ) {

            console.log( teamHome + " - " + teamAway + " = "+ calculateMatch(matchId, teamHome, teamAway) );

            console.log("--------------------------");

            teams.push(teamHome)
            teams.push(teamAway)

        }

    });

    teams = _.unique(teams);

    //console.log( teams.slice(0, 4) );
    //console.log( teams.slice(4, 8) );
    //console.log( teams.slice(8, 12) );
    //console.log( teams.slice(12, 16) );
    //console.log( teams.slice(16, 20) );
    //console.log( teams.slice(20, 24) );
    //console.log( teams.slice(24, 28) );
    //console.log( teams.slice(28, 32) );

    console.log("Promedio de Gol:: " + (goals / matchs) );
});

$b.run();