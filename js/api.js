let base_url = "https://api.football-data.org/v2/";

const fetchApi = function(url) {    
  return fetch(url, {
    headers: {
      'X-Auth-Token': 'a1d553941aa449078860c56f8764ccc9'
    }
  });
};

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json
function getScorer() {
  if ('caches' in window) {
    caches.match(base_url + "competitions/2021/standings").then(function(response) {
      if (response) {
        response.json().then(function (data) {
          let FilterRegularSeason = data.standings.filter(function(scorer) {
            return scorer.stage === 'REGULAR_SEASON' && scorer.type === 'TOTAL';
          });
          var scorerHTML = "";
          FilterRegularSeason[0].table.forEach(function(scorer) {
              // console.log(scorer.team);
            scorerHTML += `
              <tr>
                <td>${scorer.position}</td>
                <td><img src="${scorer.team.crestUrl}"  class="img-club" alt="${scorer.team.name}" onError="this.onerror=null;this.src='/no_image_available.jpeg';"/></td>
                <td><span style="margin-left: 10px;"><a href="./detail.html?id=${scorer.team.id}">${scorer.team.name}</a></span></td>
                <td>${scorer.won}</td>
                <td>${scorer.draw}</td>
                <td>${scorer.lost}</td>
                <td>${scorer.goalsFor}</td>
                <td>${scorer.goalsAgainst}</td>
                <td>${scorer.goalDifference}</td>
                <td>${scorer.points}</td>
                <td><span>${scorer.form}</span></td>
              </tr>
            `;
          });

          var utamascoreHTML = `
                    <h2 class="judul">Klasemen ${data.competition.name}</h2>
                    <table class="striped">
                      <thead>
                        <tr style="font-style: bold;">
                            <th>Pos</th>
                            <th></th>
                            <th>Club</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>GF</th>
                            <th>GA</th>
                            <th>GD</th>
                            <th>Pts</th>
                            <th>Last Perform</th>
                        </tr>
                      </thead>

                      <tbody>
                        ${scorerHTML}
                      </tbody>
                    </table>`;
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("scorer").innerHTML = utamascoreHTML;
        })
      }
    })
  }
    
    fetchApi(base_url + "competitions/2021/standings")
    .then(status)
    .then(json)
    .then(function(data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.
      // Menyusun komponen card artikel secara dinamis

      let FilterRegularSeason = data.standings.filter(function(scorer) {
        return scorer.stage === 'REGULAR_SEASON' && scorer.type === 'TOTAL';
      });

      var scorerHTML = "";
      FilterRegularSeason[0].table.forEach(function(scorer) {
        scorerHTML += `
              <tr>
                <td>${scorer.position}</td>
                <td><img src="${scorer.team.crestUrl}"  class="img-club" alt="${scorer.team.name}" onError="this.onerror=null;this.src='/no_image_available.jpeg';"/></td>
                <td><span style="margin-left: 10px;"><a href="./detail.html?id=${scorer.team.id}">${scorer.team.name}</a></span></td>
                <td>${scorer.won}</td>
                <td>${scorer.draw}</td>
                <td>${scorer.lost}</td>
                <td>${scorer.goalsFor}</td>
                <td>${scorer.goalsAgainst}</td>
                <td>${scorer.goalDifference}</td>
                <td>${scorer.points}</td>
                <td><span>${scorer.form}</span>
                    </td>
              </tr>
            `;
      });

      var utamascoreHTML = `
      <h2 class="judul">Klasemen ${data.competition.name}</h2>
      <table class="striped">
        <thead>
          <tr style="font-style: bold;">
              <th>Pos</th>
              <th></th>
              <th>Club</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>GF</th>
              <th>GA</th>
              <th>GD</th>
              <th>Pts</th>
              <th>Last Perform</th>
          </tr>
        </thead>

        <tbody>
          ${scorerHTML}
        </tbody>
      </table>
        `;


      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("scorer").innerHTML = utamascoreHTML;
    })
    .catch(error);
}


