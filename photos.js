// Photos des plats : Wikimedia Commons, licences libres. Crédit affiché sur chaque photo.
const PHOTOS = {
 "Velouté de potiron": {
  "src": "photos/veloute-de-potiron.jpg",
  "auteur": "PattayaPatrol",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:DSC_7126_Creamy_pumpkin_soup_garnished_with_a_swirl_of_cream_and_chopped_herbs_served_in_a_white_soup_cup.jpg"
 },
 "Gratin dauphinois": {
  "src": "photos/gratin-dauphinois.jpg",
  "auteur": "Ludovic Péron",
  "licence": "CC BY-SA 3.0",
  "page": "https://commons.wikimedia.org/wiki/File:Gratin_dauphinois.jpg"
 },
 "Poireaux vinaigrette": {
  "src": "photos/poireaux-vinaigrette.jpg",
  "auteur": "Benreis",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Poireaux_vinaigrette_Dijon.jpg"
 },
 "Flamiche aux poireaux": {
  "src": "photos/flamiche-aux-poireaux.jpg",
  "auteur": "Claude Humbert",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:02._Flamiche_picarde_(4).jpg"
 },
 "Pot-au-feu": {
  "src": "photos/pot-au-feu.jpg",
  "auteur": "Andre",
  "licence": "CC BY-SA 3.0",
  "page": "https://commons.wikimedia.org/wiki/File:Pot-au-feu2.jpg"
 },
 "Hachis parmentier": {
  "src": "photos/hachis-parmentier.jpg",
  "auteur": "Bycro",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Hachis_parmentier_01.jpg"
 },
 "Soupe de lentilles corail au lait de coco": {
  "src": "photos/soupe-de-lentilles-corail-au-lait-de-coco.jpg",
  "auteur": "Andy Li",
  "licence": "CC0",
  "page": "https://commons.wikimedia.org/wiki/File:Lentil_Soup_-_Schnitzel_%26_Co._2026-05-16.jpg"
 },
 "Risotto aux champignons": {
  "src": "photos/risotto-aux-champignons.jpg",
  "auteur": "spurekar",
  "licence": "CC BY 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Mushroom_and_Leek_Risotto_(49535206656).jpg"
 },
 "Endives au jambon": {
  "src": "photos/endives-au-jambon.jpg",
  "auteur": "Vincent van Zeijst",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Chicory_(witlof),_oven_dish_with_ham_and_cheese.jpg"
 },
 "Salade d'endives, pomme et noix": {
  "src": "photos/salade-d-endives-pomme-et-noix.jpg",
  "auteur": "Daderot",
  "licence": "CC0",
  "page": "https://commons.wikimedia.org/wiki/File:Salad_of_roasted_pears,_red_endive,_shallots,_almonds,_chevre_mousse,_honey,_and_mint_vinaigrette_-_Wellington,_New_Zealand.jpg"
 },
 "Choux de Bruxelles rôtis à l'ail": {
  "src": "photos/choux-de-bruxelles-rotis-a-l-ail.jpg",
  "auteur": "Kelly Sue",
  "licence": "CC BY-SA 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Roasted_Brussels_Sprouts_with_Kumquats.jpg"
 },
 "Potée au chou": {
  "src": "photos/potee-au-chou.jpg",
  "auteur": "Arnaud 25",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Garbure_02.jpg"
 },
 "Curry de patate douce et pois chiches": {
  "src": "photos/curry-de-patate-douce-et-pois-chiches.jpg",
  "auteur": "pelican from Tokyo, Japan",
  "licence": "CC BY-SA 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Sweet_potato_curry_(10362720945).jpg"
 },
 "Crumble aux pommes": {
  "src": "photos/crumble-aux-pommes.jpg",
  "auteur": "Suzette - www.suzette.nu from Arnhem, Netherlands",
  "licence": "CC BY 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Vegan_apple_crumble_(8293111737).jpg"
 },
 "Poires au chocolat": {
  "src": "photos/poires-au-chocolat.jpg",
  "auteur": "J Doll",
  "licence": "CC BY 3.0",
  "page": "https://commons.wikimedia.org/wiki/File:Tea_Poached_Pears_In_Chocolate_Sauce_(140490793).jpeg"
 },
 "Blanquette de veau": {
  "src": "photos/blanquette-de-veau.jpg",
  "auteur": "Arnaud 25",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Blanquette_de_veau_%C3%A0_l%27ancienne_06.jpg"
 },
 "Gratin de butternut": {
  "src": "photos/gratin-de-butternut.jpg",
  "auteur": "DocteurCosmos",
  "licence": "CC BY 3.0",
  "page": "https://commons.wikimedia.org/wiki/File:Gratin_courge_butternut_1.jpg"
 },
 "Soupe à l'oignon gratinée": {
  "src": "photos/soupe-a-l-oignon-gratinee.jpg",
  "auteur": "jeffreyw",
  "licence": "CC BY 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Mmm...onion_soup_(5344349906).jpg"
 },
 "Cabillaud et purée de panais": {
  "src": "photos/cabillaud-et-puree-de-panais.jpg",
  "auteur": "Peachyeung316",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Fish_with_potato_and_cream_sauce.jpg"
 },
 "Tartiflette": {
  "src": "photos/tartiflette.jpg",
  "auteur": "Benoît Prieur",
  "licence": "CC0",
  "page": "https://commons.wikimedia.org/wiki/File:Une_tartiflette_sortie_du_four.jpg"
 },
 "Carottes râpées à l'orange": {
  "src": "photos/carottes-rapees-a-l-orange.jpg",
  "auteur": "건복맘",
  "licence": "CC BY 2.0 kr",
  "page": "https://commons.wikimedia.org/wiki/File:French_grated_carrot_salad.jpg"
 },
 "Salade de mâche et betterave": {
  "src": "photos/salade-de-mache-et-betterave.jpg",
  "auteur": "Suzette - www.suzette.nu from Arnhem, Netherlands",
  "licence": "CC BY 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Beetroot_Salad_(3862315693).jpg"
 },
 "Omelette aux champignons": {
  "src": "photos/omelette-aux-champignons.jpg",
  "auteur": "Andy Li",
  "licence": "CC0",
  "page": "https://commons.wikimedia.org/wiki/File:Cheese_%26_Mushroom_Omelette_-_The_Bystander_Cafe_2023-08-07.jpg"
 },
 "Chili sin carne": {
  "src": "photos/chili-sin-carne.jpg",
  "auteur": "Carstor",
  "licence": "CC BY-SA 2.5",
  "page": "https://commons.wikimedia.org/wiki/File:Bowl_of_chili.jpg"
 },
 "Saumon au four et poireaux fondants": {
  "src": "photos/saumon-au-four-et-poireaux-fondants.jpg",
  "auteur": "Smabs Sputzer",
  "licence": "CC BY 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Waterzooi,_2010.jpg"
 },
 "Moules marinières": {
  "src": "photos/moules-marinieres.jpg",
  "auteur": "Arnaud 25",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Moules_marini%C3%A8res_02.jpg"
 },
 "Poêlée de tofu et brocoli au sésame": {
  "src": "photos/poelee-de-tofu-et-brocoli-au-sesame.jpg",
  "auteur": "Miscellaneous contributor",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Tofu_and_Broccoli_2.jpg"
 },
 "Pommes au four à la cannelle": {
  "src": "photos/pommes-au-four-a-la-cannelle.jpg",
  "auteur": "Andrey Korzun",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Baked_apple_02.JPG"
 },
 "Compote pomme-poire": {
  "src": "photos/compote-pomme-poire.jpg",
  "auteur": "Taken",
  "licence": "CC0",
  "page": "https://commons.wikimedia.org/wiki/File:Apple-sauce-544676.jpg"
 },
 "Purée de carottes": {
  "src": "photos/puree-de-carottes.jpg",
  "auteur": "Elsie Hui",
  "licence": "CC BY 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Chicken_wings_with_mashed_carrot.jpg"
 },
 "Velouté de chou-fleur": {
  "src": "photos/veloute-de-chou-fleur.jpg",
  "auteur": "Andy Li",
  "licence": "CC0",
  "page": "https://commons.wikimedia.org/wiki/File:Cauliflower_and_potato_soup_-_T_@_Hove_2023-10-22.jpg"
 },
 "Curry de chou-fleur au lait de coco": {
  "src": "photos/curry-de-chou-fleur-au-lait-de-coco.jpg",
  "auteur": "auteur inconnu",
  "licence": "CC BY-SA 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Aloo_gobi.jpg"
 },
 "Oeufs cocotte aux épinards": {
  "src": "photos/oeufs-cocotte-aux-epinards.jpg",
  "auteur": "Jpbrigand2",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Oeuf_cocotte.jpg"
 },
 "Asperges vertes rôties et oeuf mollet": {
  "src": "photos/asperges-vertes-roties-et-oeuf-mollet.jpg",
  "auteur": "Arnold Gatilao from Oakland, CA, USA",
  "licence": "CC BY 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Grilled_asparagus,_prosciutto,_63-degree_egg_and_torn_croutons.jpg"
 },
 "Navarin d'agneau printanier": {
  "src": "photos/navarin-d-agneau-printanier.jpg",
  "auteur": "Arnaud 25",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Navarin_01.jpg"
 },
 "Petits pois à la française": {
  "src": "photos/petits-pois-a-la-francaise.jpg",
  "auteur": "Kochtopf",
  "licence": "CC BY 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Braised_Hearts_of_Lettuce_with_Green_Peas.jpg"
 },
 "Risotto aux petits pois et à la menthe": {
  "src": "photos/risotto-aux-petits-pois-et-a-la-menthe.jpg",
  "auteur": "Katrin Gilger",
  "licence": "CC BY-SA 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Pea_Risotto_with_Lemon_and_Basil_(4355548435).jpg"
 },
 "Quiche épinards et chèvre": {
  "src": "photos/quiche-epinards-et-chevre.jpg",
  "auteur": "timothy muza timothymuza",
  "licence": "CC0",
  "page": "https://commons.wikimedia.org/wiki/File:Slice_of_Quiche_(Unsplash).jpg"
 },
 "Taboulé printanier aux herbes": {
  "src": "photos/taboule-printanier-aux-herbes.jpg",
  "auteur": "cyclonebill",
  "licence": "CC BY-SA 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Flickr_-_cyclonebill_-_Tabbouleh.jpg"
 },
 "Tarte à la rhubarbe": {
  "src": "photos/tarte-a-la-rhubarbe.jpg",
  "auteur": "File:Tarte à la rhubarbe France.jpg: Borneo derivative work: Ralf Roletschek",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Tarte_%C3%A0_la_rhubarbe_France-2.jpg"
 },
 "Fraises à la menthe": {
  "src": "photos/fraises-a-la-menthe.jpg",
  "auteur": "Personal Creations",
  "licence": "CC BY 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Strawberry_Bruschetta_toast_with_honey_ricotta_balsamic_vinegar_mint_and_basil_in_mixing_bowl_next_to_toaster_on_wood_table_(15785175923).jpg"
 },
 "Salade de pommes de terre nouvelles et radis": {
  "src": "photos/salade-de-pommes-de-terre-nouvelles-et-radis.jpg",
  "auteur": "cyclonebill from Copenhagen, Denmark",
  "licence": "CC BY-SA 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Restaurant_Marv_%26_Ben_Nye_kartofler_med_rygeost,_radiser,_asparges_og_%C3%B8rredrogn_(5854646998).jpg"
 },
 "Saumon et épinards frais à la crème": {
  "src": "photos/saumon-et-epinards-frais-a-la-creme.jpg",
  "auteur": "PattayaPatrol",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:DSCF0412_Seared_salmon_fillet_topped_with_saut%C3%A9ed_shrimp_served_with_creamed_spinach_and_a_side_salad.jpg"
 },
 "Velouté d'asperges vertes": {
  "src": "photos/veloute-d-asperges-vertes.jpg",
  "auteur": "Petar Milošević",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Asparagus_soup_(spargelsuppe).jpg"
 },
 "Artichauts vinaigrette": {
  "src": "photos/artichauts-vinaigrette.jpg",
  "auteur": "Mauro Cateb",
  "licence": "CC BY-SA 3.0",
  "page": "https://commons.wikimedia.org/wiki/File:Cooked_artichokes.jpg"
 },
 "Maquereaux rôtis et salade de fenouil": {
  "src": "photos/maquereaux-rotis-et-salade-de-fenouil.jpg",
  "auteur": "Kernow Skies",
  "licence": "CC BY-SA 3.0",
  "page": "https://commons.wikimedia.org/wiki/File:Grilled_mackerel_on_a_BBQ.jpg"
 },
 "Poulet au citron et aux asperges": {
  "src": "photos/poulet-au-citron-et-aux-asperges.jpg",
  "auteur": "Daderot",
  "licence": "CC0",
  "page": "https://commons.wikimedia.org/wiki/File:Asparagus,_broccoli,_chicken_-_Massachusetts.jpg"
 },
 "Épinards sautés à l'ail et aux pignons": {
  "src": "photos/epinards-sautes-a-l-ail-et-aux-pignons.jpg",
  "auteur": "Missvain",
  "licence": "CC0",
  "page": "https://commons.wikimedia.org/wiki/File:Willi%27s_Seafood_%26_Raw_Bar_-_March_2025_-_Sarah_Stierch_01.jpg"
 },
 "Ratatouille": {
  "src": "photos/ratatouille.jpg",
  "auteur": "Arnaud 25",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Ratatouille_001.jpg"
 },
 "Gazpacho": {
  "src": "photos/gazpacho.jpg",
  "auteur": "Bocadorada",
  "licence": "CC BY-SA 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Gazpacho_Cazuela_Barro.jpg"
 },
 "Tomates, mozzarella et basilic": {
  "src": "photos/tomates-mozzarella-et-basilic.jpg",
  "auteur": "Rainer Zenz",
  "licence": "CC BY-SA 3.0",
  "page": "https://commons.wikimedia.org/wiki/File:Caprese-1.jpg"
 },
 "Tian de légumes provençal": {
  "src": "photos/tian-de-legumes-provencal.jpg",
  "auteur": "Renhour48",
  "licence": "CC0",
  "page": "https://commons.wikimedia.org/wiki/File:Tian_-_Tian_Tomates_-_Poivrons-_Courgettes-_Oignons.jpg"
 },
 "Taboulé libanais": {
  "src": "photos/taboule-libanais.jpg",
  "auteur": "cyclonebill",
  "licence": "CC BY-SA 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Flickr_-_cyclonebill_-_Tabbouleh.jpg"
 },
 "Pâtes au pesto": {
  "src": "photos/pates-au-pesto.jpg",
  "auteur": "Marco Del Torchio 95",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Pasta_al_pesto_fatto_in_casa.jpg"
 },
 "Courgettes farcies": {
  "src": "photos/courgettes-farcies.jpg",
  "auteur": "Justwiki",
  "licence": "CC BY 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Stuffed_squash_2025_JORDAN_(2).jpg"
 },
 "Brochettes de poulet et poivrons": {
  "src": "photos/brochettes-de-poulet-et-poivrons.jpg",
  "auteur": "Netha Hussain",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Chicken_tandoori_and_bell_pepper_on_skewers.jpg"
 },
 "Salade de pâtes au thon": {
  "src": "photos/salade-de-pates-au-thon.jpg",
  "auteur": "FotoosVanRobin from Netherlands",
  "licence": "CC BY-SA 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Tuna_pasta_salad.jpg"
 },
 "Melon et jambon cru": {
  "src": "photos/melon-et-jambon-cru.jpg",
  "auteur": "Nikodem Nijaki",
  "licence": "CC BY-SA 3.0",
  "page": "https://commons.wikimedia.org/wiki/File:Prosciutto_con_melone_IMGP0936.jpg"
 },
 "Clafoutis aux cerises": {
  "src": "photos/clafoutis-aux-cerises.jpg",
  "auteur": "Popo le Chien",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Clafoutis_cerises.jpg"
 },
 "Salade pastèque, feta et menthe": {
  "src": "photos/salade-pasteque-feta-et-menthe.jpg",
  "auteur": "Stephanie from Austin TX",
  "licence": "CC BY 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Watermelon_Vegan_Feta_Salad_(10695235746).jpg"
 },
 "Haricots verts à l'ail": {
  "src": "photos/haricots-verts-a-l-ail.jpg",
  "auteur": "FASTILY",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Sauteed_Garlic_Green_Beans_1_2017-02-22.jpg"
 },
 "Omelette aux courgettes": {
  "src": "photos/omelette-aux-courgettes.jpg",
  "auteur": "cyclonebill",
  "licence": "CC BY-SA 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Flickr_-_cyclonebill_-_Omelet_med_squash,_ost_og_estragon.jpg"
 },
 "Pêches rôties au miel": {
  "src": "photos/peches-roties-au-miel.jpg",
  "auteur": "Tony Webster from Minneapolis, Minnesota, United States",
  "licence": "CC BY 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Grilled_Peach_at_Minnesota_State_Fair_(48659750766).jpg"
 },
 "Shakshuka": {
  "src": "photos/shakshuka.jpg",
  "auteur": "Calliopejen1",
  "licence": "CC BY-SA 3.0",
  "page": "https://commons.wikimedia.org/wiki/File:Shakshuka_by_Calliopejen1.jpg"
 },
 "Pâtes carbonara": {
  "src": "photos/pates-carbonara.jpg",
  "auteur": "Javier Somoza",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Espaguetis_carbonara.jpg"
 },
 "Crêpes": {
  "src": "photos/crepes.jpg",
  "auteur": "David Monniaux",
  "licence": "CC BY-SA 3.0",
  "page": "https://commons.wikimedia.org/wiki/File:Crepes_dsc07085.jpg"
 },
 "Galettes de sarrasin complètes": {
  "src": "photos/galettes-de-sarrasin-completes.jpg",
  "auteur": "Arnaud 25",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Galette_de_sarrasin_compl%C3%A8te_bretonne.jpg"
 },
 "Riz au lait": {
  "src": "photos/riz-au-lait.jpg",
  "auteur": "Ross Berteig from Monrovia, California, USA",
  "licence": "CC BY 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Rice_pudding_cinnamon.jpg"
 },
 "Poulet rôti et pommes de terre": {
  "src": "photos/poulet-roti-et-pommes-de-terre.jpg",
  "auteur": "Evan Swigart from Chicago, USA",
  "licence": "CC BY 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Max%27s_Roasted_Chicken_-_Evan_Swigart.jpg"
 },
 "Dahl de lentilles vertes et épinards": {
  "src": "photos/dahl-de-lentilles-vertes-et-epinards.jpg",
  "auteur": "Vis M",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Dal_Palak.jpg"
 },
 "Soupe de légumes du marché": {
  "src": "photos/soupe-de-legumes-du-marche.jpg",
  "auteur": "Horacio Cambeiro",
  "licence": "CC BY-SA 3.0",
  "page": "https://commons.wikimedia.org/wiki/File:Traditional_Vegetable_Soup_from_Argentina.jpg"
 },
 "Papillotes de colin aux légumes": {
  "src": "photos/papillotes-de-colin-aux-legumes.jpg",
  "auteur": "edseloh",
  "licence": "CC BY-SA 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Black_Cod_en_Papillot.jpg"
 },
 "Radis, beurre et pain de campagne": {
  "src": "photos/radis-beurre-et-pain-de-campagne.jpg",
  "auteur": "Self, en:User:Jengod",
  "licence": "Public domain",
  "page": "https://commons.wikimedia.org/wiki/File:Radish_3371103037_4ab07db0bf_o.jpg"
 },
 "Frittata aux asperges et aux herbes": {
  "src": "photos/frittata-aux-asperges-et-aux-herbes.jpg",
  "auteur": "fir0002 (flagstaffotos)",
  "licence": "GFDL 1.2",
  "page": "https://commons.wikimedia.org/wiki/File:Frittata02.jpg"
 },
 "Houmous et bâtonnets de légumes": {
  "src": "photos/houmous-et-batonnets-de-legumes.jpg",
  "auteur": "Popo le Chien",
  "licence": "CC0",
  "page": "https://commons.wikimedia.org/wiki/File:Houmous.jpg"
 },
 "Bûche de Noël au chocolat": {
  "src": "photos/buche-de-noel-au-chocolat.jpg",
  "auteur": "Jebulon",
  "licence": "CC0",
  "page": "https://commons.wikimedia.org/wiki/File:B%C3%BBche_de_No%C3%ABl_chocolat_framboise_maison.jpg"
 },
 "Poulet rôti aux marrons": {
  "src": "photos/poulet-roti-aux-marrons.jpg",
  "auteur": "Daderot",
  "licence": "CC0",
  "page": "https://commons.wikimedia.org/wiki/File:Chicken_and_vegetables,_Christmas_2022_-_Massachusetts.jpg"
 },
 "Velouté de châtaignes": {
  "src": "photos/veloute-de-chataignes.jpg",
  "auteur": "Luca Nebuloni from Milan, Italy",
  "licence": "CC BY 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Pumpkin_soup_with_chestnuts_(10513766303).jpg"
 },
 "Muffins à la citrouille": {
  "src": "photos/muffins-a-la-citrouille.jpg",
  "auteur": "W.carter",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Plain_vanilla_muffin_in_Tuntorp.jpg"
 },
 "Gigot d'agneau rôti à l'ail": {
  "src": "photos/gigot-d-agneau-roti-a-l-ail.jpg",
  "auteur": "Chun's Pictures",
  "licence": "CC BY 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Gigot_d%27agneau_%C3%A0_la_po%C3%AAle.jpg"
 },
 "Oeufs mimosa": {
  "src": "photos/oeufs-mimosa.jpg",
  "auteur": "Jpbrigand2",
  "licence": "CC BY-SA 4.0",
  "page": "https://commons.wikimedia.org/wiki/File:Oeufs_momisa_2.jpg"
 },
 "Nids de Pâques au chocolat": {
  "src": "photos/nids-de-paques-au-chocolat.jpg",
  "auteur": "Kristin Ausk",
  "licence": "CC BY-SA 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Easter_cupcakes_-_colourful_chocolate_eggs_on_green_nest_icing.jpg"
 },
 "Gâteau au chocolat fondant": {
  "src": "photos/gateau-au-chocolat-fondant.jpg",
  "auteur": "Mathieu MD",
  "licence": "CC BY-SA 3.0",
  "page": "https://commons.wikimedia.org/wiki/File:Fondant_au_chocolat_(250g_de_beurre).jpg"
 },
 "Pizza maison": {
  "src": "photos/pizza-maison.jpg",
  "auteur": "N i c o l a from Fiumicino (Rome), Italy",
  "licence": "CC BY 2.0",
  "page": "https://commons.wikimedia.org/wiki/File:Pizza_(17450755191).jpg"
 }
};
