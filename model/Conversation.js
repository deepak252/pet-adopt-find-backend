class Conversation {
    constructor(userId1, userId2,createdAt){
        this.userId1 = userId1;
        this.userId2 = userId2;
        this.createdAt = createdAt;
    }
    toString() {
        return `"${this.userId1}","${this.userId2}","${this.createdAt}"`
    }
}

module.exports = Conversation;