function getScorerId() {
  // Ambil nilai query parameter (?id=)
  return new Promise(function(resolve, reject) {
  let urlParams = new URLSearchParams(window.location.search);
  let idParam = urlParams.get("id");

  if ('caches' in window) {
    caches.match(base_url + "teams/" + idParam).then(function(response) {
      if (response) {
          response.json().then(function(data) {

          var detailHTML = `
          <div class="card">
            <h2 class="judul">${data.name}</h2>
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${data.crestUrl}"  alt="${data.name}" onError="this.onerror=null;this.src='/no_image_available.jpeg';"/>
            </div>
            <div class="card-content">
              <ul class="collection">
                <li class="collection-item">Address: ${data.address}</li>
                <li class="collection-item">Phone: ${data.phone}</li>
                <li class="collection-item">Website: ${data.phone}</li>
                <li class="collection-item">Founded: ${data.founded}</li>
                <li class="collection-item">Venue: ${data.venue}</li>
              </ul>
            </div>
          </div>
        `;


          document.getElementById("body-content").innerHTML = detailHTML;
          // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
          
          resolve(data);
          });
        }
      });
    }



    fetchApi(base_url + "teams/" + idParam)
    .then(response => {
      return response.json();
    })
    .then(data => {
      // Objek JavaScript dari response.json() masuk lewat variabel data.
      console.log(data);
      // Menyusun komponen card artikel secara dinamis
      var detailHTML = `
          <div class="card">
            <h2 class="judul">${data.name}</h2>
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${data.crestUrl}" alt="${data.name}" onError="this.onerror=null;this.src='/no_image_available.jpeg';"/>
            </div>
            <div class="card-content">
              <ul class="collection">
                <li class="collection-item">Address: ${data.address}</li>
                <li class="collection-item">Phone: ${data.phone}</li>
                <li class="collection-item">Website: ${data.phone}</li>
                <li class="collection-item">Founded: ${data.founded}</li>
                <li class="collection-item">Venue: ${data.venue}</li>
              </ul>
            </div>
          </div>
        `;
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("body-content").innerHTML = detailHTML;
      resolve(data);
    });
  });
}

function getJadwal() {
    if ('caches' in window) {
    caches.match(base_url + "/competitions/PL/matches?status=SCHEDULED").then(function(response) {
      if (response) {
        response.json().then(function (data) {
          var jadwalHTML = "";
          data.matches.forEach(function(jadwal) {
            var jadwaltgl = new Date(jadwal.utcDate);
            const months = [
              'Januari',
              'Februari',
              'Maret',
              'April',
              'Mei',
              'Juni',
              'Juli',
              'Augustus',
              'September',
              'Oktober',
              'November',
              'Desember'
            ];
            const days = [
              'Minggu',
              'Senin',
              'Selasa',
              'Rabu',
              'Kamis',
              'Jumat',
              'Sabtu'
            ];
            const dayName = days[jadwaltgl.getDay()];
            const day = jadwaltgl.getDate();
            const month = jadwaltgl.getMonth();
            const year = jadwaltgl.getFullYear();
            const monthName = months[jadwaltgl.getMonth()];
            const hours = jadwaltgl.getHours() < 10 ? "0" + jadwaltgl.getHours() : jadwaltgl.getHours();
            const minutes =  jadwaltgl.getMinutes() < 10 ? "0" + jadwaltgl.getMinutes() : jadwaltgl.getMinutes();
            jadwalHTML += `
            <table class="striped" style="margin-top:20px;">
            <tbody>
               <tr>
                 <td width="10%"><img class="img-club" src="https://crests.football-data.org/${jadwal.homeTeam.id}.svg"></td>
                 <td width="50%">${jadwal.homeTeam.name}</td>
                 <td rowspan="2"></td>
                 <td rowspan="2">Pukul ${hours}:${minutes} WIB,<br/> ${dayName} ${day} ${monthName} ${year}</td>
               </tr>
               <tr>
                <td width="10%"><img class="img-club" src="https://crests.football-data.org/${jadwal.awayTeam.id}.svg"></td>
                <td width="50%">${jadwal.awayTeam.name}</td>

               </tr>
             </tbody>
             </table>

            `;
          
          });
        document.getElementById("jadwal").innerHTML = jadwalHTML;
        resolve(jadwal);
        });
        }
      });
    }

    fetchApi(base_url + "/competitions/PL/matches?status=SCHEDULED")
    .then(status)
    .then(json)
    .then(function(data) {

      // Menyusun komponen card artikel secara dinamis
      var jadwalHTML = "";
      data.matches.forEach(function(jadwal) {
        var jadwaltgl = new Date(jadwal.utcDate);
        const months = [
          'Januari',
          'Februari',
          'Maret',
          'April',
          'Mei',
          'Juni',
          'Juli',
          'Augustus',
          'September',
          'Oktober',
          'November',
          'Desember'
        ];
        const days = [
          'Minggu',
          'Senin',
          'Selasa',
          'Rabu',
          'Kamis',
          'Jumat',
          'Sabtu'
        ];
        const dayName = days[jadwaltgl.getDay()];
        const day = jadwaltgl.getDate();
        const month = jadwaltgl.getMonth();
        const year = jadwaltgl.getFullYear();
        const monthName = months[jadwaltgl.getMonth()];
        const hours = jadwaltgl.getHours() < 10 ? "0" + jadwaltgl.getHours() : jadwaltgl.getHours();
        const minutes =  jadwaltgl.getMinutes() < 10 ? "0" + jadwaltgl.getMinutes() : jadwaltgl.getMinutes();
        jadwalHTML += `
        <table class="striped" style="margin-top:20px;">
        <tbody>
           <tr>
             <td width="10%"><img class="img-club" src="https://crests.football-data.org/${jadwal.homeTeam.id}.svg"></td>
             <td width="50%">${jadwal.homeTeam.name}</td>
             <td rowspan="2"></td>
             <td rowspan="2">Pukul ${hours}:${minutes} WIB,<br/> ${dayName} ${day} ${monthName} ${year}</td>
           </tr>
           <tr>
            <td width="10%"><img class="img-club" src="https://crests.football-data.org/${jadwal.awayTeam.id}.svg"></td>
            <td width="50%">${jadwal.awayTeam.name}</td>

           </tr>
         </tbody>
         </table>

        `;
      
      });
    document.getElementById("jadwal").innerHTML = jadwalHTML;
    })
    .catch(error);
}

