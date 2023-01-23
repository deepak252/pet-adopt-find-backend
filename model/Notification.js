class Notification{
    constructor(userId, notify_type, title=null, description=null, isRead=null, createdAt){
        this.userId = userId;
        this.notify_type = notify_type;
        this.title = title;
        this.description = description;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }
    toString(){
        return `
           "${this.userId}", "${this.notify_type}","${this.title}","${this.description}","${this.isRead}","${this.createdAt}"`;
    }
}

module.exports = Notification; 