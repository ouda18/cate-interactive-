var map = document.querySelector('#map')
var paths = map.querySelectorAll('.map__image a')
var links = map.querySelectorAll('.map__list a')

/*/plyfill du forEach
if (Nodelist.prototype.forEach === undefined) {
    NodeList.prototype.forEach = function (callback) {
        [].forEach.call(this, callback)
    }
    
} */

var activeArea = function (id) {
    map.querySelectorAll('.is-active').forEach(function (item) {
        item.classList.remove('is-active')
    })
    
    if (id !== undefined) {
        document.querySelector('#list-' + id).classList.add('is-active')

        document.querySelector('#region-' + id).classList.add('is-active')
    }
    
}
// survoler la carte et active les liste
paths.forEach(function (path) {
    path.addEventListener('mouseenter', function () {
        var id = this.id.replace('region-','')

        activeArea(id)

    })
})
 // survoler la liste et activer la carte
links.forEach(function (link) {
    link.addEventListener('mouseenter', function (){

        var id = this.id.replace('list-','')

        activeArea(id)
    })
})
map.addEventListener('mouseover', function () {
    activeArea()
})