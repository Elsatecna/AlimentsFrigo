// ============ Logique (testable sans navigateur) ============

const SAISONS = ["printemps", "été", "automne", "hiver"];
const ICONES_SAISON = { "printemps": "🌸", "été": "☀️", "automne": "🍂", "hiver": "❄️" };
const NOMS_SAISONS = { "printemps": "Printemps", "été": "Été", "automne": "Automne", "hiver": "Hiver" };

const PLACARD = ["ail", "oignon", "échalote", "farine", "sucre", "beurre", "huile", "moutarde", "vinaigre",
  "bouillon de légumes", "curry", "cumin", "cannelle", "thym", "vanille"];

const SYNONYMES = {
  "patate": "pomme de terre", "pdt": "pomme de terre", "patate douce": "patate douce",
  "steak hache": "boeuf hache", "viande hachee": "boeuf hache", "hache": "boeuf hache",
  "gruyere": "fromage rape", "emmental": "fromage rape", "comte": "fromage rape", "fromage": "fromage rape",
  "champignon de paris": "champignon", "chevre": "fromage de chevre", "thon": "thon en conserve", "thon en boite": "thon en conserve",
  "creme liquide": "creme fraiche", "chou": "chou vert", "pommes de terre": "pomme de terre",
  "creme": "creme fraiche", "lardon": "lardons", "spaghetti": "pates", "penne": "pates", "coquillette": "pates",
  "courge": "courge butternut", "butternut": "courge butternut", "citrouille": "potiron",
  "pois chiches": "pois chiche", "petit pois": "petits pois", "haricot": "haricot vert",
  "pomme de terre nouvelle": "pomme de terre nouvelle", "tofu": "tofu ferme", "betterave": "betterave cuite",
  "jambon blanc": "jambon", "jambon de pays": "jambon cru", "sauce soja": "tamari",
};

const INVARIABLES = new Set(["pois", "radis", "noix", "riz", "mais", "jus", "anchois", "frais", "pates", "lardons", "moules", "petits", "bruxelles", "paris"]);

