
var search = ""
var forcastDat = null
//console.log(dateFns.fromUnixTime(1608658970))
/*
Controller
*/
//searches forcast data given city and returns true if successful
async function searchForcastDat(){
  let search = document.querySelector("#search").value;
  var key = "1e1b023ee586a7e9d8bcc5a9dbe4382e"
  var forcastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${search}&units=imperial&appid=${key}`
  if (search != ""){
    await fetchingForcast(forcastUrl);
  } else {
    modalError()
  }
}

self.addEventListener("keyup", async (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    console.log("enter pressed");
    searchForcastDat();
    }
});
/*
Model
*/
//fetchs forcast given url and defines forcastDat
function fetchingForcast(forcastUrl){
  let search = document.querySelector("#search").value;
  if (search != ""){
    fetch(forcastUrl)
    .then(validateResponse)
    .then(responseToJSON)
    .then(dat => {
      forcastDat = dat;
      updateforcastPanel();
    })
    .catch(error=>{
      console.log(error);
      modalError();
    })
  }
}
function validateResponse(response){
  if (response.ok){
    return response;
  } else {
    throw Error("response.ok: "+ response.ok);
  }

}
function responseToJSON(response){
  return response.json();
}
function responseToBlob(response){
  return response.blob();
}
async function fetchingImg(imgName){
  let imgUrl = `http://openweathermap.org/img/wn/${imgName}@2x.png`;
  let data = await fetch(imgUrl)
  .then(validateResponse)//This should never error unless the img doesn't exist
  .then(responseToBlob)
  .catch(error=>{
    console.log(error);
    modalError();
  })
  return data
}
/*
View
*/
function modalError(){
  document.querySelector("#error-modal").click();
}

async function updateforcastPanel(isBadInput = false){
  const forcastPanel = document.querySelector("#forcast-panel");
  while (forcastPanel.lastChild){ //$.empty()
    forcastPanel.removeChild(forcastPanel.lastChild);
  }
  if (isBadInput){
    console.log("Bad Input!")
    for (let i = 0; i < 5; i++){
      let newCard = createCardContainer();
      forcastPanel.append(newCard);
    }
  } else {
    console.log(forcastDat)
    let dt = []
    let temp = []
    let hum = []
    let imgBlob = []
    for (let i = 0; i < forcastDat.list.length; i++){
      dt.push(forcastDat.list[i].dt_txt);
      temp.push(forcastDat.list[i].main.temp);
      hum.push(forcastDat.list[i].main.humidity);
      await fetchingImg(forcastDat.list[i].weather[0].icon).then(blob=>{imgBlob.push(URL.createObjectURL(blob))})
    }
    for (let i = 0; i < forcastDat.list.length; i++){
      let newCard = createCardContainer(dt[i],temp[i],hum[i],imgBlob[i]);
      forcastPanel.append(newCard);

    }
  }
  }

function createCardContainer(date = "", temp="", hum="", imgBlob=""){

  const container = document.createElement("div");
  container.classList.add("container","col", "mb-4");//use className for other browser support
    const card = document.createElement("div");
    card.classList.add("card");
      const cardBody = document.createElement("card-body");
      cardBody.classList.add("card-body","bg-light");
        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.innerText = `${date}`;
        const img = document.createElement("img");
        img.src = imgBlob;
        const p1 = document.createElement("p");
        p1.innerText = `Temperature: ${temp}°C`;
        const p2 = document.createElement("p");
        p2.innerText = `Humidity: ${hum}%`;
        p1.classList.add("card-text");
        p2.classList.add("card-text");

  cardBody.append(cardTitle);
  cardBody.append(img);
  cardBody.append(p1);
  cardBody.append(p2);
  card.append(cardBody);
  container.append(card);
  return container;
}

function main(){
  if (localStorage in navigator){
    var weatherStorage = localStorage.getItem("last-search")
    if (false){
      updateforcastPanel(isBadInput = true);//because there is no input when we start
      //// TODO: get latest localStorage search
    }
  }

}

main()
