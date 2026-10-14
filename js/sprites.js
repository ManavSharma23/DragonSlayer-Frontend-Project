// Rich SVG Sprites with breathing animation support: Player Knight + Slime, Beast, Ogre, Dragon
export const SPRITES = {
    player: `
    <svg viewBox="0 0 120 140" class="sprite-svg player-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="armorSteel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#94a3b8"/>
                <stop offset="50%" stop-color="#475569"/>
                <stop offset="100%" stop-color="#1e293b"/>
            </linearGradient>
            <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fef08a"/>
                <stop offset="60%" stop-color="#eab308"/>
                <stop offset="100%" stop-color="#854d0e"/>
            </linearGradient>
            <linearGradient id="capeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#991b1b"/>
                <stop offset="100%" stop-color="#450a0a"/>
            </linearGradient>
            <filter id="swordGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
        </defs>
        <!-- Shadow -->
        <ellipse cx="60" cy="132" rx="38" ry="7" fill="#000" opacity="0.6"/>
        <!-- Flowing Cape -->
        <path d="M 40 45 Q 22 80 18 125 Q 35 120 52 125 Q 48 85 50 48 Z" fill="url(#capeGrad)" stroke="#2b0505" stroke-width="1.5"/>
        <!-- Legs / Sabatons -->
        <path d="M 42 95 L 40 128 L 52 128 L 54 95 Z" fill="url(#armorSteel)" stroke="#0f172a" stroke-width="2"/>
        <path d="M 66 95 L 68 128 L 80 128 L 78 95 Z" fill="url(#armorSteel)" stroke="#0f172a" stroke-width="2"/>
        <!-- Torso / Breastplate -->
        <path d="M 38 45 L 82 45 L 75 98 L 45 98 Z" fill="url(#armorSteel)" stroke="#0f172a" stroke-width="2"/>
        <polygon points="60,48 52,65 60,82 68,65" fill="none" stroke="url(#goldTrim)" stroke-width="2.5"/>
        <!-- Pauldrons -->
        <ellipse cx="36" cy="48" rx="12" ry="9" fill="url(#goldTrim)" stroke="#0f172a" stroke-width="1.5"/>
        <ellipse cx="84" cy="48" rx="12" ry="9" fill="url(#goldTrim)" stroke="#0f172a" stroke-width="1.5"/>
        <!-- Great Helm -->
        <path d="M 46 16 Q 60 8 74 16 L 76 42 Q 60 46 44 42 Z" fill="url(#armorSteel)" stroke="#0f172a" stroke-width="2"/>
        <!-- Helmet Visor Slit -->
        <line x1="50" y1="28" x2="70" y2="28" stroke="#0f172a" stroke-width="3"/>
        <line x1="50" y1="28" x2="70" y2="28" stroke="#38bdf8" stroke-width="1.5"/>
        <!-- Crest Feather Plume -->
        <path d="M 58 10 Q 52 -2 60 -8 Q 70 -4 64 10" fill="#dc2626"/>
        <!-- Broadsword / Weapon -->
        <g id="player-weapon-node" filter="url(#swordGlow)">
            <line x1="88" y1="95" x2="114" y2="25" stroke="#e2e8f0" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="88" y1="95" x2="114" y2="25" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round"/>
            <!-- Guard -->
            <line x1="82" y1="88" x2="96" y2="92" stroke="url(#goldTrim)" stroke-width="4"/>
            <!-- Pommel -->
            <circle cx="85" cy="102" r="3" fill="url(#goldTrim)"/>
        </g>
    </svg>`,

    slime: `
    <svg viewBox="0 0 120 120" class="sprite-svg slime-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="slimeGrad" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stop-color="#4ade80"/>
                <stop offset="45%" stop-color="#16a34a"/>
                <stop offset="90%" stop-color="#14532d"/>
            </radialGradient>
            <filter id="slimeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
        </defs>
        <ellipse cx="60" cy="105" rx="46" ry="11" fill="#022c22" opacity="0.6"/>
        <path d="M 24 95 C 16 80 20 48 42 36 C 54 28 66 28 78 36 C 100 48 104 80 96 95 C 88 105 32 105 24 95 Z" fill="url(#slimeGrad)" stroke="#14532d" stroke-width="3" filter="url(#slimeGlow)"/>
        <!-- Eyes -->
        <ellipse cx="46" cy="58" rx="8" ry="10" fill="#fff"/>
        <ellipse cx="48" cy="58" rx="4" ry="6" fill="#052e16"/>
        <circle cx="49" cy="55" r="2" fill="#fff"/>
        <ellipse cx="74" cy="58" rx="8" ry="10" fill="#fff"/>
        <ellipse cx="72" cy="58" rx="4" ry="6" fill="#052e16"/>
        <circle cx="71" cy="55" r="2" fill="#fff"/>
        <!-- Caustic Bubbles -->
        <circle cx="38" cy="80" r="4" fill="#bbf7d0" opacity="0.8"/>
        <circle cx="82" cy="82" r="3" fill="#bbf7d0" opacity="0.8"/>
        <ellipse cx="60" cy="42" rx="6" ry="3" fill="#86efac" opacity="0.85"/>
    </svg>`,

    fangbeast: `
    <svg viewBox="0 0 140 130" class="sprite-svg fangbeast-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="beastFur" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#57534e"/>
                <stop offset="60%" stop-color="#292524"/>
                <stop offset="100%" stop-color="#0c0a09"/>
            </linearGradient>
            <filter id="eyeGlow">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
        </defs>
        <ellipse cx="70" cy="115" rx="55" ry="10" fill="#000" opacity="0.6"/>
        <!-- Savage Ears -->
        <polygon points="35,45 20,15 48,32" fill="#1c1917" stroke="#dc2626" stroke-width="1.8"/>
        <polygon points="105,45 120,15 92,32" fill="#1c1917" stroke="#dc2626" stroke-width="1.8"/>
        <!-- Torso & Mane -->
        <path d="M 32 50 Q 70 28 108 50 Q 120 78 108 106 Q 70 120 32 106 Q 20 78 32 50 Z" fill="url(#beastFur)" stroke="#7f1d1d" stroke-width="2.5"/>
        <!-- Glowing Red Eyes -->
        <ellipse cx="52" cy="62" rx="7" ry="5" fill="#ef4444" filter="url(#eyeGlow)"/>
        <circle cx="53" cy="62" r="2" fill="#fff"/>
        <ellipse cx="88" cy="62" rx="7" ry="5" fill="#ef4444" filter="url(#eyeGlow)"/>
        <circle cx="87" cy="62" r="2" fill="#fff"/>
        <!-- Razor Fangs & Maw -->
        <polygon points="70,76 58,88 82,88" fill="#111"/>
        <polygon points="50,88 58,110 64,88" fill="#f8fafc" stroke="#64748b" stroke-width="1"/>
        <polygon points="76,88 82,110 90,88" fill="#f8fafc" stroke="#64748b" stroke-width="1"/>
        <!-- Spikes -->
        <path d="M 40 38 L 46 25 L 56 34" stroke="#e2e8f0" stroke-width="3" fill="none"/>
        <path d="M 100 38 L 94 25 L 84 34" stroke="#e2e8f0" stroke-width="3" fill="none"/>
    </svg>`,

    ogre: `
    <svg viewBox="0 0 150 140" class="sprite-svg ogre-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="ogreSkin" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#4d7c0f"/>
                <stop offset="60%" stop-color="#365314"/>
                <stop offset="100%" stop-color="#1a2e05"/>
            </linearGradient>
        </defs>
        <ellipse cx="75" cy="125" rx="60" ry="12" fill="#000" opacity="0.6"/>
        <!-- Heavy Bone Horns -->
        <path d="M 38 42 Q 22 14 12 24 Q 28 38 40 48" fill="#d6d3d1" stroke="#78716c" stroke-width="2"/>
        <path d="M 112 42 Q 128 14 138 24 Q 122 38 110 48" fill="#d6d3d1" stroke="#78716c" stroke-width="2"/>
        <!-- Massive Frame -->
        <path d="M 28 120 L 35 68 Q 75 32 115 68 L 122 120 Z" fill="url(#ogreSkin)" stroke="#142006" stroke-width="3.5"/>
        <!-- War Paint -->
        <path d="M 50 68 L 68 80" stroke="#b91c1c" stroke-width="4" stroke-linecap="round"/>
        <path d="M 100 68 L 82 80" stroke="#b91c1c" stroke-width="4" stroke-linecap="round"/>
        <!-- Glowing Amber Eyes -->
        <ellipse cx="54" cy="65" rx="6" ry="4.5" fill="#facc15"/>
        <circle cx="54" cy="65" r="2" fill="#000"/>
        <ellipse cx="96" cy="65" rx="6" ry="4.5" fill="#facc15"/>
        <circle cx="96" cy="65" r="2" fill="#000"/>
        <!-- Brutal Upward Tusks -->
        <polygon points="48,102 54,80 62,102" fill="#fff" stroke="#78716c" stroke-width="1.2"/>
        <polygon points="88,102 96,80 102,102" fill="#fff" stroke="#78716c" stroke-width="1.2"/>
        <path d="M 48 102 Q 75 112 102 102" stroke="#000" stroke-width="3.5" fill="none"/>
    </svg>`,

    dragon: `
    <svg viewBox="0 0 320 280" class="sprite-svg dragon-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="dragonCoreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffedd5"/>
                <stop offset="25%" stop-color="#f97316"/>
                <stop offset="60%" stop-color="#dc2626"/>
                <stop offset="100%" stop-color="#450a0a" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="dragonWingMembrane" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1c0507"/>
                <stop offset="50%" stop-color="#450a0a"/>
                <stop offset="100%" stop-color="#0a0203"/>
            </linearGradient>
            <linearGradient id="dragonSpikes" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#f59e0b"/>
                <stop offset="50%" stop-color="#78350f"/>
                <stop offset="100%" stop-color="#1c1917"/>
            </linearGradient>
            <linearGradient id="dragonArmorPlates" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#7f1d1d"/>
                <stop offset="35%" stop-color="#450a0a"/>
                <stop offset="70%" stop-color="#1c0507"/>
                <stop offset="100%" stop-color="#050102"/>
            </linearGradient>
            <filter id="infernalFireGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
        </defs>
        <!-- Massive Shadow Cast -->
        <ellipse cx="160" cy="265" rx="140" ry="14" fill="#000" opacity="0.85"/>
        <!-- Colossal Wings Left (Back Layer) -->
        <path d="M 140 140 Q 60 50 15 15 Q 10 70 30 110 Q 5 120 20 150 Q 8 165 40 185 Q 90 190 140 170 Z" fill="url(#dragonWingMembrane)" stroke="#b45309" stroke-width="2"/>
        <path d="M 15 15 Q 60 80 140 140" stroke="#f59e0b" stroke-width="3" fill="none"/>
        <path d="M 15 15 L 8 8 L 18 18" stroke="#fef08a" stroke-width="3"/>
        <path d="M 30 110 Q 80 120 140 150" stroke="#78350f" stroke-width="2" fill="none"/>
        <path d="M 20 150 Q 75 155 140 160" stroke="#78350f" stroke-width="2" fill="none"/>

        <!-- Colossal Wings Right (Back Layer) -->
        <path d="M 180 140 Q 260 50 305 15 Q 310 70 290 110 Q 315 120 300 150 Q 312 165 280 185 Q 230 190 180 170 Z" fill="url(#dragonWingMembrane)" stroke="#b45309" stroke-width="2"/>
        <path d="M 305 15 Q 260 80 180 140" stroke="#f59e0b" stroke-width="3" fill="none"/>
        <path d="M 305 15 L 312 8 L 302 18" stroke="#fef08a" stroke-width="3"/>
        <path d="M 290 110 Q 240 120 180 150" stroke="#78350f" stroke-width="2" fill="none"/>
        <path d="M 300 150 Q 245 155 180 160" stroke="#78350f" stroke-width="2" fill="none"/>

        <!-- Muscular Dragon Body & Torso -->
        <path d="M 115 140 Q 95 200 110 250 L 210 250 Q 225 200 205 140 Z" fill="url(#dragonArmorPlates)" stroke="#991b1b" stroke-width="3"/>
        
        <!-- Glowing Molten Chest Vents (Apex Power Core) -->
        <path d="M 130 165 Q 160 175 190 165 Q 175 220 160 235 Q 145 220 130 165 Z" fill="url(#dragonCoreGlow)" filter="url(#infernalFireGlow)"/>
        <!-- Chest Carapace Rib Plates -->
        <path d="M 134 175 Q 160 185 186 175" stroke="#1c0507" stroke-width="4" fill="none"/>
        <path d="M 138 195 Q 160 205 182 195" stroke="#1c0507" stroke-width="4" fill="none"/>
        <path d="M 144 215 Q 160 223 176 215" stroke="#1c0507" stroke-width="3" fill="none"/>

        <!-- Massive Claws / Talons -->
        <path d="M 105 240 L 90 262 L 105 262 L 120 262 L 125 245" fill="#1c1917" stroke="#78350f" stroke-width="2"/>
        <polygon points="88,262 82,272 95,262" fill="#fef08a"/>
        <polygon points="103,262 105,274 112,262" fill="#fef08a"/>
        <polygon points="118,262 125,272 124,262" fill="#fef08a"/>

        <path d="M 215 240 L 230 262 L 215 262 L 200 262 L 195 245" fill="#1c1917" stroke="#78350f" stroke-width="2"/>
        <polygon points="232,262 238,272 225,262" fill="#fef08a"/>
        <polygon points="217,262 215,274 208,262" fill="#fef08a"/>
        <polygon points="202,262 195,272 196,262" fill="#fef08a"/>

        <!-- Serpentine Armored Neck -->
        <path d="M 135 150 L 140 90 L 180 90 L 185 150 Z" fill="url(#dragonArmorPlates)" stroke="#991b1b" stroke-width="2.5"/>
        <path d="M 148 100 L 172 100" stroke="#f59e0b" stroke-width="2"/>
        <path d="M 145 120 L 175 120" stroke="#f59e0b" stroke-width="2"/>

        <!-- Predatory Dragon Head -->
        <path d="M 115 85 Q 160 55 205 85 L 210 105 Q 160 135 110 105 Z" fill="url(#dragonArmorPlates)" stroke="#ea580c" stroke-width="3"/>
        
        <!-- Serrated Horns (Triple Crown) -->
        <path d="M 130 75 Q 85 20 60 10 Q 95 40 120 70" fill="url(#dragonSpikes)" stroke="#fef08a" stroke-width="2"/>
        <path d="M 190 75 Q 235 20 260 10 Q 225 40 200 70" fill="url(#dragonSpikes)" stroke="#fef08a" stroke-width="2"/>
        <path d="M 145 65 Q 130 35 120 25 Q 140 45 150 62" fill="url(#dragonSpikes)" stroke="#f59e0b" stroke-width="1.5"/>
        <path d="M 175 65 Q 190 35 200 25 Q 180 45 170 62" fill="url(#dragonSpikes)" stroke="#f59e0b" stroke-width="1.5"/>

        <!-- Brow Ridge & Piercing Fiery Slit Eyes -->
        <path d="M 125 78 L 150 82" stroke="#000" stroke-width="4"/>
        <polygon points="132,82 148,82 144,90 134,90" fill="#fef08a" filter="url(#infernalFireGlow)"/>
        <line x1="140" y1="81" x2="140" y2="90" stroke="#000" stroke-width="2.5"/>

        <path d="M 195 78 L 170 82" stroke="#000" stroke-width="4"/>
        <polygon points="188,82 172,82 176,90 186,90" fill="#fef08a" filter="url(#infernalFireGlow)"/>
        <line x1="180" y1="81" x2="180" y2="90" stroke="#000" stroke-width="2.5"/>

        <!-- Blazing Infernal Maw with Fangs -->
        <ellipse cx="160" cy="108" rx="22" ry="9" fill="url(#dragonCoreGlow)"/>
        <polygon points="128,102 134,116 138,102" fill="#fff"/>
        <polygon points="142,104 148,118 152,104" fill="#fff"/>
        <polygon points="156,105 160,122 164,105" fill="#fff"/>
        <polygon points="168,104 172,118 176,104" fill="#fff"/>
        <polygon points="182,102 186,116 192,102" fill="#fff"/>
        <!-- Bottom Jagged Fangs -->
        <polygon points="135,116 140,106 145,116" fill="#fff"/>
        <polygon points="152,118 158,106 164,118" fill="#fff"/>
        <polygon points="175,116 180,106 185,116" fill="#fff"/>
    </svg>`
};
