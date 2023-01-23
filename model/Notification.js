class Notification{
    constructor(userId, type, title=null, description=null, read=null, createdAt){
        this.userId = userId;
        this.type = type;
        this.title = title;
        this.description = description;
        this.read = read;
        this.createdAt = createdAt;
    }
    toString(){
        return `
           "${this.userId}", "${this.type}","${this.title}","${this.description}","${this.read}","${this.createdAt}"`;
    }
}

module.exports = Notification; 