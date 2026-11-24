// Rayons d'ingrédients et pictogrammes utilisés pour les colonnes du frigo et les visuels des recettes.
// L'ordre compte : la première correspondance l'emporte ("lait de coco" est rangé avant "lait").
const CATEGORIES = [
  { id: "epicerie", nom: "Épicerie", icone: "🫙", items: {
    "lait de coco": "🥥", "tomate concassée": "🥫", "huile": "🫒", "vinaigre": "🫙", "moutarde": "🫙",
    "bouillon de légumes": "🍲", "sucre": "🍬", "miel": "🍯", "chocolat noir": "🍫", "tahini": "🫙", "tamari": "🫙",
    "graines de sésame": "🌰", "noix": "🌰", "pignons de pin": "🌰", "amande": "🌰", "noisette": "🌰", "vin blanc": "🍷",
    "maïs": "🌽", "olive": "🫒", "câpre": "🫙", "sauce tomate": "🥫", "confiture": "🍯" } },
  { id: "legumineuses", nom: "Légumineuses et tofu", icone: "🫘", items: {
    "lentilles": "🫘", "pois chiche": "🫘", "haricot rouge": "🫘", "haricot blanc": "🫘", "tofu ferme": "🧈", "tofu": "🧈" } },
  { id: "legumes", nom: "Légumes", icone: "🥕", items: {
    "pomme de terre": "🥔", "patate douce": "🍠", "carotte": "🥕", "poireau": "🥬", "potiron": "🎃", "courge butternut": "🎃",
    "oignon": "🧅", "échalote": "🧅", "ail": "🧄", "chou fleur": "🥦", "brocoli": "🥦", "chou de Bruxelles": "🥬", "chou vert": "🥬",
    "chou": "🥬", "endive": "🥬", "épinard": "🥬", "mâche": "🥬", "laitue": "🥬", "salade": "🥬", "champignon": "🍄",
    "céleri-rave": "🥔", "céleri": "🥬", "panais": "🥕", "navet": "🥔", "betterave cuite": "🫐", "betterave": "🫐",
    "asperge verte": "🌱", "asperge": "🌱", "petits pois": "🫛", "haricot vert": "🫛", "radis": "🌱", "rhubarbe": "🌱",
    "courgette": "🥒", "concombre": "🥒", "aubergine": "🍆", "poivron": "🫑", "tomate": "🍅", "artichaut": "🌱",
    "fenouil": "🌱", "avocat": "🥑", "gingembre": "🫚" } },
  { id: "fruits", nom: "Fruits", icone: "🍎", items: {
    "pomme": "🍎", "poire": "🍐", "orange": "🍊", "clémentine": "🍊", "mandarine": "🍊", "pamplemousse": "🍊", "citron": "🍋",
    "fraise": "🍓", "framboise": "🍓", "cerise": "🍒", "pêche": "🍑", "abricot": "🍑", "melon": "🍈", "pastèque": "🍉",
    "banane": "🍌", "kiwi": "🥝", "raisin": "🍇", "ananas": "🍍", "mangue": "🥭", "prune": "🫐", "figue": "🫐", "myrtille": "🫐" } },
  { id: "viandes", nom: "Viandes et charcuterie", icone: "🥩", items: {
    "boeuf": "🥩", "veau": "🥩", "agneau": "🥩", "porc": "🥩", "poulet": "🍗", "dinde": "🍗", "canard": "🍗",
    "jambon": "🍖", "lardons": "🥓", "poitrine fumée": "🥓", "saucisse": "🌭", "chorizo": "🌭" } },
  { id: "poissons", nom: "Poissons et fruits de mer", icone: "🐟", items: {
    "thon en conserve": "🐟", "saumon": "🐟", "cabillaud": "🐟", "colin": "🐟", "truite": "🐟", "maquereau": "🐟", "thon": "🐟", "sardine": "🐟",
    "moules": "🦪", "crevette": "🦐" } },
  { id: "cremerie", nom: "Crèmerie et œufs", icone: "🥚", items: {
    "oeuf": "🥚", "lait": "🥛", "beurre": "🧈", "crème fraîche": "🥛", "crème": "🥛", "yaourt": "🥛", "fromage râpé": "🧀",
    "parmesan": "🧀", "mozzarella": "🧀", "feta": "🧀", "roquefort": "🧀", "reblochon": "🧀", "fromage de chèvre": "🧀",
    "fromage": "🧀", "gruyère": "🧀", "emmental": "🧀", "comté": "🧀" } },
  { id: "feculents", nom: "Féculents et céréales", icone: "🌾", items: {
    "pâtes": "🍝", "riz": "🍚", "semoule": "🌾", "boulgour": "🌾", "quinoa": "🌾", "pain": "🍞", "farine de sarrasin": "🌾",
    "farine": "🌾", "pâte brisée": "🥧", "pâte feuilletée": "🥧" } },
  { id: "herbes", nom: "Herbes et épices", icone: "🌿", items: {
    "persil": "🌿", "menthe": "🌿", "basilic": "🌿", "ciboulette": "🌿", "thym": "🌿", "romarin": "🌿", "aneth": "🌿",
    "coriandre": "🌿", "curry": "🌶️", "cumin": "🌶️", "paprika": "🌶️", "piment": "🌶️", "cannelle": "🟤", "vanille": "🟤", "muscade": "🟤" } },
];
const AUTRES = { id: "autres", nom: "Autres", icone: "🧺" };

const ICONES_TYPE = { "soupe": "🍲", "plat": "🍽️", "entrée": "🥗", "dessert": "🍰", "accompagnement": "🥘" };
