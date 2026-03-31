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
    <div style="font-size:14px;color:#ff00ff;margin:4px 0">
      Le VRAI Battle Royale Officiel (pas une copie)
    </div>
    <div style="font-size:10px;color:#00ffff">
      [Site officiel certifie par Microsaft et Epyc Games]
    </div>
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
        <div style="color:#fff;font-size:11px">- Pioche en diamant</div>
        <div style="background:#ff0000;color:#fff;padding:6px;margin:8px auto 4px;cursor:pointer;font-weight:bold;border:2px outset #ccc;max-width:150px">
          TELECHARGER.EXE
        </div>
        <div style="color:#808080;font-size:8px">*frais de livraison numerique: 49,99EUR</div>
      </td>
      <td style="background:#000;border:2px solid #ff00ff;padding:10px;text-align:center;width:50%">
        <div style="color:#ff00ff;font-size:16px;font-weight:bold">PACK ULTIMATE VIP PRO</div>
        <div style="color:#ffff00;font-size:24px;font-weight:bold;margin:6px 0"><s style="color:#ff0000">999,99EUR</s> 1,99EUR</div>
        <div style="color:#fff;font-size:11px">- 999.999 FortBux</div>
        <div style="color:#fff;font-size:11px">- TOUS les skins du jeu</div>
        <div style="color:#fff;font-size:11px">- Aimbot integre (100% legal)</div>
        <div style="color:#fff;font-size:11px">- Acces anticipee Saison 99</div>
        <div style="background:#ff00ff;color:#fff;padding:6px;margin:8px auto 4px;cursor:pointer;font-weight:bold;border:2px outset #ccc;max-width:150px">
          OBTENIR_MAINTENANT.EXE
        </div>
        <div style="color:#808080;font-size:8px">**votre carte bancaire sera debitee de 299EUR/mois</div>
      </td>
    </tr>
  </table>

  <div style="margin:10px;padding:8px;border:2px solid #00ffff;background:rgba(0,0,0,0.5)">
    <div style="color:#00ffff;font-weight:bold;font-size:13px;margin-bottom:4px">TEMOIGNAGES DE VRAIS JOUEURS :</div>
    <div style="color:#fff;font-size:11px;margin:3px 0">
      <span style="color:#00ff00">xX_DarkSasuke69_Xx :</span> "jai recu 1 million de fortbux cet 100% reel merci faurnite !!!!!"
    </div>
    <div style="color:#fff;font-size:11px;margin:3px 0">
      <span style="color:#ff00ff">~*PrInCeSsE_GaMeR*~ :</span> "mon antivirus dit que cet un virus mdr mais ca marche quand meme lol"
    </div>
    <div style="color:#fff;font-size:11px;margin:3px 0">
      <span style="color:#ffff00">BonziB0y2005 :</span> "jai telecharger et mantenant mon pc fait des bruits bizarres mais jai les skins"
    </div>
  </div>

  <div style="text-align:center;margin:10px">
    <img alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" style="width:88px;height:31px;border:1px solid #fff;background:#333" />
    <img alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" style="width:88px;height:31px;border:1px solid #fff;background:#333;margin:0 4px" />
    <div style="color:#808080;font-size:10px;margin-top:6px">
      Visiteurs: <span style="background:#000;color:#00ff00;padding:1px 4px;font-family:monospace">000024891</span>
    </div>
    <div style="color:#808080;font-size:8px;margin-top:4px">
      &copy; 1998 Faurnite Inc. Tous droits reserves. Ce site est approuve par Pindows 98.
    </div>
    <div style="color:#808080;font-size:7px">
      Webmaster: xX_H4ck3r_M4st3r_Xx@caramail.fr | Optimise pour Netscope Navigator 3.0
    </div>
  </div>

  <marquee direction="up" scrollamount="2" style="position:fixed;right:6px;top:40px;width:120px;height:200px;background:rgba(0,0,0,0.8);border:2px solid #ff0000;padding:6px;font-size:10px;color:#ff0000;z-index:5">
    ATTENTION VIRUS DETECTE !!!<br/><br/>
    Votre ordinateur est infecte par 847 virus !!!<br/><br/>
    Telechargez notre antivirus GRATUIT pour nettoyer votre PC :<br/><br/>
    <span style="color:#00ff00;text-decoration:underline;cursor:pointer">AntiVirus_Total_2024_GRATUIT.exe</span><br/><br/>
    NE FERMEZ PAS CETTE FENETRE !!!
  </marquee>
</div>
`;

const ERROR_PAGE = `
<div style="background:#fff;font-family:'MS Sans Serif',Arial,sans-serif;padding:20px;height:100%;box-sizing:border-box">
  <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:20px">
    <div style="font-size:32px">&#9888;</div>
    <div>
      <div style="font-size:14px;font-weight:bold;margin-bottom:8px">
        Impossible d'afficher cette page
      </div>
      <div style="font-size:12px;color:#333;line-height:1.6">
        La page que vous recherchez est actuellement indisponible. Le site Web rencontre peut-etre des difficultes techniques ou vous devez ajuster les parametres de votre navigateur.
      </div>
    </div>
  </div>
  <hr style="border:none;border-top:1px solid #ccc;margin:16px 0" />
  <div style="font-size:11px;color:#666;line-height:1.8">
    <div style="font-weight:bold;margin-bottom:4px">Veuillez essayer les actions suivantes :</div>
    <ul style="margin:0;padding-left:20px">
      <li>Cliquez sur <span style="text-decoration:underline;color:#0000ff;cursor:pointer">Actualiser</span>, ou reessayez plus tard.</li>
      <li>Verifiez que vous avez saisi l'adresse correctement.</li>
      <li>Contactez le webmaster du site pour l'informer du probleme.</li>
    </ul>
  </div>
  <hr style="border:none;border-top:1px solid #ccc;margin:16px 0" />
  <div style="font-size:10px;color:#999;text-align:center">
    Internet Explorer - Erreur HTTP 404
  </div>
</div>
`;

const HOME_PAGE = `
<div style="background:#fff;font-family:'MS Sans Serif',Arial,sans-serif;padding:20px;height:100%;box-sizing:border-box;text-align:center">
  <div style="margin-top:40px">
    <div style="font-size:20px;font-weight:bold;color:#0000aa;margin-bottom:8px">Bienvenue sur Internet Explorer</div>
    <div style="font-size:12px;color:#666;margin-bottom:20px">Tapez une adresse dans la barre ci-dessus pour naviguer.</div>
    <div style="font-size:11px;color:#999">Pindows 98 - Le meilleur navigateur du monde*</div>
    <div style="font-size:8px;color:#ccc;margin-top:4px">*selon notre propre etude interne</div>
  </div>
</div>
`;

const KNOWN_SITES: Record<string, string> = {
  'faurnite.battlepass.com': SCAM_PAGE,
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

  // When story3 spam flag is set, auto-load faurnite on mount
  useEffect(() => {
    if (gameState.flags.story3_faurnite_spam) {
      setAddress('faurnite.battlepass.com');
      setCurrentPage(KNOWN_SITES['faurnite.battlepass.com']!);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only on mount

  const navigate = useCallback((raw: string) => {
    const url = resolveUrl(raw);
    if (!url) { setCurrentPage(HOME_PAGE); return; }

    setLoading(true);
    setAddress(url);

    // Fake loading delay
    setTimeout(() => {
      const page = KNOWN_SITES[url];
      setCurrentPage(page ?? ERROR_PAGE);
      setLoading(false);
      // Dispatch event for story triggers
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
