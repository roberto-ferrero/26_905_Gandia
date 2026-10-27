import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { renderSeo, canonical, questions } from '../src/seo.js';
import { availability } from '../src/site-config.js';

test('el HTML contiene respuestas y tarifas sin ejecutar JavaScript', () => {
  const html = renderSeo(readFileSync(new URL('../index.html', import.meta.url), 'utf8'));
  assert.ok(!html.includes('noindex'));
  assert.ok(!html.includes('<!-- SEO:'));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`));
  const data = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const faq = data['@graph'].find((item) => item['@type'] === 'FAQPage');
  assert.equal(faq.mainEntity.length, questions.length);
  for (const question of faq.mainEntity) {
    assert.ok(html.includes(`<summary>${question.name}</summary>`));
    assert.ok(html.includes(`<p>${question.acceptedAnswer.text}</p>`));
  }
  for (const season of availability.seasons) assert.ok(html.includes(`${season.price} €/noche`));
  for (const url of data['@graph'].find((item) => item['@type'] === 'Apartment').image) {
    assert.ok(existsSync(new URL('../public/' + url.slice(canonical.length), import.meta.url)), url);
  }
  assert.ok(!html.includes('private-'));
});
