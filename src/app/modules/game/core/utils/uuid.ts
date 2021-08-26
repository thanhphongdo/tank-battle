
function uuid(maxLength) {
    // let id = '';
    // while (id.length < maxLength) {
    //     id += Math.random().toString(36).substring(2);
    // }
    // return id.substr(0, maxLength);
    return new Date().getTime() + Math.floor(Math.random() * 1000000000) + Math.floor(Math.random() * 1000000000);
}

export {
    uuid
}