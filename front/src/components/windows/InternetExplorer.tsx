import { useState, useCallback, useEffect, useRef } from 'react';
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
  'avost.antivirus.com': AVOST_PAGE,
  'maison.bonzai.local': '__REACT_BONZI_CODE__',
};

function BonziCodePage({ onComplete }: { onComplete: () => void }) {
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null]);
  const [unlocked, setUnlocked] = useState(false);
  const [wrongCode, setWrongCode] = useState(false);
  const completed = useRef(false);

  const checkCode = useCallback((newSlots: (string | null)[]) => {
    if (completed.current || !newSlots.every(s => s !== null)) return;
    if (newSlots.join('') === '4751') {
      completed.current = true;
      setUnlocked(true);
      onComplete();
    } else {
      setWrongCode(true);
      setTimeout(() => { setSlots([null, null, null, null]); setWrongCode(false); }, 1200);
    }
  }, [onComplete]);

  const handleDrop = useCallback((index: number, e: React.DragEvent) => {
    e.preventDefault();
    const digit = e.dataTransfer.getData('text/plain');
    if (digit.length === 1 && digit >= '0' && digit <= '9') {
      setSlots(prev => {
        const next = [...prev];
        next[index] = digit;
        checkCode(next);
        return next;
      });
    }
  }, [checkCode]);

  if (unlocked) {
    return (
      <div style={{
        background: '#800080', minHeight: '100%',
        fontFamily: "'Comic Sans MS', 'MS Sans Serif', cursive, sans-serif", color: '#fff',
      }}>
        <table width="100%" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr><td style={{ background: '#4B0082', padding: '6px 10px', textAlign: 'center', overflow: 'hidden' }}>
              <div style={{ fontSize: 9, color: '#ffff00', whiteSpace: 'nowrap', animation: 'bonzi-scroll 12s linear infinite' }}>
                ~*~ Bienvenue chez Bonzi ! Le singe le plus cool du web ! ~*~ Bienvenue chez Bonzi ! Le singe le plus cool du web ! ~*~
              </div>
              <style>{`@keyframes bonzi-scroll { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }`}</style>
            </td></tr>
          </tbody>
        </table>

        <div style={{ textAlign: 'center', padding: '12px 10px 6px' }}>
          <div style={{ fontSize: 22, fontWeight: 'bold', color: '#ffff00', textShadow: '2px 2px #000' }}>
            🐒 La Page Perso de Bonzi 🐒
          </div>
          <div style={{ fontSize: 10, color: '#dda0dd' }}>Derniere mise a jour : 14/03/1999 — Visiteurs : 0000003</div>
          <hr style={{ border: 'none', borderTop: '2px dashed #ff00ff', margin: '8px 20%' }} />
        </div>

        <div style={{ padding: '0 14px 10px' }}>
          <div style={{ background: '#4B0082', border: '2px outset #9932CC', padding: 10, marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 'bold', color: '#00ff00', marginBottom: 6 }}>📝 A propos de moi</div>
            <div style={{ fontSize: 11, lineHeight: 1.7, color: '#eee' }}>
              <div>Salut ! Moi c'est <b style={{ color: '#ffff00' }}>Bonzi</b> ! J'ai 3 ans (en annees singe c'est beaucoup).</div>
              <div>J'habite dans le systeme de Pindows 98 depuis le premier jour.</div>
              <div>Mes hobbies : les bananes, les blagues, et surfer sur Internet Explorer !</div>
              <div>Ma couleur preferee : <span style={{ color: '#9932CC', fontWeight: 'bold' }}>VIOLET</span> (evidemment)</div>
            </div>
          </div>

          <div style={{ background: '#4B0082', border: '2px outset #9932CC', padding: 10, marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 'bold', color: '#ff6600', marginBottom: 6 }}>🎤 Mon Reve Secret</div>
            <div style={{ fontSize: 11, lineHeight: 1.7, color: '#eee' }}>
              <div>J'ai toujours voulu devenir <b style={{ color: '#ffff00' }}>comedien</b> dans Pindows !</div>
              <div>Je veux faire rire tout le monde... mais je suis pas sur d'etre assez drole 😔</div>
              <div>Personne ne sait que je fais des blagues en secret... j'ose pas leur dire.</div>
              <div>J'ai trop peur qu'ils se moquent de moi au lieu de rire AVEC moi...</div>
              <div style={{ marginTop: 6, color: '#00ffff' }}>
                <b>⭐ Je prepare mon TOUT PREMIER stand-up !! ⭐</b>
              </div>
              <div>J'ai trop hate mais j'ai un peu le trac... est-ce que les gens vont rire ?</div>
              <div style={{ fontSize: 9, color: '#ff69b4', marginTop: 4 }}>Si vous lisez ca, venez a mon spectacle svp j'ai besoin de public 🙏</div>
            </div>
          </div>

          <div style={{ background: '#4B0082', border: '2px outset #9932CC', padding: 10, marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 'bold', color: '#ff0000', marginBottom: 6 }}>📓 Journal intime</div>
            <div style={{ fontSize: 11, lineHeight: 1.7, color: '#eee', fontFamily: "'Courier New', monospace" }}>
              <div style={{ color: '#808080' }}>--- Entree du 12/03/1999 ---</div>
              <div>J'ai ecrit une nouvelle blague aujourd'hui :</div>
              <div>"Pourquoi les octets vont-ils par 8 ? Parce qu'ils ont un BIT de sens !"</div>
              <div>Je l'ai garde pour moi... j'ose pas encore la dire aux autres 😢</div>
              <div style={{ color: '#808080', marginTop: 6 }}>--- Entree du 08/03/1999 ---</div>
              <div>J'ai repete mon sketch tout seul dans le dossier System.</div>
              <div>Je crois que les DLL m'ont entendu... j'espere qu'elles diront rien.</div>
              <div style={{ color: '#808080', marginTop: 6 }}>--- Entree du 01/03/1999 ---</div>
              <div>Je me demande si quelqu'un a deja remarque que je fais des blagues...</div>
              <div>Non, impossible. Je les garde toutes pour moi. Personne ne sait.</div>
              <div>Un jour je serai pret et je leur montrerai a tous !</div>
            </div>
          </div>

          <div style={{ background: '#000', border: '2px outset #9932CC', padding: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#808080' }}>
              <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width={1} height={1} alt="" />
              Page creee avec Bloc-notes — (c) 1999 Bonzi Corp.
              <br />Meilleure resolution : 800x600 — Compatible Internet Explorer 4.0+
              <br />
              <span style={{ color: '#ff00ff' }}>[Livre d'or]</span> | <span style={{ color: '#ff00ff' }}>[Me contacter]</span> | <span style={{ color: '#ff00ff' }}>[Retour]</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: '#800080', minHeight: '100%',
      fontFamily: "'Comic Sans MS', 'MS Sans Serif', cursive, sans-serif", color: '#fff',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#4B0082', border: '3px outset #9932CC', padding: 16, textAlign: 'center', minWidth: 300,
      }}>
        <div style={{ fontSize: 16, fontWeight: 'bold', color: '#ffff00', textShadow: '1px 1px #000', marginBottom: 4 }}>
          🐒 Maison de Bonzi 🐒
        </div>
        <div style={{ fontSize: 10, color: '#dda0dd', marginBottom: 12 }}>Page personnelle — Zone PRIVEE</div>
        <hr style={{ border: 'none', borderTop: '1px dashed #ff00ff', margin: '8px 0' }} />

        <div style={{ fontSize: 12, color: '#fff', marginBottom: 10 }}>Tapez le code a 4 chiffres :</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 10 }}>
          {slots.map((digit, i) => (
            <div
              key={i}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(i, e)}
              style={{
                width: 40, height: 48,
                background: wrongCode ? '#660000' : (digit ? '#2d004e' : '#1a0030'),
                border: `2px inset ${wrongCode ? '#ff0000' : (digit ? '#ff00ff' : '#9932CC')}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, fontWeight: 'bold',
                color: wrongCode ? '#ff0000' : '#ffff00',
                fontFamily: "'Fixedsys', 'Courier New', monospace",
                cursor: 'default',
              }}
            >
              {wrongCode ? 'X' : (digit ?? '')}
            </div>
          ))}
        </div>
        {wrongCode && (
          <div style={{ color: '#ff0000', fontSize: 11, fontWeight: 'bold', marginBottom: 6 }}>!! MAUVAIS CODE !!</div>
        )}
        <div style={{ fontSize: 9, color: '#9370DB' }}>
          Les cases n'acceptent pas le clavier.
        </div>
        <hr style={{ border: 'none', borderTop: '1px dashed #ff00ff', margin: '8px 0' }} />
        <div style={{ fontSize: 8, color: '#666' }}>
          (c) 1999 Bonzi Corp. — Acces non autorise = BAN
        </div>
      </div>
    </div>
  );
}

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
    } else if (gameState.flags.story5_bonzai_page) {
      setAddress('maison.bonzai.local');
      setCurrentPage('__REACT_BONZI_CODE__');
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
      {currentPage === '__REACT_BONZI_CODE__' ? (
        <div className="ie-viewport">
          <BonziCodePage onComplete={() => dispatch({ type: 'item_clicked', itemId: 'bonzai_code_cracked', windowType: 'ie' })} />
        </div>
      ) : (
        <div className="ie-viewport" dangerouslySetInnerHTML={{ __html: currentPage }} />
      )}
    </div>
  );
}
