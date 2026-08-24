const mapHotspots = [
    {
        id: "mahanadi",
        name: "Mahanadi Basin, Odisha",
        x: 60,
        y: 12,
        fact: "The northernmost extent of the Eastern Ghats, deeply carved by the Mahanadi river.",
        iconShape: "leaf",
        speciesSilhouette: "#icon-leaf-cluster"
    },
    {
        id: "andhra",
        name: "Nallamala Range, Andhra Pradesh",
        x: 38.5,
        y: 61,
        fact: "One of the largest unbroken stretches of deciduous forest in the Ghats, home to tigers and rich endemic flora.",
        iconShape: "creature",
        speciesSilhouette: "#svg-chital"
    },
    {
        id: "telangana",
        name: "Amrabad Tiger Reserve, Telangana",
        x: 41,
        y: 55,
        fact: "A vital, rugged plateau landscape sustaining deep-rooted dry forest ecosystems.",
        iconShape: "leaf",
        speciesSilhouette: "#icon-fern-frond"
    },
    {
        id: "shevaroy",
        name: "Shevaroy Massif, Tamil Nadu",
        x: 32,
        y: 88,
        fact: "A distinct high-altitude sky island harboring unique endemic species isolated from the plains.",
        iconShape: "creature",
        speciesSilhouette: "#svg-butterfly"
    },
    {
        id: "krishnagiri",
        name: "CEGS Campus, Krishnagiri",
        x: 29,
        y: 94,
        fact: "Our base of operations. The nursery here cultivates thousands of native saplings for rewilding.",
        iconShape: "base",
        speciesSilhouette: "#icon-accent-flower"
    }
];

if (typeof window !== 'undefined') {
    window.cegsMapHotspots = mapHotspots;
}
