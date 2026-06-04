# Nuxio Coming Soon

Landingspagina voor Nuxio met focus op conversie:

- Heldere waardepropositie en pakketten
- CTA-knoppen voor offerte-aanvraag
- Offerteformulier met validatie en succesmelding
- Basis event-tracking voor CTA-klik en formulier-submit

## Bestandsstructuur

- index.html: volledige pagina (layout, styling en JavaScript)
- README.md: projectinformatie en werkwijze

## Lokaal bekijken

Open index.html direct in je browser, of start een simpele lokale server:

```bash
python3 -m http.server 8080
```

Ga daarna naar:

http://localhost:8080

## Offerteflow

Bij klik op een knop met data-offerte-cta="true":

1. Scrollt de pagina naar het offerteformulier.
2. Krijgt het veld Naam automatisch focus.
3. Wordt een tracking-event verstuurd.

Bij formulier-submit:

1. Browser-validatie controleert verplichte velden.
2. Bij succes verschijnt een bevestigingstekst.
3. Er wordt een submit-event verstuurd met pakketinformatie.

## Deploy

De git-remote staat op:

https://github.com/Nuxio-NL/coming-soon

Publiceren kan bijvoorbeeld via:

- Vercel
- GitHub Pages

## Git workflow

Kleine wijzigingen worden in aparte commits vastgelegd en gepusht naar main.
