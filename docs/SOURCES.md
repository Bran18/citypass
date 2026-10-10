# Content sources and provenance

Reviewed 2026-10-10 using the public Visit Iguazú directories and individual detail pages:
- https://visitiguazu.travel/atractivos/
- https://visitiguazu.travel/agencias/

The app includes a manually curated snapshot of 15 listings, not a live sync or a complete directory export. Every entry in `src/lib/catalog.ts` records its specific `source_url`, review date, original concise ES/EN/PT summaries and `listed` participation status. Names and published business contacts are factual directory fields. The municipal footer address, phone and email were excluded from business contacts. No article text, photos, logos, opening hours, prices or availability were imported. Icons are symbolic illustrations, not photographs of the businesses. Category assignments are editorial browsing categories, not source certification.

## Included records

Three park experiences (Garganta del Diablo, Circuito Superior, Circuito Inferior) link to the park article:
https://visitiguazu.travel/atractivos/cataratas-del-iguazu-parque-nacional/

Additional attractions:
- Güirá Oga: https://visitiguazu.travel/atractivos/guira-oga/
- El Jardín de los Picaflores: https://visitiguazu.travel/atractivos/el-jardin-de-los-picaflores/
- Experiencia Cultura Guaraní: https://visitiguazu.travel/atractivos/cultural/experiencia-cultura-guarani-un-encuentro-con-las-raices-de-misiones/
- 2000 Horizontes: https://visitiguazu.travel/atractivos/agroecologia/circuito-agroecologico-turismo-comunitario-chacras-puerto-iguazu/
- Tirolesa Iguazú, Cabalgatas Iguazú: https://visitiguazu.travel/atractivos/aventura/tirolesa-iguazu-cabalgatas-iguazu/
- Salto Mbocay: https://visitiguazu.travel/atractivos/salto-mbocay-2/

Agencies:
- Reemix.tur.ar: https://visitiguazu.travel/agencias/reemix-tur-ar/
- Comercial de Turismo: https://visitiguazu.travel/agencias/comercial-de-turismo/
- Aguas Grandes: https://visitiguazu.travel/agencias/aguas-grandes/
- Wondersfalls: https://visitiguazu.travel/agencias/wondersfalls/
- Venteveo Turismo: https://visitiguazu.travel/agencias/venteveo-turismo/
- Turismo Seven Iguazú: https://visitiguazu.travel/agencias/turismo-seven-iguazu/

## Boundaries and maintenance

No source listing implies Passport participation, municipal endorsement, current licensing or a confirmed booking. Public contacts were checked against the directory, not confirmed directly with the businesses. Some other detail pages failed retrieval and were omitted. Prices, schedules and current offerings remain at the source. The source checked date is a review date, not the publisher's update date.

With Supabase configured, successful public venue queries are supplemented with the editorial directory. Database records win ID/name matches; database failures still surface as errors. Source URLs are not used as a unique business identity because multiple park experiences legitimately share an article. The connected Iguapass database now contains all 15 listings, including provenance and public contact fields. Stable catalog keys identify imported records; all remain listed, without partner approval. Future imports must preserve that identity map.

For ongoing collaboration with the destination team, establish a named content maintainer, correction/removal process, refresh interval and agreed photo/logo rights before importing those assets or enabling automated synchronization. Updates currently require a reviewed catalog edit and deployment.
