import React from 'react';

class Map extends React.Component{
    constructor(){
        super()

        this.state = {
            coords : [],
            lines : []
        }
    }

    

    storeCoords = () => {
        const map = this.props.graph
        let c = []
        for(let room in map){
            c.push(map[room][0])
        }
        this.setState({coords : c})
    }

    createLines = () =>{
        const map = this.props.graph
        let c = []
        for(let room in map){
            for(let adjacentroom in map[room][1]){
                c.push([map[room][0]], map[map[room][1][adjacentroom][0]])
            }
        }
        this.setState({lines : c})
    }

    generateMap = () =>{
        this.storeCoords()
        this.createLines()
        setTimeout(() => {
            console.log("coords ==>", this.state.coords)
            console.log("Lines ==> ", this.state.lines)
        },1000)
    }

    render(){
        return(
            <div>
                <button onClick={this.generateMap}>GM</button>            
            </div>
        )
    }
}

export default Map