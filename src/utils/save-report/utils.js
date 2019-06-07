const path = require('path')
/**
 * 
 * @param {Object.<string, string>} tags 
 */
const parseTagsIntoFolderStructure = (tags) => {
    let result = []
    for (let key in tags){
        result.push(`${key}__${tags[key]}`)
    }

    return result.length > 0 ? result.sort() : undefined
}

const generatePath = (rootDir, url, tags, timestamp = new Date().toISOString()) => {
    if(!tags){
        return path.join(rootDir, url.replace(/(^\w+:|^)\/\//, ''), `${timestamp}.html`)
    } else {
        const parsedTags = parseTagsIntoFolderStructure(tags)
        return path.join(rootDir, url.replace(/(^\w+:|^)\/\//, ''), ...parsedTags, `${timestamp}.html`)
    }
}

module.exports = {
    generatePath,
    parseTagsIntoFolderStructure
}