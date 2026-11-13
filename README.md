# Aliments Frigo

Site qui propose des recettes de saison à partir des ingrédients du frigo et des profils des convives (âge, régime, allergies, aliments non aimés).

En ligne : https://elsatecna.github.io/AlimentsFrigo/

## Fonctionnement

- `recettes.js` : la base de recettes (68 recettes, quantités pour 4 personnes, saisons, régime, allergènes).
- `app.js` : filtrage par profil, classement (de saison d'abord, puis ingrédients disponibles), mise à l'échelle des quantités.
- `index.html` / `style.css` : la page.

Aucun serveur ni dépendance : il suffit d'ouvrir `index.html`. Les choix sont mémorisés dans le navigateur.

## Ajouter une recette

Ajouter un objet dans `RECETTES` (fichier `recettes.js`) en suivant le format des autres recettes.
