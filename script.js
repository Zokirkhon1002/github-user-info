const ApiURL = "https://api.github.com/users/",
  main = document.getElementById("main"),
  form = document.getElementById("form"),
  toasts = document.querySelector(".toasts"),
  search = document.getElementById("search");

var x = 1;
if (x == 1) {
    const elon = document.createElement("div");
    elon.classList.add("toast");
    elon.classList.add('error');
    elon.innerText = `sichqonchani o'ng tomonini bosdingiz \n iltimos bu ishni qilmang. \n keyingi safar chiqarilib yuborilasiz!`;

  window.oncontextmenu = function (e) {
    e.preventDefault();
    x++;
    if(x == 3){
     elon.innerText = 'uzr, sizni chiqarib yubordik. Xayr!';
     toasts.appendChild(elon);
     setTimeout(() => {
        elon.remove();
      }, 3000);
     return setTimeout(() => {
        window.close();
      }, 3300);
     }
     else {
         toasts.appendChild(elon);
         e.preventDefault();
     }
  };
  setTimeout(() => {
    elon.remove();
  }, 5000);
}

async function getUser(userName) {
  try {
    const { data } = await axios(ApiURL + userName);

    createUserCard(data);
    getRepos(userName);
  } catch (error) {
    if (error.response.status == 404) {
      createErrorCard(
        `${userName} nomli github foydalanuvchisini topa olmadik.`
      );
    }
  }
}

async function getRepos(userName) {
  try {
    const { data } = await axios(`${ApiURL + userName}/repos?sort=created`);

    addReposToCard(data);
  } catch (error) {
    createErrorCard(`repos larni olish bilan muammo bor`);
  }
}

function createUserCard(user) {
  const cardHTML = `
    <div class="card">
    <div>
    <img src="${user.avatar_url}" alt="${user.name}" class="avatar" />
    </div>
    <div class="user-info">
    <h2>${user.name ? user.name : "nomi kiritilmagan"}</h2>
    <p>${user.bio ? user.bio : "shior kiritilmagan"}</p>
    <ul>
    <li>${
      user.followers ? user.followers : "hechkim kuzatmaydi"
    } <strong> Followers </strong> </li> 
    <li>${
      user.following ? user.following : "hechkimni kuzatmaydi"
    } <strong> Following </strong> </li> 
    <li>${
      user.public_repos ? user.public_repos : "reposlar yuklanmagan"
    } <strong> Repos </strong> </li>
    <li class="location" ><span>Location: </span> ${
      user.location ? user.location : "manzil kiritilmagan"
    } </li>

    </ul>

    <div id="repos"></div>
    </div>
    </div>
    `;

  main.innerHTML = cardHTML;
}

function createErrorCard(errorMsg) {
  const cardHTML = `
    <div class="card">
    <h1>${errorMsg}</h1>
    </div>
    `;

  main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
  const reposElement = document.getElementById("repos");

  repos.slice(0, repos.length).forEach((repo) => {
    const repoElement = document.createElement("a");
    repoElement.classList.add("repo");
    repoElement.href = repo.html_url;
    repoElement.target = "_blabk";
    repoElement.innerText = repo.name;

    reposElement.appendChild(repoElement);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = search.value.toLowerCase();

  if (username) {
    getUser(username);

    search.value = "";
  }
});
