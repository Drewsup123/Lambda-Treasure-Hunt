def oppositeDirection(direction):
    # This function literally just reverses whatever direction you put into it
    if direction is 'n':
        return 's'
    elif direction is 's':
        return 'n'
    elif direction is 'e':
        return 'w'
    elif direction is 'w':
        return 'e'


def fill_traversal():
    visited = dict()
    visited[player.currentRoom.id] = player.currentRoom.getExits()
    checked = []
    returned_list = []
    while len(list(visited)) < 499:
        if player.currentRoom.id not in visited:
            visited[player.currentRoom.id] = player.currentRoom.getExits()
        while len(visited[player.currentRoom.id]) is 0 and len(checked) > 0:
            prev_node = checked.pop()
            returned_list.append(prev_node)
            player.travel(prev_node)

        step = visited[player.currentRoom.id].pop(0)
        checked.append(oppositeDirection(step))
        returned_list.append(step)
        player.travel(step)
    return returned_list


traversalPath = fill_traversal()





OLD JAVASCRIPT CODE THAT DID NOT WORK JUST KEEPING IT JUST IN CASE

#   // fillTraversal(){
#   //   let visited = {}
#   //   visited[0] = {"n":"?","s":"?","w":"?","e":"?"}
#   //   let keysArray = []
#   //   let checked = []
#   //   let returnedList = []
#   //   while(visited.length < 499){
#   //     if(!visited[this.getRoomId()]){
#   //       visited[this.getRoomId()] = this.getRoomExits()
#         #    visited[player.currentRoom.id].remove(checked[-1])
#   //     }
#   //     while(visited[getRoomId()].length === 0 && checked.length > 0){
#   //       let prevNode = checked.pop()
#   //       returnedList.push(prevNode)
#   //       this.moveRooms(prevNode)
#   //     }
#   //     step = visited[getRoomId()].pop(0)
#   //     checked.append(this.oppositeDirection(step))

#   //   }
#   // }
