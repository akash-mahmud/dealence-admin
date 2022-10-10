function chunks(inArray, chunkSize) {
    var chunksArray = [];

    for (let i = 0; i < inArray.length; i += chunkSize) {
        chunksArray.push(inArray.slice(i, i + chunkSize));
    }

    return chunksArray;
}

exports.chunks = chunks;