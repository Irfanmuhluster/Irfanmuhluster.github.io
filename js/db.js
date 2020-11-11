var dbPromised = idb.open("detail-club", 1, function(upgradeDb) {
  var articlesObjectStore = upgradeDb.createObjectStore("club", {
    keyPath: "id"
  });
  articlesObjectStore.createIndex("id_teams", "id", { unique: false });
});

function saveForLater(club) {
  dbPromised
    .then(function(db) {
      var tx = db.transaction("club", "readwrite");
      var store = tx.objectStore("club");
      console.log(club);
      store.put(club);
      return tx.complete;
    })
    .then(function() {
      // munculkan toast
      console.log("berhasil Disimpan");
      M.toast({html: 'Team Berhasil Disimpan!'})
    });
}


function deleteClub(club) {
  dbPromised.then(function(db) {
    var tx = db.transaction('club', 'readwrite');
    var store = tx.objectStore('club');
    // console.log(club.id);
    // var idx = store.get(id);
    store.delete(club.id);
    return tx.complete;
  }).then(function() {
     M.toast({html: 'Team Berhasil Dihapus!'})
  });
}


function getAll() {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("club", "readonly");
        var store = tx.objectStore("club");
        return store.getAll();
      })
      .then(function(articles) {
        resolve(articles);
      });
  });
}


function getById(id) {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("club", "readonly");
        var store = tx.objectStore("club");
        return store.get(id);
      })
      .then(function(article) {
        resolve(article);
      });
  });
}