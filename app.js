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
const LIMITE_REGIME = { "vegetalien": 0, "vegetarien": 1, "pescetarien": 2, "omnivore": 3 };

function listeDegouts(profil) {
  return String(profil.degouts || "").split(/[,;\n]/).map(canonique).filter(Boolean);
}

// Renvoie null si compatible, sinon la raison de l'exclusion.
function incompatibilite(recette, profil) {
  const age = Number(profil.age);
  if (profil.age !== "" && profil.age != null && age < 0.5) return null; // nourrisson : lait uniquement, pas de filtre
  if (NIVEAU_REGIME[recette.regime] > LIMITE_REGIME[profil.regime || "omnivore"]) return "régime";
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

function proposer({ recettes, frigo, avecPlacard, profils, saison, type }) {
  const termes = frigo.map(canonique).filter(Boolean);
  const actifs = profils.length ? profils : [{ regime: "omnivore", allergies: [], age: "" }];
  const enfants = actifs.some(p => p.age !== "" && Number(p.age) < 12);
  const seniors = actifs.some(p => p.age !== "" && Number(p.age) >= 75);
  const resultats = [];
  let exclues = 0;
  for (const r of recettes) {
    if (type && type !== "tout") {
      const groupe = (r.type === "soupe" || r.type === "plat") ? "plat" : r.type === "dessert" ? "dessert" : "entree";
      if (groupe !== type) continue;
    }
    if (actifs.some(p => incompatibilite(r, p))) { exclues++; continue; }
    const a = analyser(r, termes, avecPlacard);
    const deSaison = r.saisons.includes(saison);
    const score = a.utilises * 3 + a.couverture * 5 + (enfants && r.enfants ? 1 : 0) + (seniors && r.tendre ? 1 : 0)
      + (r.saisons.length < 4 && deSaison ? 1 : 0);
    resultats.push({ recette: r, ...a, deSaison, score });
  }
  resultats.sort((x, y) => (y.deSaison - x.deSaison) || (y.score - x.score) || x.recette.temps - y.recette.temps);
  return { resultats, exclues };
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
  module.exports = { normaliser, canonique, correspond, incompatibilite, proposer, ajusterQuantite, saisonDuMois, conseils };
}

// ============ Interface ============

if (typeof document !== "undefined") {
  const CLE = "frigo-saison-v1";
  const etat = charger() || {
    frigo: [],
    placard: true,
    profils: [{ nom: "Moi", age: "", regime: "omnivore", allergies: [], degouts: "" }],
    saison: saisonDuMois(new Date().getMonth() + 1),
    type: "tout",
  };
  etat.saison = etat.saisonManuelle ? etat.saison : saisonDuMois(new Date().getMonth() + 1);
  let affichees = 12;

  function charger() { try { return JSON.parse(localStorage.getItem(CLE)); } catch (e) { return null; } }
  function sauver() { try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch (e) { /* stockage indisponible */ } }

  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // --- Frigo ---
  function rendreFrigo() {
    $("#puces").innerHTML = etat.frigo.map((f, i) =>
      `<span class="puce">${esc(f)}<button type="button" aria-label="Retirer ${esc(f)}" data-i="${i}">×</button></span>`).join("");
    $("#placard").checked = etat.placard;
  }
  function ajouterFrigo(texte) {
    texte.split(/[,;\n]/).map(t => t.trim()).filter(Boolean).forEach(t => {
      if (!etat.frigo.some(f => canonique(f) === canonique(t))) etat.frigo.push(t);
    });
    rendreFrigo(); maj();
  }
  $("#ajout-ingredient").addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); ajouterFrigo(e.target.value); e.target.value = ""; }
  });
  $("#bouton-ajout").addEventListener("click", () => { const c = $("#ajout-ingredient"); ajouterFrigo(c.value); c.value = ""; c.focus(); });
  $("#puces").addEventListener("click", e => {
    if (e.target.dataset.i != null) { etat.frigo.splice(Number(e.target.dataset.i), 1); rendreFrigo(); maj(); }
  });
  $("#vider").addEventListener("click", () => { etat.frigo = []; rendreFrigo(); maj(); });
  $("#placard").addEventListener("change", e => { etat.placard = e.target.checked; maj(); });

  // --- Profils ---
  const ALLERGIES = [["gluten", "Gluten"], ["lactose", "Lactose"], ["oeuf", "Œuf"], ["fruits à coque", "Fruits à coque"], ["poisson", "Poisson / fruits de mer"], ["porc", "Sans porc"]];
  const REGIMES = [["omnivore", "Mange de tout"], ["pescetarien", "Pescétarien"], ["vegetarien", "Végétarien"], ["vegetalien", "Végétalien (vegan)"]];

  function rendreProfils() {
    $("#profils").innerHTML = etat.profils.map((p, i) => `
      <fieldset class="profil" data-i="${i}">
        <div class="ligne">
          <label>Prénom<input data-champ="nom" value="${esc(p.nom)}" placeholder="Prénom"></label>
          <label class="petit">Âge (ans)<input data-champ="age" type="number" min="0" max="120" step="any" value="${esc(p.age)}" placeholder="ex. 35"></label>
          <label>Régime<select data-champ="regime">${REGIMES.map(([v, l]) => `<option value="${v}"${p.regime === v ? " selected" : ""}>${l}</option>`).join("")}</select></label>
          ${etat.profils.length > 1 ? `<button type="button" class="retirer" data-retirer="${i}" aria-label="Retirer ce profil">Retirer</button>` : ""}
        </div>
        <div class="allergies">${ALLERGIES.map(([v, l]) => `<label class="case"><input type="checkbox" data-allergie="${v}"${p.allergies.includes(v) ? " checked" : ""}> ${l}</label>`).join("")}</div>
        <label class="plein">N'aime pas<input data-champ="degouts" value="${esc(p.degouts)}" placeholder="ex. champignon, poivron"></label>
      </fieldset>`).join("");
  }
  $("#profils").addEventListener("input", e => {
    const f = e.target.closest(".profil"); if (!f) return;
    const p = etat.profils[Number(f.dataset.i)];
    if (e.target.dataset.champ) p[e.target.dataset.champ] = e.target.value;
    if (e.target.dataset.allergie) {
      const a = e.target.dataset.allergie;
      p.allergies = e.target.checked ? [...new Set([...p.allergies, a])] : p.allergies.filter(x => x !== a);
    }
    maj();
  });
  $("#profils").addEventListener("click", e => {
    if (e.target.dataset.retirer != null) { etat.profils.splice(Number(e.target.dataset.retirer), 1); rendreProfils(); maj(); }
  });
  $("#ajout-profil").addEventListener("click", () => {
    etat.profils.push({ nom: "", age: "", regime: "omnivore", allergies: [], degouts: "" });
    rendreProfils(); maj();
    const champs = document.querySelectorAll('.profil [data-champ="nom"]'); champs[champs.length - 1].focus();
  });

  // --- Options ---
  $("#saison").addEventListener("change", e => { etat.saison = e.target.value; etat.saisonManuelle = true; maj(); });
  $("#type").addEventListener("change", e => { etat.type = e.target.value; maj(); });
  $("#plus").addEventListener("click", () => { affichees += 10; rendreResultats(); });

  // --- Résultats ---
  const ETIQ_REGIME = { vegan: "Vegan", vege: "Végétarien", poisson: "Poisson", viande: "Viande" };

  function rendreResultats() {
    const { resultats, exclues } = proposer({ recettes: RECETTES, frigo: etat.frigo, avecPlacard: etat.placard, profils: etat.profils, saison: etat.saison, type: etat.type });
    const n = Math.max(1, etat.profils.length);
    const nbSaison = resultats.filter(r => r.deSaison).length;
    let resume = `${resultats.length} recette${resultats.length > 1 ? "s" : ""} compatible${resultats.length > 1 ? "s" : ""}, dont ${nbSaison} de saison (${NOMS_SAISONS[etat.saison].toLowerCase()}). Quantités pour ${n} personne${n > 1 ? "s" : ""}.`;
    if (exclues) resume += ` ${exclues} écartée${exclues > 1 ? "s" : ""} à cause des profils.`;
    if (resultats.length < 10) resume += " Les contraintes sont strictes : essayez « Tout » dans le type de plat ou assouplissez un profil pour avoir au moins 10 idées.";
    $("#resume").textContent = resume;

    const liste = resultats.slice(0, affichees);
    $("#resultats").innerHTML = liste.map(x => carte(x, n)).join("");
    $("#plus").hidden = resultats.length <= affichees;
  }

  function carte(x, n) {
    const r = x.recette;
    const manquants = x.lignes.filter(l => !l.frigo && !l.base).map(l => nomIngredient(l.ligne));
    const badges = [
      x.deSaison ? `<span class="badge saison">De saison</span>` : `<span class="badge hors">Hors saison</span>`,
      `<span class="badge">${ETIQ_REGIME[r.regime]}</span>`,
      r.allergenes.includes("gluten") ? "" : `<span class="badge">Sans gluten</span>`,
      r.allergenes.includes("lactose") ? "" : `<span class="badge">Sans lactose</span>`,
      r.epice ? `<span class="badge">Épicé</span>` : "",
    ].join("");
    const avis = conseils(r, etat.profils);
    return `<article class="recette">
      <header><h3>${esc(r.nom)}</h3><span class="meta">${esc(r.type)} · ${r.temps} min</span></header>
      <div class="badges">${badges}</div>
      <p class="dispo"><strong>${x.dispo}/${x.total}</strong> ingrédients disponibles${x.utilises ? ` · utilise ${x.utilises} produit${x.utilises > 1 ? "s" : ""} de votre frigo` : ""}</p>
      ${manquants.length ? `<p class="manque">À acheter : ${manquants.map(esc).join(", ")}</p>` : `<p class="complet">Vous avez tout !</p>`}
      ${avis.length ? `<ul class="avis">${avis.map(a => `<li>${esc(a)}</li>`).join("")}</ul>` : ""}
      <details><summary>Voir la recette</summary>
        <ul class="ingr">${x.lignes.map(l => `<li class="${l.frigo ? "ok" : l.base ? "base" : ""}">${esc(nomIngredient(l.ligne))}${qteIngredient(l.ligne) ? ` — ${esc(ajusterQuantite(qteIngredient(l.ligne), n, nomIngredient(l.ligne)))}` : ""}</li>`).join("")}</ul>
        <p class="note">+ sel, poivre, huile et eau.</p>
        <ol>${r.etapes.map(e => `<li>${esc(e)}</li>`).join("")}</ol>
      </details>
    </article>`;
  }

  let minuteur;
  function maj() {
    affichees = 12; sauver();
    clearTimeout(minuteur); minuteur = setTimeout(rendreResultats, 120);
  }

  $("#saison").innerHTML = SAISONS.map(s => `<option value="${s}"${s === etat.saison ? " selected" : ""}>${NOMS_SAISONS[s]}</option>`).join("");
  $("#type").value = etat.type || "tout";
  rendreFrigo(); rendreProfils(); rendreResultats();
}
