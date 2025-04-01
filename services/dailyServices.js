const { Daily_Live_Schedule } = require("../dummyData/Daily_Live_Schedule");
const MatchModel = require("../models/Match");

const dailyLiveSchedule = async () => {
  try {
    const todaysMatches = Daily_Live_Schedule?.sport_events?.[0];
    console.log("country_code",todaysMatches.competitors);
    
    const data = await MatchModel.create({
        matchName:`${todaysMatches.competitors[0].abbreviation}v${todaysMatches.competitors[1].abbreviation}`,
        matchId:todaysMatches.id,
        teamOne:{
            id:todaysMatches.competitors[0].id,
            name:todaysMatches.competitors[0].name,
            country:todaysMatches.competitors[0].country,
            country_code:todaysMatches.competitors[0].country_code,
            abbreviation:todaysMatches.competitors[0].abbreviation,
        },
        teamTwo:{
            id:todaysMatches.competitors[1].id,
            name:todaysMatches.competitors[1].name,
            country:todaysMatches.competitors[1].country,
            country_code:todaysMatches.competitors[1].country_code,
            abbreviation:todaysMatches.competitors[1].abbreviation,
        },
        scheduled:todaysMatches.scheduled,
        start_time_tbd:todaysMatches.start_time_tbd,
        status:todaysMatches.status,
        season:{
            id:todaysMatches.season.id,
            name:todaysMatches.season.name,
            year:todaysMatches.season.year
        },
        tournament:{
            id:todaysMatches.tournament.id,
            name:todaysMatches.tournament.name
        }
        
    });
    console.log('datadata',{data});
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  dailyLiveSchedule,
};
