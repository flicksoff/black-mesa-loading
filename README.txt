BLACK MESA LOADING SCREEN
=========================

APERÇU LOCAL
1. Ouvre index.html dans Chrome ou Edge.
2. L'écran lance une fausse progression uniquement pour l'aperçu local.

PERSONNALISATION
- Ouvre config.js avec un éditeur de texte.
- Images : ajoute les fichiers dans assets/images puis leurs chemins dans backgrounds.
- Musiques : ajoute les fichiers .mp3 ou .ogg dans assets/music puis leurs chemins dans music.
- YouTube : utilise youtubeId avec l'identifiant situé après watch?v= dans config.js.
- Le lecteur YouTube respecte les règles d'autoplay : clique sur le bouton musique pour lancer le son.
- Le volume va de 0 à 1. Exemple : 0.28 = 28 %.
- Plusieurs images ou musiques peuvent être choisies aléatoirement.

INSTALLATION PLUS TARD
1. Héberge tout ce dossier sur un site public HTTPS.
2. Vérifie que l'URL ouvre directement index.html sans mot de passe.
3. Dans server.cfg : sv_loadingurl "https://ton-site.fr/index.html?steamid=%s&mapname=%m"
4. Redémarre le serveur.

IMPORTANT
Un serveur Garry's Mod ne transforme pas automatiquement ce dossier en site web.
Il faut une URL HTTPS publique. Rien n'a été envoyé sur ton serveur par Codex.
