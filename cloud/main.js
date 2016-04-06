require('cloud/api/lottery.js');
require('cloud/api/admin-util');

var util = require('cloud/util/util.js');
var lotteryTypes = require('cloud/config/lottery-types.js');


Parse.Cloud.afterSave('Jackpot', function(request) {
  console.log('afterSave Jackpot');
  var typeId = request.object.get('typeId');
  var money = request.object.get('money');

  console.log('typeId:' + typeId);
  console.log('money:' + money);
  var notificationQuery = new Parse.Query('NotificationSetting');
  notificationQuery.equalTo('typeId', typeId);
  notificationQuery.lessThanOrEqualTo('value', money);

  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.matchesKeyInQuery('installationId', 'installationId', notificationQuery);

  Parse.Push.send({
    where: pushQuery,
    data: {
      alert: lotteryTypes.get(typeId).name + '獎金已超過' + util.prettyNumber(money) + '!!!'
    }
  }, {
    success: function() {
      console.log('push success');
      // Push was successful
    },
    error: function(error) {
      console.log('push error');
      console.log(error);
      // Handle error
    }
  });
});
