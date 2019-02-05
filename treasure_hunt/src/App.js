import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import Buttons from './components/buttons'

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
      last : {},
      traversal : [],
      numOfRoomsVisited : 1,
      // set default to 1 since we start out in a room
    }
  }
  createMap(){
    let visited = {}
    visited[0] = {"n":"?","s":"?","w":"?","e":"?"}
    let checked = []
    let returnedList = []
    // console.log(Object.keys(visited).length)
    
      while(Object.keys(visited).length < 499){
        // console.log("this is the init id thing: ", this.state.initRoom.room_id)
        if(!visited[this.state.initRoom.room_id]){
          visited[this.state.initRoom.room_id] = this.state.initRoom.exits
          // visited[this.state.initRoom.room_id].del(checked[-1])
        }
        console.log("VISITED ==> ", visited)
        // console.log("STATE ==>", this.state)
        console.log(this.state.currrentRoom)
        while(visited[this.state.initRoom.room_id].length === 0 && checked.length > 0){
          // let prevNode = checked.pop(0)
          let prevNode = checked.shift()
          returnedList.push(prevNode)
          this.moveRooms(prevNode)
          this.initReq()
        }
      
        let step = visited[this.state.initRoom.room_id].pop(0)
        // save the first element in visited[room_id]
        // delete the first element in visited[room_id]
        // let step = Object.keys(visited[this.state.initRoom.room_id][0])

        checked.push(this.oppositeDirection(step))
        returnedList.push(step)
        setTimeout(this.moveRooms(step),15000)
        this.initReq()
    }
  localStorage.setItem('traversal', visited)
  }

  moveRooms = dir => {
    console.log("called!")
    let c = this.state.config
    // had to do this to call it in post request
    axios.post(`${this.state.url}move`, {direction: dir}, c)
    .then(res => {
      this.setState({ initRoom: res.data , last:res.data});
      this.updateState(res.data)
      console.log(res.data)
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
    setTimeout(()=>{this.createMap()}, 1000)
    // this.createMap()
    
  }
  
  initReq(){
    console.log("init line 56")
    axios.get(`${this.state.url}init`, this.state.config)
    .then(res => {
      this.setState({initRoom:res.data})
      // this.updateState(res.data)
      console.log(res.data.exits)
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

  save = (currentRoom, nextRoom, direction) => {
    let traversal= this.state.traversal;
    let visited = this.state.visited;
    let numExplored = this.state.numOfRoomsVisited;

    traversal.push(direction);
    if(nextRoom in visited){/*pass*/} 
    else{
      visited[nextRoom] = { n: "?", s: "?", w: "?", e: "?" };
      numExplored++;
    }
    visited[currentRoom][direction] = nextRoom;
    visited[nextRoom][this.oppositeDirection(direction)] = currentRoom;

    this.setState(traversal, visited, numExplored);
  };

  handleDirectionClick = (e, direction) =>{
    e.preventDefault()
    e.stopPropagation()
    this.moveRooms(direction)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Welcome to the Treasure Hunt!</h1>
        </header>
        <div className="room-details">
          <h2>Room ID: {this.state.initRoom.room_id}</h2>
 
            <p>Exits : {this.state.initRoom.exits}</p>
            <p>Cooldown:{this.state.initRoom.cooldown}</p>
            {/* <ul>
              {/* {this.state.initRoom.players.map(player => {
                return <li>{player}</li>
              })} */}

        </div>
        <Buttons move={this.moveRooms}/>
      </div>
    );
  }
}

export default App;