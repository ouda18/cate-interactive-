/ *!
* svg.js - Une bibliothèque légère pour manipuler et animer SVG.
* @version 2.7.1
* https://svgdotjs.github.io/
*
* @copyright Wout Fierens <wout@mick-wout.com>
* @license MIT
*
* CONSTRUIT: le vendredi 30 novembre 2018 à 10:01:55 GMT + 0100 (GMT + 01:00)
* /;
(fonction (racine, usine) {
  / * istanbul ignorer la prochaine * /
  if (typeof define === 'function' && define.amd) {
    define (fonction () {
      retourne la fabrique (root, root.document)
    })
  } else if (typeof exports === 'objet') {
    module.exports = root.document? fabrique (root, root.document): function (w) {usine de retour (w, w.document)}
  } autre {
    root.SVG = fabrique (root, root.document)
  }
} (typeof window! == "undefined"? window: cette fonction (fenêtre, document) {

// Trouver une référence globale - utilise 'this' par défaut lorsqu'il est disponible,
// retourne à 'window' sinon (pour les bundles comme Webpack)
var globalRef = (typeof this! == "undefined")? ceci: fenêtre;

// L'élément d'habillage principal
var SVG = globalRef.SVG = function (element) {
  if (SVG.supported) {
    element = new SVG.Doc (element)

    si (! SVG.parser.draw)
      SVG.prepare ()

    élément de retour
  }
}

// Espaces de noms par défaut
SVG.ns = 'http://www.w3.org/2000/svg'
SVG.xmlns = 'http://www.w3.org/2000/xmlns/'
SVG.xlink = 'http://www.w3.org/1999/xlink'
SVG.svgjs = 'http://svgjs.com/svgjs'

// test de support svg
SVG.supported = (function () {
  revenir !! document.createElementNS &&
         !! document.createElementNS (SVG.ns, 'svg'). createSVGRect
}) ()

// Ne prenez pas la peine de continuer si SVG n'est pas supporté
if (! SVG.supported) renvoie false

// séquence d'identifiant d'élément
SVG.did = 1000

// Obtenir le prochain identifiant d'élément nommé
SVG.eid = fonction (nom) {
  retourne 'Svgjs' + capitalise (nom) + (SVG.did ++)
}

// Méthode de création d'élément
SVG.create = function (name) {
  // créer un élément
  var element = document.createElementNS (this.ns, nom)

  // appliquer un identifiant unique
  element.setAttribute ('id', this.eid (nom))

  élément de retour
}

// Méthode d'extension d'objets
SVG.extend = function () {
  var modules, méthodes, clé, i

  // Obtenir la liste des modules
  modules = [] .slice.call (arguments)

  // Obtenir un objet avec des extensions
  méthodes = modules.pop ()

  pour (i = modules.longueur - 1; i> = 0; i--)
    si (modules [i])
      pour (entrer les méthodes)
        modules [i] .prototype [clé] = méthodes [clé]

  // Assurez-vous que SVG.Set hérite des méthodes récemment ajoutées
  if (SVG.Set && SVG.Set.inherit)
    SVG.Set.inherit ()
}

// Invent new element
SVG.invent = function (config) {
  // Créer un initialiseur d'élément
  var initializer = typeof config.create == 'fonction'?
    config.create:
    une fonction() {
      this.constructor.call (this, SVG.create (config.create))
    }

  // Prototype hérité
  if (config.inherit)
    initializer.prototype = new config.inherit

  // Étendre avec des méthodes
  if (config.extend)
    SVG.extend (initializer, config.extend)

  // attache la méthode de construction au parent
  if (config.construct)
    SVG.extend (config.parent || SVG.Container, config.construct)

  renvoyer l'initialiseur
}

// Adopter des éléments svg existants
SVG.adopt = fonction (noeud) {
  // vérifie la présence du noeud
  if (! node) renvoie null

  // s'assure qu'un noeud n'est pas déjà adopté
  if (node.instance) renvoie node.instance

  // initialise les variables
  élément var

  // adopter avec des paramètres spécifiques à l'élément
  if (node.nodeName == 'svg')
    element = node.parentNode instance de window.SVGElement? nouveau SVG.Nested: nouveau SVG.Doc
  else if (node.nodeName == 'linearGradient')
    element = new SVG.Gradient ('linear')
  else if (node.nodeName == 'radialGradient')
    element = new SVG.Gradient ('radial')
  else if (SVG [majuscule (node.nodeName)])
    element = new SVG [capitalize (node.nodeName)]
  autre
    element = new SVG.Element (node)

  // assure les références
  element.type = node.nodeName
  element.node = noeud
  node.instance = element

  // Préparations spécifiques à SVG.Class
  if (élément instance de SVG.Doc)
    element.namespace (). defs ()

  // extrait les données svgjs du dom (getAttributeNS ne fonctionne pas en html5)
  element.setData (JSON.parse (node.getAttribute ('svgjs: data')) || {})

  élément de retour
}

// Initialize élément d'analyse
SVG.prepare = function () {
  // Sélectionne le corps du document et crée un élément svg invisible
  var body = document.getElementsByTagName ('body') [0]
    , draw = (body? new SVG.Doc (body): SVG.adopt (document.documentElement) .nested ()). size (2, 0)

  // Créer un objet analyseur
  SVG.parser = {
    corps: corps || document.documentElement
  , draw: draw.style ('opacity: 0; position: absolute; gauche: -100%; haut: -100%; débordement: hidden'). attr ('focusable', 'false'). node
  , poly: draw.polyline (). node
  , path: draw.path (). node
  , native: SVG.create ('svg')
  }
}

SVG.parser = {
  natif: SVG.create ('svg')
}

document.addEventListener ('DOMContentLoaded', function () {
  si (! SVG.parser.draw)
    SVG.prepare ()
}, faux)

// Stockage d'expressions régulières
SVG.regex = {
  // valeur unitaire d'analyse
  numberAndUnit: /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-bler?\d+)?)([az%]*)$/i

  // valeur hexadécimale d'analyse
, hex: / ^ #? ([af \ d] {2}) ([af \ d] {2}) ([af \ d] {2}) $ / i

  // analyse de la valeur rgb
, rgb: / rgb \ ((\ d +), (\ d +), (\ d +) \) /

  // ID de référence d'analyse
, référence: / # ([a-z0-9 \ -_] +) / i

  // divise une chaîne de transformation
, transforme: / \) \ s *,? \ s * /

  // espaces blancs
, espaces: / \ s / g

  // Test de la valeur hexadécimale
, isHex: / ^ # [a-f0-9] {3,6} $ / i

  // Test de la valeur RGB
, isRgb: / ^ rgb \ (/

  // Test de la déclaration css
, isCss: / [^:] +: [^;] +;? /

  // Teste une chaîne vide
, isBlank: / ^ (\ s +)? $ /

  // Test de la chaîne numérique
, isNumber: /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i

  // Teste la valeur en pourcentage
, isPercent: /^-?[\d\.pre+%%$/

  // Test de l'URL de l'image
, isImage: /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i

  // divisé en espaces et virgules
, délimiteur: / [\ s,] + /

  // Les expressions rationnelles suivantes sont utilisées pour analyser l'attribut d d'un chemin

  // Correspond à tous les traits d'union qui ne sont pas après un exposant
, trait d'union: / ([^ e]) \ - / gi

  // Remplace et teste toutes les lettres de chemin
, pathLetters: / [MLHVCSQTAZ] / gi

  // oui nous avons aussi besoin de celui-ci
, isPathLetter: / [MLHVCSQTAZ] / i

  // correspond à 0.154.23.45
, numbersWithDots: /((\d?\.\d+(?:e[+-]?\d+)?)((?:\.\d+(?:e[+-]?\d+)?)+ )) + / gi

  // allumettes .
, points: /\./g
}

SVG.utils = {
  // fonction de la carte
  map: fonction (tableau, bloc) {
    var i
      , il = array.length
      , résultat = []

    pour (i = 0; i <il; i ++)
      result.push (block (tableau [i]))

    résultat retourné
  }

  // fonction de filtrage
, filtre: fonction (tableau, bloc) {
    var i
      , il = array.length
      , résultat = []

    pour (i = 0; i <il; i ++)
      if (block (tableau [i]))
        result.push (tableau [i])

    résultat retourné
  }

  // Degrés à radians
, radians: fonction (d) {
    renvoie d% 360 * Math.PI / 180
  }

  // radians en degrés
, degrés: fonction (r) {
    retourne r * 180 / Math.PI% 360
  }

, filterSVGElements: fonction (noeuds) {
    return this.filter (noeuds, fonction (el) {retourne une instance de window.SVGElement})
  }

}

SVG.defaults = {
  // Valeurs d'attribut par défaut
  attrs: {
    // remplissage et contour
    'opacité de remplissage': 1
  , 'opacité de trait': 1
  , 'largeur de trait': 0
  , 'stroke-linejoin': 'mitre'
  , 'stroke-linecap': 'bout à bout'
  , remplissez: '# 000000'
  , trait: '# 000000'
  , opacité: 1
    // position
  , x: 0
  , y: 0
  , cx: 0
  , cy: 0
    // Taille
  , largeur: 0
  , hauteur: 0
    // rayon
  , r: 0
  , rx: 0
  , ry: 0
    // pente
  , offset: 0
  , 'opacité stop': 1
  , 'stop-color': '# 000000'
    // texte
  , 'taille de police': 16
  , 'font-family': 'Helvetica, Arial, sans serif'
  , 'text-anchor': 'start'
  }

}
// Module de conversion de couleurs
SVG.Color = fonction (couleur) {
  match var

  // initialise les valeurs par défaut
  this.r = 0
  this.g = 0
  this.b = 0

  si (! couleur) retourne

  // couleur d'analyse
  if (typeof color === 'string') {
    if (SVG.regex.isRgb.test (couleur)) {
      // récupère les valeurs rgb
      match = SVG.regex.rgb.exec (color.replace (SVG.regex.whitespace, ''))

      // analyse des valeurs numériques
      this.r = parseInt (match [1])
      this.g = parseInt (match [2])
      this.b = parseInt (match [3])

    } else if (SVG.regex.isHex.test (couleur)) {
      // obtient des valeurs hexadécimales
      match = SVG.regex.hex.exec (fullHex (couleur))

      // analyse des valeurs numériques
      this.r = parseInt (match [1], 16)
      this.g = parseInt (match [2], 16)
      this.b = parseInt (match [3], 16)

    }

  } else if (typeof color === 'objet') {
    this.r = couleur.r
    this.g = couleur.g
    this.b = couleur.b

  }

}

SVG.extend (SVG.Color, {
  // Conversion par défaut en hexadécimal
  toString: function () {
    retourne this.toHex ()
  }
  // Construire une valeur hexadécimale
, toHex: function () {
    revenir '#'
      + compToHex (this.r)
      + compToHex (this.g)
      + compToHex (this.b)
  }
  // Construit la valeur RGB
, toRgb: function () {
    retourne 'rgb (' + [this.r, this.g, this.b] .join () + ')'
  }
  // Calculer la vraie luminosité
, luminosité: fonction () {
    retour (this.r / 255 * 0.30)
         + (this.g / 255 * 0.59)
         + (this.b / 255 * 0.11)
  }
  // Rendre la couleur morphable
, morph: fonction (couleur) {
    this.destination = new SVG.Color (couleur)

    retourner cette
  }
  // Obtenir la couleur morphed à la position donnée
, à: fonction (pos) {
    // s'assure qu'une destination est définie
    si (! this.destination) retourne ce

    // normaliser pos
    pos = pos <0? 0: pos> 1? 1: pos

    // générer une couleur morphée
    retourne le nouveau SVG.Color ({
      r: ~~ (this.r + (this.destination.r - this.r) * pos)
    , g: ~~ (this.g + (this.destination.g - this.g) * pos)
    , b: ~~ (this.b + (this.destination.b - this.b) * pos)
    })
  }

})

// testeurs

// Test si la valeur donnée est une chaîne de couleur
SVG.Color.test = function (color) {
  couleur + = ''
  retourne SVG.regex.isHex.test (couleur)
      || SVG.regex.isRgb.test (couleur)
}

// Teste si la valeur donnée est un objet rgb
SVG.Color.isRgb = fonction (couleur) {
  retourne la couleur && typeof color.r == 'numéro'
               && typeof color.g == 'numéro'
               && typeof color.b == 'numéro'
}

// Test si la valeur donnée est une couleur
SVG.Color.isColor = fonction (couleur) {
  return SVG.Color.isRgb (color) || SVG.Color.test (couleur)
}
// Module de conversion de tableau
SVG.Array = function (array, fallback) {
  tableau = (tableau || []). valueOf ()

  // si le tableau est vide et que le repli est fourni, utilisez le repli
  if (array.length == 0 && fallback)
    array = fallback.valueOf ()

  // tableau d'analyse
  this.value = this.parse (tableau)
}

SVG.extend (SVG.Array, {
  // Rendre le tableau morphable
  morph: fonction (tableau) {
    this.destination = this.parse (tableau)

    // normaliser la longueur des tableaux
    if (this.value.length! = this.destination.length) {
      var lastValue = this.value [this.value.length - 1]
        , lastDestination = this.destination [this.destination.length - 1]

      tandis que (this.value.length> this.destination.length)
        this.destination.push (lastDestination)
      while (this.value.length <this.destination.length)
        this.value.push (lastValue)
    }

    retourner cette
  }
  // Nettoyer les points en double
, régler: function () {
    // trouve toutes les valeurs uniques
    pour (var i = 0, il = this.value.length, seen = []; i <il; i ++)
      if (seen.indexOf (this.value [i]) == -1)
        seen.push (this.value [i])

    // définir une nouvelle valeur
    retourner this.value = vu
  }
  // Obtenir un tableau morphé à une position donnée
, à: fonction (pos) {
    // s'assure qu'une destination est définie
    si (! this.destination) retourne ce

    // générer un tableau morphé
    pour (var i = 0, il = this.value.length, array = []; i <il; i ++)
      array.push (this.value [i] + (this.destination [i] - this.value [i]) * pos)

    retourne un nouveau SVG.Array (tableau)
  }
  // Convertir un tableau en chaîne
, toString: function () {
    renvoyer this.value.join ('')
  }
  // Valeur réelle
, valeurDe: fonction () {
    retourner this.value
  }
  // Analyse de chaîne séparée par des espaces
, analyse: fonction (tableau) {
    array = array.valueOf ()

    // si est déjà un tableau, pas besoin de l'analyser
    if (Array.isArray (array)) renvoie un tableau

    renvoyer this.split (tableau)
  }
  // Supprime les espaces inutiles
, split: fonction (chaîne) {
    retourne string.trim (). split (SVG.regex.delimiter) .map (parseFloat)
  }
  // tableau inversé
, inverse: function () {
    this.value.reverse ()

    retourner cette
  }
, clone: ​​function () {
    var clone = new this.constructor ()
    clone.value = array_clone (this.value)
    retourne le clone
  }
})
// tableau de points poly
SVG.PointArray = function (array, fallback) {
  SVG.Array.call (this, tableau, repli || [[0,0]])
}

// Hériter de SVG.Array
SVG.PointArray.prototype = new SVG.Array
SVG.PointArray.prototype.constructor = SVG.PointArray

SVG.extend (SVG.PointArray, {
  // Convertir un tableau en chaîne
  toString: function () {
    // convertir en une chaîne de points multiples
    pour (var i = 0, il = this.value.length, array = []; i <il; i ++)
      array.push (this.value [i] .join (','))

    retourne array.join ('')
  }
  // Convertir un tableau en objet linéaire
, toLine: function () {
    revenir {
      x1: this.value [0] [0]
    , y1: this.value [0] [1]
    , x2: this.value [1] [0]
    , y2: this.value [1] [1]
    }
  }
  // Obtenir un tableau morphé à une position donnée
, à: fonction (pos) {
    // s'assure qu'une destination est définie
    si (! this.destination) retourne ce

    // générer une chaîne de points morphée
    pour (var i = 0, il = this.value.length, array = []; i <il; i ++)
      array.push ([
        this.value [i] [0] + (this.destination [i] [0] - this.value [i] [0]) * pos
      , this.value [i] [1] + (this.destination [i] [1] - this.value [i] [1]) * pos
      ])

    retourne SVG.PointArray (tableau)
  }
  // chaîne de points d'analyse et tableau plat
, analyse: fonction (tableau) {
    var points = []

    array = array.valueOf ()

    // s'il s'agit d'un tableau
    if (Array.isArray (array)) {
      // et ce n'est pas plat, il n'est pas nécessaire de l'analyser
      if (Array.isArray (array [0])) {
        // veille à utiliser un clone
        return array.map (function (el) {return el.slice ()})
      } sinon si (tableau [0] .x! = null) {
        // permet aux objets ponctuels d'être passés
        return array.map (function (el) {return [el.x, el.y]})
      }
    } else {// Sinon, il est considéré comme une chaîne.
      // points d'analyse
      array = array.trim (). split (SVG.regex.delimiter) .map (parseFloat)
    }

    // valider des points - https://svgwg.org/svg2-draft/shapes.html#DataTypePoints
    // Le nombre impair de coordonnées est une erreur. Dans ce cas, supprimez la dernière coordonnée impaire.
    if (array.length% 2! == 0) array.pop ()

    // encapsule les points en deux-tuples et analyse les points sous forme de flottants
    pour (var i = 0, len = array.length; i <len; i = i + 2)
      points.push ([tableau [i], tableau [i + 1]])

    points de retour
  }
  // Déplacer une chaîne de points
, déplacer: fonction (x, y) {
    var box = this.bbox ()

    // obtient un décalage relatif
    x - = box.x
    y - = box.y

    // déplace chaque point
    si (! isNaN (x) &&! isNaN (y))
      pour (var i = this.value.length - 1; i> = 0; i--)
        this.value [i] = [this.value [i] [0] + x, this.value [i] [1] + y]

    retourner cette
  }
  // Redimensionner la chaîne poly
, taille: fonction (largeur, hauteur) {
    var i, box = this.bbox ()

    // recalculer la position de tous les points en fonction de la nouvelle taille
    pour (i = this.value.length - 1; i> = 0; i--) {
      if (box.width) this.value [i] [0] = ((this.value [i] [0] - box.x) * largeur) / box.width + box.x
      if (box.height) this.value [i] [1] = ((this.value [i] [1] - box.y) * hauteur) / box.height + box.y
    }

    retourner cette
  }
  // Récupère une boîte de points
, bbox: function () {
    SVG.parser.poly.setAttribute ('points', this.toString ())

    retourne SVG.parser.poly.getBBox ()
  }
})

var pathHandlers = {
  M: fonction (c, p, p0) {
    px = p0.x = c [0]
    py = p0.y = c [1]

    retour ['M', px, py]
  },
  L: fonction (c, p) {
    px = c [0]
    py = c [1]
    retourne ['L', c [0], c [1]]
  },
  H: fonction (c, p) {
    px = c [0]
    retourne ['H', c [0]]
  },
  V: fonction (c, p) {
    py = c [0]
    retourne ['V', c [0]]
  },
  C: fonction (c, p) {
    px = c [4]
    py = c [5]
    retourne ['C', c [0], c [1], c [2], c [3], c [4], c [5]]
  },
  S: fonction (c, p) {
    px = c [2]
    py = c [3]
    retourne ['S', c [0], c [1], c [2], c [3]]
  },
  Q: fonction (c, p) {
    px = c [2]
    py = c [3]
    retourne ['Q', c [0], c [1], c [2], c [3]]
  },
  T: fonction (c, p) {
    px = c [0]
    py = c [1]
    retourne ['T', c [0], c [1]]
  },
  Z: fonction (c, p, p0) {
    px = p0.x
    py = p0.y
    retourner ['Z']
  },
  A: fonction (c, p) {
    px = c [5]
    py = c [6]
    retourne ['A', c [0], c [1], c [2], c [3], c [4], c [5], c [6]]
  }
}

var mlhvqtcsa = 'mlhvqtcsaz'.split (' ')

pour (var i = 0, il = mlhvqtcsa.length; i <il; ++ i) {
  pathHandlers [mlhvqtcsa [i]] = (fonction (i) {
    fonction de retour (c, p, p0) {
      si (i == 'H') c [0] = c [0] + px
      sinon si (i == 'V') c [0] = c [0] + py
      sinon si (i == 'A') {
        c [5] = c [5] + px,
        c [6] = c [6] + py
      }
      autre
        pour (var j = 0, jl = longueur c; j <jl; ++ j) {
          c [j] = c [j] + (j% 2? py: px)
        }

      retour pathHandlers [i] (c, p, p0)
    }
  }) (mlhvqtcsa [i] .toUpperCase ())
}

// tableau de points de chemin
SVG.PathArray = function (array, fallback) {
  SVG.Array.call (this, tableau, repli || [['M', 0, 0]])
}

// Hériter de SVG.Array
SVG.PathArray.prototype = new SVG.Array
SVG.PathArray.prototype.constructor = SVG.PathArray

SVG.extend (SVG.PathArray, {
  // Convertir un tableau en chaîne
  toString: function () {
    retourne arrayToString (this.value)
  }
  // Déplacer la chaîne de chemin
, déplacer: fonction (x, y) {
    // récupère le cadre de la situation actuelle
    var box = this.bbox ()

    // obtient un décalage relatif
    x - = box.x
    y - = box.y

    si (! isNaN (x) &&! isNaN (y)) {
      // déplace chaque point
      pour (var l, i = this.value.length - 1; i> = 0; i--) {
        l = this.value [i] [0]

        si (l == 'M' || l == 'L' || l == 'T') {
          this.value [i] [1] + = x
          this.value [i] [2] + = y

        } sinon si (l == 'H') {
          this.value [i] [1] + = x

        } sinon si (l == 'V') {
          this.value [i] [1] + = y

        } sinon si (l == 'C' || l == 'S' || l == 'Q') {
          this.value [i] [1] + = x
          this.value [i] [2] + = y
          this.value [i] [3] + = x
          this.value [i] [4] + = y

          si (l == 'C') {
            this.value [i] [5] + = x
            this.value [i] [6] + = y
          }

        } sinon si (l == 'A') {
          this.value [i] [6] + = x
          this.value [i] [7] + = y
        }

      }
    }

    retourner cette
  }
  // Redimensionner la chaîne de chemin
, taille: fonction (largeur, hauteur) {
    // récupère le cadre de la situation actuelle
    var i, l, box = this.bbox ()

    // recalculer la position de tous les points en fonction de la nouvelle taille
    pour (i = this.value.length - 1; i> = 0; i--) {
      l = this.value [i] [0]

      si (l == 'M' || l == 'L' || l == 'T') {
        this.value [i] [1] = ((this.value [i] [1] - box.x) * width) / box.width + box.x
        this.value [i] [2] = ((this.value [i] [2] - box.y) * hauteur) / box.height + box.y

      } sinon si (l == 'H') {
        this.value [i] [1] = ((this.value [i] [1] - box.x) * width) / box.width + box.x

      } sinon si (l == 'V') {
        this.value [i] [1] = ((this.value [i] [1] - box.y) * hauteur) / box.height + box.y

      } sinon si (l == 'C' || l == 'S' || l == 'Q') {
        this.value [i] [1] = ((this.value [i] [1] - box.x) * width) / box.width + box.x
        this.value [i] [2] = ((this.value [i] [2] - box.y) * hauteur) / box.height + box.y
        this.value [i] [3] = ((this.value [i] [3] - box.x) * width) / box.width + box.x
        this.value [i] [4] = ((this.value [i] [4] - box.y) * hauteur) / box.height + box.y

        si (l == 'C') {
          this.value [i] [5] = ((this.value [i] [5] - box.x) * width) / box.width + box.x
          this.value [i] [6] = ((this.value [i] [6] - box.y) * hauteur) / box.height + box.y
        }

      } sinon si (l == 'A') {
        // redimensionner les rayons
        this.value [i] [1] = (this.value [i] [1] * width) / box.width
        this.value [i] [2] = (this.value [i] [2] * hauteur) / box.height

        // déplace les valeurs de position
        this.value [i] [6] = ((this.value [i] [6] - box.x) * width) / box.width + box.x
        this.value [i] [7] = ((this.value [i] [7] - box.y) * hauteur) / box.height + box.y
      }

    }

    retourner cette
  }
  // Teste si le tableau de chemin d'accès passé utilise les mêmes commandes de données de chemin d'accès que ce tableau de chemin d'accès
, equalCommands: function (pathArray) {
    var i, il, equalCommands

    pathArray = new SVG.PathArray (pathArray)

    equalCommands = this.value.length === pathArray.value.length
    pour (i = 0, il = this.value.length; equalCommands && i <il; i ++) {
      equalCommands = this.value [i] [0] === pathArray.value [i] [0]
    }

    retourne equalCommands
  }
  // Rendre le chemin path morphable
, morph: function (pathArray) {
    pathArray = new SVG.PathArray (pathArray)

    if (this.equalCommands (pathArray)) {
      this.destination = pathArray
    } autre {
      this.destination = null
    }

    retourner cette
  }
  // Obtient un tableau de chemins morphé à une position donnée
, à: fonction (pos) {
    // s'assure qu'une destination est définie
    si (! this.destination) retourne ce

    var sourceArray = this.value
      , destinationArray = this.destination.value
      , array = [], pathArray = new SVG.PathArray ()
      , je, j, jl

    // Animate a spécifié dans la spécification SVG
    // Voir: https://www.w3.org/TR/SVG11/paths.html#PathElement
    pour (i = 0, il = sourceArray.length; i <il; i ++) {
      tableau [i] = [sourceArray [i] [0]]
      pour (j = 1, jl = sourceArray [i] .length; j <jl; j ++) {
        tableau [i] [j] = sourceArray [i] [j] + (destinationArray [i] [j] - sourceArray [i] [j]) * pos
      }
      // Pour les deux drapeaux de la commande d'arc elliptique, la spécification SVG dit:
      // Les drapeaux et les booléens sont interpolés sous forme de fractions comprises entre zéro et un, toute valeur autre que zéro étant considérée comme une valeur de un / vrai
      // Commande arc elliptique sous forme de tableau suivi des index correspondants:
      // ['A', rx, ry, rotation de l'axe des x, drapeau à grand arc, drapeau à balayage, x, y]
      // 0 1 2 3 4 5 6 7
      si (tableau [i] [0] === 'A') {
        tableau [i] [4] = + (tableau [i] [4]! = 0)
        tableau [i] [5] = + (tableau [i] [5]! = 0)
      }
    }

    // Modifie directement la valeur d'un tableau de chemins, ceci est fait de cette façon pour la performance
    pathArray.value = tableau
    retour pathArray
  }
  // Absolute et analyse le chemin du tableau
, analyse: fonction (tableau) {
    // si c'est déjà un patharray, pas besoin de l'analyser
    if (array instanceof SVG.PathArray) renvoie array.valueOf ()

    // prépare l'analyse
    var i, x0, y0, s, seg, arr
      , x = 0
      , y = 0
      , paramCnt = {'M': 2, 'L': 2, 'H': 1, 'V': 1, 'C': 6, 'S': 4, 'Q': 4, 'T': 2, 'A': 7, 'Z': 0}

    if (typeof array == 'string') {

      tableau = tableau
        .replace (SVG.regex.numbersWithDots, pathRegReplace) // convertit 45.123.123 en 45.123 .123
        .replace (SVG.regex.pathLetters, '$ &') // place un espace entre les lettres et les chiffres
        .replace (SVG.regex.hyphen, '$ 1 -') // ajoute un espace avant le trait d'union
        .trim () // trim
        .split (SVG.regex.delimiter) // divisé en tableau

    }autre{
      array = array.reduce (fonction (prev, curr) {
        return [] .concat.call (prev, curr)
      }, [])
    }

    // tableau est maintenant un tableau contenant toutes les parties d'un chemin, par exemple ['M', '0', '0', 'L', '30', '30' ...]
    var arr = []
      , p = new SVG.Point ()
      , p0 = nouveau SVG.Point ()
      , index = 0
      , len = array.length

    faire{
      // Teste si nous avons une lettre de chemin
      if (SVG.regex.isPathLetter.test (array [index]))) {
        s = tableau [index]
        ++ index
      // Si la dernière lettre était une commande de déplacement et que nous n'en avions aucune nouvelle, la valeur par défaut est [L] ine
      } sinon si (s == 'M') {
        s = 'L'
      } sinon si (s == 'm') {
        s = 'l'
      }

      arr.push (pathHandlers [s] .call (null,
          array.slice (index, (index = index + paramCnt [s.toUpperCase ()])). map (parseFloat),
          p, p0
        )
      )

    } while (len> index)

    retour arr

  }
  // Récupère le cadre du chemin
, bbox: function () {
    SVG.parser.path.setAttribute ('d', this.toString ())

    retourne SVG.parser.path.getBBox ()
  }

})

// Module de conversion d'unités
SVG.Number = SVG.invent ({
  // initialiser
  créer: fonction (valeur, unité) {
    // initialise les valeurs par défaut
    this.value = 0
    this.unit = unit || ''

    // valeur d'analyse
    if (typeof value === 'numéro') {
      // assure une valeur numérique valide
      this.value = isNaN (valeur)? 0:! IsFinite (valeur)? (valeur <0? -3.4e + 38: + 3.4e + 38): valeur

    } else if (typeof valeur === 'chaîne') {
      unit = value.match (SVG.regex.numberAndUnit)

      si (unité) {
        // rendre la valeur numérique
        this.value = parseFloat (unité [1])

        // normaliser
        si (unité [5] == '%')
          this.value / = 100
        sinon si (unité [5] == 's')
          this.value * = 1000

        // unité de magasin
        this.unit = unit [5]
      }

    } autre {
      if (valeur instanceof SVG.Number) {
        this.value = value.valueOf ()
        this.unit = value.unit
      }
    }

  }
  // Ajout de méthodes
, étendre: {
    // cordaliser
    toString: function () {
      revenir (
        this.unit == '%'?
          ~~ (this.value * 1e8) / 1e6:
        this.unit == 's'?
          this.value / 1e3:
          this.value
      ) + this.unit
    }
  , toJSON: function () {
      retourne this.toString ()
    }
  , // Convertir en primitive
    valueOf: function () {
      retourner this.value
    }
    // Ajouter un numéro
  , plus: fonction (nombre) {
      numéro = nouveau SVG.Numéro (nombre)
      retourne un nouveau SVG.Number (this + number, this.unit || number.unit)
    }
    // nombre soustrait
  , moins: fonction (nombre) {
      numéro = nouveau SVG.Numéro (nombre)
      renvoie le nouveau numéro SVG.Numéro (this - numéro, this.unit || number.unit)
    }
    // Numéro multiplié
  , fois: fonction (nombre) {
      numéro = nouveau SVG.Numéro (nombre)
      renvoie le nouveau numéro SVG.Numéro (ce * numéro, cet.unité || nombre.unité)
    }
    // numéro de division
  , diviser: fonction (nombre) {
      numéro = nouveau SVG.Numéro (nombre)
      renvoie le nouveau numéro SVG.Numéro (this / numéro, this.unit || number.unit)
    }
    // Convertir en unité différente
  , to: fonction (unité) {
      numéro var = new SVG.Number (this)

      if (typeof unit === 'chaîne')
        nombre.unité = unité

      numéro de retour
    }
    // Rendre le nombre morphable
  , morph: fonction (nombre) {
      this.destination = new SVG.Number (number)

      si (nombre.relatif) {
        this.destination.value + = this.value
      }

      retourner cette
    }
    // Récupère le numéro morphé à la position donnée
  , à: fonction (pos) {
      // Assurez-vous qu'une destination est définie
      si (! this.destination) retourne ce

      // Générer un nouveau nombre transformé
      retourne un nouveau numéro SVG.Numéro (this.destination)
          .minus (this)
          .times (pos)
          .plus (this)
    }

  }
})


SVG.Element = SVG.invent ({
  // Initialize node
  créer: fonction (noeud) {
    // rendre la valeur de trait accessible de manière dynamique
    this._stroke = SVG.defaults.attrs.stroke
    this._event = null
    this._events = {}

    // initialise l'objet de données
    this.dom = {}

    // crée une référence circulaire
    if (this.node = noeud) {
      this.type = node.nodeName
      this.node.instance = this
      this._events = node._events || {}

      // stocke la valeur actuelle de l'attribut
      this._stroke = node.getAttribute ('stroke') || this._stroke
    }
  }

  // Ajout de méthodes de classe
, étendre: {
    // Se déplacer sur l'axe des x
    x: fonction (x) {
      retourne this.attr ('x', x)
    }
    // Se déplacer sur l'axe des y
  , y: fonction (y) {
      retournez this.attr ('y', y)
    }
    // Se déplacer par centre sur l'axe des x
  , cx: fonction (x) {
      renvoyer x == null? this.x () + this.width () / 2: this.x (x - this.width () / 2)
    }
    // Se déplacer par centre sur l'axe des y
  , cy: fonction (y) {
      retourne y == null? this.y () + this.height () / 2: this.y (y - this.height () / 2)
    }
    // Déplacer l'élément vers les valeurs x et y données
  , déplacer: fonction (x, y) {
      retourne this.x (x) .y (y)
    }
    // Déplacer l'élément par son centre
  , centre: fonction (x, y) {
      retourne this.cx (x) .cy (y)
    }
    // Définit la largeur de l'élément
  , largeur: fonction (largeur) {
      retourne this.attr ('largeur', largeur)
    }
    // Définir la hauteur de l'élément
  , hauteur: fonction (hauteur) {
      retourne this.attr ('hauteur', hauteur)
    }
    // Définit la taille de l'élément sur la largeur et la hauteur données
  , taille: fonction (largeur, hauteur) {
      var p = proportionnelTaille (this, width, height)

      retourner cette
        .width (nouveau SVG.Number (p.width))
        .height (nouveau SVG.Number (p.height))
    }
    // élément clone
  , clone: ​​fonction (parent) {
      // écrit les données dom sur le dom afin que le clone puisse les récupérer
      this.writeDataToDom ()

      // clone element et attribue un nouvel identifiant
      var clone = assignNewId (this.node.cloneNode (true))

      // insère le clone dans le parent donné ou après moi
      si (parent) parent.add (clone)
      sinon this.after (clone)

      retourne le clone
    }
    // Supprimer un élément
  , supprimez: function () {
      if (this.parent ())
        this.parent (). removeElement (this)

      retourner cette
    }
    // Remplacer l'élément
  , remplace: fonction (élément) {
      this.after (element) .remove ()

      élément de retour
    }
    // Ajoute un élément au conteneur donné et retourne self
  , addTo: function (parent) {
      retourne parent.put (this)
    }
    // Ajout d'un élément au conteneur donné et retour du conteneur
  , putIn: fonction (parent) {
      retourne parent.add (this)
    }
    // Get / set id
  , id: function (id) {
      retourne this.attr ('id', id)
    }
    // Vérifie si le point donné à l'intérieur du cadre de sélection de l'élément
  , à l'intérieur: function (x, y) {
      var box = this.bbox ()

      retourne x> box.x
          && y> box.y
          && x <box.x + box.width
          && y <box.y + box.height
    }
    // Afficher l'élément
  , show: function () {
      retourne this.style ('display', '')
    }
    // Masquer l'élément
  , masquer: function () {
      retourne this.style ('display', 'none')
    }
    // L'élément est-il visible?
  , visible: function () {
      return this.style ('display')! = 'none'
    }
    // Renvoie l'id de la conversion de chaîne
  , toString: function () {
      retourne this.attr ('id')
    }
    // Retourne un tableau de classes sur le noeud
  , classes: function () {
      var attr = this.attr ('classe')

      renvoie attr == null? []: attr.trim (). split (SVG.regex.delimiter)
    }
    // Renvoie true si la classe existe sur le noeud, false sinon
  , hasClass: fonction (nom) {
      renvoie this.classes (). indexOf (name)! = -1
    }
    // Ajouter une classe au noeud
  , addClass: fonction (nom) {
      if (! this.hasClass (name)) {
        var array = this.classes ()
        array.push (nom)
        this.attr ('classe', array.join (''))
      }

      retourner cette
    }
    // Supprimer la classe du noeud
  removeClass: fonction (nom) {
      if (this.hasClass (name)) {
        this.attr ('classe', this.classes (). filtre (fonction (c) {
          retourne c! = nom
        }). rejoindre (''))
      }

      retourner cette
    }
    // Basculer la présence d'une classe sur le nœud
  , toggleClass: fonction (nom) {
      retourner this.hasClass (name)? this.removeClass (name): this.addClass (name)
    }
    // Obtenir la valeur d'attribut de forme d'élément référencé
  , référence: fonction (attr) {
      retourne SVG.get (this.attr (attr))
    }
    // retourne l'instance d'élément parent
  , parent: fonction (type) {
      var parent = this

      // vérifier le parent
      if (! parent.node.parentNode) renvoie null

      // récupère l'élément parent
      parent = SVG.adopt (parent.node.parentNode)

      si (! type) retourne le parent

      // ancêtres de boucle si le type est donné
      while (parent && parent.node instanceof window.SVGElement) {
        if (typeof type === 'string'? parent.matches (type): instance parent du type) retourne le parent
        if (! parent.node.parentNode || parent.node.parentNode.nodeName == '#document' || parent.node.parentNode.nodeName == '# document-fragment') retourne null // # 759, # 720
        parent = SVG.adopt (parent.node.parentNode)
      }
    }
    // Obtenir le document parent
  , doc: function () {
      renvoyer cette instance de SVG.Doc? this: this.parent (SVG.Doc)
    }
    // retourne le tableau de tous les ancêtres de type donné jusqu'à la racine svg
  , parents: fonction (type) {
      var parents = [], parent = this

      faire{
        parent = parent.parent (type)
        si (! parent ||! parent.node) pause

        parents.push (parent)
      } while (parent.parent)

      retour parents
    }
    // correspond à l'élément vs un sélecteur css
  , correspond à: fonction (sélecteur) {
      renvoyer les correspondances (this.node, selector)
    }
    // retourne le noeud svg pour appeler des méthodes svg natives
  , native: function () {
      renvoyer this.node
    }
    // Importer un svg brut
  , svg: function (svg) {
      // créer un titulaire temporaire
      var well = document.createElement ('svg')

      // agit comme un passeur si svg est donné
      if (svg && cette instance de SVG.Parent) {
        // dump raw svg
        well.innerHTML = '<svg>' + svg.replace (/ / \ n /, '') .replace (/ <([\ w: -] +) ([^ <] +?) \ /> / g, '<$ 1 $ 2> </ $ 1>') + '</ svg>'

        // noeuds de greffe
        pour (var i = 0, il = well.firstChild.childNodes.length; i <il; i ++)
          this.node.appendChild (well.firstChild.firstChild)

      // sinon agit comme un getter
      } autre {
        // crée un élément wrapping svg en cas de contenu partiel
        well.appendChild (svg = document.createElement ('svg'))

        // écrit les données svgjs sur le dom
        this.writeDataToDom ()

        // insère une copie de ce noeud
        svg.appendChild (this.node.cloneNode (true))

        // retourne l'élément cible
        retourne well.innerHTML.replace (/ ^ <svg> /, '') .replace (/ <\ / svg> $ /, '')
      }

      retourner cette
    }
  // écrit les données svgjs sur le dom
  , writeDataToDom: function () {

      // dump des variables de manière récursive
      if (this.each || this.lines) {
        var fn = this.each? this: this.lines ();
        fn.each (function () {
          this.writeDataToDom ()
        })
      }

      // supprime les données précédemment définies
      this.node.removeAttribute ('svgjs: data')

      if (Object.keys (this.dom) .length)
        this.node.setAttribute ('svgjs: data', JSON.stringify (this.dom)) // voir # 428

      retourner cette
    }
  // définit les données données dans la propriété de données des éléments
  , setData: function (o) {
      this.dom = o
      retourner cette
    }
  , est: fonction (obj) {
      le retour est (ceci, obj)
    }
  }
})

