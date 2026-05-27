# Prince Education - Corporate Website

Independent English corporate website for the **Prince Education** brand, operated by **Hong Kong-Macau International Education Research Institute Limited**. This repository is separate from the AALA 2026 conference site at `aalaconference.com`.

## Local preview

```bash
cd prince-education-website
python3 -m http.server 8080
```

Open `http://localhost:8080`

## Deploy to GitHub Pages

1. Create a new GitHub repository (e.g. `prince-education-website`).
2. Push this folder:

   ```bash
   git remote add origin git@github.com:YOUR_USER/prince-education-website.git
   git add -A && git commit -m "Initial Prince Education corporate site"
   git push -u origin main
   ```

3. On GitHub: **Settings ? Pages ? Build from branch `main` / root**.
4. Register a domain (e.g. `princeeducation.com`) and add a `CNAME` file:

   ```
   www.princeeducation.com
   ```

5. At your registrar, set DNS for GitHub Pages (see [GitHub custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)).
6. Enable **Enforce HTTPS** in Pages settings.

## Before Macau bank / merchant review

Update placeholders on [contact.html](contact.html) and the site footer:

- [ ] Legal entity name exactly as on merchant application
- [ ] Business registration (UEN / M/B) number
- [ ] Official customer service email and phone
- [ ] Primary registered business address (match application)

### Bank review checklist

- [ ] Site loads over **HTTPS** on production domain
- [ ] **Home** and **About** describe the business clearly
- [ ] **Products & Services** lists offerings and conference fees
- [ ] **Contact** shows physical address, email, phone, hours
- [ ] **Privacy Policy**, **Terms of Service**, **Refund Policy** linked in footer
- [ ] **Register and pay online** opens `https://aalaconference.com/registration.html`
- [ ] No card entry fields on this site (payments only on AALA site)
- [ ] Domain registrant consistent with merchant applicant (or documented relationship)

## Partner checkout (AALA)

If a user adds AALA registration to cart, checkout redirects to the official AALA registration portal for registration form + bank payment:

**https://aalaconference.com/registration.html**

Configured on [products-services.html](products-services.html) and [checkout.html](checkout.html) - no changes required on the AALA repository.

## Structure

| Page | Purpose |
|------|---------|
| `index.html` | Home |
| `about.html` | Company story & milestones |
| `courses.html` | Programme catalogue |
| `campuses.html` | Locations |
| `team.html` | Faculty |
| `partners.html` | Partners & credentials |
| `testimonials.html` | Student feedback |
| `products-services.html` | Commercial offerings + collaborator section + \"Add to cart\" |
| `cart.html` | Cart |
| `checkout.html` | Checkout redirect to AALA portal |
| `contact.html` | Contact & business details |
| `privacy-policy.html` | Privacy |
| `terms-of-service.html` | Terms |
| `refund-policy.html` | Refunds (training + conference pointer) |

Assets in `assets/` include images exported from the company brochure PDF.
