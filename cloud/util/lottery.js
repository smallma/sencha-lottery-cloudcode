// var _ = require('underscore');

var commonUtil = require('cloud/util/common.js');

var Lottery = Parse.Object.extend('Lottery');
var Jackpot = Parse.Object.extend('Jackpot');


function createDrawInfo(info) {
  var promise = new Parse.Promise();

  var lotteryQuery = new Parse.Query(Lottery);
  lotteryQuery.equalTo('drawNo', info.drawNo);
  lotteryQuery.equalTo('typeId', info.typeId);
  lotteryQuery.first()
  .then(function (lottery) {
    if (lottery) {
      lottery.set(commonUtil.genUpdateParams({
        'drawNo': info.drawNo,
        // 'drawDate': info.drawDate,
        'drawDate': new Date(info.drawDate),
        'special': info.special,
        'typeId': info.typeId,
        'winningNumbers': info.winningNumbers,
      }));
      return lottery.save();
    } else {
      console.log('info: ');
      console.log(info);

      var newLottery = new Lottery();
      newLottery.set(commonUtil.genUpdateParams({
        'drawNo': info.drawNo,
        // 'drawDate': info.drawDate,
        'drawDate': new Date(info.drawDate),
        'special': info.special,
        'typeId': info.typeId,
        'winningNumbers': info.winningNumbers,
      }));
      return newLottery.save();
    }
  })
  .then(
    function (results) { return promise.resolve(results); },
    function (error) { return promise.reject(error); }
  );

  return promise;
}

function updateJackpot(jackpot) {
  var promise = new Parse.Promise();

  var jackpotQuery = new Parse.Query(Jackpot);

  jackpotQuery.equalTo('typeId', jackpot.typeId);
  jackpotQuery.first()
  .then(function (respJackpot) {
    if (!respJackpot) {
      respJackpot = new Jackpot();
    }

    respJackpot.set(commonUtil.genUpdateParams({
      'typeId': jackpot.typeId,
      'money': jackpot.money
    }));

    return respJackpot.save();
  })
  .then(
    function (results) { return promise.resolve(results); },
    function (error) { return promise.reject(error); }
  );

  return promise;
}


module.exports = {
    createDrawInfo: createDrawInfo,
    updateJackpot: updateJackpot
};
