exports.getDateTime = function () {
    var d = new Date();
    var str = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() + " " + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    return str;
}