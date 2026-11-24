// ============ Logique (testable sans navigateur) ============

const SAISONS = ["printemps", "été", "automne", "hiver"];
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
  viandeRouge: ["boeuf", "boeuf hache", "boeuf a braiser", "veau", "agneau"],
  charcuterie: ["jambon", "jambon cru", "lardons", "saucisse de morteau", "poitrine fumee"],
  alcool: ["vin blanc"],
  sucres: ["sucre", "miel", "chocolat noir"],
  feculents: ["pomme de terre", "pates", "riz", "semoule", "boulgour", "pain", "farine", "farine de sarrasin",
    "pate brisee", "lentilles", "pois chiche", "haricot rouge", "patate douce", "mais", "petits pois"],
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

function proposer({ recettes, frigo, avecPlacard, profils, saison, type, tempsMax = 0, tri = "pertinence", complet = false }) {
  const termes = frigo.map(canonique).filter(Boolean);
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
    if (actifs.some(p => incompatibilite(r, p))) { exclues++; continue; }
    const a = analyser(r, termes, avecPlacard);
    if (complet && a.dispo < a.total) continue;
    const deSaison = r.saisons.includes(saison);
    const score = a.utilises * 3 + a.couverture * 5 + (enfants && r.enfants ? 1 : 0) + (seniors && r.tendre ? 1 : 0)
      + (r.saisons.length < 4 && deSaison ? 1 : 0)
      + (fibresPrioritaires ? Math.min(profilRecette(r).fibres, 5) * 0.6 : 0);
    resultats.push({ recette: r, ...a, deSaison, score });
  }
  // Les recettes de saison restent devant ; le tri choisi s'applique à l'intérieur de chaque groupe.
  const parTemps = tri === "rapide" ? (x, y) => x.recette.temps - y.recette.temps
    : tri === "long" ? (x, y) => y.recette.temps - x.recette.temps : () => 0;
  resultats.sort((x, y) => (y.deSaison - x.deSaison) || parTemps(x, y) || (y.score - x.score) || x.recette.temps - y.recette.temps);
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

// Ingrédients qui manquent pour les recettes les plus proches, classés par nombre de recettes qu'ils débloquent.
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
      if (!parNom.has(cle)) parNom.set(cle, { nom, recettes: [], deSaison: 0 });
      const e = parNom.get(cle);
      e.recettes.push(x.recette.nom);
      if (x.deSaison) e.deSaison++;
    }
  }
  return [...parNom.values()]
    .sort((a, b) => (b.deSaison - a.deSaison) || (b.recettes.length - a.recettes.length) || a.nom.localeCompare(b.nom))
    .slice(0, limite);
}

function ajusterQuantite(qte, personnes, nom = "") {
  const m = qte.match(/^(\d+(?:,\d+)?)(?:\/(\d+))?(.*)$/);
  if (!m || personnes === 4) return qte;
  if (/p[aâ]te bris|^poulet$/.test(nom) || /entier/.test(qte)) return qte; // une tarte ou un poulet ne se coupe pas
  if (!m[3].trim()) { // ingrédients comptés à l'unité : on arrondit au supérieur
    const n = parseFloat(m[1].replace(",", ".")) / (m[2] ? Number(m[2]) : 1) * personnes / 4;
    return String(Math.max(1, Math.ceil(n - 0.01)));
  }
  let v = parseFloat(m[1].replace(",", ".")) / (m[2] ? Number(m[2]) : 1);
  v = v * personnes / 4;
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
  module.exports = { normaliser, canonique, correspond, incompatibilite, proposer, ajusterQuantite, saisonDuMois, conseils, profilRecette, classer, ingredientsManquants };
}

// ============ Interface ============