function getSavedClub() {
  getAll().then(clubs => {
    // console.log(clubs);
    if (clubs.length > 0) {
    // Menyusun komponen card artikel secara dinamis
    let clubHTML = "";
    clubs.forEach(club => {
      clubHTML += `
                  <div class="card">
                    <a href="./detail.html?id=${club.id}&saved=true">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${club.crestUrl}" />
                      </div>
                    </a>
                    <div class="card-content">
                      <span class="card-title truncate"><a href="./detail.html?id=${club.id}&saved=true">${club.name}</a></span>
                      <p>${club.address}</p>
                    </div>
                    <div class="card-action center-align">
                      <a href="./detail.html?id=${club.id}&saved=true" class="waves-effect waves-light btn">Detail</a>
                      <btn class="waves-effect waves-light btn delete" id="${club.id}">Delete</btn>
                    </a>
                  </div>
                `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("detail-club").innerHTML = clubHTML;

    let deletebtn = document.querySelectorAll(".delete");
    deletebtn.forEach(button => {
      button.onclick = () => {
        const id = parseInt(button.id);
        clubs.forEach((club) => {
          if (club.id === id) {
            deleteClub(club);
            button.parentElement.parentElement.style.display = 'none';
          }
        })
      }
    })
  } else {
    document.getElementById("detail-club").innerHTML = '<div class="card"><h3>Belum Ada Data yang Disimpan</h3></card>';

  }
  });

}


function getSavedClubId() {
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");
  
  getById(parseInt(idParam)).then(function(data) {
  detailHTML = '';

  var detailHTML = `
        <div class="card">
          <h2 class="judul">${data.name}</h2>
          <div class="card-image waves-effect waves-block waves-light">
            <img src="${data.crestUrl}" />
          </div>
          <div class="card-content">
           <ul class="collection">
              <li class="collection-item">Address: ${data.address}</li>
              <li class="collection-item">Phone: ${data.phone}</li>
              <li class="collection-item">Website: ${data.phone}</li>
              <li class="collection-item">Founded: ${data.founded}</li>
              <li class="collection-item">Venue: ${data.venue}</li>
            </ul>
          </div>
        </div>
      `;


        document.getElementById("body-content").innerHTML = detailHTML;
          

  });

}