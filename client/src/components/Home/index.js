import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as actions from '../../Actions/actions';
import io from 'socket.io-client';

// const socket = io('http://localhost');
var socket = io('http://localhost:8888');



class Home extends Component {
    constructor(props){
        super(props);
        this.state={input: ""}
    }
    componentDidMount=()=>{
        console.log("did mount")
        socket.emit("login");
        socket.on("login successed", res =>{
            console.log("did mount res")
            console.log(res.userName)
            this.props.initProps(res.userName, res.rooms, res.room);
        })

        socket.on("update chat", (name, message)=>{
            console.log("message:"+ message)
            this.props.updateChat(name, message);
        })
        socket.on("update rooms", rooms =>{
            this.props.updateRooms(rooms);
        })
    }
  
    inputChange=(e)=>{
        this.setState({input: e.target.value});
    }
    // scrollToBottom = () => {
    //     this.messagesEnd.scrollIntoView({ behavior: "instant" });
    // };
    sendMessage=(e)=>{
        if(e.keyCode === 13){
            // let patt_name = /^\/nick\/s+/ig
            // let patt_room = /^\/join\/s+/ig
            let array = this.state.input.split(" ");
            if(array[0] === "/join"){
            // if(patt_room.test(e.target.value.match)){
                console.log("change room")
                let newRoom = this.state.input.slice(6).trim();
                socket.emit("change room", this.props.currentRoom, newRoom, this.props.currentName);
                this.props.setCurrentRoom(newRoom);
            }else if(array[0] === "/nick"){
                let newName = this.state.input.slice(6).trim();
                socket.emit("change userName", this.props.currentName, newName, this.props.currentRoom)
            }
            else{
                socket.emit(
                    "send chat",
                    this.props.currentName,
                    this.state.input,
                    this.props.currentRoom,
                )
            }
        }
    }
    render() {
        console.log("render")
        if (this.props.hasErrored) {
            return <p>Sorry! There was an error loading the items</p>;
        }

        if (this.props.dataLoading) {
            return <p>Loading…</p>;
        }
        return (
            <div>
                <div >
                    <p>current room: {this.props.currentRoom}</p>
                    {/* <p>current users: {this.props.roomUsers.map(user=>user.name).join(", ")}</p> */}
                    <p>chat record: </p>
                    <div className="chat-div">
                        {this.props.chatText.map(chat=>{
                            return <p>{chat}</p>
                        })}
                    </div>
                </div>
                <div style={{width: "20%", float: "right"}} className="room-div">
                    <p>room list:</p>
                    {this.props.rooms.map(room=>{
                        return <p>{room.name}</p>
                    })}
                </div>
                <div>
                    <ul class="pages">
                        <li class="chat page">
                            <div class="chatArea">
                                <ul class="messages"></ul>
                            </div>
                            <input class="inputMessage" onChange={this.inputChange} placeholder="Type here..." value={this.state.input} onKeyDown={this.sendMessage}/>
                            <div>
                                <p>Chat commands:</p>
                                <li>Change nickname: /nick [username]</li>
                                <li>Join/Create: /join [room name]</li>
                            </div>
                        </li>
                    </ul>
                </div>
                
            </div>
            
        );
    }
}

const mapStateToProps = state => {
    console.log("state.currentRoom:"+state.currentRoom)
    return {
        rooms: state.rooms,
        currentRoom: state.currentRoom,
        currentName: state.currentName,
        roomUsers: state.roomUsers,
        editCompleted: state.editCompleted,
        dataLoading: state.dataLoading,
        hasErrored: state.hasErrored,
        chatText: state.chatText,
    }
};

function mapDispatchToProps(dispatch) {
    return({
        // getAllUsersByRoomFromServer:(roomId) =>{dispatch(actions.getAllUsersByRoomFromServer(roomId))},
        // getAllRoomsFromServer: () => {dispatch(actions.getAllRoomsFromServer())},
        // userNameChange: (name) => {dispatch(actions.userNameChange(name))},
        // userNameCreate: () => {dispatch(actions.userNameCreate())},
        // setChatText: (text) => {dispatch(actions.setChatText(text))},
        initProps:(userName, rooms, room) => {dispatch(actions.initProps(userName, rooms, room))},
        updateChat: (userName, message) => {dispatch(actions.updateChat(userName, message))},
        updateRooms: (rooms) => {dispatch(actions.updateRooms(rooms))},
        setCurrentRoom: (room) => {dispatch(actions.setCurrentRoom(room))},
        // chatChange: (text) => {dispatch(actions.chatChange(text))},
      })
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
