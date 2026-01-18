from django.core.management.base import BaseCommand

from council.providers.base import LLMMessage, ProviderError
from council.providers.registry import _ROUTES, build_provider


PING = [LLMMessage(role="user", content="Dis simplement « bonjour » en français.")]


class Command(BaseCommand):
    help = (
        "Ping chaque modèle configuré pour vérifier que la clé API et "
        "l'endpoint fonctionnent. Utilisation : python manage.py test_providers "
        "[--model gpt-4o] [--only-configured]"
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--model",
            help="Ne tester qu'un seul modèle (ex : gemini-2.5-flash)",
        )
        parser.add_argument(
            "--only-configured",
            action="store_true",
            help="Sauter les modèles dont la clé API est vide",
        )

    def handle(self, *args, **options):
        routes = _ROUTES
        if options.get("model"):
            mid = options["model"]
            if mid not in routes:
                self.stderr.write(self.style.ERROR(f"modèle inconnu : {mid}"))
                return
            routes = {mid: routes[mid]}

        ok = 0
        fail = 0
        skip = 0

        for model_id, route in routes.items():
            provider = build_provider(route)
            if options.get("only_configured") and not provider.api_key:
                skip += 1
                continue

            label = f"{model_id:<20} ({route.key})"
            self.stdout.write(f"→ {label} ...", ending=" ")
            self.stdout.flush()

            try:
                result = provider.call(PING, route.remote_model)
            except ProviderError as e:
                self.stdout.write(self.style.ERROR(f"FAIL — {e}"))
                fail += 1
                continue
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"CRASH — {type(e).__name__}: {e}")
                )
                fail += 1
                continue

            preview = result.content.strip().replace("\n", " ")[:80]
            self.stdout.write(
                self.style.SUCCESS(f"OK ({result.latency_ms} ms)")
            )
            self.stdout.write(f"   ↳ {preview}")
            ok += 1

        self.stdout.write("")
        summary = f"{ok} OK · {fail} échoués · {skip} ignorés"
        style = self.style.SUCCESS if fail == 0 else self.style.WARNING
        self.stdout.write(style(summary))
