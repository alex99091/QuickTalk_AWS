// 채팅방 정보를 관리하는 모델

export default class ChattingInfo {
    constructor({ id = '', name = '', roomNumber = '', messages = [] } = {}) {
      this.id = id;
      this.name = name;
      this.roomNumber = roomNumber;
      this.messages = messages;
    }
  
    addMessage(message) {
      this.messages.push(message);
    }
  
    reset() {
      this.id = '';
      this.name = '';
      this.roomNumber = '';
      this.messages = [];
    }
  }
  