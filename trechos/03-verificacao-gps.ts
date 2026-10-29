/**
 * Trecho de "Cidade em Dia" — denúncia só é aceita com GPS real, dentro
 * do raio configurado da cidade.
 *
 * Contexto: pra evitar denúncia falsa ou fora da área de atuação, o
 * backend recusa qualquer chamado cuja coordenada esteja fora do raio —
 * cálculo de distância real via fórmula de Haversine, sem depender de
 * um serviço de geofencing pago. Checado tanto no cliente (feedback
 * imediato) quanto no servidor (defesa em profundidade).
 *
 * (Excerpt isolado para fins de portfólio — ver README do repositório.)
 */

interface LatLng {
  lat: number;
  lng: number;
}

export function haversineM(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// cityCenter e cityRadiusKm vêm da configuração da cidade ativa (src/config/city.ts no projeto real)
export function isWithinCity(p: LatLng, cityCenter: LatLng, cityRadiusKm: number): boolean {
  return haversineM(p, cityCenter) <= cityRadiusKm * 1000;
}
