class Chat {
    constructor(conversationId, senderId, message, createdAt){
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.message = message;
        this.createdAt = createdAt;
    }
    toString() {
        return `"${this.conversationId}","${this.senderId}","${this.message}","${this.createdAt}"`;
    }
}

module.exports = Chat;