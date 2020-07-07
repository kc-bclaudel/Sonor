class Utils{
    static convertToDateString = function(timestamp, locales, options) {
        return new Date(timestamp).toLocaleDateString(locales, options);
    }
}

export default Utils;