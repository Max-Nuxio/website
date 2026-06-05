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

## Vercel autoresponder setup

Voor een mooie bevestigingsmail naar de invuller is in deze repo een Vercel
API route toegevoegd:

- api/send-offerte-confirmation.js

Deze route verstuurt via Resend een HTML bevestigingsmail naar het e-mailadres
uit het offerteformulier.

Zet in Vercel bij Project Settings -> Environment Variables:

- RESEND_API_KEY: je Resend API key
- RESEND_FROM: bijvoorbeeld `Nuxio <support@nuxio.nl>`

Belangrijk:

- Verifieer je domein (nuxio.nl) in Resend.
- Zet SPF, DKIM en DMARC DNS-records goed voor betere deliverability.

## Migratie van Netlify naar Vercel

De frontend gebruikt nu `/api/send-offerte-confirmation` in plaats van de oude
Netlify function route.

Als je project nog niet live komt op Vercel:

- controleer dat het Vercel-project naar deze repo en juiste root wijst
- voeg `nuxio.nl` en `www.nuxio.nl` toe aan hetzelfde Vercel-project
- zet de Vercel environment variables voor productie opnieuw in Vercel
- verifieer ownership via de gevraagde `_vercel` TXT-records als het domein nog
  aan een ander Vercel-account gekoppeld is

## Git workflow

Kleine wijzigingen worden in aparte commits vastgelegd en gepusht naar main.