SVG.easing = {
  '-': function (pos) {return pos}
, '<>': fonction (pos) {return -Math.cos (pos * Math.PI) / 2 + 0,5}
, '>': function (pos) {return Math.sin (pos * Math.PI / 2)}
, '<': function (pos) {return -Math.cos (pos * Math.PI / 2) + 1}
}

SVG.morph = function (pos) {
  fonction de retour (de, à) {
    retourne SVG.MorphObj (de, à) .at (pos)
  }
}

SVG.Situation = SVG.invent ({

  créer: fonction (o) {
    this.init = false
    this.reversed = false
    this.reversing = false

    this.duration = new SVG.Number (o.duration) .valueOf ()
    this.delay = new SVG.Number (o.delay) .valueOf ()

    this.start = + new Date () + this.delay
    this.finish = this.start + this.duration
    this.ease = o.ease

    // this.loop est incrémenté de 0 à this.loops
    // il est également incrémenté dans une boucle infinie (lorsque this.loops est vrai)
    this.loop = 0
    this.loops = false

    this.animations = {
      // functionToCall: [liste d'objets morphable]
      // par exemple move: [SVG.Number, SVG.Number]
    }

    this.attrs = {
      // contient tous les attributs qui ne sont pas représentés par une fonction fournie par svg.js
      // par exemple someAttr: SVG.Number
    }

    this.styles = {
      // contient tous les styles qui doivent être animés
      // par exemple couleur de remplissage: SVG.Color
    }

    this.transforms = [
      // contient toutes les transformations en tant qu'objets de transformation
      // par exemple [SVG.Rotate, SVG.Translate, SVG.Matrix]
    ]

    this.once = {
      // fonctionne pour tirer à une position spécifique
      // par exemple "0.5": function foo () {}
    }

  }

})


