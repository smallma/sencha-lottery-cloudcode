var commonUtil = require('cloud/util/common.js');
var lotteryUtil = require('cloud/util/lottery.js');


module.exports = {
  // common utils
  genUpdateParams: commonUtil.genUpdateParams,
  mergeSort: commonUtil.mergeSort,
  sendNotification: commonUtil.sendNotification,
  prettyNumber: commonUtil.prettyNumber,

  // lottery utils
  createDrawInfo: lotteryUtil.createDrawInfo,
  updateJackpot: lotteryUtil.updateJackpot
};
