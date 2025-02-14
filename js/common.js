function safeDecode(str) {
    try {
        return decodeURIComponent(str);
    } catch (e) {
        console.warn("Decoding error for", str, e);
        return str;
    }
}