SVG.FX = SVG.invent ({

  créer: fonction (élément) {
    this._target = element
    this.situations = []
    this.active = false
    this.situation = null
    this.paused = false
    this.lastPos = 0
    this.pos = 0
    // La position absolue d'une animation est sa position dans le contexte de sa durée complète (y compris les délais et les boucles)
    // lors de l'exécution d'un délai, absPos est inférieur à 0 et lors de l'exécution d'une boucle, sa valeur est supérieure à 1
    this.absPos = 0
    this._speed = 1
  }

, étendre: {

    / **
     * définit ou retourne la cible de cette animation
     * @param o object || nombre En cas d'objet, il contient tous les paramètres. En cas de nombre c'est la durée de l'animation
     * @param fonction de facilité || chaîne de caractères Fonction à utiliser pour assouplir ou assouplir le mot clé
     * @param delay Numéro indiquant le délai avant le début de l'animation.
     * cible de retour || ce
     * /
    animate: function (o, aisance, retard) {

      if (typeof o == 'objet') {
        facilité = o.ease
        délai = retard
        o = durée
      }

      var situation = new SVG.Situation ({
        durée: o || 1000,
        delay: delay || 0
        aisance: SVG.easing [aisance || '-'] || facilité
      })

      this.queue (situation)

      retourner cette
    }

    / **
     * définit un délai avant l'appel du prochain élément de la file d'attente
     * @param delay Durée du délai en millisecondes
     * @retour this.target ()
     * /
  , délai: fonction (délai) {
      // Le délai est exécuté par une situation vide avec sa durée
      // attribut défini sur la durée du délai
      var situation = new SVG.Situation ({
        durée: retard,
        délai: 0,
        facilité: SVG.easing ['-']
      })

      retourne this.queue (situation)
    }

    / **
     * définit ou retourne la cible de cette animation
     * @param null || SVG.Element target qui doit être défini comme nouvelle cible
     * cible de retour || ce
     * /
  , cible: fonction (cible) {
      if (cible && instance de cible de SVG.Element) {
        this._target = cible
        retourner cette
      }

      retourne this._target
    }

    // retourne la position absolue à un moment donné
  , timeToAbsPos: fonction (horodatage) {
      return (timestamp - this.situation.start) / (this.situation.duration / this._speed)
    }

    // retourne l'horodatage à partir d'une position absolue donnée
  , absPosToTime: fonction (absPos) {
      renvoie this.situation.duration / this._speed * absPos + this.situation.start
    }

    // démarre l'animationloop
  , startAnimFrame: function () {
      this.stopAnimFrame ()
      this.animationFrame = window.requestAnimationFrame (function () {this.step ()} .bind (this))
    }

    // annule le cadre d'animation
  , stopAnimFrame: function () {
      window.cancelAnimationFrame (this.animationFrame)
    }

    // lance l'animation - ne fait quelque chose que lorsque la file d'attente n'est pas active et qu'au moins une situation est définie
  , start: function () {
      // ne commence pas si déjà commencé
      si (! this.active && this.situation) {
        this.active = true
        this.startCurrent ()
      }

      retourner cette
    }

    // démarre la situation actuelle
  , startCurrent: function () {
      this.situation.start = + new Date + this.situation.delay / this._speed
      this.situation.finish = this.situation.start + this.situation.duration / this._speed
      retourne this.initAnimations (). step ()
    }

    / **
     * ajoute une fonction / situation à la file d'attente d'animation
     * @param fn fonction / situation à ajouter
     * @retourne ça
     * /
  , file d'attente: function (fn) {
      if (type de fn == 'fonction' | | fn instance de SVG.Situation)
        this.situations.push (fn)

      si (! this.situation) this.situation = this.situations.shift ()

      retourner cette
    }

    / **
     * extrait l'élément suivant de la file d'attente et l'exécute
     * @retourne ça
     * /
  , dequeue: function () {
      // arrête l'animation en cours
      this.stop ()

      // récupère la prochaine animation de la file d'attente
      this.situation = this.situations.shift ()

      if (this.situation) {
        if (this.situation instanceof SVG.Situation) {
          this.start ()
        } autre {
          // Si ce n'est pas un SVG.Situation, alors c'est une fonction, on l'exécute
          this.situation.call (this)
        }
      }

      retourner cette
    }

    // met à jour toutes les animations à l'état actuel de l'élément
    // ceci est important quand une propriété peut être changée d'une autre propriété
  , initAnimations: function () {
      var i, j, source
      var s = this.situation

      si (à son tour) retourne ceci

      pour (je suis à l'animations) {
        source = this.target () [i] ()

        if (! Array.isArray (source)) {
          source = [source]
        }

        if (! Array.isArray (à l'animations [i])) {
          s.animations [i] = [s.animations [i]]
        }

        //if(s.animations[i].length> source.length) {
        // source.concat = source.concat (s.animations [i] .slice (source.length, s.animations [i] .length))
        //}

        pour (j = source.length; j--;) {
          // La condition est parce que certaines méthodes retournent un nombre normal à la place
          // d'un SVG.Number
          if (s.animations [i] [j] instance de SVG.Number)
            source [j] = nouveau SVG.Number (source [j])

          s.animations [i] [j] = source [j] .morph (s.animations [i] [j])
        }
      }

      pour (i in s.attrs) {
        s.attrs [i] = nouveau SVG.MorphObj (this.target (). attr (i), s.attrs [i])
      }

      pour (i dans les styles) {
        s.styles [i] = nouveau SVG.MorphObj (this.target (). style (i), s.styles [i])
      }

      s.initialTransformation = this.target (). matrixify ()

      s.init = true
      retourner cette
    }
  , clearQueue: function () {
      this.situations = []
      retourner cette
    }
  , clearCurrent: function () {
      this.situation = null
      retourner cette
    }
    / ** arrête immédiatement l'animation
     * @param jumpToEnd Un booléen indiquant si l'animation en cours doit être terminée immédiatement.
     * @param clearQueue Un booléen indiquant s'il faut également supprimer l'animation en file d'attente.
     * @retourne ça
     * /
  , stop: function (jumpToEnd, clearQueue) {
      var active = this.active
      this.active = false

      if (clearQueue) {
        this.clearQueue ()
      }

      if (jumpToEnd && this.situation) {
        // initialise la situation si ce n'était pas
        ! active && this.startCurrent ()
        this.atEnd ()
      }

      this.stopAnimFrame ()

      retourne this.clearCurrent ()
    }

    / ** réinitialise l'élément à l'état où l'élément actuel a commencé
     * @retourne ça
     * /
  , reset: function () {
      if (this.situation) {
        var temp = this.situation
        this.stop ()
        this.situation = temp
        this.atStart ()
      }
      retourner cette
    }

    // Arrête l'animation en cours d'exécution, supprime toutes les animations en file d'attente et complète toutes les animations pour l'élément.
  , finition: fonction () {

      this.stop (true, false)

      while (this.dequeue (). situation && this.stop (true, false));

      this.clearQueue (). clearCurrent ()

      retourner cette
    }

    // place le pointeur d'animation interne à la position de départ, avant les boucles, et met à jour la visualisation
  , atStart: function () {
      retourne this.at (0, vrai)
    }

    // place le pointeur d'animation interne à la fin, après toutes les boucles et met à jour la visualisation
  , atEnd: function () {
      if (this.situation.loops === true) {
        // Si dans une boucle infinie, on termine l'itération en cours
        this.situation.loops = this.situation.loop + 1
      }

      if (typeof this.situation.loops == 'numéro') {
        // Si on effectue un nombre fini de boucles, on va après toutes les boucles
        renvoyer this.at (this.situation.loops, true)
      } autre {
        // S'il n'y a pas de boucle, on va juste à la fin
        retourne this.at (1, vrai)
      }
    }

    // place le pointeur d'animation interne sur la position spécifiée et met à jour la visualisation
    // si isAbsPos est vrai, pos est traité comme une position absolue.
  , à: fonction (pos, isAbsPos) {
      var durDivSpd = this.situation.duration / this._speed

      this.absPos = pos
      // Si pos n'est pas une position absolue, nous le convertissons en un
      si (! isAbsPos) {
        if (this.situation.reversed) this.absPos = 1 - this.absPos
        this.absPos + = this.situation.loop
      }

      this.situation.start = + new Date - this.absPos * durDivSpd
      this.situation.finish = this.situation.start + durDivSpd

      renvoyer this.step (true)
    }

    / **
     * définit ou retourne la vitesse des animations
     * @param speed null || Nombre La nouvelle vitesse des animations
     * Numéro de retour || ce
     * /
  , vitesse: fonction (vitesse) {
      if (speed === 0) renvoie this.pause ()

      si (vitesse) {
        this._speed = vitesse
        // Nous utilisons ici une position absolue pour que la vitesse puisse affecter le délai avant l'animation
        renvoyer this.at (this.absPos, true)
      } sinon, retourne this._speed
    }

    // Rendre en boucle
  , boucle: fonction (temps, inverse) {
      var c = this.last ()

      // stocke les boucles totales
      c.loops = (times! = null)? fois: vrai
      c.loop = 0

      si (inverse) c.reversing = true
      retourner cette
    }

    // met l'animation en pause
  , pause: function () {
      this.paused = true
      this.stopAnimFrame ()

      retourner cette
    }

    // annule l'animation
  , joue: function () {
      si (! this.paused) retourne ceci
      this.paused = false
      // Nous utilisons ici une position absolue pour pouvoir suspendre le délai avant l'animation
      renvoyer this.at (this.absPos, true)
    }

    / **
     * basculer ou définir la direction de l'animation
     * true définit la direction à l'envers tandis que false le définit à forward
     * @param reverse Boolean indiquant s'il faut inverser l'animation ou non (par défaut: basculer le statut inverse)
     * @retourne ça
     * /
  , inverse: fonction (inversée) {
      var c = this.last ()

      if (typeof inversé == 'undefined') c.reversed =! c.reversed
      sinon c.reversed = inversé

      retourner cette
    }


    / **
     * retourne un float de 0 à 1 indiquant la progression de l'animation en cours
     * @param eased Boolean indiquant si la position retournée doit être apaisée ou non
     * numéro de retour
     * /
  , progrès: fonction (aisance) {
      retour easyIt? this.situation.ease (this.pos): this.pos
    }

    / **
     * ajoute une fonction de rappel appelée lorsque l'animation en cours est terminée
     * @param fn Fonction qui doit être exécutée en tant que rappel
     * numéro de retour
     * /
  , après: function (fn) {
      var c = this.last ()
        , wrapper = function wrapper (e) {
            if (e.detail.situation == c) {
              fn.call (this, c)
              this.off ('finish.fx', wrapper) // empêche la fuite de mémoire
            }
          }

      this.target (). on ('finish.fx', wrapper)

      retourne this._callStart ()
    }

    // ajoute un rappel qui est appelé chaque fois qu'une étape d'animation est effectuée
  , pendant: fonction (fn) {
      var c = this.last ()
        , wrapper = function (e) {
            if (e.detail.situation == c) {
              fn.call (this, e.detail.pos, SVG.morph (e.detail.pos), e.detail.eased, c)
            }
          }

      // voir au dessus
      this.target (). off ('During.fx', wrapper) .on ('During.fx', wrapper)

      this.after (function () {
        this.off ('During.Fx', wrapper)
      })

      retourne this._callStart ()
    }

    // appels après TOUTES les animations de la file d'attente
  , afterAll: function (fn) {
      var wrapper = function wrapper (e) {
            fn.call (this)
            this.off ('allfinished.fx', wrapper)
          }

      // voir au dessus
      this.target (). off ('allfinished.fx', wrapper) .on ('allfinished.fx', wrapper)

      retourne this._callStart ()
    }

    // appelle à chaque étape de l'animation pour toutes les animations
  , pendantTout: fonction (fn) {
      var wrapper = function (e) {
            fn.call (this, e.detail.pos, SVG.morph (e.detail.pos), e.detail.eased, e.detail.situation)
          }

      this.target (). off ('During.fx', wrapper) .on ('During.fx', wrapper)

      this.afterAll (function () {
        this.off ('During.Fx', wrapper)
      })

      retourne this._callStart ()
    }

  , dernier: function () {
      retourner this.situations.length? this.situations [this.situations.length-1]: this.situation
    }

    // ajoute une propriété aux animations
  , add: function (méthode, arguments, type) {
      this.last () [type || 'animations'] [méthode] = args
      retourne this._callStart ()
    }

    / ** effectuer une étape de l'animation
     * @param ignoreTime Booléen indiquant s'il faut ignorer le temps et utiliser directement la position ou recalculer la position en fonction du temps
     * @retourne ça
     * /
  , étape: fonction (ignoreTime) {

      // convertit l'heure actuelle en position absolue
      if (! ignoreTime) this.absPos = this.timeToAbsPos (+ nouvelle date)

      // Cette partie convertit une position absolue en position
      if (this.situation.loops! == false) {
        var absPos, absPosInt, lastLoop

        // Si la position absolue est inférieure à 0, nous la traitons simplement comme si elle était 0
        absPos = Math.max (this.absPos, 0)
        absPosInt = Math.floor (absPos)

        if (this.situation.loops === true || absPosInt <this.situation.loops) {
          this.pos = absPos - absPosInt
          lastLoop = this.situation.loop
          this.situation.loop = absPosInt
        } autre {
          this.absPos = this.situation.loops
          this.pos = 1
          // Le -1 est parce que nous ne voulons pas basculer inversé lorsque toutes les boucles sont terminées
          lastLoop = this.situation.loop - 1
          this.situation.loop = this.situation.loops
        }

        if (this.situation.reversing) {
          // Basculement inversé si un nombre impair de boucles s'est produit depuis le dernier appel de l'étape
          this.situation.reversed = this.situation.reversed! = Boolean ((this.situation.loop - lastLoop)% 2)
        }

      } autre {
        // S'il n'y a pas de boucle, la position absolue ne doit pas être supérieure à 1
        this.absPos = Math.min (this.absPos, 1)
        this.pos = this.absPos
      }

      // alors que la position absolue peut être inférieure à 0, la position ne doit pas être inférieure à 0
      if (this.pos <0) this.pos = 0

      if (this.situation.reversed) this.pos = 1 - this.pos


      // appliquer un assouplissement
      var eased = this.situation.ease (this.pos)

      // appelle des rappels uniques
      pour (var i in this.situation.once) {
        if (i> this.lastPos && i <= facilité) {
          this.situation.once [i] .call (this.target (), this.pos, assoupli)
          supprimer this.situation.once [i]
        }
      }

      // déclenche un rappel avec position, position améliorée et situation actuelle en tant que paramètre
      if (this.active) this.target (). fire ('pendant', {pos: this.pos, eased: eased, fx: this, situation: this.situation})

      // l'utilisateur peut appeler stop ou terminer dans le rappel
      // alors assurez-vous que nous avons toujours une situation valide
      si (! this.situation) {
        retourner cette
      }

      // applique l'animation réelle à chaque propriété
      this.eachAt ()

      // fait le code final quand la situation est finie
      if ((this.pos == 1 &&! this.situation.reversed) || (this.situation.reversed && this.pos == 0)) {

        // arrête le rappel d'animation
        this.stopAnimFrame ()

        // lance le rappel terminé avec la situation actuelle en paramètre
        this.target (). fire ('terminé', {fx: this, situation: this.situation})

        si (! this.situations.length) {
          this.target (). fire ('tout fini')

          // Revérifier la longueur puisque l'utilisateur peut appeler animate dans le rappel afterAll
          si (! this.situations.length) {
            this.target (). off ('. fx') // il ne devrait plus rester de liaison, mais pour être sûr ...
            this.active = false
          }
        }

        // commence l'animation suivante
        if (this.active) this.dequeue ()
        sinon this.clearCurrent ()

      } else if (! this.paused && this.active) {
        // on continue à animer quand on n'est pas à la fin
        this.startAnimFrame ()
      }

      // sauvegarde la dernière position assouplie pour le déclenchement du rappel une fois
      this.lastPos = facilité
      retourner cette

    }

    // calcule le pas pour chaque propriété et bloque les appels
  , eachAt: function () {
      var i, len, at, self = this, target = this.target (), s = this.situation

      // applique des animations qui peuvent être appelées à travers une méthode
      pour (je suis à l'animations) {

        at = [] .concat (s.animations [i]). map (fonction (el) {
          retourne typeof el! == 'chaîne' && el.at? el.at (s.ease (self.pos), self.pos): el
        })

        cible [i] .apply (cible, à)

      }

      // applique une animation qui doit être appliquée avec attr ()
      pour (i in s.attrs) {

        at = [i] .concat (s.attrs [i]). map (fonction (el) {
          retourne typeof el! == 'chaîne' && el.at? el.at (s.ease (self.pos), self.pos): el
        })

        target.attr.apply (target, at)

      }

      // applique une animation à appliquer avec style ()
      pour (i dans les styles) {

        at = [i] .concat (s.tyles [i]). map (fonction (el) {
          retourne typeof el! == 'chaîne' && el.at? el.at (s.ease (self.pos), self.pos): el
        })

        target.style.apply (target, at)

      }

      // animate initialTransformation qui doit être chaîné
      if (à la transformation.longueur) {

        // récupère la transformation initiale initiale
        at = s.initialTransformation
        pour (i = 0, len = s.transforms.length; i <len; i ++) {

          // obtenir la prochaine transformation dans la chaîne
          var a = à la transformation [i]

          // multiplie la matrice directement
          if (une instance de SVG.Matrix) {

            si (a.relative) {
              at = at.multiply (nouveau SVG.Matrix (). morph (a) .at (s'il y a lieu (this.pos)))
            }autre{
              at = at.morph (a) .at (si.sé (this.pos))
            }
            continuer
          }

          // lorsque la transformation est absolue, nous devons d'abord réinitialiser la transformation nécessaire
          si (! a.relative)
            a.undo (at.extract ())

          // et réapplique après
          at = at.multiply (a.at (s.ease (this.pos))))

        }

        // définit une nouvelle matrice sur un élément
        target.matrix (at)
      }

      retourner cette

    }


    // ajoute un rappel unique appelé à une position spécifique et plus jamais
  , once: fonction (pos, fn, isEased) {
      var c = this.last ()
      si (! est facile) pos = c.ease (pos)

      c.once [pos] = fn

      retourner cette
    }

  , _callStart: function () {
      setTimeout (function () {this.start ()}. bind (this), 0)
      retourner cette
    }

  }

, parent: SVG.Element

  // Ajout de la méthode aux éléments parents
, construit: {
    // Obtenir le module fx ou en créer un nouveau, puis l'animer avec une durée et une facilité données
    animate: function (o, aisance, retard) {
      return (this.fx || (this.fx = new SVG.FX (this))). animate (o, facilité, retard)
    }
  , délai: fonction (délai) {
      return (this.fx || (this.fx = new SVG.FX (this))). delay (delay)
    }
  , stop: function (jumpToEnd, clearQueue) {
      si (this.fx)
        this.fx.stop (jumpToEnd, clearQueue)

      retourner cette
    }
  , finition: fonction () {
      si (this.fx)
        this.fx.finish ()

      retourner cette
    }
    // Suspend l'animation en cours
  , pause: function () {
      si (this.fx)
        this.fx.pause ()

      retourner cette
    }
    // Lecture de l'animation en pause
  , joue: function () {
      si (this.fx)
        this.fx.play ()

      retourner cette
    }
    // Définir / Obtenir la vitesse des animations
  , vitesse: fonction (vitesse) {
      si (this.fx)
        si (vitesse == null)
          retourne this.fx.speed ()
        autre
          this.fx.speed (vitesse)

      retourner cette
    }
  }

})

// MorphObj est utilisé chaque fois qu'aucun objet morphable n'est donné
SVG.MorphObj = SVG.invent ({

  créer: fonction (de, à) {
    // prépare la couleur pour le morphing
    if (SVG.Color.isColor (to)) renvoie un nouveau fichier SVG.Color (from) .morph (to)
    // vérifie si nous avons une liste de valeurs
    if (SVG.regex.delimiter.test (à partir de)) {
      // prépare le chemin pour le morphing
      if (SVG.regex.pathLetters.test (from)) renvoie un nouveau fichier SVG.PathArray (from) .morph (to)
      // prépare la liste de valeurs pour le morphing
      sinon, retourne le nouveau fichier SVG.Array (from) .morph (to)
    }
    // prépare le numéro pour le morphing
    if (SVG.regex.numberAndUnit.test (to)) renvoie le nouveau fichier SVG.Number (from) .morph (to)

    // prépare le morphing
    this.value = from
    this.destination = to
  }

, étendre: {
    at: function (pos, real) {
      retourner réel <1? this.value: this.destination
    },

    valueOf: function () {
      retourner this.value
    }
  }

})

SVG.extend (SVG.FX, {
  // Ajouter des attributs animables
  attr: fonction (a, v, relative) {
    // applique les attributs individuellement
    if (typeof a == 'objet') {
      pour (clé var dans a)
        this.attr (clé, une [clé])

    } autre {
      this.add (a, v, 'attrs')
    }

    retourner cette
  }
  // Ajouter des styles animables
, style: fonction (s, v) {
    if (typeof s == 'objet')
      pour (clé var en s)
        this.style (clé, s [clé])

    autre
      this.add (s, v, 'styles')

    retourner cette
  }
  // axe des x animable
, x: fonction (x, relative) {
    if (this.target () instanceof de SVG.G) {
      this.transform ({x: x}, relatif)
      retourner cette
    }

    var num = new SVG.Number (x)
    num.relative = relative
    renvoie this.add ('x', num)
  }
  // axe y animable
, y: fonction (y, relative) {
    if (this.target () instanceof de SVG.G) {
      this.transform ({y: y}, relatif)
      retourner cette
    }

    var num = new SVG.Number (y)
    num.relative = relative
    renvoyer this.add ('y', num)
  }
  // axe des x centre animable
, cx: fonction (x) {
    return this.add ('cx', nouveau SVG.Number (x))
  }
  // axe y centre animable
, cy: fonction (y) {
    renvoyer this.add ('cy', nouveau SVG.Number (y))
  }
  // Ajouter un mouvement animable
, déplacer: fonction (x, y) {
    retourne this.x (x) .y (y)
  }
  // Ajouter un centre animable
, centre: fonction (x, y) {
    retourne this.cx (x) .cy (y)
  }
  // Ajouter une taille animable
, taille: fonction (largeur, hauteur) {
    if (this.target () instanceof de SVG.Text) {
      // animer la taille de la police pour les éléments de texte
      this.attr ('font-size', largeur)

    } autre {
      // animer la taille basée sur bbox pour tous les autres éléments
      boîte de var

      si (! width ||! height) {
        box = this.target (). bbox ()
      }

      si (! largeur) {
        width = box.width / box.height * height
      }

      si (! hauteur) {
        height = box.height / box.width * width
      }

      this.add ('width', nouveau SVG.Number (width))
          .add ('height', nouveau SVG.Number (height))

    }

    retourner cette
  }
  // Ajouter une largeur pouvant être animée
, largeur: fonction (largeur) {
    renvoie this.add ('width', nouveau SVG.Number (width))
  }
  // Ajouter une hauteur animable
, hauteur: fonction (hauteur) {
    renvoyer this.add ('height', nouveau SVG.Number (height))
  }
  // Ajouter une parcelle animable
, tracé: fonction (a, b, c, d) {
    // Les lignes peuvent être tracées avec 4 arguments
    if (arguments.length == 4) {
      retourne this.plot ([a, b, c, d])
    }

    renvoie this.add ('plot', new (this.target (). morphArray) (a))
  }
  // Ajouter une méthode principale
, en tête: fonction (valeur) {
    Renvoie this.target (). conduisant?
      this.add ('Leading', nouveau SVG.Number (valeur)):
      ce
  }
  // Ajouter un viewbox animable
, viewbox: fonction (x, y, largeur, hauteur) {
    if (this.target () instanceof de SVG.Container) {
      this.add ('viewbox', nouveau SVG.ViewBox (x, y, largeur, hauteur))
    }

    retourner cette
  }
, mise à jour: fonction (o) {
    if (this.target () instanceof de SVG.Stop) {
      if (typeof o == 'numéro' || o instance de SVG.Number) {
        return this.update ({
          offset: arguments [0]
        , couleur: arguments [1]
        , opacité: arguments [2]
        })
      }

      if (o.opacity! = null) this.attr ('stop-opacity', o.opacity)
      if (o.color! = null) this.attr ('stop-color', o.color)
      if (o.offset! = null) this.attr ('offset', o.offset)
    }

    retourner cette
  }
})

SVG.Box = SVG.invent ({
  create: function (x, y, largeur, hauteur) {
    if (typeof x == 'object' &&! (x instanceof SVG.Element)) {
      // chromes getBoundingClientRect n'a pas de propriété x et y
      return SVG.Box.call (this, x.left! = null? x.left: xx, x.top! = null? x.top: xy, x.width, x.height)
    } else if (arguments.length == 4) {
      this.x = x
      this.y = y
      this.width = width
      this.height = height
    }

    // ajoute centre, droite, bas ...
    fullBox (cette)
  }
, étendre: {
    // Fusionner rect box avec un autre, renvoyer une nouvelle instance
    fusion: fonction (boîte) {
      var b = new this.constructor ()

      // fusionne des boites
      bx = Math.min (this.x, box.x)
      par = Math.min (this.y, box.y)
      b.width = Math.max (this.x + this.width, box.x + box.width) - bx
      b.height = Math.max (this.y + this.height, box.y + box.height) - par

      retourne fullBox (b)
    }

  , transformer: fonction (m) {
      var xMin = Infini, xMax = -Infinity, yMin = Infini, yMax = -Infinity, p, bbox

      var pts = [
        nouveau SVG.Point (this.x, this.y),
        nouveau SVG.Point (this.x2, this.y),
        nouveau SVG.Point (this.x, this.y2),
        nouveau SVG.Point (this.x2, this.y2)
      ]

      pts.forEach (fonction (p) {
        p = transformée (m)
        xMin = Math.min (xMin, px)
        xMax = Math.max (xMax, px)
        yMin = Math.min (yMin, py)
        yMax = Math.max (yMax, py)
      })

      bbox = new this.constructor ()
      bbox.x = xMin
      bbox.width = xMax-xMin
      bbox.y = ymin
      bbox.height = yMax-yMin

      fullBox (bbox)

      retourner bbox
    }
  }
})

SVG.BBox = SVG.invent ({
  // initialiser
  créer: fonction (élément) {
    SVG.Box.apply (this, [] .slice.call (arguments))

    // obtient des valeurs si l'élément est donné
    if (élément instanceof de SVG.Element) {
      boîte de var

      // oui c'est moche, mais Firefox peut être une douleur quand il s'agit d'éléments qui ne sont pas encore rendus
      essayer {

        if (! document.documentElement.contains) {
          // Ceci est IE - il ne supporte pas contient () pour les SVG de haut niveau
          var topParent = element.node
          while (topParent.parentNode) {
            topParent = topParent.parentNode
          }
          si (topParent! = document) lance une nouvelle exception ('Element not in the dom')
        } autre {
          // l'élément n'est PAS dans le dom, erreur de projection
          if (! document.documentElement.contains (element.node)) lève une nouvelle exception ('Element not in the dom')
        }

        // trouve la bbox native
        box = element.node.getBBox ()
      } catch (e) {
        if (élément instanceof de SVG.Shape) {
          var clone = element.clone (SVG.parser.draw.instance) .show ()
          box = clone.node.getBBox ()
          clone.remove ()
        }autre{
          box = {
            x: element.node.clientLeft
          , y: element.node.clientTop
          , width: element.node.clientWidth
          , height: element.node.clientHeight
          }
        }
      }

      SVG.Box.call (this, box)
    }

  }

  // Définir l'ancêtre
, hériter: SVG.Box

  // Définir le parent
, parent: SVG.Element

  // constructeur
, construit: {
    // Obtient un cadre de sélection
    bbox: function () {
      retourne la nouvelle SVG.BBox (this)
    }
  }

})

SVG.BBox.prototype.constructor = SVG.BBox


SVG.extend (SVG.Element, {
  tbox: function () {
    console.warn ('L'utilisation de TBox est obsolète et mappée à RBox. Utilisez plutôt .rbox ().')
    retourne this.rbox (this.doc ())
  }
})

SVG.R Box = SVG.invent ({
  // initialiser
  créer: fonction (élément) {
    SVG.Box.apply (this, [] .slice.call (arguments))

    if (élément instanceof de SVG.Element) {
      SVG.Box.call (this, element.node.getBoundingClientRect ())
    }
  }

, hériter: SVG.Box

  // définir le parent
, parent: SVG.Element

, étendre: {
    addOffset: function () {
      // décalage par la position de défilement de la fenêtre, car getBoundingClientRect change lorsque la fenêtre est défilée
      this.x + = window.pageXOffset
      this.y + = window.pageYOffset
      retourner cette
    }
  }

  // constructeur
, construit: {
    // Obtient rect box
    rbox: fonction (el) {
      if (el) retourne une nouvelle SVG.RBox (this) .transform (el.screenCTM (). inverse ())
      retourne une nouvelle SVG.RBox (this) .addOffset ()
    }
  }

})

SVG.RBox.prototype.constructor = SVG.RBox

SVG.Matrix = SVG.invent ({
  // initialiser
  créer: fonction (source) {
    var i, base = arrayToMatrix ([1, 0, 0, 1, 0, 0])

    // assure la source en tant qu'objet
    source = instance source de SVG.Element?
      source.matrixify ():
    typeof source === 'chaîne'?
      arrayToMatrix (source.split (SVG.regex.delimiter) .map (parseFloat)):
    arguments.length == 6?
      arrayToMatrix ([]. slice.call (arguments)):
    Array.isArray (source)?
      arrayToMatrix (source):
    typeof source === 'objet'?
      source: base

    // fusionne le source
    pour (i = abcdef.length - 1; i> = 0; --i)
      ceci [abcdef [i]] = source [abcdef [i]]! = null?
        source [abcdef [i]]: base [abcdef [i]]
  }

  // Ajout de méthodes
, étendre: {
    // Extraire les transformations individuelles
    extrait: fonction () {
      // recherche des points de transformation delta
      var px = deltaTransformPoint (this, 0, 1)
        , py = deltaTransformPoint (this, 1, 0)
        , skewX = 180 / Math.PI * Math.atan2 (px.y, px.x) - 90

      revenir {
        // Traduction
        x: this.e
      , y: this.f
      , transformerX: (this.e * Math.cos (skewX * Math.PI / 180) + this.f * Math.sin (skewX * Math.PI / 180)) / Math.sqrt (this.a * this.a + this.b * this.b)
      , transformerY: (this.f * Math.cos (skewX * Math.PI / 180) + this.e * Math.sin (-skewX * Math.PI / 180)) / Math.sqrt (this.c * this. c + this.d * this.d)
        // oblique
      , skewX: -skewX
      , skew: 180 / Math.PI * Math.atan2 (py.y, py.x)
        // échelle
      , scaleX: Math.sqrt (this.a * this.a + this.b * this.b)
      , scaleY: Math.sqrt (this.c * this.c + this.d * this.d)
        // rotation
      , rotation: skewX
      , a: this.a
      , b: this.b
      , c: this.c
      , d: this.d
      , e: this.e
      , f: ceci.f
      , matrice: nouvelle SVG.Matrix (this)
      }
    }
    // matrice de clonage
  , clone: ​​function () {
      retourne une nouvelle SVG.Matrix (this)
    }
    // Morph une matrice dans une autre
  , morph: fonction (matrice) {
      // stocker une nouvelle destination
      this.destination = new SVG.Matrix (matrice)

      retourner cette
    }
    // Obtenir la matrice morphée à une position donnée
  , à: fonction (pos) {
      // s'assure qu'une destination est définie
      si (! this.destination) retourne ce

      // calcule la matrice morphée à une position donnée
      var matrix = new SVG.Matrix ({
        a: this.a + (this.destination.a - this.a) * pos
      , b: this.b + (this.destination.b - this.b) * pos
      , c: this.c + (this.destination.c - this.c) * pos
      , d: this.d + (this.destination.d - this.d) * pos
      , e: this.e + (this.destination.e - this.e) * pos
      , f: this.f + (this.destination.f - this.f) * pos
      })

      matrice de retour
    }
    // Multiplie par matrice donnée
  , multiplie: fonction (matrice) {
      retourne une nouvelle SVG.Matrix (this.native (). multiply (parseMatrix (matrix) .native ()))
    }
    // matrice inversée
  , fonction inverse() {
      retourne SVG.Matrix (this.native (). inverse ())
    }
    // Traduire la matrice
  , traduisons: fonction (x, y) {
      retourne la nouvelle SVG.Matrix (this.native (). translate (x || 0, y || 0))
    }
    // matrice d'échelle
  , scale: function (x, y, cx, cy) {
      // supporte l'échelle uniforme
      if (arguments.length == 1) {
        y = x
      } else if (arguments.length == 3) {
        cy = cx
        cx = y
        y = x
      }

      renvoyer this.around (cx, cy, nouveau SVG.Matrix (x, 0, 0, y, 0, 0))
    }
    // Rotation de la matrice
  , rotation: fonction (r, cx, cy) {
      // convertir des degrés en radians
      r = SVG.utils.radians (r)

      renvoyer this.around (cx, cy, nouveau SVG.Matrix (Math.cos (r), Math.sin (r), -Math.sin (r), Math.cos (r), 0, 0))
    }
    // Flip matrice sur x ou y, à un décalage donné
  , retourner: fonction (a, o) {
      retourne un == 'x'?
          cette.échelle (-1, 1, o, 0):
        a == 'y'?
          cette.échelle (1, -1, 0, o):
          this.scale (-1, -1, a, o! = null? o: a)
    }
    // oblique
  , oblique: fonction (x, y, cx, cy) {
      // supporte l'inclinaison uniforme
      if (arguments.length == 1) {
        y = x
      } else if (arguments.length == 3) {
        cy = cx
        cx = y
        y = x
      }

      // convertir des degrés en radians
      x = SVG.utils.radians (x)
      y = SVG.utils.radians (y)

      return this.around (cx, cy, nouveau SVG.Matrix (1, Math.tan (y), Math.tan (x), 1, 0, 0))
    }
    // SkewX
  , skewX: fonction (x, cx, cy) {
      retourne this.skew (x, 0, cx, cy)
    }
    // Skew
  , skew: fonction (y, cx, cy) {
      retourne this.skew (0, y, cx, cy)
    }
    // Transformer autour d'un point central
  , autour de: fonction (cx, cy, matrice) {
      retourner cette
        .multiply (nouveau SVG.Matrix (1, 0, 0, 1, cx || 0, cy || 0))
        .multiply (matrice)
        .multiply (nouveau SVG.Matrix (1, 0, 0, 1, -cx || 0, -cy || 0))
    }
    // Conversion en SVGMatrix natif
  , native: function () {
      // crée une nouvelle matrice
      var matrix = SVG.parser.native.createSVGMatrix ()

      // mise à jour avec les valeurs actuelles
      pour (var i = abcdef.length - 1; i> = 0; i--)
        matrice [abcdef [i]] = ceci [abcdef [i]]

      matrice de retour
    }
    // Convertit la matrice en chaîne
  , toString: function () {
      // Construit la matrice directement, évite les valeurs trop petites
      return 'matrix (' + float32String (this.a) + ',' + float32String (this.b)
        + ',' + float32String (this.c) + ',' + float32String (this.d)
        + ',' + float32String (this.e) + ',' + float32String (this.f)
        + ')'
    }
  }

  // Définir le parent
, parent: SVG.Element

  // Ajouter une méthode parente
, construit: {
    // Obtenir la matrice actuelle
    ctm: function () {
      retourne un nouveau SVG.Matrix (this.node.getCTM ())
    },
    // Obtenir la matrice d'écran actuelle
    screenCTM: function () {
      / * https://bugzilla.mozilla.org/show_bug.cgi?id=1344537
         Cela est nécessaire car FF ne renvoie pas la matrice de transformation
         pour le système de coordonnées interne lorsque getScreenCTM () est appelé sur des svgs imbriqués.
         Cependant, tous les autres navigateurs le font * /
      if (cette instance de SVG.Nested) {
        var rect = this.rect (1,1)
        var m = rect.node.getScreenCTM ()
        rect.remove ()
        retourne le nouveau SVG.Matrix (m)
      }
      retourne SVG.Matrix (this.node.getScreenCTM ())
    }

  }

})

SVG.Point = SVG.invent ({
  // initialiser
  créer: fonction (x, y) {
    var i, source, base = {x: 0, y: 0}

    // assure la source en tant qu'objet
    source = Array.isArray (x)?
      {x: x [0], y: x [1]}:
    typeof x === 'objet'?
      {x: xx, y: xy}:
    x! = null?
      {x: x, y: (y! = null? y: x)}: base // Si y n'a pas de valeur, alors x est utilisé a sa valeur

    // fusionne le source
    this.x = source.x
    this.y = source.y
  }

  // Ajout de méthodes
, étendre: {
    // point de clonage
    clone: ​​function () {
      retourne un nouveau SVG.Point (this)
    }
    // Morph un point dans un autre
  , morph: fonction (x, y) {
      // stocker une nouvelle destination
      this.destination = new SVG.Point (x, y)

      retourner cette
    }
    // Obtenir le point morphé à une position donnée
  , à: fonction (pos) {
      // s'assure qu'une destination est définie
      si (! this.destination) retourne ce

      // calcule la matrice morphée à une position donnée
      var point = new SVG.Point ({
        x: this.x + (this.destination.x - this.x) * pos
      , y: this.y + (this.destination.y - this.y) * pos
      })

      point de retour
    }
    // Conversion en SVGPoint natif
  , native: function () {
      // crée un nouveau point
      var point = SVG.parser.native.createSVGPoint ()

      // mise à jour avec les valeurs actuelles
      point.x = this.x
      point.y = this.y

      point de retour
    }
    // point de transformation avec matrice
  , transformer: fonction (matrice) {
      retourne le nouveau SVG.Point (this.native (). matrixTransform (matrix.native ()))
    }

  }

})

SVG.extend (SVG.Element, {

  // Obtenir un point
  point: fonction (x, y) {
    retourne SVG.Point (x, y) .transform (this.screenCTM (). inverse ());
  }

})

SVG.extend (SVG.Element, {
  // Définir l'attribut d'élément svg
  attr: fonction (a, v, n) {
    // agit comme un getter complet
    if (a == null) {
      // obtenir un objet d'attributs
      a = {}
      v = this.node.attributes
      pour (n = longueur v - 1; n> = 0; n -)
        a [v [n] .nodeName] = SVG.regex.isNumber.test (v [n] .nodeValue)? parseFloat (v [n] .nodeValue): v [n] .nodeValue

      retourner un

    } else if (typeof a == 'objet') {
      // applique chaque attribut individuellement si un objet est passé
      pour (v dans a) this.attr (v, a [v])

    } sinon si (v === null) {
        // supprime la valeur
        this.node.removeAttribute (a)

    } sinon si (v == null) {
      // agit comme un getter si le premier et unique argument n'est pas un objet
      v = this.node.getAttribute (a)
      renvoyer v == null?
        SVG.defaults.attrs [a]:
      SVG.regex.isNumber.test (v)?
        parseFloat (v): v

    } autre {
      // CORRECTION DE BOGUE: certains navigateurs rendront un trait si une couleur est donnée même si la largeur du trait est 0
      if (a == 'largeur de trait')
        this.attr ('stroke', parseFloat (v)> 0? this._stroke: null)
      sinon si (a == 'accident vasculaire cérébral')
        this._stroke = v

      // convertit le remplissage et le contour d'image en motifs
      if (a == 'fill' || a == 'stroke') {
        if (SVG.regex.isImage.test (v))
          v = this.doc (). defs (). image (v, 0, 0)

        if (v instanceof SVG.Image)
          v = this.doc (). defs (). pattern (0, 0, function () {
            this.add (v)
          })
      }

      // assure des valeurs numériques correctes (accepte également NaN et Infinity)
      if (typeof v === 'numéro')
        v = nouveau SVG.Number (v)

      // assure la couleur hexagonale complète
      else if (SVG.Color.isColor (v))
        v = nouveau SVG.Color (v)

      // analyse les valeurs d'un tableau
      else if (Array.isArray (v))
        v = nouveau SVG.Array (v)

      // si l'attribut passé est en tête ...
      if (a == 'en tête') {
        // ... appelle la méthode principale à la place
        si (ceci.leading)
          this.leading (v)
      } autre {
        // set attribut donné sur le noeud
        typeof n === 'chaîne'?
          this.node.setAttributeNS (n, a, v.toString ()):
          this.node.setAttribute (a, v.toString ())
      }

      // reconstruit si nécessaire
      if (this.rebuild && (a == 'taille de la police' || a == 'x'))
        this.rebuild (a, v)
    }

    retourner cette
  }
})
SVG.extend (SVG.Element, {
  // Ajouter des transformations
  transformer: fonction (o, relative) {
    // get target dans le cas du module fx, sinon référencez ceci
    var cible = this
      , matrice, bbox

    // agir comme un getter
    if (typeof o! == 'objet') {
      // obtenir la matrice actuelle
      matrice = nouveau SVG.Matrix (cible) .extract ()

      retourne typeof o === 'chaîne'? matrice [o]: matrice
    }

    // obtenir la matrice actuelle
    matrice = nouveau SVG.Matrix (cible)

    // assure l'indicateur relatif
    relative = !! relative || !! o.relative

    // agir sur la matrice
    si (oa! = null) {
      matrice = relative?
        // relatif
        matrix.multiply (nouveau SVG.Matrix (o)):
        // absolu
        nouveau SVG.Matrix (o)

    // agir en rotation
    } else if (o.rotation! = null) {
      // assure le point central
      EnsureCentre (o, cible)

      // appliquer la transformation
      matrice = relative?
        // relatif
        matrix.rotate (o.rotation, o.cx, o.cy):
        // absolu
        matrix.rotate (o.rotation - matrix.extract (). rotation, o.cx, o.cy)

    // agir à l'échelle
    } else if (o.scale! = null || o.scaleX! = null || o.scaleY! = null) {
      // assure le point central
      EnsureCentre (o, cible)

      // assure les valeurs d'échelle sur les deux axes
      o.scaleX = o.scale! = null? o.scale: o.scaleX! = null? o.scaleX: 1
      o.scaleY = o.scale! = null? o.scale: o.scaleY! = null? échelle: 1

      si (! parent) {
        // absolu; multiplier les valeurs inversées
        var e = matrix.extract ()
        o.scaleX = o.scaleX * 1 / e.scaleX
        o.scaleY = o.scaleY * 1 / e.scaleY
      }

      matrix = matrix.scale (o.scaleX, o.scaleY, o.cx, o.cy)

    // agit en biais
    } else if (o.skew! = null || o.skewX! = null || o.skewY! = null) {
      // assure le point central
      EnsureCentre (o, cible)

      // assure des valeurs asymétriques sur les deux axes
      o.skewX = o.skew! = null? o.skew: o.skewX! = null? o.skewX: 0
      o.skewY = o.skew! = null? o.skew: o.skewY! = null? o.skewY: 0

      si (! parent) {
        // absolu; réinitialiser les valeurs d'inclinaison
        var e = matrix.extract ()
        matrix = matrix.multiply (nouveau SVG.Matrix (). skew (e.skewX, e.skewY, o.cx, o.cy) .inverse ())
      }

      matrix = matrix.skew (o.skewX, o.skewY, o.cx, o.cy)

    // agir sur le flip
    } sinon si (o.flip) {
      if (o.flip == 'x' || | o.flip == 'y') {
        o.offset = o.offset == null? target.bbox () ['c' + o.flip]: o.offset
      } autre {
        if (o.offset == null) {
          bbox = target.bbox ()
          o.flip = bbox.cx
          o.offset = bbox.cy
        } autre {
          o.flip = o.offset
        }
      }

      matrice = nouveau SVG.Matrix (). flip (o.flip, o.offset)

    // agir sur traduire
    } sinon si (ox! = null || oy! = null) {
      si (relatif) {
        // relatif
        matrix = matrix.translate (ox, oy)
      } autre {
        // absolu
        si (ox! = null) matrice.e = ox
        si (oy! = null) matrice.f = oy
      }
    }

    retourne this.attr ('transform', matrice)
  }
})

SVG.extend (SVG.FX, {
  transformer: fonction (o, relative) {
    // get target dans le cas du module fx, sinon référencez ceci
    var cible = this.target ()
      , matrice, bbox

    // agir comme un getter
    if (typeof o! == 'objet') {
      // obtenir la matrice actuelle
      matrice = nouveau SVG.Matrix (cible) .extract ()

      retourne typeof o === 'chaîne'? matrice [o]: matrice
    }

    // assure l'indicateur relatif
    relative = !! relative || !! o.relative

    // agir sur la matrice
    si (oa! = null) {
      matrice = nouveau SVG.Matrix (o)

    // agir en rotation
    } else if (o.rotation! = null) {
      // assure le point central
      EnsureCentre (o, cible)

      // appliquer la transformation
      matrice = nouveau SVG.Rotate (o.rotation, o.cx, o.cy)

    // agir à l'échelle
    } else if (o.scale! = null || o.scaleX! = null || o.scaleY! = null) {
      // assure le point central
      EnsureCentre (o, cible)

      // assure les valeurs d'échelle sur les deux axes
      o.scaleX = o.scale! = null? o.scale: o.scaleX! = null? o.scaleX: 1
      o.scaleY = o.scale! = null? o.scale: o.scaleY! = null? échelle: 1

      matrix = new SVG.Scale (o.scaleX, o.scaleY, o.cx, o.cy)

    // agit en biais
    } else if (o.skewX! = null || o.skewY! = null) {
      // assure le point central
      EnsureCentre (o, cible)

      // assure des valeurs asymétriques sur les deux axes
      o.skewX = o.skewX! = null? o.skewX: 0
      o.skewY = o.skewY! = null? o.skewY: 0

      matrice = nouvelle SVG.Skew (o.skewX, o.skewY, o.cx, o.cy)

    // agir sur le flip
    } sinon si (o.flip) {
      if (o.flip == 'x' || | o.flip == 'y') {
        o.offset = o.offset == null? target.bbox () ['c' + o.flip]: o.offset
      } autre {
        if (o.offset == null) {
          bbox = target.bbox ()
          o.flip = bbox.cx
          o.offset = bbox.cy
        } autre {
          o.flip = o.offset
        }
      }

      matrice = nouveau SVG.Matrix (). flip (o.flip, o.offset)

    // agir sur traduire
    } sinon si (ox! = null || oy! = null) {
      matrice = nouveau SVG.Translate (ox, oy)
    }

    si (! matrix) retourne cette

    matrice.relatif = relatif

    this.last (). transforms.push (matrice)

    retourne this._callStart ()
  }
})

SVG.extend (SVG.Element, {
  // Réinitialiser toutes les transformations
  untransform: function () {
    return this.attr ('transform', null)
  },
  // fusionne toute la chaîne de transformation en une matrice et la renvoie
  matrice: fonction () {

    var matrix = (this.attr ('transform') || '')
      // fractionnement des transformations
      .split (SVG.regex.transforms) .slice (0, -1) .map (function (str) {
        // générer des paires clé => valeur
        var kv = str.trim (). split ('(')
        return [kv [0], kv [1] .split (SVG.regex.delimiter) .map (function (str) {return parseFloat (str)})]
      })
      // fusionne chaque transformation en une matrice
      .reduce (function (matrix, transform)) {

        if (transform [0] == 'matrix') renvoie matrix.multiply (arrayToMatrix (transform [1]))
        return matrix [transform [0]]. apply (matrice, transformation [1])

      }, nouveau SVG.Matrix ())

    matrice de retour
  },
  // ajoute un élément à un autre parent sans changer la représentation visuelle à l'écran
  toParent: function (parent) {
    si (ce == parent) retourne cette
    var ctm = this.screenCTM ()
    var pCtm = parent.screenCTM (). inverse ()

    this.addTo (parent) .untransform (). transform (pCtm.multiply (ctm))

    retourner cette
  },
  // comme ci-dessus avec parent égal à root-svg
  toDoc: function () {
    renvoyer this.toParent (this.doc ())
  }

})

SVG.Transformation = SVG.invent ({

  create: function (source, inversed) {

    if (arguments.length> 1 && typeof inversed! = 'boolean') {
      retourne this.constructor.call (this, [] .slice.call (arguments))
    }

    if (Array.isArray (source)) {
      pour (var i = 0, len = this.arguments.length; i <len; ++ i) {
        this [this.arguments [i]] = source [i]
      }
    } else if (typeof source == 'objet') {
      pour (var i = 0, len = this.arguments.length; i <len; ++ i) {
        this [this.arguments [i]] = source [this.arguments [i]]
      }
    }

    this.inversed = false

    si (inversé === vrai) {
      this.inversed = true
    }

  }

, étendre: {

    arguments: []
  , méthode: ''

  , à: fonction (pos) {

      var params = []

      pour (var i = 0, len = this.arguments.length; i <len; ++ i) {
        params.push (this [this.arguments [i]])
      }

      var m = this._undo || nouveau SVG.Matrix ()

      m = new SVG.Matrix (). morph (SVG.Matrix.prototype [this.method] .apply (m, params)). at (pos)

      retourner this.inversed? m.inverse (): m

    }

  , annuler: fonction (o) {
      pour (var i = 0, len = this.arguments.length; i <len; ++ i) {
        o [this.arguments [i]] = type de this [this.arguments [i]] == 'non défini'? 0: o [this.arguments [i]]
      }

      // La méthode SVG.Matrix.extract utilisée avant l'appelant
      // méthode pour obtenir une valeur pour le paramètre o ne retourne pas un cx et
      // a cy donc on utilise ceux qui ont été fournis à cet objet lors de sa création
      o.cx = this.cx
      o.cy = this.cy

      this._undo = new SVG [capitalize (this.method)] (o, true) .at (1)

      retourner cette
    }

  }

})

SVG.Translate = SVG.invent ({

  parent: SVG.Matrix
, hériter: SVG.Transformation

, crée: fonction (source, inversée) {
    this.constructor.apply (this, [] .slice.call (arguments))
  }

, étendre: {
    arguments: ['transformX', 'transformerY']
  , méthode: 'traduire'
  }

})

SVG.Rotate = SVG.invent ({

  parent: SVG.Matrix
, hériter: SVG.Transformation

, crée: fonction (source, inversée) {
    this.constructor.apply (this, [] .slice.call (arguments))
  }

, étendre: {
    arguments: ['rotation', 'cx', 'cy']
  , méthode: 'tourne'
  , à: fonction (pos) {
      var m = new SVG.Matrix (). rotation (new SVG.Number (). morph (this.rotation - (this._undo? this._undo.rotation: 0)). at (pos), this.cx, this .cy)
      retourner this.inversed? m.inverse (): m
    }
  , annuler: fonction (o) {
      this._undo = o
      retourner cette
    }
  }

})

SVG.Scale = SVG.invent ({

  parent: SVG.Matrix
, hériter: SVG.Transformation

, crée: fonction (source, inversée) {
    this.constructor.apply (this, [] .slice.call (arguments))
  }

, étendre: {
    arguments: ['scaleX', 'scaleY', 'cx', 'cy']
  , méthode: 'échelle'
  }

})

SVG.Skew = SVG.invent ({

  parent: SVG.Matrix
, hériter: SVG.Transformation

, crée: fonction (source, inversée) {
    this.constructor.apply (this, [] .slice.call (arguments))
  }

, étendre: {
    arguments: ['skewX', 'skewY', 'cx', 'cy']
  , méthode: 'oblique'
  }

})

SVG.extend (SVG.Element, {
  // Générateur de style dynamique
  style: fonction (s, v) {
    if (arguments.length == 0) {
      // avoir le style complet
      Renvoie this.node.style.cssText || ''

    } else if (arguments.length <2) {
      // applique chaque style individuellement si un objet est passé
      if (typeof s == 'objet') {
        pour (v dans s) this.style (v, s [v])

      } else if (SVG.regex.isCss.test (s)) {
        // analyse la chaîne css
        s = s.split (/ \ s *; \ s * /)
          // filtrer le suffixe; et des trucs comme ;;
          .filter (function (e) {return !! e})
          .map (fonction (e) {retourne e.split (/ \ s *: \ s * /)})

        // applique chaque définition individuellement
        tandis que (v = s.pop ()) {
          this.style (v [0], v [1])
        }
      } autre {
        // agit comme un getter si le premier et unique argument n'est pas un objet
        retourne this.node.style [camelCase (s)]
      }

    } autre {
      this.node.style [camelCase (s)] = v === null || SVG.regex.isBlank.test (v)? '': v
    }

    retourner cette
  }
})
SVG.Parent = SVG.invent ({
  // Initialize node
  créer: fonction (élément) {
    this.constructor.call (this, element)
  }

  // Hériter de
, hérite: SVG.Element

  // Ajout de méthodes de classe
, étendre: {
    // retourne tous les éléments enfants
    enfants: fonction () {
      return SVG.utils.map (SVG.utils.filterSVGElements (this.node.childNodes), fonction (noeud) {
        retourne SVG.adopt (noeud)
      })
    }
    // Ajouter un élément donné à une position
  , ajouter: fonction (élément, i) {
      si (i == null)
        this.node.appendChild (element.node)
      else if (element.node! = this.node.childNodes [i])
        this.node.insertBefore (element.node, this.node.childNodes [i])

      retourner cette
    }
    // Fait fondamentalement la même chose que `add ()` mais renvoie l'élément ajouté
  , put: fonction (élément, i) {
      this.add (élément, i)
      élément de retour
    }
    // Vérifie si l'élément donné est un enfant
  , a: fonction (élément) {
      retourne this.index (element)> = 0
    }
    // Obtient l'index d'un élément donné
  , index: fonction (élément) {
      return [] .slice.call (this.node.childNodes) .indexOf (element.node)
    }
    // Obtenir un élément à l'index donné
  , obtenez: fonction (i) {
      retourne SVG.adopt (this.node.childNodes [i])
    }
    // Premier enfant
  , d'abord: function () {
      retourner this.get (0)
    }
    // Récupère le dernier enfant
  , dernier: function () {
      return this.get (this.node.childNodes.length - 1)
    }
    // Itère sur tous les enfants et invoque un bloc donné
  , each: function (block, deep) {
      var i, il
        , enfants = this.children ()

      pour (i = 0, il = children.length; i <il; i ++) {
        if (enfants [i] instance de SVG.Element)
          block.apply (enfants [i], [i, enfants])

        if (deep && (enfants [i] instance de SVG.Container))
          enfants [i] .each (bloc, profond)
      }

      retourner cette
    }
    // Supprimer un enfant donné
  , removeElement: function (element) {
      this.node.removeChild (element.node)

      retourner cette
    }
    // Supprimer tous les éléments de ce conteneur
  , clear: function () {
      // enlève les enfants
      while (this.node.hasChildNodes ())
        this.node.removeChild (this.node.lastChild)

      // enlève la référence à defs
      supprimer this._defs

      retourner cette
    }
  , // Get defs
    defs: function () {
      Renvoie this.doc (). defs ()
    }
  }

})

