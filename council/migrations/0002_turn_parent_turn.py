from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("council", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="turn",
            name="parent_turn",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="follow_ups",
                to="council.turn",
            ),
        ),
    ]
