# Generated by Django 3.2 on 2021-06-20 00:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mantenedor', '0011_sucursal'),
    ]

    operations = [
        migrations.CreateModel(
            name='Imagenes',
            fields=[
                ('id_img', models.AutoField(primary_key=True, serialize=False)),
                ('imagen', models.ImageField(db_column='imagen', null=True, upload_to='static')),
            ],
            options={
                'db_table': 'imagenes',
            },
        ),
        migrations.DeleteModel(
            name='comuna',
        ),
        migrations.DeleteModel(
            name='Marca',
        ),
        migrations.DeleteModel(
            name='Producto',
        ),
        migrations.DeleteModel(
            name='Region',
        ),
        migrations.DeleteModel(
            name='Sucursal',
        ),
        migrations.DeleteModel(
            name='TipoUsuario',
        ),
    ]