SVG.extend (SVG.Parent, {

  dissocier: fonction (parent, profondeur) {
    if (profondeur === 0 || cette instance de SVG.Defs || this.node == SVG.parser.draw) renvoie ceci

    parent = parent || (cette instance de SVG.Doc? this: this.parent (SVG.Parent))
    profondeur = profondeur || Infini

    this.each (function () {
      if (cette instance de SVG.Defs) retourne ceci
      if (cette instance de SVG.Parent) renvoie this.ungroup (parent, profondeur 1)
      renvoyer this.toParent (parent)
    })

    this.node.firstChild || this.remove ()

    retourner cette
  },

  aplatir: fonction (parent, profondeur) {
    Renvoie this.ungroup (parent, profondeur)
  }

})
SVG.Container = SVG.invent ({
  // Initialize node
  créer: fonction (élément) {
    this.constructor.call (this, element)
  }

  // Hériter de
, hérite: SVG.Parent

})

SVG.ViewBox = SVG.invent ({

  créer: fonction (source) {
    var i, base = [0, 0, 0, 0]

    var x, y, largeur, hauteur, boîte, vue, nous, il
      , wm = 1 // multiplicateur de largeur
      , hm = 1 // multiplicateur de hauteur
      , reg = /[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?e:++-???d=)

    if (instance source de SVG.Element) {

      nous = source
      il = source
      view = (source.attr ('viewBox') || '') .match (reg)
      box = source.bbox

      // récupère les dimensions du noeud actuel
      width = new SVG.Number (source.width ())
      height = new SVG.Number (source.height ())

      // recherche les dimensions non-pourcentales les plus proches
      while (width.unit == '%') {
        wm * = width.value
        width = new SVG.Number (une instance de SVG.Doc? we.parent (). offsetWidth: we.parent (). width ())
        nous = we.parent ()
      }
      while (height.unit == '%') {
        hm * = height.value
        height = new SVG.Number (il instance of SVG.Doc? he.parent (). offsetHeight: he.parent (). height ())
        il = il.parent ()
      }

      // assure les valeurs par défaut
      this.x = 0
      this.y = 0
      this.width = width * wm
      this.height = height * hm
      this.zoom = 1

      if (afficher) {
        // obtient la largeur et la hauteur de la zone de visualisation
        x = parseFloat (vue [0])
        y = parseFloat (vue [1])
        width = parseFloat (vue [2])
        height = parseFloat (vue [3])

        // calculer le zoom en fonction de la zone de visualisation
        this.zoom = ((this.width / this.height)> (width / height))?
          this.height / height:
          this.width / width

        // calcule les dimensions réelles en pixels de l'élément SVG.Doc parent
        this.x = x
        this.y = y
        this.width = width
        this.height = height

      }

    }autre{

      // assure la source en tant qu'objet
      source = typeof source === 'chaîne'?
        source.match (reg) .map (fonction (el) {return parseFloat (el)}):
      Array.isArray (source)?
        la source :
      typeof source == 'objet'?
        [source.x, source.y, source.width, source.height]:
      arguments.length == 4?
        [] .slice.call (arguments):
        base

      this.x = source [0]
      this.y = source [1]
      this.width = source [2]
      this.height = source [3]
    }


  }

, étendre: {

    toString: function () {
      renvoyer this.x + '' + this.y + '' + this.width + '' + this.height
    }
  , morph: fonction (x, y, largeur, hauteur) {
      this.destination = new SVG.ViewBox (x, y, largeur, hauteur)
      retourner cette
    }

  , à: fonction (pos) {

      si (! this.destination) retourne ce

      retourne la nouvelle SVG.ViewBox ([
          this.x + (this.destination.x - this.x) * pos
        , this.y + (this.destination.y - this.y) * pos
        , this.width + (this.destination.width - this.width) * pos
        , this.height + (this.destination.height - this.height) * pos
      ])

    }

  }

  // Définir le parent
, parent: SVG.Container

  // Ajouter une méthode parente
, construit: {

    // get / set viewbox
    viewbox: fonction (x, y, largeur, hauteur) {
      if (arguments.length == 0)
        // agit comme un getter s'il n'y a pas d'argument
        retourne la nouvelle SVG.ViewBox (this)

      // sinon agit comme un passeur
      return this.attr ('viewBox', nouveau SVG.ViewBox (x, y, largeur, hauteur))
    }

  }

})
// Ajout d'événements aux éléments

