
// actions
export const hasError = val =>({
    type: 'HAS_ERROR',
    val
})

export const dataLoading = val =>({
    type: 'DATA_LOADING',
    val
})

 export const initProps = (userName, rooms, room)=>({
     type: 'SET_INITPROPS',
     userName,
     rooms,
     room
 })

 export const updateChat = (userName, message) => ({
     type: 'UPDATE_CHAT',
     userName,
     message
 })

 export const updateRooms =rooms => ({
     type: 'UPDATE_ROOMS',
     rooms
 })

 export const setCurrentRoom = room =>({
     type: 'SET_CURRENT_ROOM',
     room
 })



