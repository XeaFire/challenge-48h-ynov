import { useState, useCallback, useEffect } from 'react';
import { useGame } from '../../game/GameContext';

const SCAM_PAGE = `
<div style="background:#000080;min-height:100%;font-family:'Comic Sans MS',cursive,sans-serif;color:#ffff00;overflow:hidden">
  <div style="background:linear-gradient(90deg,#ff0000,#ff8800,#ffff00,#00ff00,#0000ff,#ff00ff,#ff0000);padding:4px;text-align:center">
    <marquee scrollamount="8" style="font-size:11px;color:#fff;font-weight:bold">
      *** FELICITATIONS !!! VOUS ETES LE 1.000.000eme VISITEUR !!! CLIQUEZ ICI POUR RECUPERER VOS 10.000 FORTBUX GRATUITS !!! ***
    </marquee>
  </div>
  <div style="text-align:center;padding:10px">
    <div style="font-size:28px;font-weight:bold;color:#00ff00;text-shadow:2px 2px #ff0000;letter-spacing:2px">
      <span style="color:#ff0000">~*~</span> FAURNITE <span style="color:#ff0000">~*~</span>
    </div>
    <div style="font-size:14px;color:#ff00ff;margin:4px 0">Le VRAI Battle Royale Officiel (pas une copie)</div>
    <div style="font-size:10px;color:#00ffff">[Site officiel certifie par Microsaft et Epyc Games]</div>
  </div>
  <div style="background:#ff0000;color:#fff;font-size:18px;font-weight:bold;text-align:center;padding:8px;margin:6px;border:3px dashed #ffff00;animation:blink98 0.5s infinite">
    !!! OFFRE LIMITEE - EXPIRE DANS 00:03:27 !!!
  </div>
  <table style="width:90%;margin:0 auto;border-collapse:collapse">
    <tr>
      <td style="background:#000;border:2px solid #00ff00;padding:10px;text-align:center;width:50%">
        <div style="color:#00ff00;font-size:16px;font-weight:bold">PACK STARTER</div>
        <div style="color:#ffff00;font-size:24px;font-weight:bold;margin:6px 0"><s style="color:#ff0000">99,99EUR</s> GRATUIT*</div>
        <div style="color:#fff;font-size:11px">- 50.000 FortBux</div>
        <div style="color:#fff;font-size:11px">- Skin "Le Vrai Joueur"</div>
        <div style="color:#fff;font-size:11px">- Danse "Le Floss Supreme"</div>
        <div style="background:#ff0000;color:#fff;padding:6px;margin:8px auto 4px;cursor:pointer;font-weight:bold;border:2px outset #ccc;max-width:150px">TELECHARGER.EXE</div>
        <div style="color:#808080;font-size:8px">*frais de livraison numerique: 49,99EUR</div>
      </td>
      <td style="background:#000;border:2px solid #ff00ff;padding:10px;text-align:center;width:50%">
        <div style="color:#ff00ff;font-size:16px;font-weight:bold">PACK ULTIMATE VIP PRO</div>
        <div style="color:#ffff00;font-size:24px;font-weight:bold;margin:6px 0"><s style="color:#ff0000">999,99EUR</s> 1,99EUR</div>
        <div style="color:#fff;font-size:11px">- 999.999 FortBux</div>
        <div style="color:#fff;font-size:11px">- TOUS les skins du jeu</div>
        <div style="color:#fff;font-size:11px">- Aimbot integre (100% legal)</div>
        <div style="background:#ff00ff;color:#fff;padding:6px;margin:8px auto 4px;cursor:pointer;font-weight:bold;border:2px outset #ccc;max-width:150px">OBTENIR_MAINTENANT.EXE</div>
        <div style="color:#808080;font-size:8px">**votre carte bancaire sera debitee de 299EUR/mois</div>
      </td>
    </tr>
  </table>
  <div style="margin:10px;padding:8px;border:2px solid #00ffff;background:rgba(0,0,0,0.5)">
    <div style="color:#00ffff;font-weight:bold;font-size:13px;margin-bottom:4px">TEMOIGNAGES DE VRAIS JOUEURS :</div>
    <div style="color:#fff;font-size:11px;margin:3px 0"><span style="color:#00ff00">xX_DarkSasuke69_Xx :</span> "jai recu 1 million de fortbux cet 100% reel merci faurnite !!!!!"</div>
    <div style="color:#fff;font-size:11px;margin:3px 0"><span style="color:#ff00ff">~*PrInCeSsE_GaMeR*~ :</span> "mon antivirus dit que cet un virus mdr mais ca marche quand meme lol"</div>
    <div style="color:#fff;font-size:11px;margin:3px 0"><span style="color:#ffff00">BonziB0y2005 :</span> "jai telecharger et mantenant mon pc fait des bruits bizarres mais jai les skins"</div>
  </div>
  <marquee direction="up" scrollamount="2" style="position:fixed;right:6px;top:40px;width:120px;height:200px;background:rgba(0,0,0,0.8);border:2px solid #ff0000;padding:6px;font-size:10px;color:#ff0000;z-index:5">
    ATTENTION VIRUS DETECTE !!!<br/><br/>Votre ordinateur est infecte par 847 virus !!!<br/><br/>
    <span style="color:#00ff00;text-decoration:underline;cursor:pointer">AntiVirus_Total_2024_GRATUIT.exe</span><br/><br/>NE FERMEZ PAS CETTE FENETRE !!!
  </marquee>
</div>
`;