;[ 'Cliquez sur',
  'dblclick',
  'souris vers le bas',
  'mouseup',
  'passer la souris',
  'mouseout',
  'mousemove',
  'mouseenter',
  'mouseleave',
  «touchstart»,
  «touchmove»,
  'Touchleave',
  'touchend',
  'touchcancel'] .forEach (fonction (événement) {
    // ajouter un événement à SVG.Element
    SVG.Element.prototype [événement] = fonction (f) {
      // lie l'événement à l'élément plutôt qu'au nœud de l'élément
      if (f == null) {
        SVG.off (this, event)
      } autre {
        SVG.on (this, event, f)
      }
      retourner cette
    }
  })

SVG.listenerId = 0

// Ajouter un classeur d'événements dans l'espace de noms SVG
SVG.on = fonction (noeud, événements, écouteur, liaison, options) {
  var l = listener.bind (nœud de liaison ||)
  var n = instance de noeud SVG.Element? node.node: noeud

  // assure un objet instance pour les noeuds non adoptés
  n.instance = n.instance || {_événements: {}}

  var bag = n.instance._events

  // add id to listener
  if (! listener._svgjsListenerId) {listener._svgjsListenerId = ++ SVG.listenerId}

  events.split (SVG.regex.delimiter) .forEach (function (event) {
    var ev = event.split ('.') [0]
    var ns = event.split ('.') [1] || '*'

    // assure l'objet valide
    sac [ev] = sac [ev] || {}
    sac [ev] [ns] = sac [ev] [ns] || {}

    // écouteur de référence
    sac [ev] [ns] [écouteur._svgjsListenerId] = l

    // ajouter un auditeur
    n.addEventListener (ev, l, options || false)
  })
}

