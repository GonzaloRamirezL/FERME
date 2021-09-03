from django.db import models

class Imagenes(models.Model):
	id_img = models.AutoField(primary_key=True)
	imagen = models.ImageField(upload_to="static", null = True,  db_column='imagen')
	
	class Meta:
		db_table = 'imagenes'








