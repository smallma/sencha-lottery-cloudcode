// var Lottery = Parse.Object.extend('Lottery');

var util = require('cloud/util/util.js');


Parse.Cloud.define('createDrawsInfo', function(request, response) {
  var params = request.params;
  var drawsInfo = params.drawsInfo || [];

  function _createDrawsInfo() {
    var promises = [];

    drawsInfo.forEach(function (info) {
      if (!info.drawNo) { return; }

      promises.push(util.createDrawInfo(info));
    });

    promises.push(Parse.Promise.as());
    return Parse.Promise.when(promises);
  }

  _createDrawsInfo()
  .then(
    function(results) { response.success(results); },
    function(error) { response.error(error); }
  );
});


Parse.Cloud.define('updateJackpots', function(request, response) {
  var params = request.params;
  var jackpots = params.jackpots || [];
  console.log(jackpots);

  function _updateJackpots() {
    var promises = [];

    jackpots.forEach(function(Jackpot) {
      promises.push(util.updateJackpot(Jackpot));
    });

    promises.push(Parse.Promise.as());
    return Parse.Promise.when(promises);
  }

  _updateJackpots()
  .then(
    function(results) { response.success(results); },
    function(error) { response.error(error); }
  );
});