const AVOST_PAGE = `
<div style="background:#f5f7fa;min-height:100%;font-family:Segoe UI,Tahoma,sans-serif;color:#333">
  <div style="background:linear-gradient(135deg,#1a237e,#0d47a1);padding:16px 20px;color:#fff">
    <div style="font-size:20px;font-weight:bold;letter-spacing:1px">🛡️ AVOST Antivirus</div>
    <div style="font-size:11px;opacity:0.8;margin-top:2px">Protection totale pour Pindows 98</div>
  </div>
  <div style="padding:16px 20px">
    <div style="background:#e8f5e9;border-left:4px solid #4caf50;padding:12px;margin-bottom:16px;border-radius:2px">
      <div style="font-size:14px;font-weight:bold;color:#2e7d32">✅ Votre systeme est protege</div>
      <div style="font-size:11px;color:#555;margin-top:4px">Derniere analyse : il y a 2 minutes — 1 menace neutralisee</div>
    </div>
    <div style="font-size:15px;font-weight:bold;margin-bottom:10px;color:#1a237e">📋 Conseils de securite</div>
    <div style="background:#fff;border:1px solid #ddd;border-radius:4px;padding:12px;margin-bottom:12px">
      <div style="font-size:12px;line-height:1.8">
        <div style="margin-bottom:6px">🔒 <b>Ne cliquez jamais</b> sur des liens promettant des cadeaux gratuits ou des offres "trop belles pour etre vraies".</div>
        <div style="margin-bottom:6px">📧 <b>Mefiance avec les mails</b> provenant d'expediteurs inconnus ou avec des caracteres etranges.</div>
        <div style="margin-bottom:6px">🐒 <b>Ne telechargez jamais</b> de logiciels proposes par des <span style="color:#7b1fa2;font-weight:bold">singes violets inconnus</span>. Ils contiennent souvent des malwares.</div>
        <div style="margin-bottom:6px">💾 <b>Sauvegardez</b> regulierement vos fichiers importants sur une disquette externe.</div>
        <div>🔄 <b>Mettez a jour</b> votre systeme et votre antivirus regulierement.</div>
      </div>
    </div>
    <div style="font-size:15px;font-weight:bold;margin-bottom:10px;color:#1a237e">⚠️ Menaces recentes detectees</div>
    <div style="background:#fff;border:1px solid #ddd;border-radius:4px;overflow:hidden">
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <tr style="background:#e3f2fd">
          <th style="text-align:left;padding:6px 10px">Menace</th>
          <th style="text-align:left;padding:6px 10px">Type</th>
          <th style="text-align:left;padding:6px 10px">Statut</th>
        </tr>
        <tr style="border-top:1px solid #eee">
          <td style="padding:6px 10px">faurnite_installer.exe</td>
          <td style="padding:6px 10px;color:#d32f2f">Trojan.FortBux</td>
          <td style="padding:6px 10px;color:#4caf50">Supprime ✓</td>
        </tr>
        <tr style="border-top:1px solid #eee">
          <td style="padding:6px 10px">popup_generator.dll</td>
          <td style="padding:6px 10px;color:#d32f2f">Adware.SpamWindow</td>
          <td style="padding:6px 10px;color:#4caf50">Supprime ✓</td>
        </tr>
        <tr style="border-top:1px solid #eee;background:#fff3e0">
          <td style="padding:6px 10px;font-weight:bold">B̶o̶n̶z̶i̶_̶b̶u̶d̶d̶y̶.̶e̶x̶e̶</td>
          <td style="padding:6px 10px;color:#e65100">Spyware.Suspect</td>
          <td style="padding:6px 10px;color:#ff9800;font-weight:bold">En surveillance... 👀</td>
        </tr>
      </table>
    </div>
    <div style="margin-top:16px;text-align:center;font-size:9px;color:#999">
      &copy; 1998 AVOST Software — "On protege, vous surfez" — avost.antivirus.com
    </div>
  </div>
</div>
`;

