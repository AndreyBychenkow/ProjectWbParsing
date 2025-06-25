from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.FloatField()
    sale_price = models.FloatField(default=0)
    brand = models.CharField(max_length=255, blank=True, null=True)
    rating = models.FloatField()
    feedback_count = models.IntegerField()
    image_links = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name