// Ajouter un unbinder d'événement dans l'espace de noms SVG
SVG.off = fonction (noeud, événements, écouteur, options) {
  var n = instance de noeud SVG.Element? node.node: noeud
  if (! n.instance) return

  // auditeur peut être une fonction ou un nombre
  if (typeof listener === 'fonction') {
    listener = listener._svgjsListenerId
    si (! auditeur) retourne
  }

  var bag = n.instance._events

  ; (events || '') .split (SVG.regex.delimiter) .forEach (function (event) {
    var ev = event && event.split ('.') [0]
    var ns = event && event.split ('.') [1]
    var namespace, l

    si (auditeur) {
      // supprime la référence de l'auditeur
      if (bag [ev] && bag [ev] [ns || '*']) {
        // removeListener
        n.removeEventListener (ev, sac [ev] [ns || '*'] [écouteur], options || faux)

        delete bag [ev] [ns || '*'][auditeur]
      }
    } else if (ev && ns) {
      // supprime tous les écouteurs pour un événement namespaced
      if (bag [ev] && bag [ev] [ns]) {
        pour (l dans le sac [ev] [ns]) {SVG.off (n, [ev, ns] .join ('.'), l)}

        supprimer le sac [ev] [ns]
      }
    } sinon si (ns) {
      // supprime tous les écouteurs pour un espace de noms spécifique
      pour (événement dans le sac) {
        for (espace de noms dans le sac [événement]) {
          if (ns === espace de noms) {SVG.off (n, [événement, ns] .join ('.'))}}
        }
      }
    } sinon si (ev) {
      // supprime tous les écouteurs pour l'événement
      si (sac [ev]) {
        for (espace de noms dans le dossier [ev]) {SVG.off (n, [ev, espace de noms] .join ('.'))}

        supprimer le sac [ev]
      }
    } autre {
      // supprime tous les écouteurs sur un noeud donné
      pour (événement dans le sac) {SVG.off (n, événement)}

      n.instance._events = {}
    }
  })
}

SVG.extend (SVG.Element, {
  // Lier un événement donné à l'auditeur
  on: fonction (événement, écouteur, liaison, options) {
    SVG.on (cet événement, auditeur, liaison, options)
    retourner cette
  },
  // Unbind event from listener
  off: fonction (événement, auditeur) {
    SVG.off (this.node, event, listener)
    retourner cette
  },
  feu: fonction (événement, données) {
    // événement de dispatch
    if (instance d'instance de window.Event) {
      this.node.dispatchEvent (event)
    } autre {
      this.node.dispatchEvent (événement = nouveau SVG.CustomEvent (événement, {détail: données, annulable: vrai}))
    }
    this._event = événement
    retourner cette
  },
  événement: function () {
    retourner this._event
  }
})


SVG.Defs = SVG.invent ({
  // Initialize node
  créer: 'defs'

  // Hériter de
, hériter: SVG.Container

})
SVG.G = SVG.invent ({
  // Initialize node
  créer: 'g'

  // Hériter de
, hériter: SVG.Container

  // Ajout de méthodes de classe
, étendre: {
    // Se déplacer sur l'axe des x
    x: fonction (x) {
      renvoyer x == null? this.transform ('x'): this.transform ({x: x - this.x ()}, true)
    }
    // Se déplacer sur l'axe des y
  , y: fonction (y) {
      retourne y == null? this.transform ('y'): this.transform ({y: y - this.y ()}, vrai)
    }
    // Se déplacer par centre sur l'axe des x
  , cx: fonction (x) {
      renvoyer x == null? this.gbox (). cx: this.x (x - this.gbox (). width / 2)
    }
    // Se déplacer par centre sur l'axe des y
  , cy: fonction (y) {
      retourne y == null? this.gbox (). cy: this.y (y - this.gbox (). height / 2)
    }
  , gbox: function () {

      var bbox = this.bbox ()
        , trans = this.transform ()

      bbox.x + = trans.x
      bbox.x2 + = trans.x
      bbox.cx + = trans.x

      bbox.y + = trans.y
      bbox.y2 + = trans.y
      bbox.cy + = trans.y

      retourner bbox
    }
  }

  // Ajouter une méthode parente
, construit: {
    // Créer un élément de groupe
    groupe: fonction () {
      renvoyer this.put (nouveau SVG.G)
    }
  }
})

SVG.Doc = SVG.invent ({
  // Initialize node
  créer: fonction (élément) {
    if (élément) {
      // assure la présence d'un élément dom
      element = typeof element == 'chaîne'?
        document.getElementById (element):
        élément

      // Si la cible est un élément svg, utilisez cet élément comme enveloppe principale.
      // Cela permet à svg.js de travailler avec des documents svg.
      if (element.nodeName == 'svg') {
        this.constructor.call (this, element)
      } autre {
        this.constructor.call (this, SVG.create ('svg'))
        element.appendChild (this.node)
        this.size ('100%', '100%')
      }

      // définit les attributs de l'élément svg et assure le noeud defs
      this.namespace (). defs ()
    }
  }

  // Hériter de
, hériter: SVG.Container

  // Ajout de méthodes de classe
, étendre: {
    // Ajouter des espaces de noms
    espace de noms: function () {
      retourner cette
        .attr ({xmlns: SVG.ns, version: '1.1'})
        .attr ('xmlns: xlink', SVG.xlink, SVG.xmlns)
        .attr ('xmlns: svgjs', SVG.svgjs, SVG.xmlns)
    }
    // Crée et retourne l'élément defs
  , defs: function () {
      si (! this._defs) {
        var defs

        // Trouver ou créer un élément defs dans cette instance
        if (defs = this.node.getElementsByTagName ('defs') [0])
          this._defs = SVG.adopt (defs)
        autre
          this._defs = new SVG.Defs

        // Assurez-vous que le nœud defs est à la fin de la pile
        this.node.appendChild (this._defs.node)
      }

      renvoyer this._defs
    }
    // méthode parent personnalisée
  , parent: function () {
      if (! this.node.parentNode || this.node.parentNode.nodeName == '#document' || this.node.parentNode.nodeName == '# document-fragment') renvoie la valeur null
      Renvoie this.node.parentNode
    }
    // Correction d'un possible décalage de sous-pixel. Voir:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=608812
  , spof: function () {
      var pos = this.node.getScreenCTM ()

      si (pos)
        ce
          .style ('left', (-pos.e% 1) + 'px')
          .style ('top', (-pos.f% 1) + 'px')

      retourner cette
    }

      // supprime la doc du DOM
  , supprimez: function () {
      if (this.parent ()) {
        this.parent (). removeChild (this.node)
      }

      retourner cette
    }
  , clear: function () {
      // enlève les enfants
      while (this.node.hasChildNodes ())
        this.node.removeChild (this.node.lastChild)

      // enlève la référence à defs
      supprimer this._defs

      // ajouter un analyseur
      si (! SVG.parser.draw.parentNode)
        this.node.appendChild (SVG.parser.draw)

      retourner cette
    }
  , clone: ​​fonction (parent) {
      // écrit les données dom sur le dom afin que le clone puisse les récupérer
      this.writeDataToDom ()

      // obtenir une référence au noeud
      var node = this.node

      // clone element et attribue un nouvel identifiant
      var clone = assignNewId (node.cloneNode (true))

      // insère le clone dans le parent donné ou après moi
      si (parent) {
        (parent.node || parent) .appendChild (clone.node)
      } autre {
        node.parentNode.insertBefore (clone.node, node.nextSibling)
      }

      retourne le clone
    }
  }

})

// ### Ce module ajoute une fonctionnalité de retour en arrière aux éléments.

//
SVG.extend (SVG.Element, {
  // Obtiens tous les frères et soeurs, y compris moi-même
  frères et soeurs: function () {
    Renvoie this.parent (). enfants ()
  }
  // Obtenir la position actuelle des frères et sœurs
, position: fonction () {
    Renvoie this.parent (). index (this)
  }
  // Récupère le prochain élément (retournera null s'il n'y en a pas)
, ensuite: function () {
    retourne this.siblings () [this.position () + 1]
  }
  // Récupère le prochain élément (retournera null s'il n'y en a pas)
, précédent: function () {
    retourne this.siblings () [this.position () - 1]
  }
  // Envoyer l'élément donné un pas en avant
, forward: function () {
    var i = this.position () + 1
      , p = this.parent ()

    // déplace le noeud d'un pas en avant
    p.removeElement (this) .add (this, i)

    // vérifie que le noeud defs est toujours au sommet
    if (p instanceof SVG.Doc)
      p.node.appendChild (p.defs (). noeud)

    retourner cette
  }
  // Envoyer l'élément donné un pas en arrière
, en arrière: function () {
    var i = this.position ()

    si (i> 0)
      this.parent (). removeElement (this) .add (this, i - 1)

    retourner cette
  }
  // Envoie un élément donné à l'avant
, avant: function () {
    var p = this.parent ()

    // Avancer le noeud
    p.node.appendChild (this.node)

    // Assurez-vous que le noeud defs est toujours au sommet
    if (p instanceof SVG.Doc)
      p.node.appendChild (p.defs (). noeud)

    retourner cette
  }
  // Envoie un élément donné à l'arrière
, retour: function () {
    if (this.position ()> 0)
      this.parent (). removeElement (this) .add (this, 0)

    retourner cette
  }
  // insère un élément donné avant l'élément ciblé
, avant: fonction (élément) {
    element.remove ()

    var i = this.position ()

    this.parent (). add (element, i)

    retourner cette
  }
  // Installe un élément donné après l'élément ciblé
, après: fonction (élément) {
    element.remove ()

    var i = this.position ()

    this.parent (). add (element, i + 1)

    retourner cette
  }

})
SVG.Mask = SVG.invent ({
  // Initialize node
  créer: fonction () {
    this.constructor.call (this, SVG.create ('masque'))

    // conserve les références aux éléments masqués
    this.targets = []
  }

  // Hériter de
, hériter: SVG.Container

  // Ajout de méthodes de classe
, étendre: {
    // Démasque tous les éléments masqués et se supprime
    remove: function () {
      // démasque toutes les cibles
      pour (var i = this.targets.length - 1; i> = 0; i--)
        if (this.targets [i])
          this.targets [i] .unmask ()
      this.targets = []

      // enlève le masque du parent
      SVG.Element.prototype.remove.call (this)

      retourner cette
    }
  }

  // Ajouter une méthode parente
, construit: {
    // Créer un élément de masquage
    masque: fonction () {
      renvoie this.defs (). put (nouveau SVG.Mask)
    }
  }
})


SVG.extend (SVG.Element, {
  // Distribuer le masque dans l'élément svg
  maskWith: function (element) {
    // utilise un masque donné ou en crée un nouveau
    this.masker = élément instance de SVG.Mask? element: this.parent (). mask (). add (element)

    // stocke la révérence sur soi dans un masque
    this.masker.targets.push (this)

    // appliquer un masque
    return this.attr ('masque', 'url ("#' + this.masker.attr ('id') + '")')
  }
  // Démasque l'élément
, démasquer: function () {
    supprimer this.masker
    Renvoie this.attr ('masque', null)
  }

})

SVG.ClipPath = SVG.invent ({
  // Initialize node
  créer: fonction () {
    this.constructor.call (this, SVG.create ('clipPath'))

    // conserve les références aux éléments découpés
    this.targets = []
  }

  // Hériter de
, hériter: SVG.Container

  // Ajout de méthodes de classe
, étendre: {
    // Déclipez tous les éléments écrêtés et supprimez-le
    remove: function () {
      // Déclipse toutes les cibles
      pour (var i = this.targets.length - 1; i> = 0; i--)
        if (this.targets [i])
          this.targets [i] .unclip ()
      this.targets = []

      // supprime clipPath du parent
      this.parent (). removeElement (this)

      retourner cette
    }
  }

  // Ajouter une méthode parente
, construit: {
    // Créer un élément de découpage
    clip: fonction () {
      renvoie this.defs (). put (nouveau SVG.ClipPath)
    }
  }
})

//
SVG.extend (SVG.Element, {
  // Distribuer clipPath à l'élément svg
  clipWith: fonction (élément) {
    // utilise un clip donné ou en crée un nouveau
    this.clipper = instance de SVG.ClipPath? element: this.parent (). clip (). add (element)

    // stocke la révérence sur soi dans un masque
    this.clipper.targets.push (this)

    // appliquer un masque
    return this.attr ('clip-path', 'url ("#' + this.clipper.attr ('id') + '")')
  }
  // Déclipper l'élément
, Déclipez: function () {
    supprimer this.clipper
    return this.attr ('clip-path', null)
  }

})
SVG.Gradient = SVG.invent ({
  // Initialize node
  créer: fonction (type) {
    this.constructor.call (this, SVG.create (type + 'Gradient'))

    // type de magasin
    this.type = type
  }

  // Hériter de
, hériter: SVG.Container

  // Ajout de méthodes de classe
, étendre: {
    // Ajouter un arrêt de couleur
    at: fonction (décalage, couleur, opacité) {
      renvoyer this.put (nouveau SVG.Stop) .update (offset, color, opacity)
    }
    // Mise à jour du dégradé
  , mise à jour: fonction (bloc) {
      // supprime tous les arrêts
      this.clear ()

      // invoquer le bloc passé
      if (typeof block == 'fonction')
        block.call (this, this)

      retourner cette
    }
    // retourne l'id de remplissage
  , remplissez: function () {
      retourne 'url (#' + this.id () + ')'
    }
    // Conversion de chaîne d'alias à remplir
  , toString: function () {
      retourne this.fill ()
    }
    // attr personnalisé pour gérer la transformation
  , attr: fonction (a, b, c) {
      if (a == 'transformer') a = 'gradientTransform'
      retourne SVG.Container.prototype.attr.call (this, a, b, c)
    }
  }

  // Ajouter une méthode parente
, construit: {
    // Créer un élément de dégradé dans defs
    gradient: fonction (type, bloc) {
      retourne this.defs (). gradient (type, bloc)
    }
  }
})

// Ajoute des méthodes animables aux modules gradient et fx
SVG.extend (SVG.Gradient, SVG.FX, {
  // De la position
  à partir de: function (x, y) {
    return (this._target || this) .type == 'radial'?
      this.attr ({fx: nouveau SVG.Number (x), fy: nouveau SVG.Number (y)}):
      this.attr ({x1: nouveau SVG.Numéro (x), y1: nouveau SVG.Numéro (y)})
  }
  // Positionner
, à: fonction (x, y) {
    return (this._target || this) .type == 'radial'?
      this.attr ({cx: nouveau SVG.Number (x), cy: nouveau SVG.Number (y)}):
      this.attr ({x2: nouveau SVG.Number (x), y2: nouveau SVG.Number (y)})
  }
})

// Génération de gradient de base
SVG.extend (SVG.Defs, {
  // définit le dégradé
  gradient: fonction (type, bloc) {
    renvoyer this.put (nouveau SVG.Gradient (type)). update (block)
  }

})

SVG.Stop = SVG.invent ({
  // Initialize node
  créer: 'stop'

  // Hériter de
, hérite: SVG.Element

  // Ajout de méthodes de classe
, étendre: {
    // ajoute des arrêts de couleur
    mise à jour: fonction (o) {
      if (typeof o == 'numéro' || o instance de SVG.Number) {
        o = {
          offset: arguments [0]
        , couleur: arguments [1]
        , opacité: arguments [2]
        }
      }

      // définir les attributs
      if (o.opacity! = null) this.attr ('stop-opacity', o.opacity)
      if (o.color! = null) this.attr ('stop-color', o.color)
      if (o.offset! = null) this.attr ('offset', nouveau SVG.Number (o.offset))

      retourner cette
    }
  }

})

SVG.Pattern = SVG.invent ({
  // Initialize node
  créer: 'motif'

  // Hériter de
, hériter: SVG.Container

  // Ajout de méthodes de classe
, étendre: {
    // retourne l'id de remplissage
    remplir: fonction () {
      retourne 'url (#' + this.id () + ')'
    }
    // Mise à jour du modèle en reconstruisant
  , mise à jour: fonction (bloc) {
      // supprime le contenu
      this.clear ()

      // invoquer le bloc passé
      if (typeof block == 'fonction')
        block.call (this, this)

      retourner cette
    }
    // Conversion de chaîne d'alias à remplir
  , toString: function () {
      retourne this.fill ()
    }
    // attr personnalisé pour gérer la transformation
  , attr: fonction (a, b, c) {
      if (a == 'transformer') a = 'patternTransform'
      retourne SVG.Container.prototype.attr.call (this, a, b, c)
    }

  }

  // Ajouter une méthode parente
, construit: {
    // Créer un élément de motif dans defs
    motif: fonction (largeur, hauteur, bloc) {
      retourne this.defs (). pattern (largeur, hauteur, bloc)
    }
  }
})

SVG.extend (SVG.Defs, {
  // Définir le dégradé
  motif: fonction (largeur, hauteur, bloc) {
    renvoyer this.put (nouveau SVG.Pattern) .update (block) .attr ({
      x: 0
    , y: 0
    largeur: largeur
    , hauteur: hauteur
    , patternUnits: 'userSpaceOnUse'
    })
  }

})
SVG.Shape = SVG.invent ({
  // Initialize node
  créer: fonction (élément) {
    this.constructor.call (this, element)
  }

  // Hériter de
, hérite: SVG.Element

})

SVG.Bare = SVG.invent ({
  // initialiser
  créer: fonction (élément, hériter) {
    // élément de construction
    this.constructor.call (this, SVG.create (element))

    // hérite des méthodes personnalisées
    si (hériter)
      for (méthode var dans inherit.prototype)
        if (typeof inherit.prototype [méthode] === 'fonction')
          this [méthode] = inherit.prototype [méthode]
  }

  // Hériter de
, hérite: SVG.Element

  // Ajout de méthodes
, étendre: {
    // Insérer du texte brut
    mots: fonction (texte) {
      // supprime le contenu
      while (this.node.hasChildNodes ())
        this.node.removeChild (this.node.lastChild)

      // créer un noeud de texte
      this.node.appendChild (document.createTextNode (text))

      retourner cette
    }
  }
})


SVG.extend (SVG.Parent, {
  // Crée un élément qui n'est pas décrit par SVG.js
  élément: fonction (élément, hériter) {
    Renvoie this.put (nouveau SVG.Bare (élément, hériter))
  }
})

SVG.Symbol = SVG.invent ({
  // Initialize node
  créer: 'symbole'

  // Hériter de
, hériter: SVG.Container

, construit: {
    // créer un symbole
    symbole: fonction () {
      Renvoie this.put (nouveau SVG.Symbol)
    }
  }
})

SVG.Use = SVG.invent ({
  // Initialize node
  créer: 'utiliser'

  // Hériter de
, hériter: SVG.Shape

  // Ajout de méthodes de classe
, étendre: {
    // Utiliser l'élément comme référence
    élément: fonction (élément, fichier) {
      // Définir l'élément doublé
      retourne this.attr ('href', (fichier || '') + '#' + élément, SVG.xlink)
    }
  }

  // Ajouter une méthode parente
, construit: {
    // Créer un élément d'utilisation
    utiliser: fonction (élément, fichier) {
      Renvoie this.put (nouveau SVG.Use) .element (element, file)
    }
  }
})
SVG.Rect = SVG.invent ({
  // Initialize node
  créer: 'rect'

  // Hériter de
, hériter: SVG.Shape

  // Ajouter une méthode parente
, construit: {
    // Créer un élément rect
    rect: fonction (largeur, hauteur) {
      retourne this.put (nouveau SVG.Rect ()). size (width, height)
    }
  }
})
SVG.Circle = SVG.invent ({
  // Initialize node
  créer: 'cercle'

  // Hériter de
, hériter: SVG.Shape

  // Ajouter une méthode parente
, construit: {
    // Créer un élément de cercle, basé sur une ellipse
    cercle: fonction (taille) {
      Renvoie this.put (nouveau SVG.Circle) .rx ​​(nouveau SVG.Number (taille) .divide (2)). move (0, 0)
    }
  }
})

