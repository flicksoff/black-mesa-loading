// Configuration principale — modifie uniquement ce fichier pour personnaliser l'écran.
window.BM_LOADING_CONFIG = {
    serverName: "BLACK MESA RP FRANCE",
    facilityName: "BLACK MESA RESEARCH FACILITY",
    sectorName: "ANOMALOUS MATERIALS",
    headline: "Bienvenue au complexe",
    tagline: "La science exige de la précision. Votre coopération est obligatoire.",

    // Tu peux ajouter plusieurs images : une sera choisie au hasard à chaque connexion.
    backgrounds: [
        "assets/images/facility-background.png"
    ],
    randomBackground: true,

    // "youtubeId" utilise le lecteur officiel YouTube intégré.
    // Pour un fichier local, remplace youtubeId par file: "assets/music/titre.mp3".
    music: [
        {
            title: "SILO THEME — ATLI ÖRVARSSON",
            youtubeId: "Dwtkp1udc5U"
        }
    ],
    randomMusic: false,
    musicVolume: 0.28,

    tipsInterval: 6500,
    tips: [
        "Respectez les consignes du personnel de sécurité.",
        "Votre badge doit rester visible dans les secteurs réglementés.",
        "Toute anomalie doit être signalée immédiatement à votre supérieur.",
        "L'accès aux zones de test exige une autorisation scientifique valide.",
        "En cas d'alarme, rejoignez le point de rassemblement indiqué.",
        "L'utilisation non autorisée des équipements du complexe est interdite."
    ]
};
