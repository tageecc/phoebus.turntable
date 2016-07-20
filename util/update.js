var User = require('../model/user');

module.exports = function () {
    var _data = {
        lottery_number: 2,
        winning_times: 0
    }

    User.update({}, {"$unset": _data}, {multi: true}, function (err, user) {
        if (err) console.error(err);
        else {
            console.log('============ 更新成功！============');
        }
    })
};
