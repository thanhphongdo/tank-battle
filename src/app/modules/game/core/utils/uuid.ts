
function uuid(maxLength) {
    let id = '';
    while (id.length < maxLength) {
        id += Math.random().toString(36).substring(2);
    }
    return id.substr(0, maxLength);
}

export {
    uuid
}