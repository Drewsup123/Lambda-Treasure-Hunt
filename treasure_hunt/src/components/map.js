import React from 'react';
import { FlexibleXYPlot, LineSeries, MarkSeries, XYPlot } from 'react-vis';

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
                c.push([map[room][1], map[map[room][1][adjacentroom][0]]])
            }
        }
        this.setState({lines : c})
    }

    generateMap = () =>{
        this.storeCoords()
        // this.createLines()
        // setTimeout(() => {
        //     console.log("coords ==>", this.state.coords)
        //     console.log("Lines ==> ", this.state.lines)
        // },1000)
    }

    componentDidMount(){
        setTimeout(()=>this.generateMap(),1500)
    }

    render(){
        return(
            <div>
                <h1>MAP</h1>
                {/* <button onClick={this.generateMap}>GM</button>    */}

                    {/* {this.state.lines.map(line => (
                        <LineSeries strokeWidth="3" color="#E5E5E5" data={line} />
                    ))} */}
                    <XYPlot width={200} height={200}>
                        <MarkSeries
                            className="mark-series-example"
                            strokeWidth={5}
                            opacity="1"
                            size="2"
                            color="#525959"
                            data={this.state.coords}
                        />
                    </XYPlot>

            </div>        
        )
    }
}

export default Map