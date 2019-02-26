import React from 'react';
import { BatterNumber } from '../components/BatterNumber';
import { TotalScore } from '../components/TotalScore';
import { OversNum } from '../components/Overs';
import { Wickets } from '../components/Wickets';
import { TargetScore } from '../components/TargetScore';
import { ResetButton } from '../components/ResetButton';
import { NextInningsButton } from '../components/NextInningsButton';

import '../../css/app.css';

export class App extends React.Component{
    constructor (props){
        super(props);
        this.state = {
                        totalScore: 0,
                        wickets: 0,
                        overs: 0,
                        targetScore: 0,
                        batAScore: 0,
                        batBScore: 0
                    };
        this.handleBatAScoreUpdate = this.handleBatAScoreUpdate.bind(this);
        this.handleBatBScoreUpdate = this.handleBatBScoreUpdate.bind(this);
        this.handleOversUpdate = this.handleOversUpdate.bind(this);
        this.handleWicket = this.handleWicket.bind(this);
        this.handleNextInnings = this.handleNextInnings.bind(this);
        this.handleResetClick = this.handleResetClick.bind(this);
        this.handleScoreUpdate = this.handleScoreUpdate.bind(this);
        this.handleBatAWicket = this.handleBatAWicket.bind(this);
        this.handleBatBWicket = this.handleBatBWicket.bind(this);
        this.handleUpdateScoreboard = this.handleUpdateScoreboard.bind(this);
        this.getScoresJson = this.getScoresJson.bind(this);
    }

    handleBatAScoreUpdate (delta){
        let newRuns = this.state.batAScore + delta;
        let updateVals = delta;
        if(newRuns < 0) {
            updateVals = 0 - this.state.batAScore;
            newRuns = 0;
        }
        this.setState({batAScore: newRuns});
        this.handleScoreUpdate(updateVals);
    }

    handleBatBScoreUpdate (delta){
        let newRuns = this.state.batBScore + delta;
        let updateVals = delta;
        if(newRuns < 0) {
            updateVals = 0 - this.state.batBScore;
            newRuns = 0;
        }
        this.setState({batBScore: newRuns});
        this.handleScoreUpdate(updateVals);
    }

    

    handleScoreUpdate (delta) {
        let newTotScore = this.state.totalScore + delta;
        if (newTotScore < 0){
            newTotScore = 0;
        }
        this.setState({totalScore: newTotScore});
        //this.handleUpdateScoreboard();
    }

    handleBatAWicket (){
        this.setState({batAScore: 0});
        this.handleWicket();
    }

    handleBatBWicket (){
        this.setState({batBScore: 0});
        this.handleWicket();
    }

    handleWicket () {
        let newWickets = this.state.wickets + 1;
        if (newWickets > 9){
            newWickets = 9;
        }
        this.setState({wickets: newWickets});
        //this.handleUpdateScoreboard();
    }

    handleOversUpdate (delta){
        let newOvers = this.state.overs + delta;
        if (newOvers < 0){
            newOvers = 0;
        }
        this.setState({overs: newOvers});
        //this.handleUpdateScoreboard();
    }

    handleNextInnings (){
        let newTargetScore = this.state.totalScore + 1;
        this.setState(
            {
                totalScore: 0,
                wickets: 0,
                overs: 0,
                targetScore: newTargetScore,
                batAScore: 0,
                batBScore: 0
            });
    }

    handleResetClick (){
        this.setState(
            {
                totalScore: 0,
                wickets: 0,
                overs: 0,
                targetScore: 0,
                batAScore: 0,
                batBScore: 0
            });

        //this.handleUpdateScoreboard();        
    }

    getScoresJson(){
      console.log('{"scores": {"scorestr1": "'+this.state.batAScore+','+this.state.totalScore+','+this.state.batBScore+
      '", "scorestr2": "'+this.state.wickets+','+this.state.overs+','+this.state.targetScore+'"}}');
      return '{"scores": {"scorestr1": "'+this.state.batAScore+','+this.state.totalScore+','+this.state.batBScore+
              '", "scorestr2": "'+this.state.wickets+','+this.state.overs+','+this.state.targetScore+'"}}';
    }

    // async function getUpdateResult(){
    //   let res = await fetch('http://localhost:5000/update', 
    //   {
    //     method: 'POST',
    //     mode: 'cors',
    //     headers: {
    //       "access-control-allow-origin" : "*",
    //       "Content-type": "application/json; charset=UTF-8"
    //     },
    //     body: this.getScoresJson()
    //   });

