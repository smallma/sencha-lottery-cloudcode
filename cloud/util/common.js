var Installation = Parse.Installation;


function genUpdateParams(options) {
  var results = {};

  for (var arg in options) {
    if (typeof options[arg] !== 'undefined') {
      results[arg] = options[arg];
    }
  }
  return results;
}

function _merge(left, right, sortBy) {
  var results = [];
  var il = 0;
  var ir = 0;

  while(il < left.length && ir < right.length) {
    if (left[il][sortBy] < right[ir][sortBy]) {
      results.push(left[il++]);
    } else {
      results.push(right[ir++]);
    }
  }

  return results.concat(left.slice(il)).concat(right.slice(ir));
}

function mergeSort(items, sortBy) {
  if (items.length < 2) { return items; }

  var middle = Math.floor(items.length / 2);
  var left = items.slice(0, middle);
  var right = items.slice(middle);
  var params = _merge(mergeSort(left, sortBy), mergeSort(right, sortBy), sortBy);

  params.unshift(0, items.length);
  items.splice.apply(items, params);
  return items;
}

function sendNotification(channel, post){
  console.log('sendNotification');
  console.log(channel);
  console.log('post type: ' + post.type + ', post.title: ' + post.title);

  var userQuery = channel.relation('attends').query();
  userQuery.find()
  .then(function(users) {
    console.log(users);

    var iOSroidInstallationQuery = new Parse.Query(Installation);
    iOSroidInstallationQuery.containedIn('user', users);
    iOSroidInstallationQuery.equalTo('deviceType', 'ios');

    var androidInstallationQuery = new Parse.Query(Installation);
    androidInstallationQuery.containedIn('user', users);
    androidInstallationQuery.equalTo('deviceType', 'android');

    Parse.Push.send(
      {
        where: iOSroidInstallationQuery,
        data: {
          'type': post.type,
          'alert': post.title,
          'badge': '0',
          'sound': '',
          'postId': post.id
        }
      },
      {
        success: function() {},
        error: function() {}
      }
    );

    Parse.Push.send(
      {
        where: androidInstallationQuery,
        data: {
          'type': post.type,
          'badge': '0',
          'alertBody': post.title,
          'sound': '',
          'postId': post.id
        }
      },
      {
        success: function() {},
        error: function() {}
      }
    );

  });
}

function prettyNumber(number){
  // return number > 1e9 ? Math.round(number/1e9) + ' G'
  //      : number > 1e6 ? Math.round(number/1e6) + ' M'
  //      : number > 1e3 ? Math.round(number/1e3) + ' k'
  //      : number;
  function myToFixed(num){
    return parseFloat(num.toFixed(num < 10 ? 1 : 0));
  }
  return number > 1e12 ? myToFixed(number / 1e12) + ' 兆'
       : number > 1e8 ? myToFixed(number / 1e8) + ' 億'
       : number > 1e4 ? myToFixed(number / 1e4) + ' 萬'
       : number;
}

module.exports = {
    genUpdateParams: genUpdateParams,
    mergeSort: mergeSort,
    sendNotification: sendNotification,
    prettyNumber: prettyNumber
};