SVG.extend (SVG.Circle, SVG.FX, {
  // Rayon x valeur
  rx: fonction (rx) {
    retourne this.attr ('r', rx)
  }
  // valeur du rayon alias x
, ry: fonction (ry) {
    retournez this.rx (ry)
  }
})

SVG.Ellipse = SVG.invent ({
  // Initialize node
  créer: 'ellipse'

  // Hériter de
, hériter: SVG.Shape

  // Ajouter une méthode parente
, construit: {
    // Créer une ellipse
    ellipse: fonction (largeur, hauteur) {
      Renvoie this.put (nouveau SVG.Ellipse) .size (largeur, hauteur) .move (0, 0)
    }
  }
})

SVG.extend (SVG.Ellipse, SVG.Rect, SVG.FX, {
  // Rayon x valeur
  rx: fonction (rx) {
    retourne this.attr ('rx', rx)
  }
  // Rayon y valeur
, ry: fonction (ry) {
    retourner this.attr ('ry', ry)
  }
})

// Ajouter une méthode commune
SVG.extend (SVG.Circle, SVG.Ellipse, {
    // Se déplacer sur l'axe des x
    x: fonction (x) {
      renvoyer x == null? this.cx () - this.rx (): this.cx (x + this.rx ())
    }
    // Se déplacer sur l'axe des y
  , y: fonction (y) {
      retourne y == null? this.cy () - this.ry (): this.cy (y + this.ry ())
    }
    // Se déplacer par centre sur l'axe des x
  , cx: fonction (x) {
      renvoyer x == null? this.attr ('cx'): this.attr ('cx', x)
    }
    // Se déplacer par centre sur l'axe des y
  , cy: fonction (y) {
      retourne y == null? this.attr ('cy'): this.attr ('cy', y)
    }
    // Définit la largeur de l'élément
  , largeur: fonction (largeur) {
      largeur de retour == null? this.rx () * 2: this.rx (nouveau SVG.Number (width) .divide (2))
    }
    // Définir la hauteur de l'élément
  , hauteur: fonction (hauteur) {
      hauteur de retour == null? this.ry () * 2: this.ry (nouveau SVG.Number (height) .divide (2))
    }
    // fonction de taille personnalisée
  , taille: fonction (largeur, hauteur) {
      var p = proportionnelTaille (this, width, height)

      retourner cette
        .rx (nouveau SVG.Number (p.width) .divide (2))
        .ry (nouveau SVG.Numéro (p.height) .divide (2))
    }
})
SVG.Line = SVG.invent ({
  // Initialize node
  créer: 'ligne'

  // Hériter de
, hériter: SVG.Shape

  // Ajout de méthodes de classe
, étendre: {
    // Obtenir un tableau
    tableau: fonction () {
      retourne un nouveau SVG.PointArray ([
        [this.attr ('x1'), this.attr ('y1')]
      , [this.attr ('x2'), this.attr ('y2')]
      ])
    }
    // Ecrase la méthode native plot ()
  , tracé: fonction (x1, y1, x2, y2) {
      si (x1 == null)
        retourne this.array ()
      else if (typeof y1! == 'indéfini')
        x1 = {x1: x1, y1: y1, x2: x2, y2: y2}
      autre
        x1 = nouveau SVG.PointArray (x1) .toLine ()

      retourne this.attr (x1)
    }
    // Déplacer par le coin supérieur gauche
  , déplacer: fonction (x, y) {
      retourne this.attr (this.array (). move (x, y) .toLine ())
    }
    // Définit la taille de l'élément sur la largeur et la hauteur données
  , taille: fonction (largeur, hauteur) {
      var p = proportionnelTaille (this, width, height)

      retourne this.attr (this.array (). size (p.width, p.height) .toLine ())
    }
  }

  // Ajouter une méthode parente
, construit: {
    // Créer un élément de ligne
    ligne: fonction (x1, y1, x2, y2) {
      // s'assure que l'intrigue est appelée en tant que setter
      // x1 n'est pas nécessairement un nombre, il peut également s'agir d'un tableau, d'une chaîne et d'un SVG.PointArray
      retourne SVG.Line.prototype.plot.apply (
        this.put (nouveau SVG.Line)
      , x1! = null? [x1, y1, x2, y2]: [0, 0, 0, 0]
      )
    }
  }
})

SVG.Polyline = SVG.invent ({
  // Initialize node
  créer: 'polyligne'

  // Hériter de
, hériter: SVG.Shape

  // Ajouter une méthode parente
, construit: {
    // Créer un élément de polyligne encapsulé
    polyligne: fonction (p) {
      // s'assure que l'intrigue est appelée en tant que setter
      Renvoie this.put (nouveau SVG.Polyline) .plot (p || new SVG.PointArray)
    }
  }
})

SVG.Polygon = SVG.invent ({
  // Initialize node
  créer: 'polygone'

  // Hériter de
, hériter: SVG.Shape

  // Ajouter une méthode parente
, construit: {
    // Créer un élément de polygone enveloppé
    polygone: fonction (p) {
      // s'assure que l'intrigue est appelée en tant que setter
      Renvoie this.put (nouveau SVG.Polygon) .plot (p || new SVG.PointArray)
    }
  }
})

// Ajouter des fonctions spécifiques à un polygone
SVG.extend (SVG.Polyline, SVG.Polygon, {
  // Obtenir un tableau
  tableau: fonction () {
    retourner this._array || (this._array = new SVG.PointArray (this.attr ('points')))
  }
  // Tracer un nouveau chemin
, tracé: fonction (p) {
    return (p == null)?
      this.array ():
      this.clear (). attr ('points', typeof p == 'chaîne'? p: (this._array = new SVG.PointArray (p)))
  }
  // Effacer le cache du tableau
, clear: function () {
    supprimer this._array
    retourner cette
  }
  // Déplacer par le coin supérieur gauche
, déplacer: fonction (x, y) {
    renvoyer this.attr ('points', this.array (). move (x, y))
  }
  // Définit la taille de l'élément sur la largeur et la hauteur données
, taille: fonction (largeur, hauteur) {
    var p = proportionnelTaille (this, width, height)

    renvoyer this.attr ('points', this.array (). size (p.width, p.height))
  }

})

// unifie tous les éléments point à point
SVG.extend (SVG.Line, SVG.Polyline, SVG.Polygon, {
  // Définir un tableau morphable
  morphArray: SVG.PointArray
  // Se déplacer par le coin supérieur gauche sur l'axe des x
, x: fonction (x) {
    renvoyer x == null? this.bbox (). x: this.move (x, this.bbox (). y)
  }
  // Se déplacer par le coin supérieur gauche sur l'axe des y
, y: fonction (y) {
    retourne y == null? this.bbox (). y: this.move (this.bbox (). x, y)
  }
  // Définit la largeur de l'élément
, largeur: fonction (largeur) {
    var b = this.bbox ()

    largeur de retour == null? Largeur: this.size (width, b.height)
  }
  // Définir la hauteur de l'élément
, hauteur: fonction (hauteur) {
    var b = this.bbox ()

    hauteur de retour == null? Hauteur: this.size (largeur, hauteur)
  }
})
SVG.Path = SVG.invent ({
  // Initialize node
  créer: 'chemin'

  // Hériter de
, hériter: SVG.Shape

  // Ajout de méthodes de classe
, étendre: {
    // Définir un tableau morphable
    morphArray: SVG.PathArray
    // Obtenir un tableau
  , tableau: fonction () {
      retourner this._array || (this._array = new SVG.PathArray (this.attr ('d')))
    }
    // Tracer un nouveau chemin
  , tracé: fonction (d) {
      return (d == null)?
        this.array ():
        this.clear (). attr ('d', typeof d == 'chaîne'? d: (this._array = new SVG.PathArray (d)))
    }
    // Effacer le cache du tableau
  , clear: function () {
      supprimer this._array
      retourner cette
    }
    // Déplacer par le coin supérieur gauche
  , déplacer: fonction (x, y) {
      renvoie this.attr ('d', this.array (). move (x, y))
    }
    // Se déplacer par le coin supérieur gauche sur l'axe des x
  , x: fonction (x) {
      renvoyer x == null? this.bbox (). x: this.move (x, this.bbox (). y)
    }
    // Se déplacer par le coin supérieur gauche sur l'axe des y
  , y: fonction (y) {
      retourne y == null? this.bbox (). y: this.move (this.bbox (). x, y)
    }
    // Définit la taille de l'élément sur la largeur et la hauteur données
  , taille: fonction (largeur, hauteur) {
      var p = proportionnelTaille (this, width, height)

      renvoie this.attr ('d', this.array (). size (p.width, p.height))
    }
    // Définit la largeur de l'élément
  , largeur: fonction (largeur) {
      largeur de retour == null? this.bbox (). width: this.size (width, this.bbox (). height)
    }
    // Définir la hauteur de l'élément
  , hauteur: fonction (hauteur) {
      hauteur de retour == null? this.bbox (). height: this.size (this.bbox (). width, height)
    }

  }

  // Ajouter une méthode parente
, construit: {
    // Créer un élément de chemin encapsulé
    chemin: fonction (d) {
      // s'assure que l'intrigue est appelée en tant que setter
      Renvoie this.put (nouveau SVG.Path) .plot (d || nouveau SVG.PathArray)
    }
  }
})

SVG.Image = SVG.invent ({
  // Initialize node
  créer une image'

  // Hériter de
, hériter: SVG.Shape

  // Ajout de méthodes de classe
, étendre: {
    // (re) charge l'image
    load: function (url) {
      si (! url) retourne ceci

      var self = this
        , img = nouvelle fenêtre.Image ()

      // image de précharge
      SVG.on (img, 'load', function () {
        SVG.off (img)

        var p = self.parent (SVG.Pattern)

        if (p === null) renvoie

        // assure la taille de l'image
        if (self.width () == 0 && self.height () == 0)
          self.size (img.width, img.height)

        // assure la taille du motif si elle n'est pas définie
        if (p && p.width () == 0 && p.height () == 0)
          p.size (self.width (), self.height ())

        // rappeler
        if (typeof self._loaded === 'fonction')
          self._loaded.call (self, {
            largeur: img.width
          , hauteur: img.height
          , rapport: img.width / img.height
          , url: url
          })
      })

      SVG.on (img, 'erreur', fonction (e) {
        SVG.off (img)

        if (typeof self._error === 'fonction') {
            self._error.call (self, e)
        }
      })

      renvoyer this.attr ('href', (img.src = this.src = url), SVG.xlink)
    }
    // Ajouter un rappel chargé
  , chargé: fonction (chargé) {
      this._loaded = chargé
      retourner cette
    }

  , erreur: fonction (erreur) {
      this._error = erreur
      retourner cette
    }
  }

  // Ajouter une méthode parente
, construit: {
    // créer un élément d'image, charger l'image et définir sa taille
    image: fonction (source, largeur, hauteur) {
      Renvoie this.put (nouvelle image SVG) .load (source) .size (width || 0, height || width || 0)
    }
  }

})
SVG.Text = SVG.invent ({
  // Initialize node
  créer: fonction () {
    this.constructor.call (this, SVG.create ('text'))

    this.dom.leading = new SVG.Number (1.3) // stocke la valeur principale pour la reconstruction
    this._rebuild = true // permet la mise à jour automatique des valeurs dy
    this._build = false // désactive le mode de construction pour ajouter plusieurs lignes

    // définir la police par défaut
    this.attr ('font-family', SVG.defaults.attrs ['font-family'])
  }

  // Hériter de
, hériter: SVG.Shape

  // Ajout de méthodes de classe
, étendre: {
    // Se déplacer sur l'axe des x
    x: fonction (x) {
      // agir comme getter
      si (x == null)
        retourne this.attr ('x')

      retourne this.attr ('x', x)
    }
    // Se déplacer sur l'axe des y
  , y: fonction (y) {
      var oy = this.attr ('y')
        , o = typeof oy === 'nombre'? oy - this.bbox (). y: 0

      // agir comme getter
      si (y == null)
        retourne typeof oy === 'numéro'? oy - o: oy

      renvoyer this.attr ('y', typeof y.valueOf () === 'nombre'? y + o: y)
    }
    // Déplacer le centre sur l'axe des x
  , cx: fonction (x) {
      renvoyer x == null? this.bbox (). cx: this.x (x - this.bbox (). width / 2)
    }
    // Déplacer le centre sur l'axe des y
  , cy: fonction (y) {
      retourne y == null? this.bbox (). cy: this.y (y - this.bbox (). height / 2)
    }
    // Définir le contenu du texte
  , texte: fonction (texte) {
      // agir comme getter
      if (typeof text === 'undefined') {
        var text = ''
        var enfants = this.node.childNodes
        pour (var i = 0, len = children.length; i <len; ++ i) {

          // ajoute newline si ce n'est pas le premier enfant et si newLined est défini sur true
          if (i! = 0 && enfants [i] .nodeType! = 3 && SVG.adopt (enfants [i]). dom.newLined == true) {
            text + = '\ n'
          }

          // ajoute le contenu de ce noeud
          text + = children [i] .textContent
        }

        texte de retour
      }

      // supprime le contenu existant
      this.clear (). build (true)

      if (typeof text === 'fonction') {
        // blocage d'appel
        text.call (this, this)

      } autre {
        // stocke le texte et s'assure que le texte n'est pas vide
        text = text.split ('\ n')

        // construit de nouvelles lignes
        pour (var i = 0, il = text.length; i <il; i ++)
          this.tspan (text [i]). newLine ()
      }

      // désactive le mode de construction et reconstruit les lignes
      Renvoie this.build (false) .rebuild ()
    }
    // Définir la taille de la police
  , taille: fonction (taille) {
      retourne this.attr ('font-size', taille) .rebuild ()
    }
    // Définir / obtenir le leader
  , en tête: fonction (valeur) {
      // agir comme getter
      if (valeur == null)
        retourner this.dom.leading

      // agir comme passeur
      this.dom.leading = nouveau SVG.Number (valeur)

      retourne this.rebuild ()
    }
    // Obtient toutes les lignes de premier niveau
  , lignes: fonction () {
      var node = (this.textPath && this.textPath () || this) .node

      // filtre les tspans et les mappe aux instances SVG.js
      var lines = SVG.utils.map (SVG.utils.filterSVGElements (node.childNodes), fonction (el) {
        retourne SVG.adopt (el)
      })

      // retourne une instance de SVG.set
      retourne le nouveau SVG.Set (lignes)
    }
    // Reconstruire le type d'aspect
  , reconstruire: fonction (reconstruire) {
      // stocke le nouveau drapeau de reconstruction si donné
      if (typeof rebuild == 'boolean')
        this._rebuild = reconstruire

      // définit la position de toutes les lignes
      if (this._rebuild) {
        var self = this
          , blankLineOffset = 0
          , dy = this.dom.leading * new SVG.Number (this.attr ('taille de la police'))

        this.lines (). each (function () {
          if (this.dom.newLined) {
            si (! self.textPath ())
              this.attr ('x', self.attr ('x'))
            if (this.text () == '\ n') {
              blankLineOffset + = dy
            }autre{
              this.attr ('dy', dy + blankLineOffset)
              blankLineOffset = 0
            }
          }
        })

        this.fire ('reconstruire')
      }

      retourner cette
    }
    // Activer / désactiver le mode de construction
  , build: fonction (build) {
      this._build = !! construire
      retourner cette
    }
    // remplace la méthode du parent pour définir les données correctement
  , setData: function (o) {
      this.dom = o
      this.dom.leading = nouveau SVG.Number (o.leading || 1.3)
      retourner cette
    }
  }

  // Ajouter une méthode parente
, construit: {
    // Créer un élément de texte
    texte: fonction (texte) {
      Renvoie this.put (nouveau SVG.Text) .text (text)
    }
    // Créer un élément de texte brut
  , en clair: fonction (texte) {
      Renvoie this.put (nouveau SVG.Text) .plain (text)
    }
  }

})

SVG.Tspan = SVG.invent ({
  // Initialize node
  créer: 'tspan'

  // Hériter de
, hériter: SVG.Shape

  // Ajout de méthodes de classe
, étendre: {
    // Définir le contenu du texte
    texte: fonction (texte) {
      if (text == null) retourne this.node.textContent + (this.dom.newLined? '\ n': '')

      typeof text === 'fonction'? text.call (this, this): this.plain (text)

      retourner cette
    }
    // raccourci dx
  , dx: fonction (dx) {
      retourne this.attr ('dx', dx)
    }
    // raccourci dy
  , dy: fonction (dy) {
      retournez this.attr ('dy', dy)
    }
    // Créer une nouvelle ligne
  , newLine: function () {
      // récupère le texte du parent
      var t = this.parent (SVG.Text)

      // marque nouvelle ligne
      this.dom.newLined = true

      // applique la nouvelle hyÂn
      retournez this.dy (t.dom.leading * t.attr ('taille de la police')). attr ('x', tx ())
    }
  }

})

SVG.extend (SVG.Text, SVG.Tspan, {
  // Créer un noeud de texte brut
  plain: fonction (texte) {
    // efface si le mode de construction est désactivé
    if (this._build === false)
      this.clear ()

    // créer un noeud de texte
    this.node.appendChild (document.createTextNode (text))

    retourner cette
  }
  // Créer un tspan
, tspan: fonction (texte) {
    var node = (this.textPath && this.textPath () || this) .node
      , tspan = new SVG.Tspan

    // efface si le mode de construction est désactivé
    if (this._build === false)
      this.clear ()

    // ajouter un nouveau tspan
    node.appendChild (tspan.node)

    retourne tspan.text (text)
  }
  // Effacer toutes les lignes
, clear: function () {
    var node = (this.textPath && this.textPath () || this) .node

    // supprime les nœuds enfants existants
    while (node.hasChildNodes ())
      node.removeChild (node.lastChild)

    retourner cette
  }
  // Obtenir la longueur de l'élément de texte
, longueur: fonction () {
    Renvoie this.node.getComputedTextLength ()
  }
})

SVG.TextPath = SVG.invent ({
  // Initialize node
  créer: 'textPath'

  // Hériter de
, hérite: SVG.Parent

  // Définir la classe parente
, parent: SVG.Text

  // Ajouter une méthode parente
, construit: {
    morphArray: SVG.PathArray
    // Créer un chemin pour le texte à exécuter
  , chemin: fonction (d) {
      // crée un élément textPath
      var path = new SVG.TextPath
        , track = this.doc (). defs (). path (d)

      // déplace les lignes vers textpath
      while (this.node.hasChildNodes ())
        path.node.appendChild (this.node.firstChild)

      // ajoute un élément textPath en tant que noeud enfant
      this.node.appendChild (path.node)

      // lie textPath au chemin et ajoute du contenu
      path.attr ('href', '#' + piste, SVG.xlink)

      retourner cette
    }
    // retourne le tableau de l'élément de piste
  , tableau: fonction () {
      var track = this.track ()

      piste de retour? track.array (): null
    }
    // chemin du tracé s'il y en a
  , tracé: fonction (d) {
      var track = this.track ()
        , pathArray = null

      si (piste) {
        pathArray = track.plot (d)
      }

      return (d == null)? pathArray: ceci
    }
    // Récupère l'élément de piste
  , piste: fonction () {
      var path = this.textPath ()

      si (chemin)
        retour path.reference ('href')
    }
    // Récupère l'enfant textPath
  , textPath: function () {
      if (this.node.firstChild && this.node.firstChild.nodeName == 'textPath')
        retourne SVG.adopt (this.node.firstChild)
    }
  }
})

