import React, { Component } from 'react';
import './App.css';
import axios from 'axios'

class App extends Component {
  constructor(){
    super()
    this.state = {
      url : "https://lambda-treasure-hunt.herokuapp.com/api/adv/",
      config : {headers:{"Authorization":"Token 78d053a88abb09f2c77e9d6146b585bd54629049"}},
      initRoom : {},
      currrentRoom : 0,
      exits : {},
      coordinates : '',
      cooldown : 0,
      visited : {
        0: { n: "?", s: "?", w: "?", e: "?" }
      },
      last = {}

    }
  }
  createMap(){
    let visited = {}
    visited[0] = {"n":"?","s":"?","w":"?","e":"?"}
    let checked = []
    let returnedList = []
    // console.log(Object.keys(visited).length)
    while(Object.keys(visited).length < 499){
      if(!visited[this.state.initRoom.room_id]){
        visited[this.state.initRoom.room_id] = this.state.initRoom.exits
        // visited[this.state.initRoom.room_id].del(checked[-1])
      }
      console.log("v ==> ", visited[0])
      console.log("STATE ==>", this.state)
      while(visited[this.state.initRoom.room_id].length === 0 && checked.length > 0){
        let prevNode = checked.pop()
        returnedList.push(prevNode)
        this.moveRooms(prevNode)
        this.initReq()
      }
      let step = visited[this.state.initRoom].pop(0)
      checked.push(this.oppositeDirection(step))
      returnedList.push(step)
      this.moveRooms(step)
      this.initReq()
    }
  }
  moveRooms = direction => {
    let c = this.state.config
    // had to do this to call it in post request
    axios.post(`${this.state.url}move`, {c,direction: direction})
    .then(res => {
      this.setState({ initRoom: res.data });
    })
    .catch(err => {
      console.log(err);
    });
  };
  oppositeDirection(direction){
    if(direction === "n"){
      return "s"
    }
    if(direction === "s"){
      return "n"
    }
    if(direction === "e"){
      return "w"
    }
    if(direction === "w"){
      return "e"
    }
  }
  componentDidMount=()=>{
    this.initReq()
    // this.createMap()
  }
  
  initReq(){
    console.log("init line 56")
    axios.get(`${this.state.url}init`, this.state.config)
    .then(res => {
      this.setState({initRoom:res.data})
      this.updateState(res.data)
    })
    .catch(err => {
      console.log(err)
    })
  }

  updateState = res => {
    if ("room_id" in res) {
      this.setState({
        currentRoom: res.room_id,
        exits: res.exits,
        coordinates: res.coordinates,
        cooldown: res.cooldown
      });
    }
  };

  unexploredDirection = () => {
    let exits = this.state.exits;
    let current = this.state.currentRoom;
    let visited = this.state.visited;
    let unexplored = [];
    let directions = ["n", "s", "e", "w"];

    for (let i = 0; i < directions.length; i++) {
      if (exits.includes(directions[i])) {
        if (visited[current][directions[i]] === "?") {
          unexplored.push(directions[i]);
        }
      } else {
        visited[current][directions[i]] = "-";
      }
    }

    this.setState({ visited: visited });

    if (unexplored.length === 0) {
      return null;
    } else {
      return unexplored[Math.floor(Math.random(unexplored.length))];
    }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Welcome to the Treasure Hunt!</h1>
          <h2>Room ID : {this.state.initRoom.room_id}</h2>
          <p>Title : {this.state.initRoom.title}</p>
          <p>Description : {this.state.initRoom.description}</p>
          <p>Coordinates : {this.state.initRoom.coordinates}</p>
          <p>Exits : {this.state.initRoom.exits}</p>
          <p>api key: {process.env.API_KEY}</p>
        </header>
      </div>
    );
  }
}

export default App;