function normaliser(texte) {
  return String(texte)
    .toLowerCase()
    .replace(/œ/g, "oe").replace(/æ/g, "ae")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[-'’]/g, " ")
    .replace(/[^a-z0-9 ]/g, "")
    .split(/\s+/).filter(Boolean)
    .map(m => (m.length > 3 && !INVARIABLES.has(m) && /[sx]$/.test(m)) ? m.slice(0, -1) : m)
    .join(" ");
}

function canonique(texte) {
  const n = normaliser(texte);
  return SYNONYMES[n] ? normaliser(SYNONYMES[n]) : n;
}

// "pomme" ne doit pas correspondre à "pomme de terre", mais "tomate" correspond à "tomate cerise".
function correspond(a, b) {
  if (!a || !b) return false;
  if (a === b) return true;
  const [court, long] = a.length < b.length ? [a, b] : [b, a];
  if (long.startsWith(court + " ")) {
    const reste = long.slice(court.length + 1);
    return !/^(de|d|a|au|aux|en) /.test(reste + " ");
  }
  return false;
}

function nomIngredient(ligne) { return ligne.split("|")[0]; }
function qteIngredient(ligne) { return ligne.split("|")[1] || ""; }

function saisonDuMois(mois) { // mois 1-12
  if (mois === 12 || mois <= 2) return "hiver";
  if (mois <= 5) return "printemps";
  if (mois <= 8) return "été";
  return "automne";
}

const NIVEAU_REGIME = { vegan: 0, vege: 1, poisson: 2, viande: 3 };
const LIMITE_REGIME = { "vegetalien": 0, "vegetarien": 1, "pescetarien": 2 };

// Familles d'ingrédients utilisées par les régimes santé (repérées automatiquement dans chaque recette).
const FAMILLES = {
  viandeRouge: ["boeuf", "boeuf hache", "boeuf a braiser", "veau", "agneau", "gigot d agneau"],
  charcuterie: ["jambon", "jambon cru", "lardons", "saucisse de morteau", "poitrine fumee"],
  alcool: ["vin blanc"],
  sucres: ["sucre", "miel", "chocolat noir", "oeufs en chocolat"],
  feculents: ["pomme de terre", "pates", "riz", "semoule", "boulgour", "pain", "farine", "farine de sarrasin",
    "pate brisee", "pain de mie", "cereales", "lentilles", "pois chiche", "haricot rouge", "patate douce", "mais", "petits pois"],
  fibres: ["poireau", "carotte", "potiron", "courge butternut", "chou vert", "chou de bruxelles", "endive", "epinard",
    "champignon", "celeri rave", "panais", "navet", "betterave cuite", "mache", "brocoli", "asperge verte", "petits pois",
    "radis", "rhubarbe", "courgette", "aubergine", "poivron", "tomate", "concombre", "haricot vert", "lentilles",
    "pois chiche", "haricot rouge", "patate douce", "pomme", "poire", "laitue", "oignon", "ail", "noix", "boulgour",
    "farine de sarrasin", "artichaut", "fenouil", "chou fleur", "fraise", "cerise", "framboise", "orange", "pamplemousse", "clementine", "peche"],
};

const cacheProfil = new Map();
function profilRecette(recette) {
  if (cacheProfil.has(recette)) return cacheProfil.get(recette);
  const noms = recette.ingr.map(l => canonique(nomIngredient(l)));
  const compte = fam => noms.filter(n => FAMILLES[fam].some(f => correspond(n, normaliser(f)))).length;
  const p = {
    viandeRouge: compte("viandeRouge") > 0,
    charcuterie: compte("charcuterie") > 0,
    alcool: compte("alcool") > 0,
    sucres: compte("sucres") > 0,
    feculents: compte("feculents") > 0,
    fibres: compte("fibres"),
  };
  p.lowCarb = !p.feculents && !p.sucres && recette.type !== "dessert";
  cacheProfil.set(recette, p);
  return p;
}

// Ancien format (un seul régime) → liste de régimes.
function regimesDe(profil) {
  if (Array.isArray(profil.regimes)) return profil.regimes;
  return profil.regime && profil.regime !== "omnivore" ? [profil.regime] : [];
}

const REGLES_SANTE = {
  endometriose: p => p.viandeRouge || p.charcuterie || p.alcool || p.sucres,
  lowcarb: p => !p.lowCarb,
  microbiote: p => p.charcuterie || p.sucres || p.fibres < 2,
};

function listeDegouts(profil) {
  return String(profil.degouts || "").split(/[,;\n]/).map(canonique).filter(Boolean);
}

// Renvoie null si compatible, sinon la raison de l'exclusion.
function incompatibilite(recette, profil) {
  const age = Number(profil.age);
  if (profil.age !== "" && profil.age != null && age < 0.5) return null; // nourrisson : lait uniquement, pas de filtre
  const regimes = regimesDe(profil);
  const limite = Math.min(3, ...regimes.map(r => LIMITE_REGIME[r]).filter(v => v != null));
  if (NIVEAU_REGIME[recette.regime] > limite) return "régime";
  const pr = profilRecette(recette);
  for (const r of regimes) if (REGLES_SANTE[r] && REGLES_SANTE[r](pr)) return r;
  const allergies = profil.allergies || [];
  for (const a of allergies) {
    if (a === "porc" && recette.porc) return "porc";
    if (a === "poisson" && recette.regime === "poisson") return "poisson";
    if (recette.allergenes.includes(a)) return a;
  }
  const degouts = listeDegouts(profil);
  for (const d of degouts) {
    if (recette.ingr.some(l => correspond(canonique(nomIngredient(l)), d))) return "n'aime pas " + d;
  }
  if (!isNaN(age) && profil.age !== "") {
    if (age < 1 && (recette.alertes.includes("miel") || !recette.tendre)) return "âge";
    if (age < 3 && recette.epice) return "âge";
    if (age < 4 && recette.alertes.includes("noix-entieres")) return "âge";
  }
  return null;
}

function conseils(recette, profils) {
  const out = [];
  for (const p of profils) {
    const age = Number(p.age);
    if (p.age === "" || p.age == null || isNaN(age)) continue;
    const nom = p.nom || "la personne";
    if (age < 0.5) { out.push(`${nom} (${formatAge(age)}) : lait uniquement à cet âge.`); continue; }
    if (age < 1) out.push(`${nom} (${formatAge(age)}) : mixer finement, sans sel ni sucre ajoutés.`);
    else if (age < 3 && !recette.tendre) out.push(`${nom} (${formatAge(age)}) : couper en tout petits morceaux.`);
    if (age < 3 && recette.alertes.includes("oeuf-coulant")) out.push(`${nom} (${formatAge(age)}) : bien cuire l'œuf, pas de jaune coulant.`);
    if (age >= 75 && !recette.tendre) out.push(`${nom} (${formatAge(age)}) : couper finement ou prolonger la cuisson.`);
  }
  return out;
}

function formatAge(age) {
  if (age < 2) return Math.round(age * 12) + " mois";
  return Math.floor(age) + " ans";
}

function analyser(recette, termesFrigo, avecPlacard) {
  const placard = PLACARD.map(canonique);
  const lignes = recette.ingr.map(l => {
    const c = canonique(nomIngredient(l));
    const frigo = termesFrigo.some(t => correspond(c, t));
    const base = !frigo && avecPlacard && placard.some(t => correspond(c, t));
    return { ligne: l, frigo, base };
  });
  const utilises = lignes.filter(x => x.frigo).length;
  const dispo = lignes.filter(x => x.frigo || x.base).length;
  return { lignes, utilises, dispo, total: lignes.length, couverture: dispo / lignes.length };
}

function proposer({ recettes, frigo, avecPlacard, profils, saison, type, tempsMax = 0, tri = "pertinence", complet = false, occasion = "", autour = [], notes = {} }) {
  // Les ingrédients « autour de » sont forcément disponibles et doivent figurer dans la recette.
  const obligatoires = autour.map(canonique).filter(Boolean);
  const termes = [...frigo, ...autour].map(canonique).filter(Boolean);
  const actifs = profils.length ? profils : [{ regimes: [], allergies: [], age: "" }];
  const enfants = actifs.some(p => p.age !== "" && Number(p.age) < 12);
  const seniors = actifs.some(p => p.age !== "" && Number(p.age) >= 75);
  const fibresPrioritaires = actifs.some(p => regimesDe(p).some(r => r === "microbiote" || r === "endometriose"));
  const resultats = [];
  let exclues = 0;
  for (const r of recettes) {
    if (type && type !== "tout") {
      const groupe = (r.type === "soupe" || r.type === "plat") ? "plat" : r.type === "dessert" ? "dessert" : "entree";
      if (groupe !== type) continue;
    }
    if (tempsMax && r.temps > tempsMax) continue;
    if (obligatoires.length) {
      const noms = r.ingr.map(l => canonique(nomIngredient(l)));
      if (!obligatoires.every(o => noms.some(n => correspond(n, o)))) continue;
    }
    if (actifs.some(p => incompatibilite(r, p))) { exclues++; continue; }
    const a = analyser(r, termes, avecPlacard);
    if (complet && a.dispo < a.total) continue;
    const deSaison = r.saisons.includes(saison);
    const score = a.utilises * 3 + a.couverture * 5 + (enfants && r.enfants ? 1 : 0) + (seniors && r.tendre ? 1 : 0)
      + (r.saisons.length < 4 && deSaison ? 1 : 0)
      + (fibresPrioritaires ? Math.min(profilRecette(r).fibres, 5) * 0.6 : 0);
    const pourOccasion = !!occasion && (r.occasions || []).includes(occasion);
    resultats.push({ recette: r, ...a, deSaison, pourOccasion, score });
  }
  // Ordre : recettes de l'occasion choisie, puis de saison ; le tri choisi s'applique à l'intérieur de ces groupes.
  // Le tri par note passe avant la saison (les mieux notées d'abord, les non notées à la fin).
  const note = x => notes[cleRecette(x.recette)] || 0;
  const parTri = tri === "rapide" ? (x, y) => x.recette.temps - y.recette.temps
    : tri === "long" ? (x, y) => y.recette.temps - x.recette.temps : () => 0;
  resultats.sort((x, y) => (y.pourOccasion - x.pourOccasion)
    || (tri === "note" ? note(y) - note(x) : 0)
    || (y.deSaison - x.deSaison) || parTri(x, y) || (y.score - x.score) || x.recette.temps - y.recette.temps);
  return { resultats, exclues };
}

// Range un ingrédient dans un rayon : correspondance exacte d'abord, puis la plus longue, puis un mot du nom.
const cacheClasse = new Map();
function classer(nom) {
  const c = canonique(nom);
  if (cacheClasse.has(c)) return cacheClasse.get(c);
  const tous = [];
  for (const cat of (typeof CATEGORIES !== "undefined" ? CATEGORIES : [])) {
    for (const [cle, emoji] of Object.entries(cat.items)) tous.push({ cat, emoji, cle: normaliser(cle) });
  }
  const mots = c.split(" ");
  const trouve = tous.find(t => t.cle === c)
    || tous.filter(t => correspond(c, t.cle)).sort((a, b) => b.cle.length - a.cle.length)[0]
    || tous.find(t => !t.cle.includes(" ") && mots.includes(t.cle));
  const res = trouve ? { categorie: trouve.cat.id, emoji: trouve.emoji } : { categorie: "autres", emoji: "🧺" };
  cacheClasse.set(c, res);
  return res;
}

// Déduit régime, allergènes et porc à partir des ingrédients (pour les recettes ajoutées par l'utilisateur).
const MOTS_GLUTEN = ["farine", "pates", "pain", "semoule", "boulgour", "pate brisee", "pate feuilletee", "chapelure", "biscuit", "ble", "orge", "seigle", "couscous", "nouille", "spaghetti"];
const MOTS_LACTOSE = ["lait", "beurre", "creme", "creme fraiche", "fromage", "fromage rape", "parmesan", "mozzarella", "feta", "roquefort", "reblochon", "fromage de chevre", "yaourt", "gruyere", "emmental", "comte", "ricotta", "mascarpone"];
const MOTS_FRUITS_COQUE = ["noix", "noisette", "amande", "pignons de pin", "pistache", "noix de cajou"];
const MOTS_PORC = ["jambon", "jambon cru", "lardons", "poitrine fumee", "saucisse", "chorizo", "porc", "bacon"];
function detecter(noms) {
  const c = noms.map(canonique);
  // Un mot compte aussi au milieu du nom (« tranches de pain »), sauf s'il est suivi de « de » (« lait de coco »).
  const contientMot = (n, m) => { const mots = n.split(" "), k = mots.indexOf(m); return k >= 0 && !["de", "d"].includes(mots[k + 1]); };
  const a = liste => c.some(n => liste.some(m => correspond(n, normaliser(m)) || (!normaliser(m).includes(" ") && contientMot(n, normaliser(m)))));
  const cats = noms.map(n => classer(n).categorie);
  const regime = cats.includes("viandes") ? "viande" : cats.includes("poissons") ? "poisson"
    : (cats.includes("cremerie") || a(["miel"])) ? "vege" : "vegan";
  const allergenes = [];
  if (a(MOTS_GLUTEN)) allergenes.push("gluten");
  if (a(MOTS_LACTOSE)) allergenes.push("lactose");
  if (a(["oeuf"])) allergenes.push("oeuf");
  if (a(MOTS_FRUITS_COQUE)) allergenes.push("fruits à coque");
  return { regime, allergenes, porc: a(MOTS_PORC), miel: a(["miel"]) };
}

// Lit une ligne d'ingrédient : « poireau : 3 », « 200 g de farine » ou « sel ».
function lireIngredient(ligne) {
  const t = ligne.trim().replace(/^[-•*]\s*/, "");
  if (!t) return null;
  if (t.includes(":")) { const [nom, ...q] = t.split(":"); return { nom: nom.trim(), qte: q.join(":").trim() }; }
  const m = t.match(/^(\d+(?:[.,]\d+)?(?:\/\d+)?\s*(?:kg|g|mg|cl|ml|dl|l|c\. ?à ?(?:soupe|café)|cuill[eè]res? à (?:soupe|café)|pinc[ée]es?|tranches?|gousses?|bottes?|bouquets?|filets?|pavés?|boîtes?|sachets?|verres?|tasses?)?)\s+(?:de |d'|d’)?(.+)$/i);
  if (m) return { nom: m[2].trim(), qte: m[1].trim() };
  return { nom: t, qte: "" };
}

// Vérifie une recette importée ou saisie et la remet au format du site.
function normaliserRecette(r) {
  if (!r || typeof r !== "object") return null;
  const nom = String(r.nom || "").trim().slice(0, 120);
  const ingr = (Array.isArray(r.ingr) ? r.ingr : []).map(String).map(l => l.trim()).filter(Boolean).slice(0, 60);
  const etapes = (Array.isArray(r.etapes) ? r.etapes : []).map(String).map(e => e.trim()).filter(Boolean).slice(0, 40);
  const temps = Math.round(Number(r.temps));
  if (!nom || !ingr.length || !etapes.length || !(temps > 0)) return null;
  const types = ["plat", "soupe", "entrée", "accompagnement", "dessert"];
  const saisons = (Array.isArray(r.saisons) ? r.saisons : []).filter(x => SAISONS.includes(x));
  const auto = detecter(ingr.map(nomIngredient));
  return {
    id: typeof r.id === "string" && r.id ? r.id : "m" + Math.random().toString(36).slice(2, 10),
    perso: true, nom, ingr, etapes, temps: Math.min(temps, 24 * 60),
    type: types.includes(r.type) ? r.type : "plat",
    saisons: saisons.length ? saisons : [...SAISONS],
    regime: ["vegan", "vege", "poisson", "viande"].includes(r.regime) ? r.regime : auto.regime,
    allergenes: [...new Set([...(Array.isArray(r.allergenes) ? r.allergenes : []), ...auto.allergenes])].filter(x => ["gluten", "lactose", "oeuf", "fruits à coque"].includes(x)),
    porc: !!r.porc || auto.porc,
    epice: !!r.epice, enfants: r.enfants !== false, tendre: !!r.tendre,
    alertes: auto.miel ? ["miel"] : [],
    personnes: Math.max(1, Math.min(50, Math.round(Number(r.personnes)) || 4)),
    photo: typeof r.photo === "string" && /^data:image\/(jpeg|png|webp);base64,/.test(r.photo) ? r.photo : "",
  };
}

// Ingrédients qui manquent pour les recettes les plus proches, classés par nombre de recettes qu'ils débloquent.
// « Qui cuisine » : repère dans une étape ce qu'un adulte doit faire selon l'âge du cuisinier.
const RISQUES = [
  { id: "four", libelle: "le four", motif: /\bfour\b|enfourn|gratin(?:er|ez)|°\s?C/i },
  { id: "eau", libelle: "l'eau bouillante", motif: /eau bouillante|bouillante|égoutt|blanchir|ébullition|bain-marie/i },
  { id: "feu", libelle: "la cuisson sur le feu", motif: /\bcuire|cuisson|faire revenir|revenir|dorer|saisir|sauter|poêl|casserole|cocotte|mijot|frém|caramélis|fondre|griller|torréfi|\bréchauffer|suer|nacrer|faire tomber|tomber les|pocher|roux|feu (?:vif|doux)|sirop/i },
  { id: "couteau", libelle: "le couteau", motif: /couper|coupez|émincer|émincé|hacher|haché|trancher|tranche|tronçon|découper|ciseler|ciselé|dénoyaut|évider|éplucher|peler|en dés|rondelles|lanières|quartiers|julienne|fendre|zeste|piquer/i },
  { id: "mixeur", libelle: "le mixeur", motif: /\bmix(?:er|ez|é)|blender/i },
  { id: "rape", libelle: "la râpe", motif: /râp(?:er|ez|é)/i },
];
// Ce qu'un adulte doit obligatoirement faire selon la tranche d'âge (ado 12-18 ans, enfant 6-12 ans, jeune enfant 1-6 ans).
const RISQUES_PAR_CUISINIER = {
  adulte: [],
  ado: ["eau", "mixeur"],
  enfant: ["four", "eau", "feu", "couteau", "mixeur"],
  jeune: ["four", "eau", "feu", "couteau", "mixeur", "rape"],
};
function etapesAdulte(etape, cuisinier) {
  const interdits = RISQUES_PAR_CUISINIER[cuisinier] || [];
  return RISQUES.filter(r => interdits.includes(r.id) && r.motif.test(etape)).map(r => r.libelle);
}

// Identifiant stable d'une recette (pour les notes et commentaires).
function cleRecette(r) { return r.perso ? "perso:" + r.id : "base:" + r.nom; }

function ingredientsManquants(options, limite = 40) {
  const { resultats } = proposer({ ...options, tri: "pertinence", complet: false });
  let maxManquants = 2, candidats = [];
  while (maxManquants <= 6) {
    candidats = resultats.filter(x => x.total > x.dispo && x.total - x.dispo <= maxManquants);
    if (candidats.length >= 20) break;
    maxManquants++;
  }
  const parNom = new Map();
  for (const x of candidats) {
    for (const l of x.lignes) {
      if (l.frigo || l.base) continue;
      const nom = nomIngredient(l.ligne), cle = canonique(nom);
      if (!parNom.has(cle)) parNom.set(cle, { nom, recettes: [], deSaison: 0, occasion: 0 });
      const e = parNom.get(cle);
      e.recettes.push(x.recette.nom);
      if (x.deSaison) e.deSaison++;
      if (x.pourOccasion) e.occasion++;
    }
  }
  return [...parNom.values()]
    .sort((a, b) => (b.occasion - a.occasion) || (b.deSaison - a.deSaison) || (b.recettes.length - a.recettes.length) || a.nom.localeCompare(b.nom))
    .slice(0, limite);
}

function ajusterQuantite(qte, personnes, nom = "", base = 4) {
  const m = qte.match(/^(\d+(?:,\d+)?)(?:\/(\d+))?(.*)$/);
  if (!m || personnes === base) return qte;
  if (/p[aâ]te bris|^poulet$/.test(nom) || /entier/.test(qte)) return qte; // une tarte ou un poulet ne se coupe pas
  if (!m[3].trim()) { // ingrédients comptés à l'unité : on arrondit au supérieur
    const n = parseFloat(m[1].replace(",", ".")) / (m[2] ? Number(m[2]) : 1) * personnes / base;
    return String(Math.max(1, Math.ceil(n - 0.01)));
  }
  let v = parseFloat(m[1].replace(",", ".")) / (m[2] ? Number(m[2]) : 1);
  v = v * personnes / base;
  const reste = m[3];
  let txt;
  if (v >= 100) txt = String(Math.round(v / 10) * 10);
  else if (v >= 10) txt = String(Math.round(v));
  else if (/^\s*(kg|l)\b/.test(reste)) txt = String(Math.round(v * 10) / 10).replace(".", ",");
  else {
    const demi = Math.round(v * 2) / 2;
    const r = demi === 0 ? 0.5 : demi;
    txt = Number.isInteger(r) ? String(r) : (r === 0.5 ? "1/2" : String(r).replace(".", ","));
  }
  return txt + reste;
}

if (typeof module !== "undefined") {
  module.exports = { normaliser, canonique, correspond, incompatibilite, proposer, ajusterQuantite, saisonDuMois, conseils, profilRecette, classer, ingredientsManquants, detecter, lireIngredient, normaliserRecette, cleRecette, etapesAdulte };
}

// ============ Interface ============

if (typeof document !== "undefined") {
  const CLE = "frigo-saison-v1";
  const nouvelId = () => "p" + Math.random().toString(36).slice(2, 10);

  function charger() { try { return JSON.parse(localStorage.getItem(CLE)); } catch (e) { return null; } }
  function sauver() {
    const { edition, aSupprimer, ...aGarder } = etat;
    try { localStorage.setItem(CLE, JSON.stringify(aGarder)); return true; } catch (e) { return false; }
  }

  const etat = charger() || {
    connus: [], frigo: [], placard: true,
    carnet: [{ id: nouvelId(), nom: "Moi", age: "", regimes: [], allergies: [], degouts: "" }],
    type: "tout", tempsMax: 0, tri: "pertinence",
  };
  // Reprise des données enregistrées par les versions précédentes du site.
  if (etat.profils) {
    etat.carnet = etat.profils.map(p => ({ id: nouvelId(), nom: p.nom || "", age: p.age || "", regimes: regimesDe(p), allergies: p.allergies || [], degouts: p.degouts || "" }));
    delete etat.profils;
  }
  if (!etat.convives) etat.convives = etat.carnet.map(p => p.id);
  if (!etat.connus) etat.connus = [...etat.frigo];
  if (!etat.tri) etat.tri = "pertinence";
  if (!etat.tempsMax) etat.tempsMax = 0;
  if (!Array.isArray(etat.autour)) etat.autour = [];
  if (typeof etat.occasion !== "string") etat.occasion = "";
  if (!etat.cuisinier) etat.cuisinier = "adulte";
  if (!etat.avis || typeof etat.avis !== "object") etat.avis = {};
  etat.mesRecettes = (Array.isArray(etat.mesRecettes) ? etat.mesRecettes : []).map(normaliserRecette).filter(Boolean);
  const toutesRecettes = () => [...RECETTES, ...etat.mesRecettes];
  etat.saison = etat.saisonManuelle ? etat.saison : saisonDuMois(new Date().getMonth() + 1);
  etat.edition = null; etat.aSupprimer = null;
  let affichees = 12;

  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const convives = () => etat.carnet.filter(p => etat.convives.includes(p.id));

  // --- Frigo : chaque ingrédient saisi est gardé et se coche / décoche ---
  const estCoche = nom => etat.frigo.some(f => canonique(f) === canonique(nom));

  // Regroupe des noms par rayon, dans l'ordre des rayons, chaque colonne triée par ordre alphabétique.
  function parRayon(elements, nomDe) {
    const rayons = [...CATEGORIES, AUTRES].map(c => ({ ...c, elements: [] }));
    for (const el of elements) rayons.find(r => r.id === classer(nomDe(el)).categorie).elements.push(el);
    rayons.forEach(r => r.elements.sort((a, b) => normaliser(nomDe(a)).localeCompare(normaliser(nomDe(b)))));
    return rayons.filter(r => r.elements.length);
  }

  function rendreFrigo() {
    const rayons = parRayon(etat.connus.map((nom, i) => ({ nom, i })), x => x.nom);
    $("#puces").innerHTML = rayons.map(r => `
      <div class="colonne">
        <h3><span aria-hidden="true">${r.icone}</span> ${esc(r.nom)}</h3>
        ${r.elements.map(({ nom, i }) => {
          const on = estCoche(nom);
          return `<label class="ligne-ing${on ? " on" : ""}"><input type="checkbox" data-ing="${i}"${on ? " checked" : ""}> <span title="${esc(nom)}">${esc(nom)}</span><button type="button" class="oublier" data-oublier="${i}" aria-label="Retirer ${esc(nom)} de la liste" title="Retirer de la liste">×</button></label>`;
        }).join("")}
      </div>`).join("") || `<p class="vide">Aucun ingrédient pour l'instant. Ceux que vous ajoutez restent ici, rangés par rayon, pour les prochaines fois.</p>`;
    const n = etat.frigo.length;
    $("#compte-frigo").textContent = etat.connus.length ? `${n} coché${n > 1 ? "s" : ""} sur ${etat.connus.length}` : "";
    $("#actions-frigo").hidden = !etat.connus.length;
    $("#placard").checked = etat.placard;
  }
  function ajouterFrigo(texte) {
    texte.split(/[,;\n]/).map(t => t.trim()).filter(Boolean).forEach(t => {
      if (!etat.connus.some(f => canonique(f) === canonique(t))) etat.connus.push(t);
      const nom = etat.connus.find(f => canonique(f) === canonique(t));
      if (!estCoche(nom)) etat.frigo.push(nom);
    });
    rendreFrigo(); maj();
  }
  $("#ajout-ingredient").addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); ajouterFrigo(e.target.value); e.target.value = ""; }
  });
  $("#bouton-ajout").addEventListener("click", () => { const c = $("#ajout-ingredient"); ajouterFrigo(c.value); c.value = ""; c.focus(); });
  $("#puces").addEventListener("change", e => {
    if (e.target.dataset.ing == null) return;
    const nom = etat.connus[Number(e.target.dataset.ing)];
    etat.frigo = e.target.checked ? [...etat.frigo, nom] : etat.frigo.filter(f => canonique(f) !== canonique(nom));
    rendreFrigo(); maj();
  });
  $("#puces").addEventListener("click", e => {
    if (e.target.dataset.oublier == null) return;
    e.preventDefault();
    const nom = etat.connus[Number(e.target.dataset.oublier)];
    etat.connus = etat.connus.filter(f => f !== nom);
    etat.frigo = etat.frigo.filter(f => canonique(f) !== canonique(nom));
    rendreFrigo(); maj();
  });
  $("#tout-cocher").addEventListener("click", () => { etat.frigo = [...etat.connus]; rendreFrigo(); maj(); });
  $("#tout-decocher").addEventListener("click", () => { etat.frigo = []; rendreFrigo(); maj(); });
  $("#placard").addEventListener("change", e => { etat.placard = e.target.checked; maj(); });

  // --- Profils enregistrés ---
  const ALLERGIES = [["gluten", "Gluten"], ["lactose", "Lactose"], ["oeuf", "Œuf"], ["fruits à coque", "Fruits à coque"], ["poisson", "Poisson / fruits de mer"], ["porc", "Sans porc"]];
  const REGIMES = [
    ["vegetarien", "Végétarien", "Ni viande ni poisson"],
    ["vegetalien", "Végétalien (vegan)", "Aucun produit animal"],
    ["pescetarien", "Pescétarien", "Pas de viande, poisson autorisé"],
    ["endometriose", "Anti-inflammatoire", "Sans viande rouge, charcuterie, alcool ni sucre ajouté"],
    ["lowcarb", "Low carb", "Sans féculents (pâtes, riz, pain, pommes de terre, légumineuses) ni sucre"],
    ["microbiote", "Microbiote", "Riche en fibres végétales, sans charcuterie ni sucre ajouté"],
  ];
  const libelle = (liste, v) => (liste.find(x => x[0] === v) || [v, v])[1];

  function resumeProfil(p) {
    const morceaux = [];
    if (p.age !== "" && p.age != null && !isNaN(Number(p.age))) morceaux.push(formatAge(Number(p.age)));
    morceaux.push(p.regimes.length ? p.regimes.map(r => libelle(REGIMES, r)).join(", ") : "mange de tout");
    if (p.allergies.length) morceaux.push("sans " + p.allergies.map(a => a === "porc" ? "porc" : libelle(ALLERGIES, a).toLowerCase()).join(", "));
    if (String(p.degouts || "").trim()) morceaux.push("n'aime pas : " + p.degouts.trim());
    return morceaux.join(" · ");
  }

  function formulaire(p) {
    return `<fieldset class="profil" data-id="${p.id}">
      <div class="ligne">
        <label>Prénom<input data-champ="nom" value="${esc(p.nom)}" placeholder="Prénom"></label>
        <label class="petit">Âge (ans)<input data-champ="age" type="number" min="0" max="120" step="any" value="${esc(p.age)}" placeholder="ex. 35"></label>
      </div>
      <p class="sous-titre">Régimes <span>(plusieurs choix possibles, rien coché = mange de tout)</span></p>
      <div class="allergies">${REGIMES.map(([v, l, aide]) => `<label class="case" title="${esc(aide)}"><input type="checkbox" data-regime="${v}"${p.regimes.includes(v) ? " checked" : ""}> ${l}</label>`).join("")}</div>
      <p class="sous-titre">Allergies et interdits</p>
      <div class="allergies">${ALLERGIES.map(([v, l]) => `<label class="case"><input type="checkbox" data-allergie="${v}"${p.allergies.includes(v) ? " checked" : ""}> ${l}</label>`).join("")}</div>
      <label class="plein">N'aime pas<input data-champ="degouts" value="${esc(p.degouts)}" placeholder="ex. champignon, poivron"></label>
      <div class="pied-profil"><button type="button" data-terminer="${p.id}">Enregistrer</button></div>
    </fieldset>`;
  }

  function rendreProfils() {
    $("#profils").innerHTML = etat.carnet.map(p => {
      const on = etat.convives.includes(p.id);
      return `<div class="profil-ligne${on ? " on" : ""}">
        <label class="case convive"><input type="checkbox" data-convive="${p.id}"${on ? " checked" : ""}>
          <span><strong>${esc(p.nom || "Sans nom")}</strong><span class="resume-profil" data-resume="${p.id}">${esc(resumeProfil(p))}</span></span>
        </label>
        <span class="actions">
          <button type="button" class="lien" data-editer="${p.id}">${etat.edition === p.id ? "Fermer" : "Modifier"}</button>
          ${etat.aSupprimer === p.id
            ? `<button type="button" class="lien danger" data-confirmer="${p.id}">Confirmer la suppression</button>`
            : `<button type="button" class="lien" data-supprimer="${p.id}">Supprimer</button>`}
        </span>
      </div>${etat.edition === p.id ? formulaire(p) : ""}`;
    }).join("") || `<p class="vide">Aucun profil enregistré.</p>`;
    const n = convives().length;
    $("#compte-convives").textContent = `${n} personne${n > 1 ? "s" : ""} à table`;
  }

  $("#profils").addEventListener("input", e => {
    const f = e.target.closest(".profil"); if (!f) return;
    const p = etat.carnet.find(x => x.id === f.dataset.id);
    if (e.target.dataset.champ) p[e.target.dataset.champ] = e.target.value;
    if (e.target.dataset.allergie) {
      const a = e.target.dataset.allergie;
      p.allergies = e.target.checked ? [...new Set([...p.allergies, a])] : p.allergies.filter(x => x !== a);
    }
    if (e.target.dataset.regime) {
      const r = e.target.dataset.regime;
      p.regimes = e.target.checked ? [...new Set([...p.regimes, r])] : p.regimes.filter(x => x !== r);
    }
    const resume = document.querySelector(`[data-resume="${p.id}"]`);
    if (resume) resume.textContent = resumeProfil(p);
    const titre = resume && resume.previousElementSibling; if (titre) titre.textContent = p.nom || "Sans nom";
    maj();
  });
  $("#profils").addEventListener("change", e => {
    const id = e.target.dataset.convive; if (!id) return;
    etat.convives = e.target.checked ? [...etat.convives, id] : etat.convives.filter(x => x !== id);
    rendreProfils(); maj();
  });
  $("#profils").addEventListener("click", e => {
    const d = e.target.dataset;
    if (d.editer) { etat.edition = etat.edition === d.editer ? null : d.editer; etat.aSupprimer = null; rendreProfils(); }
    else if (d.terminer) { etat.edition = null; rendreProfils(); }
    else if (d.supprimer) { etat.aSupprimer = d.supprimer; rendreProfils(); }
    else if (d.confirmer) {
      etat.carnet = etat.carnet.filter(p => p.id !== d.confirmer);
      etat.convives = etat.convives.filter(x => x !== d.confirmer);
      if (etat.edition === d.confirmer) etat.edition = null;
      etat.aSupprimer = null; rendreProfils(); maj();
    }
  });
  $("#ajout-profil").addEventListener("click", () => {
    const p = { id: nouvelId(), nom: "", age: "", regimes: [], allergies: [], degouts: "" };
    etat.carnet.push(p); etat.convives.push(p.id); etat.edition = p.id; etat.aSupprimer = null;
    rendreProfils(); maj();
    const champ = document.querySelector(`.profil[data-id="${p.id}"] [data-champ="nom"]`); if (champ) champ.focus();
  });

  // --- Options ---
  $("#saison").addEventListener("change", e => { etat.saison = e.target.value; etat.saisonManuelle = true; maj(); });
  $("#type").addEventListener("change", e => { etat.type = e.target.value; maj(); });
  // Curseur « Timing » : de la recette la plus rapide à la plus longue ; tout à droite = pas de limite.
  const dureeTexte = v => v >= 60 ? `${Math.floor(v / 60)} h${v % 60 ? " " + String(v % 60).padStart(2, "0") : ""}` : `${v} min`;
  const TEMPS_MIN = Math.min(...RECETTES.map(r => r.temps));
  const TEMPS_MAX = Math.ceil(Math.max(...RECETTES.map(r => r.temps)) / 5) * 5;
  const PAS_DE_LIMITE = TEMPS_MAX;
  const libelleTemps = v => v >= PAS_DE_LIMITE ? "toutes durées" : "jusqu'à " + dureeTexte(v);
  $("#temps-max").min = TEMPS_MIN; $("#temps-max").max = TEMPS_MAX;
  $("#temps-min-label").textContent = dureeTexte(TEMPS_MIN);
  $("#temps-max-label").textContent = dureeTexte(TEMPS_MAX);
  $("#temps-max").addEventListener("input", e => {
    const v = Number(e.target.value);
    etat.tempsMax = v >= PAS_DE_LIMITE ? 0 : v;
    $("#temps-max-valeur").textContent = libelleTemps(v);
    e.target.setAttribute("aria-valuetext", libelleTemps(v));
    maj();
  });
  $("#tri").addEventListener("change", e => { etat.tri = e.target.value; maj(); });
  $("#occasion").addEventListener("change", e => { etat.occasion = e.target.value; maj(); });
  $("#cuisinier").addEventListener("change", e => { etat.cuisinier = e.target.value; maj(); });

  // --- « Je veux faire une recette autour de » : 1 à 3 ingrédients obligatoires ---
  function rendreAutour() {
    $("#autour-puces").innerHTML = etat.autour.map((nom, i) =>
      `<span class="puce-autour">${esc(classer(nom).emoji)} ${esc(nom)}<button type="button" data-retirer-autour="${i}" aria-label="Retirer ${esc(nom)}">×</button></span>`).join("");
    const plein = etat.autour.length >= 3;
    $("#autour-saisie").disabled = plein; $("#autour-ajout").disabled = plein;
    $("#autour-saisie").placeholder = plein ? "3 ingrédients maximum" : "ex. potiron, puis Entrée";
  }
  function remplirSuggestions() {
    const vus = new Set(), noms = [];
    for (const nom of [...etat.connus, ...toutesRecettes().flatMap(r => r.ingr.map(nomIngredient))]) {
      const c = canonique(nom); if (!vus.has(c)) { vus.add(c); noms.push(nom); }
    }
    noms.sort((a, b) => normaliser(a).localeCompare(normaliser(b)));
    $("#liste-ingredients").innerHTML = noms.map(n => `<option value="${esc(n)}"></option>`).join("");
  }
  function ajouterAutour() {
    const champ = $("#autour-saisie");
    champ.value.split(/[,;]/).map(t => t.trim()).filter(Boolean).forEach(t => {
      if (etat.autour.length < 3 && !etat.autour.some(a => canonique(a) === canonique(t))) etat.autour.push(t);
    });
    champ.value = ""; rendreAutour(); maj();
  }
  $("#autour-saisie").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); ajouterAutour(); } });
  $("#autour-saisie").addEventListener("change", e => { if (e.target.value && $("#liste-ingredients").querySelector(`option[value="${CSS.escape ? CSS.escape(e.target.value) : e.target.value}"]`)) ajouterAutour(); });
  $("#autour-ajout").addEventListener("click", ajouterAutour);
  $("#autour-puces").addEventListener("click", e => {
    const i = e.target.dataset.retirerAutour; if (i == null) return;
    etat.autour.splice(Number(i), 1); rendreAutour(); maj();
  });
  $("#plus").addEventListener("click", () => { affichees += 10; rendreResultats(); });

  // --- Étape « Avez-vous aussi… ? » ---
  const optionsRecherche = () => ({ recettes: toutesRecettes(), frigo: etat.frigo, avecPlacard: etat.placard, profils: convives(), saison: etat.saison, type: etat.type, tempsMax: etat.tempsMax, tri: etat.tri, occasion: etat.occasion, autour: etat.autour, notes: notesParRecette() });
  if (!etat.etape) etat.etape = "saisie";
  if (!etat.question) etat.question = [];

  function rendreEtapes() {
    $("#question").hidden = etat.etape === "saisie" || !etat.question.length;
    $("#zone-resultats").hidden = etat.etape !== "resultats";
    $("#chercher").textContent = etat.etape === "saisie" ? "Trouver des recettes" : "Relancer la recherche";
    $("#valider-question").hidden = etat.etape === "resultats";
    rendreQuestion();
  }

  function rendreQuestion() {
    if (!etat.question.length) { $("#question-liste").innerHTML = ""; return; }
    $("#question-intro").textContent = etat.etape === "resultats"
      ? "Cochez ou décochez : les recettes ci-dessous se mettent à jour."
      : "Ces ingrédients manquent pour des recettes qui vous correspondent. Cochez ceux que vous avez : seules les recettes dont vous avez tous les ingrédients seront proposées.";
    const rayons = parRayon(etat.question, q => q.nom);
    $("#question-liste").innerHTML = rayons.map(r => `
      <div class="colonne">
        <h3><span aria-hidden="true">${r.icone}</span> ${esc(r.nom)}</h3>
        ${r.elements.map(q => {
          const on = estCoche(q.nom);
          const n = q.recettes.length;
          return `<label class="ligne-ing${on ? " on" : ""}" title="${esc("Pour : " + q.recettes.join(", "))}"><input type="checkbox" data-question="${esc(q.nom)}"${on ? " checked" : ""}> <span>${esc(q.nom)} <small>${n} recette${n > 1 ? "s" : ""}</small></span></label>`;
        }).join("")}
      </div>`).join("");
  }

  $("#chercher").addEventListener("click", () => {
    etat.question = ingredientsManquants(optionsRecherche()).map(q => ({ nom: q.nom, recettes: q.recettes }));
    etat.etape = etat.question.length ? "question" : "resultats";
    sauver(); rendreEtapes(); rendreResultats();
    (etat.etape === "question" ? $("#question") : $("#zone-resultats")).scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("#question-liste").addEventListener("change", e => {
    const nom = e.target.dataset.question; if (!nom) return;
    if (e.target.checked) {
      if (!etat.connus.some(f => canonique(f) === canonique(nom))) etat.connus.push(nom);
      if (!estCoche(nom)) etat.frigo.push(etat.connus.find(f => canonique(f) === canonique(nom)));
    } else {
      etat.frigo = etat.frigo.filter(f => canonique(f) !== canonique(nom));
    }
    rendreFrigo(); rendreQuestion(); maj();
  });
  $("#valider-question").addEventListener("click", () => {
    etat.etape = "resultats"; sauver(); rendreEtapes(); rendreResultats();
    $("#zone-resultats").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // --- Résultats : uniquement les recettes dont on a tous les ingrédients ---
  const ETIQ_REGIME = { vegan: "Vegan", vege: "Végétarien", poisson: "Poisson", viande: "Viande" };

  function rendreResultats() {
    if (etat.etape !== "resultats") return;
    const table = convives();
    const { resultats } = proposer({ ...optionsRecherche(), profils: table, complet: true });
    const n = Math.max(1, table.length);
    const nbSaison = resultats.filter(r => r.deSaison).length;
    let resume = resultats.length
      ? `${resultats.length} recette${resultats.length > 1 ? "s" : ""} réalisable${resultats.length > 1 ? "s" : ""} avec ce que vous avez, dont ${nbSaison} de saison (${NOMS_SAISONS[etat.saison].toLowerCase()}). Quantités pour ${n} personne${n > 1 ? "s" : ""}.`
      : "Aucune recette n'est réalisable avec tous les ingrédients cochés pour l'instant. Cochez les ingrédients que vous avez dans la liste ci-dessus, ou ajoutez-en au frigo.";
    if (!table.length) resume += " Aucune personne cochée : les profils ne sont pas pris en compte.";
    if (resultats.length && resultats.length < 10) resume += " Pour plus d'idées, cochez d'autres ingrédients" + (etat.tempsMax ? " ou allongez le temps maximum." : ".");
    $("#resume").textContent = resume;

    if (etat.autour.length) resume += ` Toutes contiennent : ${etat.autour.join(", ")}.`;
    if (etat.occasion) {
      const nbOcc = resultats.filter(x => x.pourOccasion).length;
      resume += nbOcc ? ` ${nbOcc} idée${nbOcc > 1 ? "s" : ""} pour ${ICONES_OCCASION[etat.occasion]} en tête de liste.` : ` Aucune recette spéciale ${ICONES_OCCASION[etat.occasion]} avec ces ingrédients : relancez la recherche pour voir ce qu'il manque.`;
    }
    if (etat.cuisinier !== "adulte") resume += ` Cuisinier : ${NOMS_CUISINIER[etat.cuisinier]}, les gestes réservés aux adultes sont signalés en rouge.`;
    $("#resume").textContent = resume;
    derniersResultats = new Map();
    $("#resultats").innerHTML = resultats.slice(0, affichees).map(x => carte(x, n)).join("");
    $("#plus").hidden = resultats.length <= affichees;
  }

  // --- Notes et commentaires (gardés dans le navigateur) ---
  const avisDe = r => etat.avis[cleRecette(r)] || { note: 0, commentaires: [] };
  function notesParRecette() {
    const n = {}; for (const [k, v] of Object.entries(etat.avis)) if (v.note) n[k] = v.note; return n;
  }
  function etoiles(r, interactif) {
    const note = avisDe(r).note || 0, cle = esc(cleRecette(r));
    if (!interactif) return note ? `<span class="etoiles-lecture" aria-label="Noté ${note} sur 5">${"★".repeat(note)}<span class="vide">${"★".repeat(5 - note)}</span></span>` : "";
    return `<span class="etoiles" role="group" aria-label="Noter cette recette">${[1, 2, 3, 4, 5].map(i =>
      `<button type="button" class="etoile${i <= note ? " on" : ""}" data-noter="${cle}" data-note="${i}" aria-label="${i} étoile${i > 1 ? "s" : ""} sur 5" aria-pressed="${i <= note}">★</button>`).join("")}</span>`;
  }
  function noter(cle, note) {
    const a = etat.avis[cle] || { note: 0, commentaires: [] };
    a.note = a.note === note ? 0 : note; // un second clic sur la même étoile retire la note
    etat.avis[cle] = a; sauver();
  }

  const ICONES_OCCASION = { noel: "🎄 Noël", halloween: "🎃 Halloween", paques: "🐣 Pâques", anniversaire: "🎂 Anniversaire" };
  const NOMS_CUISINIER = { ado: "un ado (12-18 ans)", enfant: "un enfant (6-12 ans)", jeune: "un jeune enfant (1-6 ans)" };
  const dureeCourte = t => t >= 60 ? `${Math.floor(t / 60)} h${t % 60 ? String(t % 60).padStart(2, "0") : ""}` : `${t} min`;
  const groupeDe = r => r.type === "dessert" ? "dessert" : (r.type === "entrée" || r.type === "accompagnement") ? "entree" : "plat";
  let derniersResultats = new Map(); // clé de recette → résultat affiché, pour la grande vue

  function badgesDe(x, max = 99) {
    const r = x.recette;
    return [
      x.pourOccasion ? `<span class="badge occasion">${ICONES_OCCASION[etat.occasion]}</span>` : "",
      r.perso ? `<span class="badge perso">Ma recette</span>` : "",
      x.deSaison ? `<span class="badge saison">De saison</span>` : `<span class="badge hors">Hors saison</span>`,
      `<span class="badge">${ETIQ_REGIME[r.regime]}</span>`,
      r.allergenes.includes("gluten") ? "" : `<span class="badge">Sans gluten</span>`,
      r.allergenes.includes("lactose") ? "" : `<span class="badge">Sans lactose</span>`,
      profilRecette(r).lowCarb ? `<span class="badge">Low carb</span>` : "",
      profilRecette(r).fibres >= 3 ? `<span class="badge">Riche en fibres</span>` : "",
      r.epice ? `<span class="badge">Épicé</span>` : "",
    ].filter(Boolean).slice(0, max).join("");
  }
  const listeIngredients = (x, n) => `<ul class="ingr">${x.lignes.map(l => `<li class="${l.frigo ? "ok" : l.base ? "base" : ""}">${esc(nomIngredient(l.ligne))}${qteIngredient(l.ligne) ? ` <span class="qte">${esc(ajusterQuantite(qteIngredient(l.ligne), n, nomIngredient(l.ligne), x.recette.personnes || 4))}</span>` : ""}</li>`).join("")}</ul>`;

  // Tuile recto/verso : recto = photo et titre, verso = ingrédients et bouton « C'est parti ! ».
  function carte(x, n) {
    const r = x.recette, cle = esc(cleRecette(r)), nbCom = avisDe(r).commentaires.length;
    derniersResultats.set(cleRecette(r), x);
    return `<article class="tuile groupe-${groupeDe(r)}" data-cle="${cle}" tabindex="0" role="button" aria-pressed="false" aria-label="${esc(r.nom)} : retourner la tuile pour voir la recette">
      <div class="tuile-interieur">
        <div class="face recto">
          ${visuel(r)}
          <header class="titre-recette"><h3>${esc(r.nom)}</h3><span class="meta">${esc(r.type)} · ⏱ ${dureeCourte(r.temps)} ${etoiles(r, false)}</span></header>
          <div class="badges">${badgesDe(x, 3)}</div>
          <span class="retourner" aria-hidden="true">↻ Voir la recette</span>
        </div>
        <div class="face verso">
          <header class="titre-recette"><h3>${esc(r.nom)}</h3><span class="meta">⏱ ${dureeCourte(r.temps)} · pour ${n} pers.</span></header>
          <div class="verso-corps">
            <p class="sous-titre">Ingrédients</p>
            ${listeIngredients(x, n)}
            <p class="verso-etapes">${r.etapes.length} étape${r.etapes.length > 1 ? "s" : ""}${etat.cuisinier !== "adulte" && r.etapes.some(e => etapesAdulte(e, etat.cuisinier).length) ? ` · <span class="alerte-adulte">avec l'aide d'un adulte</span>` : ""}</p>
          </div>
          <div class="verso-pied">
            ${etoiles(r, true)}
            <span class="nb-com">💬 ${nbCom}</span>
            <button type="button" class="principal cest-parti" data-ouvrir="${cle}">C'est parti !</button>
          </div>
        </div>
      </div>
    </article>`;
  }

  // Grande vue de la recette.
  let dernierFocus = null;
  function ouvrirRecette(cle) {
    const x = derniersResultats.get(cle); if (!x) return;
    const r = x.recette, table = convives(), n = Math.max(1, table.length), a = avisDe(r), avis = conseils(r, table);
    const cuisinier = etat.cuisinier;
    const etapes = r.etapes.map(e => {
      const adulte = etapesAdulte(e, cuisinier);
      return adulte.length
        ? `<li class="etape-adulte">${esc(e)}<span class="mention-adulte">⚠️ À faire par un adulte : ${esc(adulte.join(", "))}.</span></li>`
        : `<li>${esc(e)}</li>`;
    }).join("");
    $("#modale-contenu").innerHTML = `
      <div class="grande groupe-${groupeDe(r)}">
        ${visuel(r)}
        <header class="titre-recette"><h2 id="modale-titre">${esc(r.nom)}</h2><span class="meta">${esc(r.type)} · ⏱ ${dureeCourte(r.temps)} (préparation + cuisson) · pour ${n} personne${n > 1 ? "s" : ""}</span></header>
        <div class="grande-corps">
          <div class="badges">${badgesDe(x)}</div>
          ${cuisinier !== "adulte" ? `<p class="bandeau-cuisinier">Recette réalisée par ${NOMS_CUISINIER[cuisinier]} : les étapes <strong>en rouge</strong> doivent obligatoirement être faites par un adulte.</p>` : ""}
          ${avis.length ? `<ul class="avis">${avis.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
          <div class="grande-colonnes">
            <div><h3>Ingrédients</h3>${listeIngredients(x, n)}<p class="note">+ sel, poivre, huile et eau.</p></div>
            <div><h3>Préparation</h3><ol class="etapes">${etapes}</ol></div>
          </div>
          <div class="avis-recette">
            <h3>Votre avis</h3>
            <p>${etoiles(r, true)} <span class="aide-note">${a.note ? `Vous avez donné ${a.note}/5` : "Pas encore noté"}</span></p>
            <form class="form-commentaire" data-commenter="${esc(cleRecette(r))}">
              <label for="nouveau-commentaire">Ajouter un commentaire</label>
              <textarea id="nouveau-commentaire" rows="2" maxlength="500" placeholder="ex. J'ai ajouté une pincée de muscade, un régal !"></textarea>
              <button type="submit">Publier</button>
            </form>
            <ul class="commentaires">${a.commentaires.map((c, i) => `<li><p>${esc(c.texte)}</p><small>${esc(new Date(c.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }))} · <button type="button" class="lien" data-supprimer-com="${esc(cleRecette(r))}" data-i="${i}">Supprimer</button></small></li>`).reverse().join("") || `<li class="vide">Aucun commentaire pour l'instant.</li>`}</ul>
          </div>
          ${r.perso ? `<p class="actions-carte"><button type="button" class="lien" data-modifier-recette="${r.id}">Modifier ma recette</button></p>` : ""}
        </div>
      </div>`;
    if ($("#modale").hidden) dernierFocus = document.activeElement;
    $("#modale").hidden = false; document.body.classList.add("modale-ouverte");
    $(".modale-boite").focus();
  }
  function fermerRecette() {
    $("#modale").hidden = true; document.body.classList.remove("modale-ouverte");
    if (dernierFocus && dernierFocus.focus) dernierFocus.focus();
  }

  // Clics sur les tuiles (retourner), les étoiles, « C'est parti ! » et dans la grande vue.
  document.addEventListener("click", e => {
    const t = e.target;
    if (t.closest("[data-fermer]")) { fermerRecette(); return; }
    const etoile = t.closest("[data-noter]");
    if (etoile) {
      noter(etoile.dataset.noter, Number(etoile.dataset.note));
      const ouverte = !$("#modale").hidden ? etoile.dataset.noter : null;
      rafraichirTuiles(); if (ouverte) ouvrirRecette(ouverte);
      return;
    }
    const ouvrir = t.closest("[data-ouvrir]");
    if (ouvrir) { ouvrirRecette(ouvrir.dataset.ouvrir); return; }
    const sup = t.closest("[data-supprimer-com]");
    if (sup) {
      const a = etat.avis[sup.dataset.supprimerCom]; a.commentaires.splice(Number(sup.dataset.i), 1); sauver();
      ouvrirRecette(sup.dataset.supprimerCom); rafraichirTuiles(); return;
    }
    const tuile = t.closest(".tuile");
    if (tuile && !t.closest("button, a, input, textarea, select, label")) retourner(tuile);
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !$("#modale").hidden) { fermerRecette(); return; }
    if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("tuile")) { e.preventDefault(); retourner(e.target); }
    // Garde le focus dans la grande vue tant qu'elle est ouverte.
    if (e.key === "Tab" && !$("#modale").hidden) {
      const f = [...document.querySelectorAll(".modale-boite button, .modale-boite textarea, .modale-boite a")].filter(el => !el.disabled);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  function retourner(tuile) {
    const r = tuile.classList.toggle("retournee");
    tuile.setAttribute("aria-pressed", String(r));
  }
  document.addEventListener("submit", e => {
    const f = e.target.closest("[data-commenter]"); if (!f) return;
    e.preventDefault();
    const texte = f.querySelector("textarea").value.trim(); if (!texte) return;
    const cle = f.dataset.commenter, a = etat.avis[cle] || { note: 0, commentaires: [] };
    a.commentaires.push({ texte: texte.slice(0, 500), date: new Date().toISOString() });
    etat.avis[cle] = a; sauver(); ouvrirRecette(cle); rafraichirTuiles();
  });
  // Met à jour les tuiles en gardant celles qui sont retournées.
  function rafraichirTuiles() {
    const retournees = new Set([...document.querySelectorAll(".tuile.retournee")].map(t => t.dataset.cle));
    rendreResultats();
    document.querySelectorAll(".tuile").forEach(t => { if (retournees.has(t.dataset.cle)) { t.classList.add("retournee"); t.setAttribute("aria-pressed", "true"); } });
  }

  // Visuel illustré : couleur selon le type de plat, pictogrammes des ingrédients principaux.
  const BASIQUES = new Set(["ail", "oignon", "echalote", "bouillon de legume", "huile", "vinaigre", "moutarde", "sucre", "farine", "beurre", "curry", "cumin", "cannelle", "thym", "vanille"]);
  function visuel(r) {
    const photo = r.photo ? { src: r.photo } : (typeof PHOTOS !== "undefined" && PHOTOS[r.nom]);
    if (photo) {
      const credit = photo.auteur
        ? `<a class="credit" href="${esc(photo.page)}" target="_blank" rel="noopener">Photo : ${esc(photo.auteur)} · ${esc(photo.licence)}</a>` : "";
      return `<figure class="photo"><img class="photo-fond" src="${esc(photo.src)}" alt="" aria-hidden="true" loading="lazy"><img class="photo-plat" src="${esc(photo.src)}" alt="${esc(r.nom)}" loading="lazy">${credit}</figure>`;
    }
    const vus = new Set(), icones = [];
    const principaux = r.ingr.map(nomIngredient).filter(n => !BASIQUES.has(canonique(n)));
    const ajouter = noms => { for (const nom of noms) { const e = classer(nom).emoji; if (!vus.has(e) && icones.length < 4) { vus.add(e); icones.push(e); } } };
    ajouter(principaux);
    if (icones.length < 2) ajouter(r.ingr.map(nomIngredient));
    const cle = normaliser(r.type).replace(/ /g, "-");
    return `<div class="visuel visuel-${cle}" role="img" aria-label="Illustration : ${esc(r.nom)}">
      <span class="visuel-type" aria-hidden="true">${ICONES_TYPE[r.type] || "🍽️"}</span>
      <span class="visuel-ingr" aria-hidden="true">${icones.join("")}</span>
    </div>`;
  }

  // --- Mon carnet de recettes : ajout, modification, import et export (gardées dans le navigateur) ---
  const NOMS_TYPES = [["plat", "🍽️ Plat"], ["soupe", "🍲 Soupe"], ["entrée", "🥗 Entrée"], ["accompagnement", "🥘 Accompagnement"], ["dessert", "🍰 Dessert"]];
  const NOMS_REGIMES_RECETTE = [["auto", "Détecté automatiquement"], ["vegan", "Vegan"], ["vege", "Végétarien"], ["poisson", "Avec poisson"], ["viande", "Avec viande"]];
  let brouillonPhoto = null; // photo en cours dans le formulaire

  function message(texte, erreur = false) {
    const m = $("#message-recettes"); m.textContent = texte; m.classList.toggle("erreur", erreur);
  }

  function formulaireRecette(r) {
    const v = r || { nom: "", type: "plat", temps: "", personnes: 4, saisons: [], ingr: [], etapes: [], allergenes: [], porc: false, epice: false, tendre: false, regime: "auto" };
    const lignes = v.ingr.map(l => qteIngredient(l) ? `${nomIngredient(l)} : ${qteIngredient(l)}` : nomIngredient(l)).join("\n");
    brouillonPhoto = r ? (r.photo || null) : null;
    return `<form id="form-recette" class="form-recette" novalidate data-id="${r ? r.id : ""}">
      <h3>${r ? "Modifier la recette" : "Nouvelle recette"}</h3>
      <div class="ligne">
        <label class="large">Nom de la recette<input name="nom" required maxlength="120" value="${esc(v.nom)}" placeholder="ex. Gratin de courgettes de mamie"></label>
        <label>Type<select name="type">${NOMS_TYPES.map(([k, l]) => `<option value="${k}"${v.type === k ? " selected" : ""}>${l}</option>`).join("")}</select></label>
        <label class="petit">Temps (min)<input name="temps" type="number" min="1" max="1440" required value="${esc(v.temps)}" placeholder="45"></label>
        <label class="petit">Pour (pers.)<input name="personnes" type="number" min="1" max="50" value="${esc(v.personnes || 4)}"></label>
      </div>
      <p class="sous-titre">Saisons <span>(rien coché = toute l'année)</span></p>
      <div class="allergies">${SAISONS.map(x => `<label class="case"><input type="checkbox" name="saisons" value="${x}"${r && v.saisons.length < 4 && v.saisons.includes(x) ? " checked" : ""}> ${ICONES_SAISON[x]} ${NOMS_SAISONS[x]}</label>`).join("")}</div>
      <div class="deux-colonnes">
        <label>Ingrédients <span class="indice">un par ligne, ex. « poireau : 3 » ou « 200 g de farine »</span>
          <textarea name="ingr" rows="8" required placeholder="poireau : 3\n200 g de farine\n20 cl de crème fraîche\noeuf : 2">${esc(lignes)}</textarea></label>
        <label>Étapes <span class="indice">une par ligne</span>
          <textarea name="etapes" rows="8" required placeholder="Émincer les poireaux.\nLes faire fondre 15 min au beurre.\n…">${esc(v.etapes.join("\n"))}</textarea></label>
      </div>
      <div class="ligne">
        <label>Régime<select name="regime">${NOMS_REGIMES_RECETTE.map(([k, l]) => `<option value="${k}"${(r ? v.regime : "auto") === k ? " selected" : ""}>${l}</option>`).join("")}</select></label>
        <label>Photo du plat (facultatif)<input name="photo" type="file" accept="image/*"></label>
      </div>
      <p class="sous-titre">Contient <span>(détecté d'après les ingrédients, complétez si besoin)</span></p>
      <div class="allergies">
        ${[["gluten", "Gluten"], ["lactose", "Lactose"], ["oeuf", "Œuf"], ["fruits à coque", "Fruits à coque"]].map(([k, l]) => `<label class="case"><input type="checkbox" name="allergenes" value="${k}"${v.allergenes.includes(k) ? " checked" : ""}> ${l}</label>`).join("")}
        <label class="case"><input type="checkbox" name="porc"${v.porc ? " checked" : ""}> Porc</label>
        <label class="case"><input type="checkbox" name="epice"${v.epice ? " checked" : ""}> Épicé</label>
        <label class="case"><input type="checkbox" name="tendre"${v.tendre ? " checked" : ""}> Texture fondante (tout-petits, seniors)</label>
      </div>
      <div id="apercu-photo" class="apercu-photo">${brouillonPhoto ? `<img src="${brouillonPhoto}" alt="Photo choisie">` : ""}</div>
      <p class="message erreur" id="erreur-recette" aria-live="polite"></p>
      <div class="pied-form">
        ${r ? `<button type="button" class="lien danger" id="supprimer-recette">Supprimer cette recette</button>` : "<span></span>"}
        <span><button type="button" class="secondaire" id="annuler-recette">Annuler</button> <button type="submit">Enregistrer la recette</button></span>
      </div>
    </form>`;
  }

  function ouvrirFormulaire(r) {
    $("#formulaire-recette").innerHTML = formulaireRecette(r);
    message("");
    $("#mes-recettes").scrollIntoView({ behavior: "smooth", block: "start" });
    $('#form-recette [name="nom"]').focus();
  }
  function fermerFormulaire() { $("#formulaire-recette").innerHTML = ""; brouillonPhoto = null; }

  function rendreMesRecettes() {
    const liste = etat.mesRecettes;
    $("#liste-mes-recettes").innerHTML = liste.map(r => `<li>
      <span><strong>${esc(r.nom)}</strong> <small>${esc(r.type)} · ${r.temps} min · ${r.ingr.length} ingrédients</small></span>
      <button type="button" class="lien" data-modifier-recette="${r.id}">Modifier</button></li>`).join("");
    $("#exporter").disabled = !liste.length;
    $("#titre-liste-carnet").hidden = !liste.length;
    if (typeof remplirSuggestions === "function") remplirSuggestions();
  }

  // Coche automatiquement les allergènes détectés quand on tape les ingrédients.
  $("#formulaire-recette").addEventListener("input", e => {
    if (e.target.name !== "ingr") return;
    const noms = e.target.value.split("\n").map(lireIngredient).filter(Boolean).map(x => x.nom);
    const d = detecter(noms);
    d.allergenes.forEach(a => { const c = document.querySelector(`#form-recette [name="allergenes"][value="${a}"]`); if (c) c.checked = true; });
    if (d.porc) document.querySelector('#form-recette [name="porc"]').checked = true;
  });

  // Photo : redimensionnée à 600 px de large pour rester légère dans le navigateur.
  $("#formulaire-recette").addEventListener("change", e => {
    if (e.target.name !== "photo" || !e.target.files[0]) return;
    const fichier = e.target.files[0];
    if (!fichier.type.startsWith("image/")) return;
    const lecteur = new FileReader();
    lecteur.onload = () => {
      const img = new Image();
      img.onload = () => {
        const l = Math.min(600, img.width), h = Math.round(img.height * l / img.width);
        const c = document.createElement("canvas"); c.width = l; c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, l, h);
        brouillonPhoto = c.toDataURL("image/jpeg", 0.8);
        $("#apercu-photo").innerHTML = `<img src="${brouillonPhoto}" alt="Photo choisie"> <button type="button" class="lien" id="retirer-photo">Retirer la photo</button>`;
      };
      img.src = lecteur.result;
    };
    lecteur.readAsDataURL(fichier);
  });

  $("#formulaire-recette").addEventListener("click", e => {
    if (e.target.id === "annuler-recette") fermerFormulaire();
    if (e.target.id === "retirer-photo") { brouillonPhoto = null; $("#apercu-photo").innerHTML = ""; }
    if (e.target.id === "supprimer-recette") {
      if (e.target.dataset.confirme) {
        const id = $("#form-recette").dataset.id;
        etat.mesRecettes = etat.mesRecettes.filter(r => r.id !== id);
        fermerFormulaire(); rendreMesRecettes(); maj(); message("Recette supprimée.");
      } else { e.target.dataset.confirme = "1"; e.target.textContent = "Confirmer la suppression"; }
    }
  });

  $("#formulaire-recette").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target, val = n => f.elements[n].value;
    const ingr = val("ingr").split("\n").map(lireIngredient).filter(Boolean).map(x => x.qte ? `${x.nom}|${x.qte}` : x.nom);
    const etapes = val("etapes").split("\n").map(x => x.trim()).filter(Boolean);
    const erreurs = [];
    if (!val("nom").trim()) erreurs.push("le nom");
    if (!(Number(val("temps")) > 0)) erreurs.push("le temps");
    if (!ingr.length) erreurs.push("au moins un ingrédient");
    if (!etapes.length) erreurs.push("au moins une étape");
    if (erreurs.length) { $("#erreur-recette").textContent = "Il manque " + erreurs.join(", ") + "."; return; }
    const coches = n => [...f.querySelectorAll(`[name="${n}"]:checked`)].map(c => c.value);
    const brut = {
      id: f.dataset.id || undefined, nom: val("nom"), type: val("type"), temps: val("temps"), personnes: val("personnes"),
      saisons: coches("saisons"), ingr, etapes, allergenes: coches("allergenes"),
      regime: val("regime") === "auto" ? undefined : val("regime"),
      porc: f.elements.porc.checked, epice: f.elements.epice.checked, tendre: f.elements.tendre.checked, photo: brouillonPhoto || "",
    };
    const r = normaliserRecette(brut);
    if (!r) { $("#erreur-recette").textContent = "La recette n'a pas pu être enregistrée."; return; }
    const i = etat.mesRecettes.findIndex(x => x.id === r.id);
    if (i >= 0) etat.mesRecettes[i] = r; else etat.mesRecettes.push(r);
    if (!sauver()) {
      if (i >= 0) etat.mesRecettes[i] = { ...r, photo: "" }; else etat.mesRecettes[etat.mesRecettes.length - 1].photo = "";
      sauver();
      message("Recette enregistrée, mais sans la photo : la mémoire du navigateur est pleine.", true);
    } else message(`« ${r.nom} » est enregistrée et sera proposée dès que vous aurez ses ingrédients.`);
    fermerFormulaire(); rendreMesRecettes(); maj();
  });

  $("#nouvelle-recette").addEventListener("click", () => ouvrirFormulaire(null));
  document.addEventListener("click", e => {
    const id = e.target.dataset && e.target.dataset.modifierRecette;
    if (id) { if (!$("#modale").hidden) fermerRecette(); ouvrirFormulaire(etat.mesRecettes.find(r => r.id === id)); }
  });

  $("#exporter").addEventListener("click", () => {
    const donnees = { format: "select-and-cook", version: 1, recettes: etat.mesRecettes.map(({ perso, ...r }) => r) };
    const lien = document.createElement("a");
    lien.href = URL.createObjectURL(new Blob([JSON.stringify(donnees, null, 2)], { type: "application/json" }));
    lien.download = "mes-recettes-select-and-cook.json";
    document.body.appendChild(lien); lien.click(); lien.remove();
    message(`${etat.mesRecettes.length} recette${etat.mesRecettes.length > 1 ? "s" : ""} exportée${etat.mesRecettes.length > 1 ? "s" : ""}. Vous pouvez envoyer ce fichier à un proche pour qu'il l'importe.`);
  });

  $("#bouton-importer").addEventListener("click", () => $("#importer").click());
  $("#importer").addEventListener("change", e => {
    const fichier = e.target.files[0]; if (!fichier) return;
    const lecteur = new FileReader();
    lecteur.onload = () => {
      let donnees;
      try { donnees = JSON.parse(lecteur.result); } catch (err) { message("Ce fichier n'est pas un fichier de recettes Select & Cook!.", true); return; }
      const brutes = Array.isArray(donnees) ? donnees : Array.isArray(donnees.recettes) ? donnees.recettes : [];
      const existants = new Set(toutesRecettes().map(r => normaliser(r.nom)));
      let ajoutees = 0, ignorees = 0;
      for (const b of brutes) {
        const r = normaliserRecette({ ...b, id: undefined });
        if (!r || existants.has(normaliser(r.nom))) { ignorees++; continue; }
        etat.mesRecettes.push(r); existants.add(normaliser(r.nom)); ajoutees++;
      }
      sauver(); rendreMesRecettes(); maj();
      message(ajoutees
        ? `${ajoutees} recette${ajoutees > 1 ? "s" : ""} importée${ajoutees > 1 ? "s" : ""}${ignorees ? ` (${ignorees} ignorée${ignorees > 1 ? "s" : ""} : déjà présentes ou incomplètes)` : ""}.`
        : "Aucune nouvelle recette dans ce fichier (déjà présentes ou incomplètes).", !ajoutees);
      e.target.value = "";
    };
    lecteur.readAsText(fichier);
  });

  let minuteur;
  function maj() {
    affichees = 12; sauver();
    clearTimeout(minuteur); minuteur = setTimeout(rendreResultats, 120);
  }

  $("#saison").innerHTML = SAISONS.map(s => `<option value="${s}"${s === etat.saison ? " selected" : ""}>${ICONES_SAISON[s]} ${NOMS_SAISONS[s]}</option>`).join("");
  $("#type").value = etat.type || "tout";
  $("#temps-max").value = String(etat.tempsMax || PAS_DE_LIMITE);
  $("#temps-max-valeur").textContent = libelleTemps(etat.tempsMax || PAS_DE_LIMITE);
  $("#temps-max").setAttribute("aria-valuetext", libelleTemps(etat.tempsMax || PAS_DE_LIMITE));
  $("#tri").value = etat.tri;
  $("#occasion").value = etat.occasion;
  $("#cuisinier").value = etat.cuisinier;
  rendreAutour(); remplirSuggestions();
  rendreFrigo(); rendreProfils(); rendreEtapes(); rendreResultats(); rendreMesRecettes(); sauver();
}
