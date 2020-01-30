const API_KEY = 'O3iJIz4KNHqyrwfM88y7Abn9WA2607z0';

let searchCategory = 'cats';
let url = 'http://api.giphy.com/v1/gifs/search?q=' + searchCategory + '&api_key=' + API_KEY + '&limit=8';
let listItems = $('.list li');

get(url).then(function(response) {
    let responseObject = JSON.parse(response);
    listItems.each(function(index){
        render($(this), responseObject.data[index]);
    })
}, function(error) {
    console.error("Failed!", error);
});

$('.list__more').on('click',function(){
    $(this).siblings('.list__size').fadeToggle('fast');
    $(this).siblings('.list__link').fadeToggle('fast');
});

$('.query__random').on('click',function(e){
    e.preventDefault();
    listItems.each(function(){
        let thisLi = $(this);
        url = 'http://api.giphy.com/v1/gifs/random?tag=' + searchCategory + '&api_key='+ API_KEY;
        get(url).then(function(response) {
            responseObject = JSON.parse(response);
            render(thisLi, responseObject.data)
        }, function(error) {
            console.error("Failed!", error);
        });
    })
});

$('.query__search').on('change paste keyup',function(){
    if($(this).val().length > 2) {
        url = 'http://api.giphy.com/v1/gifs/search?q=' + $(this).val() + '&api_key=' + API_KEY + '&limit=8';
        get(url).then(function(response) {
            responseObject = JSON.parse(response);
            if(responseObject.data.length) {
                listItems.each(function(index){
                    render($(this), responseObject.data[index]);
                })
            }
        }, function(error) {
            console.error("Failed!", error);
        });
    }
});

function render(self, item) {
    self.find('img').attr('src', item.images.original.url);
    self.find('.list__name').text(item.title);
    self.find('.list__size span').text(item.images.original.size);
    self.find('.list__link').attr('href', item.images.original.url);
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
