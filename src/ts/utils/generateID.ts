function generateID(prefix = 'id') {

    let id = `${+new Date()}_${Math.round(Math.random() * 1000)}`;

    return `${prefix}_${id}`;

}

export default generateID;