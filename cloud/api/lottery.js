var _ = require('underscore');

var Lottery = Parse.Object.extend('Lottery');
var Jackpot = Parse.Object.extend('Jackpot');

Parse.Cloud.define('testLottery', function (request, response) {
  function _getJackpot() {
    var promise = new Parse.Promise();

    var query = new Parse.Query(Lottery);
    query.equalTo('typeId', 1);
    query.descending('drawDate');
    query.first()
      .then(
        function(result) {
          return promise.resolve(result);
        },
        function(error) {
          return promise.reject(error);
        }
      );

    return promise;
  }
  _getJackpot()
  .then(
    function(result) {
      response.success(result);
    },
    function (error) { response.error(error); }
  );
});

Parse.Cloud.define('lastLotteryResult', function(request, response) {
  var defaulTypeIds = _.range(1, 11);
  var typeIds = request.params.typeIds || defaulTypeIds;
  var currentLotteryResults = [];
  var results = [];

  console.log('----lastLotteryResult----');
  console.log('request.params');
  console.log(request.params);
  console.log('typeIds');
  console.log(typeIds);


  function _fetchLastLotteryResult() {
    var promises = [];

    _.each(typeIds, function(typeId) {
      console.log('typeId:' + typeId);

      var query = new Parse.Query(Lottery);
      query.equalTo('typeId', typeId);
      query.descending('drawDate');
      query.limit(1);
      var queryCollection = query.collection();

      var promise = queryCollection.fetch()
        .then(function(collection){
          console.log('collection');
          if(collection && typeof collection.toJSON === 'function'){
            console.log(collection.toJSON());
            results = results.concat(collection.toJSON());
          }
          return Parse.Promise.as();
        });

      promises.push(promise);
    });

    return Parse.Promise.when(promises);
  }

  function _fetchCurrentLottery() {
    var promises = [];

    _.each(typeIds, function(typeId) {
      console.log('typeId:' + typeId);

      var query = new Parse.Query(Jackpot);
      query.equalTo('typeId', typeId);
      query.limit(1);

      var queryCollection = query.collection();

      var promise = queryCollection.fetch()
        .then(function(collection) {
          if(collection && typeof collection.toJSON === 'function'){
            console.log(collection.toJSON());
            currentLotteryResults = currentLotteryResults.concat(collection.toJSON());
          }
          return Parse.Promise.as();
        });
      promises.push(promise);
    });

    return Parse.Promise.when(promises);
  }

  _fetchLastLotteryResult()
  .then(function() {
    return _fetchCurrentLottery();
  })
  .then(
    function() {
      _.each(currentLotteryResults, function(currentLotteryResult) {
        var match = _.where(results, {typeId: currentLotteryResult.typeId})[0];
        if(match) {
          console.log('match!!! currentLottery money: ' + currentLotteryResult.money);
          match.jackpot = currentLotteryResult.money;
        }
      });
      console.log('finalResult');
      console.log(results);
      response.success(results);
    },
    function (error) { response.error(error); }
  );
});


Parse.Cloud.define('getHistory', function(request, response) {
  var typeId = request.params.typeId;

  var lotteryQuery = new Parse.Query(Lottery);
  lotteryQuery.equalTo('typeId', typeId);
  lotteryQuery.descending('drawDate');
  lotteryQuery.limit(1000);

  var queryCollection = lotteryQuery.collection();
  queryCollection.fetch()
  .then(
    function (collection) {
      var results = _.each(collection.toJSON(), function(model) {
        model.id = model.objectId;
        model.drawDate = (new Date(model.drawDate.iso)).toLocaleDateString();
      });
      response.success(results);
    },
    function(error) { response.error(error); }
  );
});
