var map = document.querySelector('#map');
var paths = map.querySelectorAll('.map__image a');
var links = map.querySelectorAll('.map__list a');
//var projets = map.querySelectorAll('.map__projet a');
/*var links = map.querySelectorAll('.map__projet a') // variable selectionnant les projet
var paths = map.querySelectorAll('.map__projet a')
*/

//plyfill du forEach 
/*if (Nodelist.prototype.forEach === undefined) {
    NodeList.prototype.forEach = function (callback) {
        [].forEach.call(this, callback)
    }
}*/

// quand la souri passe sur une zone de la carte elle active le lien de la partie en question 
var activeArea = function (id) {
    map.querySelectorAll('.is-active').forEach(function (item) {
        item.classList.remove('is-active');
    });
    if (id !== undefined) {
        document.querySelector('#list-' + id).classList.add('is-active');
        document.querySelector('#region-' + id).classList.add('is-active');
        //document.querySelector('#projet-' + id).classList.add('is-active');
    }
};
// survoler la carte et active les liste
paths.forEach(function (path) {
    path.addEventListener('mouseenter', function () {
        var id = this.id.replace('region-', '');
        activeArea(id);
    });
    map.addEventListener('mouseover', function () {
        activeArea();
    });
});
// survoler la liste et activer la carte
links.forEach(function (link) {
    link.addEventListener('mouseenter', function () {
        var id = this.id.replace('list-', '');
        activeArea(id);
    });
});
map.addEventListener('mouseover', function () {
    activeArea();
});
// scripte consernant les different projet
/*
projets.forEach(function (projet) {
    projet.addEventListener('mouseenter', function () {
        var id = this.id.replace('projet-', '');
        activeArea(id);
    });
});
map.addEventListener('mouseover', function () {
    activeArea();
});
*/