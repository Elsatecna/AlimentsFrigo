# Select & Cook!

Site qui propose des recettes de saison à partir des ingrédients du frigo et des profils des convives (âge, régime, régimes à choix multiple dont endométriose, low carb et microbiote, allergies, aliments non aimés).

En ligne : https://elsatecna.github.io/AlimentsFrigo/

## Fonctionnement

- `recettes.js` : la base de recettes (78 recettes, quantités pour 4 personnes, saisons, régime, allergènes).
- `app.js` : filtrage par profil, classement (de saison d'abord, puis ingrédients disponibles), mise à l'échelle des quantités.
- `categories.js` : les rayons d'ingrédients (colonnes du frigo) et les pictogrammes des visuels.
- `photos.js` et `photos/` : photos des plats (Wikimedia Commons, licences libres ; auteur et licence affichés sur chaque photo).
- `index.html` / `style.css` : la page.

## Parcours

1. Cocher les ingrédients du frigo (rangés par rayon) et les personnes à table.
2. « Trouver des recettes » : le site liste les ingrédients qui manquent pour les recettes les plus proches et demande lesquels on a.
3. Seules les recettes dont on a tous les ingrédients (placard de base compris) sont affichées.

Aucun serveur ni dépendance : il suffit d'ouvrir `index.html`. Les choix sont mémorisés dans le navigateur.

## Ajouter une recette

Ajouter un objet dans `RECETTES` (fichier `recettes.js`) en suivant le format des autres recettes.

## Mémorisation

Tout est enregistré dans le navigateur (localStorage) :
- le carnet de profils (on coche les personnes à table) ;
- la liste des ingrédients déjà saisis (on coche ce qu'on a) ;
- les réglages : saison choisie, type de plat, temps maximum, tri.

## Mon carnet de recettes

Chacun peut ajouter ses recettes (avec photo facultative), les modifier, les exporter dans un fichier `.json` et importer celui d'un proche. Elles restent dans le navigateur ; pour les ajouter à la base commune, il suffit de copier le contenu d'un fichier exporté dans `recettes.js`.