SVG.Nested = SVG.invent ({
  // Initialize node
  créer: fonction () {
    this.constructor.call (this, SVG.create ('svg'))

    this.style ('débordement', 'visible')
  }

  // Hériter de
, hériter: SVG.Container

  // Ajouter une méthode parente
, construit: {
    // Créer un document svg imbriqué
    imbriqué: function () {
      Renvoie this.put (nouveau SVG.Nested)
    }
  }
})
SVG.A = SVG.invent ({
  // Initialize node
  créer un'

  // Hériter de
, hériter: SVG.Container

  // Ajout de méthodes de classe
, étendre: {
    // lien URL
    to: function (url) {
      retourne this.attr ('href', url, SVG.xlink)
    }
    // Attribut show de lien
  , show: fonction (cible) {
      return this.attr ('show', target, SVG.xlink)
    }
    // Attribut cible de lien
  , cible: fonction (cible) {
      renvoyer this.attr ('cible', cible)
    }
  }

  // Ajouter une méthode parente
, construit: {
    // Créer un élément de lien hypertexte
    lien: fonction (url) {
      renvoyer this.put (nouveau SVG.A) .to (url)
    }
  }
})

SVG.extend (SVG.Element, {
  // Créer un élément de lien hypertexte
  linkTo: function (url) {
    var link = new SVG.A

    if (typeof url == 'fonction')
      url.call (lien, lien)
    autre
      link.to (url)

    renvoie this.parent (). put (lien) .put (this)
  }

})
SVG.Marker = SVG.invent ({
  // Initialize node
  créer: 'marqueur'

  // Hériter de
, hériter: SVG.Container

  // Ajout de méthodes de classe
, étendre: {
    // Définit la largeur de l'élément
    width: fonction (largeur) {
      return this.attr ('markerWidth', largeur)
    }
    // Définir la hauteur de l'élément
  , hauteur: fonction (hauteur) {
      return this.attr ('markerHeight', height)
    }
    // Définit les marqueurs refX et refY
  , ref: fonction (x, y) {
      retourne this.attr ('refX', x) .attr ('refY', y)
    }
    // marqueur de mise à jour
  , mise à jour: fonction (bloc) {
      // supprime tout le contenu
      this.clear ()

      // invoquer le bloc passé
      if (typeof block == 'fonction')
        block.call (this, this)

      retourner cette
    }
    // retourne l'id de remplissage
  , toString: function () {
      retourne 'url (#' + this.id () + ')'
    }
  }

  // Ajouter une méthode parente
, construit: {
    marqueur: fonction (largeur, hauteur, bloc) {
      // Créer un élément marqueur dans defs
      retourne this.defs (). marker (largeur, hauteur, bloc)
    }
  }

})

SVG.extend (SVG.Defs, {
  // Créer un marqueur
  marqueur: fonction (largeur, hauteur, bloc) {
    // Définir la zone de visualisation par défaut pour qu'elle corresponde à la largeur et à la hauteur, définir les références sur cx et cy et définir orienter sur auto
    renvoyer this.put (nouveau SVG.Marker)
      .size (largeur, hauteur)
      .ref (largeur / 2, hauteur / 2)
      .viewbox (0, 0, largeur, hauteur)
      .attr ('orient', 'auto')
      .update (bloc)
  }

})

SVG.extend (SVG.Line, SVG.Polyline, SVG.Polygon, SVG.Path, {
  // Créer et attacher des marqueurs
  marqueur: fonction (marqueur, largeur, hauteur, bloc) {
    var attr = ['marqueur']

    // Nom de l'attribut de construction
    if (marqueur! = 'tous') attr.push (marqueur)
    attr = attr.join ('-')

    // Définir l'attribut marqueur
    marqueur = arguments [1] instance de SVG.Marker?
      arguments [1]:
      this.doc (). marqueur (largeur, hauteur, bloc)

    retourne this.attr (attr, marqueur)
  }

})
// Définir la liste des attributs disponibles pour le trait et le remplissage
sucre var = {
  trait: ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset']
, remplissez: ['couleur', 'opacité', 'règle']
, préfixe: fonction (t, a) {
    renvoyer une == 'couleur'? t: t + '-' + a
  }
}

// Ajoute du sucre pour le remplissage et le trait
; ['fill', 'stroke']. forEach (function (m) {
  var i, extension = {}

  extension [m] = fonction (o) {
    if (typeof o == 'non défini')
      retourner cette
    if (typeof o == 'chaîne' || SVG.Color.isRgb (o) || (o && typeof o.fill === 'fonction'))
      this.attr (m, o)

    autre
      // définit tous les attributs de sugar.fill et de la liste de frappe de sucre
      pour (i = sucre [m] .longueur - 1; i> = 0; i--)
        si (o [sucre [m] [i]]! = nul)
          this.attr (préfixe de sucre (m, sucre [m] [i]), o [sucre [m] [i]])

    retourner cette
  }

  SVG.extend (SVG.Element, SVG.FX, extension)

})

SVG.extend (SVG.Element, SVG.FX, {
  // rotation de la carte à transformer
  tourner: fonction (d, cx, cy) {
    retourne this.transform ({rotation: d, cx: cx, cy: cy})
  }
  // Mappe l'inclinaison à transformer
, oblique: fonction (x, y, cx, cy) {
    retourne arguments.length == 1 || arguments.length == 3?
      this.transform ({skew: x, cx: y, cy: cx}):
      this.transform ({skewX: x, skewY: y, cx: cx, cy: cy})
  }
  // Échelle de la carte à transformer
, scale: function (x, y, cx, cy) {
    retourne arguments.length == 1 || arguments.length == 3?
      this.transform ({échelle: x, cx: y, cy: cx}):
      this.transform ({scaleX: x, scaleY: y, cx: cx, cy: cy})
  }
  // Map translate to transform
, traduisons: fonction (x, y) {
    renvoyer this.transform ({x: x, y: y})
  }
  // retournement de la carte à transformer
, retourner: fonction (a, o) {
    o = type de a == 'nombre'? a: o
    return this.transform ({flip: a || 'both', offset: o})
  }
  // Map matrice à transformer
, matrice: fonction (m) {
    return this.attr ('transform', nouveau SVG.Matrix (arguments.length == 6? [] .slice.call (arguments): m))
  }
  // opacité
, opacité: fonction (valeur) {
    renvoie this.attr ('opacity', valeur)
  }
  // Déplacement relatif sur l'axe des x
, dx: fonction (x) {
    Renvoie this.x (nouveau SVG.Number (x) .plus (cette instance de SVG.FX? 0: this.x ()), true)
  }
  // Déplacement relatif sur l'axe des y
, dy: function (y) {
    Renvoie this.y (nouveau SVG.Number (y) .plus (cette instance de SVG.FX? 0: this.y ()), true)
  }
  // Déplacement relatif sur les axes x et y
, dmove: function (x, y) {
    retourne this.dx (x) .dy (y)
  }
})

SVG.extend (SVG.Rect, SVG.Ellipse, SVG.Circle, SVG.Gradient, SVG.FX, {
  // Ajouter les rayons x et y
  rayon: fonction (x, y) {
    var type = (this._target || this) .type;
    type de retour == 'radial' || tapez == 'cercle'?
      this.attr ('r', nouveau SVG.Number (x)):
      this.rx (x) .ry (y == null? x: y)
  }
})

SVG.extend (SVG.Path, {
  // Obtenir la longueur du chemin
  longueur: fonction () {
    Renvoie this.node.getTotalLength ()
  }
  // Obtenir le point à la longueur
, pointAt: fonction (longueur) {
    return this.node.getPointAtLength (length)
  }
})

SVG.extend (SVG.Parent, SVG.Text, SVG.Tspan, SVG.FX, {
  // Définir la police
  police: fonction (a, v) {
    if (typeof a == 'objet') {
      pour (v dans a) this.font (v, a [v])
    }

    retourne un == 'menant'?
        this.leading (v):
      un == 'ancre'?
        this.attr ('text-anchor', v):
      a == 'taille' || a == 'famille' || a == 'poids' || a == 'stretch' || a == 'variante' || un style ==?
        this.attr ('font -' + a, v):
        this.attr (a, v)
  }
})

SVG.Set = SVG.invent ({
  // initialiser
  créer: fonction (membres) {
    if (membres instanceof SVG.Set) {
      this.members = members.members.slice ()
    } autre {
      Array.isArray (membres)? this.members = members: this.clear ()
    }
  }

  // Ajout de méthodes de classe
, étendre: {
    // Ajouter un élément à définir
    ajouter: function () {
      var i, il, elements = [] .slice.call (arguments)

      pour (i = 0, il = éléments.longueur; i <il; i ++)
        this.members.push (éléments [i])

      retourner cette
    }
    // Supprimer l'élément du set
  , remove: function (element) {
      var i = this.index (element)

      // enlève l'enfant donné
      si (i> -1)
        this.members.splice (i, 1)

      retourner cette
    }
    // Itérer sur tous les membres
  , chacun: fonction (bloc) {
      pour (var i = 0, il = this.members.length; i <il; i ++)
        block.apply (this.members [i], [i, this.members])

      retourner cette
    }
    // Restaurer les valeurs par défaut
  , clear: function () {
      // initialise le magasin
      this.members = []

      retourner cette
    }
    // Obtenir la longueur d'un ensemble
  , longueur: fonction () {
      retourner this.members.length
    }
    // Vérifie si un élément donné est présent dans le jeu
  , a: fonction (élément) {
      retourne this.index (element)> = 0
    }
    // retourne l'index d'un élément donné dans le jeu
  , index: fonction (élément) {
      Renvoie this.members.indexOf (element)
    }
    // Obtenir le membre à l'index donné
  , obtenez: fonction (i) {
      retourner this.members [i]
    }
    // Obtenir le premier membre
  , d'abord: function () {
      retourner this.get (0)
    }
    // Obtenir le dernier membre
  , dernier: function () {
      return this.get (this.members.length - 1)
    }
    // Valeur par défaut
  , valeurDe: fonction () {
      retourner this.members
    }
    // Obtient le cadre de sélection de tous les membres inclus ou un champ vide si l'ensemble ne contient aucun élément
  , bbox: function () {
      // retourne une boîte vide il n'y a pas de membres
      if (this.members.length == 0)
        retourne la nouvelle SVG.RBox ()

      // récupère la première rbox et met à jour la bbox cible
      var rbox = this.members [0] .rbox (this.members [0] .doc ())

      this.each (function () {
        // utilisateur rbox pour une position correcte et une représentation visuelle
        rbox = rbox.merge (this.rbox (this.doc ()))
      })

      retourne rbox
    }
  }

  // Ajouter une méthode parente
, construit: {
    // Créer un nouvel ensemble
    set: fonction (membres) {
      retourne un nouveau SVG.Set (membres)
    }
  }
})

SVG.FX.Set = SVG.invent ({
  // Initialize node
  créer: fonction (set) {
    // référence de magasin à définir
    this.set = set
  }

})

// méthodes d'alias
SVG.Set.inherit = function () {
  var m
    , méthodes = []

  // collecte les méthodes de forme
  pour (var m dans SVG.Shape.prototype)
    if (typeof SVG.Shape.prototype [m] == 'fonction' && typeof SVG.Set.prototype [m]! = 'fonction')
      methods.push (m)

  // appliquer des aliasses de forme
  methods.forEach (fonction (méthode) {
    SVG.Set.prototype [méthode] = fonction () {
      pour (var i = 0, il = this.members.length; i <il; i ++)
        if (this.members [i] && typeof this.members [i] [méthode] == 'fonction')
          this.members [i] [méthode] .apply (this.members [i], arguments)

      méthode de retour == 'animate'? (this.fx || (this.fx = new SVG.FX.Set (this))): this
    }
  })

  // méthodes claires pour le prochain tour
  méthodes = []

  // rassemble des méthodes FX
  pour (var m dans SVG.FX.prototype)
    if (type de SVG.FX.prototype [m] == 'fonction' && type de SVG.FX.Set.prototype [m]! = 'fonction')
      methods.push (m)

  // appliquer des aliasses fx
  methods.forEach (fonction (méthode) {
    SVG.FX.Set.prototype [méthode] = fonction () {
      pour (var i = 0, il = this.set.members.length; i <il; i ++)
        this.set.members [i] .fx [méthode] .apply (this.set.members [i] .fx, arguments)

      retourner cette
    }
  })
}


SVG.extend (SVG.Element, {
  // Stocke les valeurs de données sur les nœuds svg
  données: fonction (a, v, r) {
    if (typeof a == 'objet') {
      pour (v dans a)
        this.data (v, a [v])

    } else if (arguments.length <2) {
      essayer {
        retourne JSON.parse (this.attr ('data-' + a))
      } catch (e) {
        retourne this.attr ('data-' + a)
      }

    } autre {
      this.attr (
        'data-' + a
      , v === null?
          nul :
        r === true || typeof v === 'chaîne' || typeof v === 'numéro'?
          v:
          JSON.stringify (v)
      )
    }

    retourner cette
  }
})
SVG.extend (SVG.Element, {
  // Mémoriser des données arbitraires
  rappelez-vous: function (k, v) {
    // mémoriser chaque élément d'un objet individuellement
    if (typeof arguments [0] == 'objet')
      pour (var v en k)
        this.remember (v, k [v])

    // récupère de la mémoire
    else if (arguments.length == 1)
      retourne this.memory () [k]

    // mémoire en mémoire
    autre
      this.memory () [k] = v

    retourner cette
  }

  // Effacer une mémoire donnée
, oubliez: function () {
    if (arguments.length == 0)
      this._memory = {}
    autre
      pour (var i = arguments.length - 1; i> = 0; i--)
        supprimer this.memory () [arguments [i]]

    retourner cette
  }

  // Initialise ou retourne un objet mémoire local
, mémoire: function () {
    renvoie this._memory || (this._memory = {})
  }

})
// Méthode d'obtention d'un élément par identifiant
SVG.get = function (id) {
  var node = document.getElementById (idFromReference (id) || id)
  retourne SVG.adopt (noeud)
}

// Sélection des éléments par la chaîne de requête
SVG.select = fonction (requête, parent) {
  retourne le nouveau SVG.Set (
    SVG.utils.map ((parent || document) .querySelectorAll (requête), fonction (noeud) {
      retourne SVG.adopt (noeud)
    })
  )
}

SVG.extend (SVG.Parent, {
  // Méthode de sélection scoped
  sélectionnez: fonction (requête) {
    retourne SVG.select (requête, this.node)
  }

})
fonction pathRegReplace (a, b, c, d) {
  retourne c + d.replace (SVG.regex.dots, '.')
}

// crée un clone profond de tableau
fonction array_clone (arr) {
  var clone = arr.slice (0)
  pour (var i = clone.length; i -;) {
    if (Array.isArray (clone [i])) {
      clone [i] = array_clone (clone [i])
    }
  }
  retourne le clone
}

// teste si un élément donné est une instance d'un objet
la fonction est (el, obj) {
  retourne el instanceof obj
}

// teste si un sélecteur donné correspond à un élément
correspond aux fonctions (el, selector) {
  return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector) .call (el, sélecteur);
}

// Convertit la chaîne séparée par des tirets en camelCase
fonction camelCase (s) {
  retourne s.toLowerCase (). remplace (/-(.)/ g, fonction (m, g) {
    retourne g.toUpperCase ()
  })
}

// majuscule la première lettre d'une chaîne
fonction capitalise (s) {
  renvoyer s.charAt (0) .toUpperCase () + s.slice (1)
}

// Assurer à six hex basé
fonction fullHex (hex) {
  renvoyer hex.length == 4?
    ['#',
      hexsubstring (1, 2), hexsubstring (1, 2)
    , hexsubstring (2, 3), hexsubstring (2, 3)
    , hexsubstring (3, 4), hexsubstring (3, 4)
    ] .join (''): hex
}

// Composant en valeur hexadécimale
fonction compToHex (comp) {
  var hex = comp.toString (16)
  renvoyer hex.length == 1? '0' + hex: hex
}

// Calculer les valeurs proportionnelles de largeur et de hauteur si nécessaire
fonction proportionnelleTaille (élément, largeur, hauteur) {
  if (width == null || height == null) {
    var box = element.bbox ()

    if (width == null)
      width = box.width / box.height * height
    sinon si (hauteur == null)
      height = box.height / box.width * width
  }

  revenir {
    largeur: largeur
  , hauteur: hauteur
  }
}

// point de transformation Delta
fonction deltaTransformPoint (matrice, x, y) {
  revenir {
    x: x * matrice.a + y * matrice.c + 0
  , y: x * matrice.b + y * matrice.d + 0
  }
}

// Mappe un tableau de matrice à un objet
fonction tableauVersMatrix (a) {
  retourne {a: a [0], b: a [1], c: a [2], d: a [3], e: a [4], f: a [5]}
}

// Matrice d'analyse si nécessaire
fonction parseMatrix (matrice) {
  if (! (instance de matrice de SVG.Matrix))
    matrice = nouveau SVG.Matrix (matrice)

  matrice de retour
}

// Ajouter un point central pour transformer un objet
function assureCentre (o, target) {
  o.cx = o.cx == null? target.bbox (). cx: o.cx
  o.cy = o.cy == null? target.bbox (). cy: o.cy
}

// Assistants PathArray
fonction arrayToString (a) {
  pour (var i = 0, il = a.longueur, s = ''; i <il; i ++) {
    s + = a [i] [0]

    if (a [i] [1]! = null) {
      s + = a [i] [1]

      if (a [i] [2]! = null) {
        s + = ''
        s + = a [i] [2]

        if (a [i] [3]! = null) {
          s + = ''
          s + = a [i] [3]
          s + = ''
          s + = a [i] [4]

          if (a [i] [5]! = null) {
            s + = ''
            s + = a [i] [5]
            s + = ''
            s + = a [i] [6]

            if (a [i] [7]! = null) {
              s + = ''
              s + = a [i] [7]
            }
          }
        }
      }
    }
  }

  retour s + ''
}

// Nouvelle affectation profonde
fonction assignNewId (noeud) {
  // fait la même chose pour les nœuds enfants SVG
  pour (var i = node.childNodes.length - 1; i> = 0; i--)
    if (node.childNodes [i] instanceof window.SVGElement)
      assignNewId (node.childNodes [i])

  return SVG.adopt (node) .id (SVG.eid (node.nodeName))
}

// Ajouter plus de propriétés du cadre de sélection
fonction fullBox (b) {
  if (bx == null) {
    bx = 0
    par = 0
    largeur = 0
    b.height = 0
  }

  pc = largeur largeur
  bh = b.height
  b.x2 = bx + largeur B.
  b.y2 = par + b.height
  b.cx = bx + largeur B. / 2
  b.cy = par + b.height / 2

  retour b
}

// Obtenir l'id de la chaîne de référence
fonction idFromReference (url) {
  var m = (url || '') .toString (). match (SVG.regex.reference)

  si (m) retourne m [1]
}

// Si des valeurs telles que 1e-88 sont passées, ceci n'est pas un float 32 bits valide,
// mais dans ces cas, nous sommes si proches de 0 que 0 fonctionne bien!
fonction float32String (v) {
  renvoyer Math.abs (v)> 1e-37? v: 0
}

// Créer un tableau de matrice pour la mise en boucle
var abcdef = 'abcdef'.split (' ')

// Ajout de CustomEvent à IE9 et IE10
if (typeof window.CustomEvent! == 'function') {
  // Code de: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
  var CustomEventPoly = fonction (événement, options) {
    options = options || {bubbles: false, cancelable: false, détail: undefined}
    var e = document.createEvent ('CustomEvent')
    e.initCustomEvent (event, options.bubbles, options.cancelable, options.detail)
    retour e
  }

  CustomEventPoly.prototype = window.Event.prototype

  SVG.CustomEvent = CustomEventPoly
} autre {
  SVG.CustomEvent = window.CustomEvent
}

// requestAnimationFrame / cancelAnimationFrame Polyfill avec repli basé sur Paul Irish
(fonction (w) {
  var lastTime = 0
  var vendors = ['moz', 'webkit']

  pour (var x = 0; x <vendors.length &&! window.requestAnimationFrame; ++ x) {
    w.requestAnimationFrame = w [fournisseurs [x] + 'RequestAnimationFrame']
    w.cancelAnimationFrame = w [fournisseurs [x] + 'CancelAnimationFrame'] ||
                              w [vendeurs [x] + 'CancelRequestAnimationFrame']
  }

  w.requestAnimationFrame = w.requestAnimationFrame ||
    fonction (rappel) {
      var currTime = new Date (). getTime ()
      var timeToCall = Math.max (0, 16 - (currTime - lastTime))

      var id = w.setTimeout (function () {
        rappel (currTime + timeToCall)
      }, timeToCall)

      lastTime = currTime + timeToCall
      ID de retour
    }

  w.cancelAnimationFrame = w.cancelAnimationFrame || w.clearTimeout;

}(la fenêtre))

retour SVG

}));