const ERROR_PAGE = `
<div style="background:#fff;font-family:'MS Sans Serif',Arial,sans-serif;padding:20px;height:100%;box-sizing:border-box">
  <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:20px">
    <div style="font-size:32px">&#9888;</div>
    <div>
      <div style="font-size:14px;font-weight:bold;margin-bottom:8px">Impossible d'afficher cette page</div>
      <div style="font-size:12px;color:#333;line-height:1.6">
        La page que vous recherchez est actuellement indisponible.
      </div>
    </div>
  </div>
  <hr style="border:none;border-top:1px solid #ccc;margin:16px 0" />
  <div style="font-size:10px;color:#999;text-align:center">Internet Explorer - Erreur HTTP 404</div>
</div>
`;

const HOME_PAGE = `
<div style="background:#fff;font-family:'MS Sans Serif',Arial,sans-serif;padding:20px;height:100%;box-sizing:border-box;text-align:center">
  <div style="margin-top:40px">
    <div style="font-size:20px;font-weight:bold;color:#0000aa;margin-bottom:8px">Bienvenue sur Internet Explorer</div>
    <div style="font-size:12px;color:#666">Tapez une adresse dans la barre ci-dessus pour naviguer.</div>
  </div>
</div>
`;

const KNOWN_SITES: Record<string, string> = {
  'faurnite.battlepass.com': SCAM_PAGE,
  'avost.antivirus.com': AVOST_PAGE,
};

function resolveUrl(input: string): string {
  let url = input.trim().toLowerCase();
  url = url.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  return url;
}

export function InternetExplorer() {
  const { gameState, dispatch } = useGame();
  const [address, setAddress] = useState('');
  const [currentPage, setCurrentPage] = useState<string>(HOME_PAGE);
  const [loading, setLoading] = useState(false);

  // Auto-load a page based on story flags
  useEffect(() => {
    if (gameState.flags.story3_faurnite_spam) {
      setAddress('faurnite.battlepass.com');
      setCurrentPage(SCAM_PAGE);
    } else if (gameState.flags.story3_avost_page) {
      setAddress('avost.antivirus.com');
      setCurrentPage(AVOST_PAGE);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useCallback((raw: string) => {
    const url = resolveUrl(raw);
    if (!url) { setCurrentPage(HOME_PAGE); return; }
    setLoading(true);
    setAddress(url);
    setTimeout(() => {
      const page = KNOWN_SITES[url];
      setCurrentPage(page ?? ERROR_PAGE);
      setLoading(false);
      dispatch({ type: 'url_visited', url });
    }, 800 + Math.random() * 1200);
  }, [dispatch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') navigate(address);
  };

  return (
    <div className="ie-browser">
      <div className="ie-toolbar">
        <button className="ie-nav-btn" onClick={() => setCurrentPage(HOME_PAGE)}>Accueil</button>
        <div className="ie-address-bar">
          <span className="ie-address-label">Adresse</span>
          <input
            className="ie-address-input"
            value={address}
            onChange={e => setAddress(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="http://"
            spellCheck={false}
          />
        </div>
        <button className="ie-nav-btn" onClick={() => navigate(address)}>OK</button>
      </div>
      {loading && <div className="ie-loading-bar"><div className="ie-loading-fill" /></div>}
      <div className="ie-viewport" dangerouslySetInnerHTML={{ __html: currentPage }} />
    </div>
  );
}