if (typeof document !== "undefined") {
  const CLE = "frigo-saison-v1";
  const nouvelId = () => "p" + Math.random().toString(36).slice(2, 10);

  function charger() { try { return JSON.parse(localStorage.getItem(CLE)); } catch (e) { return null; } }
  function sauver() {
    const { edition, aSupprimer, ...aGarder } = etat;
    try { localStorage.setItem(CLE, JSON.stringify(aGarder)); } catch (e) { /* stockage indisponible */ }
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
          return `<label class="ligne-ing${on ? " on" : ""}"><input type="checkbox" data-ing="${i}"${on ? " checked" : ""}> <span>${esc(nom)}</span><button type="button" class="oublier" data-oublier="${i}" aria-label="Retirer ${esc(nom)} de la liste" title="Retirer de la liste">×</button></label>`;
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
    ["endometriose", "Endométriose", "Anti-inflammatoire : sans viande rouge, charcuterie, alcool ni sucre ajouté"],
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
  // Curseur : la dernière position (125) veut dire « peu importe » (pas de limite).
  const PAS_DE_LIMITE = 125;
  function libelleTemps(v) {
    if (v >= PAS_DE_LIMITE) return "peu importe";
    return v >= 60 ? `${Math.floor(v / 60)} h${v % 60 ? String(v % 60).padStart(2, "0") : ""}` : `${v} min`;
  }
  $("#temps-max").addEventListener("input", e => {
    const v = Number(e.target.value);
    etat.tempsMax = v >= PAS_DE_LIMITE ? 0 : v;
    $("#temps-max-valeur").textContent = libelleTemps(v);
    e.target.setAttribute("aria-valuetext", libelleTemps(v));
    maj();
  });
  $("#tri").addEventListener("change", e => { etat.tri = e.target.value; maj(); });
  $("#plus").addEventListener("click", () => { affichees += 10; rendreResultats(); });

  // --- Étape « Avez-vous aussi… ? » ---
  const optionsRecherche = () => ({ recettes: RECETTES, frigo: etat.frigo, avecPlacard: etat.placard, profils: convives(), saison: etat.saison, type: etat.type, tempsMax: etat.tempsMax, tri: etat.tri });
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

    $("#resultats").innerHTML = resultats.slice(0, affichees).map(x => carte(x, n, table)).join("");
    $("#plus").hidden = resultats.length <= affichees;
  }

  function carte(x, n, table) {
    const r = x.recette;
    const badges = [
      x.deSaison ? `<span class="badge saison">De saison</span>` : `<span class="badge hors">Hors saison</span>`,
      `<span class="badge">${ETIQ_REGIME[r.regime]}</span>`,
      r.allergenes.includes("gluten") ? "" : `<span class="badge">Sans gluten</span>`,
      r.allergenes.includes("lactose") ? "" : `<span class="badge">Sans lactose</span>`,
      profilRecette(r).lowCarb ? `<span class="badge">Low carb</span>` : "",
      profilRecette(r).fibres >= 3 ? `<span class="badge">Riche en fibres</span>` : "",
      r.epice ? `<span class="badge">Épicé</span>` : "",
    ].join("");
    const avis = conseils(r, table);
    const duree = r.temps >= 60 ? `${Math.floor(r.temps / 60)} h${r.temps % 60 ? String(r.temps % 60).padStart(2, "0") : ""}` : `${r.temps} min`;
    return `<article class="recette">
      ${visuel(r)}
      <div class="corps">
      <header><h3>${esc(r.nom)}</h3><span class="meta">${esc(r.type)}</span></header>
      <p class="temps"><span aria-hidden="true">⏱</span> ${duree} <span>(préparation + cuisson)</span></p>
      <div class="badges">${badges}</div>
      <p class="complet">Vous avez tous les ingrédients${x.utilises ? ` · utilise ${x.utilises} produit${x.utilises > 1 ? "s" : ""} de votre frigo` : ""}</p>
      ${avis.length ? `<ul class="avis">${avis.map(a => `<li>${esc(a)}</li>`).join("")}</ul>` : ""}
      <details><summary>Voir la recette</summary>
        <ul class="ingr">${x.lignes.map(l => `<li class="${l.frigo ? "ok" : l.base ? "base" : ""}">${esc(nomIngredient(l.ligne))}${qteIngredient(l.ligne) ? ` — ${esc(ajusterQuantite(qteIngredient(l.ligne), n, nomIngredient(l.ligne)))}` : ""}</li>`).join("")}</ul>
        <p class="note">+ sel, poivre, huile et eau.</p>
        <ol>${r.etapes.map(e => `<li>${esc(e)}</li>`).join("")}</ol>
      </details>
      </div>
    </article>`;
  }

  // Visuel illustré : couleur selon le type de plat, pictogrammes des ingrédients principaux.
  const BASIQUES = new Set(["ail", "oignon", "echalote", "bouillon de legume", "huile", "vinaigre", "moutarde", "sucre", "farine", "beurre", "curry", "cumin", "cannelle", "thym", "vanille"]);
  function visuel(r) {
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

  let minuteur;
  function maj() {
    affichees = 12; sauver();
    clearTimeout(minuteur); minuteur = setTimeout(rendreResultats, 120);
  }

  $("#saison").innerHTML = SAISONS.map(s => `<option value="${s}"${s === etat.saison ? " selected" : ""}>${NOMS_SAISONS[s]}</option>`).join("");
  $("#type").value = etat.type || "tout";
  $("#temps-max").value = String(etat.tempsMax || PAS_DE_LIMITE);
  $("#temps-max-valeur").textContent = libelleTemps(etat.tempsMax || PAS_DE_LIMITE);
  $("#temps-max").setAttribute("aria-valuetext", libelleTemps(etat.tempsMax || PAS_DE_LIMITE));
  $("#tri").value = etat.tri;
  rendreFrigo(); rendreProfils(); rendreEtapes(); rendreResultats(); sauver();
}
