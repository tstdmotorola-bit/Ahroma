import { describe, expect, it } from "vitest";
import { getProduct } from "@/data/products";
describe("preços", () => {
  it.each([
    ["brand-collection-326", 599], ["dolce-gabbana-the-only-one-intense", 599], ["lattafa-the-kingdom", 269],
    ["lattafa-atheeri", 499], ["lady-million", 699], ["212-vip-rose", 629], ["invictus", 799], ["angel-mugler-eau-de-parfum-100ml", 829],
  ])("%s custa %d", (slug, price) => expect(getProduct(slug)?.price).toBe(price));
});