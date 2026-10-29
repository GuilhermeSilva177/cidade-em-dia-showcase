/**
 * Trecho de "Cidade em Dia" — detecção de chamados duplicados por
 * proximidade geográfica.
 *
 * Contexto: várias pessoas costumam reportar o mesmo buraco. Em vez de
 * criar chamados repetidos (e poluir o painel da prefeitura), o sistema
 * busca chamados abertos da mesma categoria num raio pequeno e, se achar,
 * oferece "apoiar" o chamado existente em vez de abrir um novo — bounding
 * box como pré-filtro indexável, distância exata (Haversine) decide.
 *
 * (Excerpt isolado, com chamadas ao banco simplificadas — ver README do repositório.)
 */

import { and, desc, eq, inArray, sql } from "drizzle-orm";
// db, tickets e haversineM vêm do projeto real (lib/db, db/schema, lib/geo)

const DUPLICATE_RADIUS_M = 60;
const BOUNDING_BOX_DEG = 0.0012; // ~130 m — pré-filtro grosseiro antes do cálculo exato

export async function findNearbyOpen(categoryId: string, lat: number, lng: number) {
  const rows = await db
    .select()
    .from(tickets)
    .where(
      and(
        eq(tickets.categoryId, categoryId),
        inArray(tickets.status, ["ABERTO", "EM_ANDAMENTO"]),
        sql`${tickets.lat} between ${lat - BOUNDING_BOX_DEG} and ${lat + BOUNDING_BOX_DEG}`,
        sql`${tickets.lng} between ${lng - BOUNDING_BOX_DEG} and ${lng + BOUNDING_BOX_DEG}`,
      ),
    )
    .orderBy(desc(tickets.createdAt))
    .limit(10);

  return rows.find((r) => haversineM({ lat, lng }, r) <= DUPLICATE_RADIUS_M) ?? null;
}
