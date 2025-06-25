import os
import django
import requests
import sys
import time
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ProjectWbParsing.settings')
django.setup()

from products.models import Product

class WBSearchParser:
    def __init__(self, query):
        self.query = query

    def parse(self, max_pages=None):
        Product.objects.all().delete()
        page = 1
        total = 0
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "Referer": "https://www.wildberries.ru/",
        }
        while True:
            if max_pages and page > max_pages:
                print("Достигнут лимит страниц.")
                break
            url = (
                f"https://search.wb.ru/exactmatch/ru/common/v4/search"
                f"?ab_testing=false&appType=1&curr=rub&dest=-1257786"
                f"&query={self.query}&page={page}&sort=popular&spp=30&resultset=catalog"
            )
            print(f"Парсим страницу {page} — {url}")
            resp = requests.get(url, headers=headers)
            if resp.status_code != 200:
                print(f"Ошибка запроса: {resp.status_code}")
                break
            data = resp.json()
            products = data.get("data", {}).get("products", [])
            if not products:
                print("Товаров больше нет.")
                break
            for product in products:
                price = product.get("priceU", 0) / 100
                sale_price = product.get("salePriceU", 0) / 100
                Product.objects.update_or_create(
                    name=product.get("name", ""),
                    defaults={
                        "price": price,
                        "sale_price": sale_price,
                        "brand": product.get("brand", ""),
                        "rating": product.get("rating", 0),
                        "feedback_count": product.get("feedbacks", 0),
                        "image_links": self._get_images(product),
                    }
                )
                total += 1
            print(f"Собрано товаров: {total}")
            page += 1
            time.sleep(2.5)
        print(f"Готово! Всего собрано товаров: {total}")

    @staticmethod
    def _get_images(product):
        _short_id = product["id"] // 100000
        basket = str(_short_id // 144 + 1).zfill(2)
        pics = product.get("pics", 1)
        product_id = product["id"]
        links = [
            f"https://basket-{basket}.wb.ru/vol{_short_id}/part{product_id // 1000}/{product_id}/images/big/{i}.jpg"
            for i in range(1, pics + 1)
        ]
        return ";".join(links)

if __name__ == "__main__":
    query = input("Введите поисковый запрос (например, кроссовки, сапоги, туфли): ").strip()
    max_pages = input("Сколько страниц парсить? (Enter — все): ").strip()
    max_pages = int(max_pages) if max_pages else None
    parser = WBSearchParser(query)
    parser.parse(max_pages=max_pages)