    //   if(res.status != 200){
    //     return null;
    //   }

    //   data = await res.json();

    //   return data;
    // }

    handleUpdateScoreboard(){
      //Handle init here
      //let res = await fetch//
      // let data = getUpdateResult(); 
      // if (data){
      //   console.log(data);
      //   console.log('Scoreboard updated');
      // 
      
      fetch('http://localhost:5000/update', 
              {
                method: 'POST',
                mode: 'cors',
                headers: {
                  "access-control-allow-origin" : "*",
                  "Content-type": "application/json; charset=UTF-8"
                },
                body: this.getScoresJson()
              })
      .then((res) => {
        console.log(res.json)
        if(res.status != 200){
          return res
        }
      }).then(console.log("Updated scores."));

    }
    
    componentDidUpdate(prevProps, prevState) {
      if (prevState !== this.state) {
        this.handleUpdateScoreboard();
      }
    }

    componentDidMount(){
      //Handle init here
      fetch('http://localhost:5000/init', 
              {
                method: 'GET',
                mode: 'cors',
                headers: {
                  "access-control-allow-origin" : "*",
                  "Content-type": "application/json; charset=UTF-8"
                }
              })
      .then((res) => {
        if(res.status != 200){
          return res
        }  
      }).then(console.log("Initialised arduino."));
    }

    render(){
        return (
            <div className="app-container">

                <section className="scoreboard-header">
                    ICKLETON CC SCOREBOARD
                </section>

                <section className="batter-a">
                    <BatterNumber title="Batter A" score={this.state.batAScore} scoreUpdate={this.handleBatAScoreUpdate} handleWicket={this.handleBatAWicket}/>
                </section>
                <section className="total-score">
                    <TotalScore number={this.state.totalScore} handleClick={this.handleScoreUpdate} />
                </section>
                <section className="batter-b">
                    <BatterNumber title="Batter B" score={this.state.batBScore} scoreUpdate={this.handleBatBScoreUpdate} handleWicket={this.handleBatBWicket}/>
                </section>

                <section className="wickets-sect">
                    <Wickets value={this.state.wickets} />
                </section>
                <section className="overs-sect">
                    <OversNum number={this.state.overs} handleClick={this.handleOversUpdate} />                        
                </section>
                <section className="target-score">
                    <TargetScore value={this.state.targetScore} />
                </section>

                <section className=".next-innings-button">
                    <NextInningsButton value="Next Innings" onButtonClick={this.handleNextInnings}/>
                </section>
                <section className=".reset-button">
                    <ResetButton value="Reset" onButtonClick={this.handleResetClick}/>
                </section>
            </div>
        );
            
            
           /* Boot strap table layout 
           
           <div className="main-container">
                <div className="page-header scoreboard-header">
                    <h1>Ickleton CC Scoreboard</h1>
                </div>
                <div className="container">
                    <div className="row">
                        <div className=".col-xs-4 batter-a">
                            <BatterNumber title="Batter A" scoreUpdate={this.handleScoreUpdate} handleWicket={this.handleWicket}/>
                        </div>
                        <div className=".col-xs-4 total-score">
                            <TotalScore number={this.state.totalScore} handleClick={this.handleScoreUpdate} />
                        </div>
                        <div className=".col-xs-4 batter-b">
                            <BatterNumber title="Batter B" scoreUpdate={this.handleScoreUpdate} handleWicket={this.handleWicket}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className=".col-xs-4 wickets-sect">
                            <Wickets value={this.state.wickets} />
                        </div>
                        <div className=".col-xs-4 overs-sect">
                            <OversNum number={this.state.overs} handleClick={this.handleOversUpdate} />
                        </div>
                        <div className=".col-xs-4 target-score">
                            <TargetScore value={this.state.targetScore} />
                        </div>
                    </div>
                    <div className="row">
                        <div className=".col-xs-4">
                        Lower Col 1
                        </div>
                        <div className=".col-xs-4">
                        Lower Col 2
                        </div>
                        <div className=".col-xs-4">
                        Lower Col 3
                        </div>
                    </div>
                </div>
            </div>
            ); */ 
    }
}

App.defaultProps = {
    wickets: 0,
    overs: 0,
    totalScore: 0,
    targetScore: 0
}
