let endPoint =
  "https://itunes.apple.com/search?term=${ARTIST_NAME}&media=music&entity=album&attribute=artistTerm&limit=200";

const Model = (() => {
  // fetching to do
  const fetchData = (name) => {
    return fetchJsonp(
      "https://itunes.apple.com/search?term=${" +
        name +
        "}&media=music&entity=album&attribute=artistTerm&limit=200",
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    ).then((response) => response.json());
  };

  return { fetchData };
})();

const View = (() => {
  // Usage of class Names

  const domString = {
    albumListContainer: ".main",
    musicListContent: ".collection__list",
    artistSearch: ".artist__search",
    artistName: ".iTunes__input",
    searchBtn: ".artist__search__button",
    countRes: ".album__result"
  };
  const render = (element, template) => {
    template.innerHTML = element;
  };

  const generateTemplate = (count) => {
      count =  count ? count : 0;
      console.log("count inside template", count)
      return `<section class="iTunes">
                    <header class="iTunes__header">
                        <input class="iTunes__input" type="text" placeholder="Artist's Name">
                        <button class="artist__search__button btn"><i class="fas fa-search"></i></button>
                    </header>

                    <section class="albums__found">
                        <div class="album__result"> ${count} results found </div>
                        <ul class="collection__list">
                        </ul>
                    </section>   
                </section>`;
  };

  const generateTodoItem = (todo) => {
    const title = todo.collectionCensoredName.length > 20 ? todo.collectionCensoredName.substring(0, 20) + "..." : todo.collectionCensoredName;

    return `<li class="collection__song">
                    <div class="specific__song">
                        <img src="${todo.artworkUrl100}" alt="">
                        <p class="img__text"> ${title} </p>
                    </div>
                </li>`;
  };

  return { domString, generateTodoItem, generateTemplate, render };
})();

const AppControler = ((view, model) => {
  let todoListData;
  const template = document.querySelector(view.domString.albumListContainer);

  const init = () => {
    // main container
    // const template = document.querySelector(view.domString.albumListContainer);
    const generateTemp = view.generateTemplate();
    view.render(generateTemp, template);
    const searchNow = document.querySelector(view.domString.searchBtn);
    const val = document.querySelector(view.domString.artistName);
    searchNow.addEventListener("click", () => {
      getAlbums(val);
    });
  };

  getAlbums = (val) => {
    const newValue = val.value;
    model.fetchData(newValue).then((data) => {
      updateToDoList(data);
    //   console.log("data", data.resultCount)
    //   const Temp = view.generateTemplate;
    //   template.innerHTML = Temp(data.resultCount)

    });
  };

  updateToDoList = (data) => {
    
    let counting = data.resultCount;
    console.log("data", counting)
    document.querySelector(view.domString.countRes).innerHTML = counting + " results found";
    dataArr = data.results;

    function myFun() {
      myVar = setTimeout(callBackFn, 0);
    }

    function callBackFn() {
      const joinedData = dataArr
        .map((todo) => view.generateTodoItem(todo))
        .join("");
      const parent = document.querySelector(view.domString.musicListContent);
      parent.innerHTML = joinedData;
    }

    myFun();
  };

  return { init };
})(View, Model);

AppControler.init();
