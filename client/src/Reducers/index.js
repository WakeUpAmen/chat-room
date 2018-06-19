//1 create state

const initialState ={
    users:[],
    rooms:[],
    editUnitCompleted: false,
    dataLoading: false,
    hasError: false,
    currentName: "",
    currentRoom: "",
    roomUsers: [],
    chatText:[],
  };

//reducer
export const reducers =(state = initialState, action)=>{
    switch(action.type){
        case 'HAS_ERROR':
            return {...state, hasError: action.val};
        case 'DATA_LOADING':
            return {...state, dataLoading: action.val};
        case 'SET_INITPROPS':
            return{state, currentName: action.userName, currentRoom: action.room, rooms: action.rooms, chatText: [...state.chatText, "you are known as:"+action.userName]}
        case 'UPDATE_CHAT':
            return {...state, chatText: [...state.chatText, `${action.userName}: ${action.message}`]}
        case 'UPDATE_ROOMS':
            return {...state, rooms: action.rooms}
        case 'SET_CURRENT_ROOM':
            return {...state, currentRoom: action.room};
        default:
            return state;
    }
}

export default reducers;