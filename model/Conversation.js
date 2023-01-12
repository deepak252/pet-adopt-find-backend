class Conversation {
    constructor(firstMember, secondMember){
        this.firstMember = firstMember;
        this.secondMember = secondMember;
    }
    toString() {
        return `"${this.firstMember}","${this.secondMember}"`
    }
}

module.exports = Conversation;