# Second Table — Food Waste Distribution Frontend

React + Vite frontend for the [Food Waste Distribution System API](https://github.com/InukolluKiranKumar/foodwaste-distribution-system).

## Run it locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. It talks to the live backend by default
(set in `.env`) — no local backend needed.

## What's built

- **Browse Food** (`/`) — lists everything currently `AVAILABLE`, lets an NGO claim it
- **Donate Food** (`/donate`) — donor creates a new listing
- **Register as Donor** / **Register as NGO** — since the backend has no auth yet,
  registering just stores your donor/recipient record's `id` in the browser's
  localStorage so the app knows "who you are" for claiming/listing. No password, no login.
- **My Donations** — a donor's own listings, with a cancel option while `AVAILABLE`
- **My Claims** — an NGO's claimed pickups, with "mark picked up" / "cancel claim"

## Known assumptions worth verifying against the real API

I built this from your README's documented endpoints, but a couple of details
weren't spelled out and I had to make a reasonable guess. Test these first:

1. **Claim request body** — I'm sending `POST /api/donations/{id}/claim` with
   `{ "recipientId": <id> }`. If your controller expects a different field name
   (e.g. `recipientId` nested differently, or a query param instead), you'll see
   a 400/415 error on claim, and the fix is a one-line change in
   `src/api/client.js` → `claimDonation`.
2. **Recipient fields** — I used `name`, `email`, `phone`, `address` to match the
   Donor shape. If `Recipient` has different/extra required fields, registration
   will fail with a validation error — add the missing fields to
   `src/pages/RegisterRecipient.jsx`.
3. **Distribution field names** — I read `donationId` and `claimedAt` off the
   distribution object with fallbacks (`foodDonationId`, `createdAt`). If neither
   matches, "My Claims" will show blanks — check the actual JSON shape via
   `GET /api/distributions` and adjust `src/pages/MyClaims.jsx`.

If any of these need fixing, paste me the actual error/response and I'll patch it
in one shot.

## CORS — important before deploying

Your backend doesn't currently document a CORS policy. Once this frontend is on
its own domain, browser requests to the Railway API will be blocked unless the
backend explicitly allows it. Add this to your Spring Boot project:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "https://YOUR-DEPLOYED-FRONTEND-URL")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*");
    }
}
```

Redeploy the backend after adding this, updating the allowed origin once you
have your real deployed frontend URL.

## Deploying the frontend (Vercel — free, connects to GitHub like Railway did)

1. Push this project to a new GitHub repo.
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, **Add New → Project**,
   select the repo.
3. Vercel auto-detects Vite — framework preset "Vite", build command `npm run build`,
   output directory `dist`. Leave defaults.
4. Deploy. You'll get a live URL like `https://your-app.vercel.app`.
5. Go back and add that URL to your backend's CORS config (above), redeploy the backend.
