const API_KEY = 'O3iJIz4KNHqyrwfM88y7Abn9WA2607z0';
const NUMBER_OF_IMAGES = 8;

let searchCategory = 'cats';
let url = 'http://api.giphy.com/v1/gifs/search?q=' + searchCategory + '&api_key=' + API_KEY + '&limit=' + NUMBER_OF_IMAGES;
let list = $('.list');

get(url).then(function(response) {
    let responseObject = JSON.parse(response);
    for (let key in responseObject.data){
        list.append(LiTemplate(responseObject.data[key]))
    }
}, function(error) {
    console.error("Failed!", error);
});

list.on('click', '.list__more', function(){
    $(this).siblings('.list__size').fadeToggle('fast');
    $(this).siblings('.list__link').fadeToggle('fast');
});

$('.query__random').on('click',function(e){
    e.preventDefault();
    list.children().remove();
    for(let i = 0; i < NUMBER_OF_IMAGES; i++) {
        url = 'http://api.giphy.com/v1/gifs/random?tag=' + searchCategory + '&api_key='+ API_KEY;
        get(url).then(function(response) {
            responseObject = JSON.parse(response);
            list.append(LiTemplate(responseObject.data))
        }, function(error) {
            console.error("Failed!", error);
        });
    }
});

$('.query__search').on('change paste keyup',function(){
    if($(this).val().length > 2) {
        list.children().remove();
        url = 'http://api.giphy.com/v1/gifs/search?q=' + $(this).val() + '&api_key=' + API_KEY + '&limit=8';
        get(url).then(function(response) {
            responseObject = JSON.parse(response);
            for (let key in responseObject.data){
                list.append(LiTemplate(responseObject.data[key]))
            }
        }, function(error) {
            console.error("Failed!", error);
        });
    }
});

function LiTemplate(current) {
    return `<li>
                <img src="${current.images.original.url}" alt="img">
                <div class="list__info">
                    <span class="list__name">${current.title}</span>
                    <div class="list__more">i</div>
                    <div class="list__size">
                        Size:
                        <span>${current.images.original.size}</span>
                        bytes
                    </div>
                    <a href="${current.images.original.url}" class="list__link" target="_blank">link</a>
                </div>
            </li>
    `;
}

function get(url) {
    return new Promise(function(resolve, reject) {
        let req = new XMLHttpRequest();
        req.open('GET', url);
        req.onload = function() {
            if (req.status == 200) {
                resolve(req.response);
            }
            else {
                reject(Error(req.statusText));
            }
        };
        req.onerror = function() {
            reject(Error("Network Error"));
        };
        req.send();
    });
}
