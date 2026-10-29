/**
 * Trecho de "Cidade em Dia" — avatar anônimo determinístico (identicon),
 * sem serviço externo e sem nunca expor a foto/nome real do cidadão.
 *
 * Contexto: por LGPD, o ranking público não pode mostrar nome nem foto —
 * mas precisa de algo visualmente identificável e ESTÁVEL (não pode mudar
 * a cada carregamento, nem se o cidadão trocar de número de telefone).
 * A solução: um hash simples + um SVG gerado puro a partir de uma semente
 * fixa guardada no cadastro.
 *
 * (Excerpt isolado para fins de portfólio — ver README do repositório.)
 */

function hashSeed(seed: string): number[] {
  let h1 = 0xdeadbeef ^ seed.length;
  let h2 = 0x41c6ce57 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    const ch = seed.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const bytes: number[] = [];
  let x = h1 >>> 0;
  let y = h2 >>> 0;
  for (let i = 0; i < 24; i++) {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
    y = (Math.imul(y, 22695477) + 1) >>> 0;
    bytes.push((x ^ y) & 0xff);
  }
  return bytes;
}

const HUES = [4, 24, 45, 90, 150, 190, 210, 260, 290, 330];

/** Gera um SVG de identicon (grade 5x5 simétrica), determinístico a partir da semente. */
export function identiconSvg(seed: string, size = 64): string {
  const bytes = hashSeed(seed || "anon");
  const hue = HUES[bytes[0] % HUES.length];
  const bg = `hsl(${hue} 70% 94%)`;
  const fg = `hsl(${hue} 60% 42%)`;
  const cols = 5;
  const cell = size / cols;
  const half = Math.ceil(cols / 2);
  let cells = "";
  for (let r = 0; r < cols; r++) {
    for (let c = 0; c < half; c++) {
      const idx = r * half + c;
      if ((bytes[idx % bytes.length] & 1) !== 1) continue;
      const x1 = c * cell;
      const x2 = (cols - 1 - c) * cell;
      cells += `<rect x="${x1}" y="${r * cell}" width="${cell}" height="${cell}" fill="${fg}"/>`;
      if (x2 !== x1) cells += `<rect x="${x2}" y="${r * cell}" width="${cell}" height="${cell}" fill="${fg}"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${size / 2}" fill="${bg}"/>${cells}</svg>`;
}

const ADJ = ["Ágil", "Atento", "Vigilante", "Dedicado", "Cuidadoso", "Solidário", "Prestativo", "Zeloso"];
const NOUN = ["Guardião", "Vizinho", "Cidadão", "Vigia", "Sentinela", "Colaborador"];

/** Apelido curto e estável pro ranking público — nunca o nome real do cidadão. */
export function anonymousAlias(seed: string): string {
  const bytes = hashSeed(seed || "anon");
  return `${NOUN[bytes[2] % NOUN.length]} ${ADJ[bytes[1] % ADJ.length]} #${100 + (bytes[3] % 900)}`;
}
