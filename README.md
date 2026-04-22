# Boribory

Un "panel de conseil" : tu poses une question, plusieurs modèles d'IA te répondent en parallèle, chaque réponse dans sa propre carte. Tu choisis jusqu'à 6 modèles parmi 11 à chaque nouvelle discussion.

## Pourquoi ?

Boribory est né d'un incident trouvé en prod : on avait besoin d'**avoir plusieurs avis d'IA en même temps** pour diagnostiquer le problème, et surtout de pouvoir **clarifier la réponse d'un modèle quand elle était confuse ou douteuse**, en **discutant directement avec ce modèle-là** sans relancer toute la batterie ni perdre le contexte des autres. L'outil a été taillé pour ce cas précis : **usage interne en équipe**, quelques profils, tout le monde sur la même instance. Ce n'est **pas prévu pour un gros volume d'utilisateurs** ni exposé publiquement — d'où l'absence d'authentification durcie (pas de 2FA, pas d'email, pas de vérification, juste `username` + `password`). L'idée c'est qu'on monte l'instance sur une machine partagée et que l'équipe y entre vite.

D'où les choix suivants :

- **Arrêter de switcher entre les tabs** — une seule question, une seule interface, toutes les réponses en parallèle dans un même écran. Plus de copier-coller, plus d'oubli d'un modèle.
- **Comparer côte à côte** — chaque IA répond dans sa propre carte. Tu vois d'un coup d'œil qui est d'accord avec qui, qui hallucine, qui nuance. L'erreur d'un modèle saute aux yeux quand les autres disent l'inverse.
- **Clarifier une réponse en tête-à-tête** — quand une carte te laisse perplexe, clique "Répondre" dessus : un mini-input apparaît dans la carte et tu continues la discussion uniquement avec ce modèle, pour lever l'ambiguïté sans relancer les autres.
- **Plusieurs profils pour partager avec l'équipe** — authentification par utilisateur, chacun garde ses propres conversations privées. Chaque membre s'inscrit, personne ne voit les discussions des autres, mais tout le monde partage la même instance et les mêmes clés API.
- **Auth volontairement légère** — pas de 2FA, pas d'email, pas de récupération par lien. L'outil est pensé pour tourner en interne (VPN, LAN, ou machine d'équipe) — si tu l'exposes sur Internet public, ajoute une couche devant (reverse proxy avec auth, SSO, etc.).
- **Mutualiser les clés API** — une seule config `.env` côté serveur, tous les membres bénéficient des tiers gratuits des 7 providers (~5-50 req/jour/modèle) sans que chacun doive créer un compte chez OpenAI, Google, Groq, Mistral, Cohere, DeepSeek, OpenRouter.
- **Ne pas dépendre d'un seul fournisseur** — si GitHub Models tombe ou change ses quotas, Gemini et Mistral continuent. Si un provider retire un modèle, tu en ajoutes un autre dans `registry.py`.
- **Réduire le biais d'un seul modèle** — poser la même question à 6 LLM d'entraînements différents donne un signal plus robuste qu'une seule réponse, surtout sur les sujets où un modèle unique serait tenté de te dire ce que tu veux entendre.
- **Rester souverain sur les données** — self-hosted, SQLite en dev, rien ne sort vers un SaaS intermédiaire. Les conversations vivent sur ta machine ou ton serveur, pas dans un dashboard tiers.

## Stack

- **Backend** : Django 4.2 + Django REST Framework (auth par token). BDD : SQLite en dev.
- **Frontend** : React 18 + Vite + TypeScript + Tailwind CSS.
- **Providers** : GitHub Models, Google Gemini, Groq, Mistral, Cohere, DeepSeek, OpenRouter — tous via leur endpoint OpenAI-compatible (un seul adaptateur côté backend).

## Arborescence

```
boribory/
├── manage.py
├── requirements.txt
├── .env.example          # modèle à copier vers .env
├── boribory/             # projet Django (settings, urls)
├── council/              # app Django
│   ├── models.py         # Conversation · Turn · Response
│   ├── views.py          # ConversationViewSet + action /ask/
│   ├── auth_views.py     # register · login · logout · me
│   ├── providers/        # adaptateurs LLM
│   │   ├── base.py
│   │   ├── openai_compat.py
│   │   └── registry.py   # mapping model_id → endpoint + nom distant
│   └── management/commands/test_providers.py
└── frontend/             # React + Vite
    └── src/
        ├── App.tsx
        ├── contexts/AuthContext.tsx
        ├── api/          # client.ts + conversations.ts
        └── components/
```

## Installation

### Pré-requis
- Python 3.10+ (testé avec l'env conda `myself`)
- Node 18+

### Backend

```bash
cd boribory
conda activate myself          # ou un autre env Python
pip install -r requirements.txt
cp .env.example .env           # puis édite .env (voir "Clés API" plus bas)
python manage.py migrate
python manage.py runserver     # http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                    # http://localhost:5173
```

Le frontend tape par défaut sur `http://localhost:8000/api`. Pour changer : crée `frontend/.env` avec `VITE_API_BASE=https://autre-host/api`.

## Clés API des providers

Tous les providers ont un tier gratuit suffisant pour usage perso (~5-50 requêtes/jour/modèle). Remplis `.env` avec celles que tu veux activer — les modèles non configurés afficheront simplement "clé API non configurée" sans casser les autres.

| Variable `.env`          | Modèles débloqués                   | Où récupérer la clé                         |
| ------------------------ | ----------------------------------- | ------------------------------------------- |
| `GITHUB_MODELS_TOKEN`    | GPT-4o, GPT-4o mini, o1-mini        | github.com/settings/tokens (PAT classique, scope `models:read`) |
| `GOOGLE_API_KEY`         | Gemini 2.5 Flash, Gemini 2.5 Pro    | aistudio.google.com/app/apikey              |
| `GROQ_API_KEY`           | Llama 3.3 70B                       | console.groq.com/keys                       |
| `MISTRAL_API_KEY`        | Mistral Large 2                     | console.mistral.ai/api-keys                 |
| `COHERE_API_KEY`         | Command R+                          | dashboard.cohere.com/api-keys               |
| `DEEPSEEK_API_KEY`       | DeepSeek V3                         | platform.deepseek.com/api_keys              |
| `OPENROUTER_API_KEY`     | DeepSeek R1, Qwen 2.5 72B           | openrouter.ai/keys                          |

Exemple de `.env` :

```
DJANGO_SECRET_KEY=change-me-in-prod
DJANGO_DEBUG=1

GITHUB_MODELS_TOKEN=ghp_xxxxxxxx
GOOGLE_API_KEY=AIzaxxxxxxxx
GROQ_API_KEY=gsk_xxxxxxxx
MISTRAL_API_KEY=xxxxxxxx
COHERE_API_KEY=xxxxxxxx
DEEPSEEK_API_KEY=sk-xxxxxxxx
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxx
```

## Vérifier la connectivité

Une fois `.env` rempli, teste chaque modèle avec un petit ping :

```bash
# tous les modèles configurés :
python manage.py test_providers --only-configured

# un seul modèle :
python manage.py test_providers --model gemini-2.5-flash

# tous (même ceux sans clé) :
python manage.py test_providers
```

Sortie type :

```
→ gpt-4o               (github_models) ... OK (1820 ms)
   ↳ Bonjour ! Je suis GPT-4o, comment puis-je t'aider aujourd'hui ?
→ gemini-2.5-flash     (google)        ... OK (940 ms)
   ↳ Bonjour !
→ llama-3.3-70b        (groq)          ... OK (420 ms)
   ↳ Bonjour !
→ mistral-large        (mistral)       ... FAIL — HTTP 401 — invalid key
```

En cas d'échec, le message d'erreur (code HTTP + début du body) donne le diagnostic : clé invalide, endpoint qui a bougé, nom de modèle à ajuster, etc. Les endpoints et noms sont dans `council/providers/registry.py` — seul fichier à toucher pour corriger.

## Utilisation

1. Démarre backend + frontend, ouvre http://localhost:5173
2. Inscris-toi (un compte Django est créé côté backend)
3. Clique **Nouvelle discussion** → galerie des 11 modèles avec leur entreprise, pays, contexte, ELO LMSYS Arena
4. Sélectionne jusqu'à 6 modèles, clique **Commencer**
5. Pose ta question — chaque modèle répond dans sa propre carte en parallèle
6. Questions suivantes : chaque modèle garde le contexte de ses **propres** réponses précédentes (pas celles des autres IA, pour éviter la contamination croisée)

## API (endpoints Django)

Tous les endpoints sont sous `/api/` et requièrent `Authorization: Token <token>` sauf les deux premiers.

| Méthode  | Chemin                              | Description                               |
| -------- | ----------------------------------- | ----------------------------------------- |
| `POST`   | `/api/auth/register/`               | Crée un compte, retourne le token         |
| `POST`   | `/api/auth/login/`                  | Connexion, retourne le token              |
| `POST`   | `/api/auth/logout/`                 | Invalide le token                         |
| `GET`    | `/api/auth/me/`                     | Infos du user connecté                    |
| `GET`    | `/api/conversations/`               | Liste des conversations du user           |
| `POST`   | `/api/conversations/`               | Crée une conversation                     |
| `GET`    | `/api/conversations/{id}/`          | Détail avec tous les tours et réponses    |
| `PATCH`  | `/api/conversations/{id}/`          | Met à jour (titre, modèles sélectionnés)  |
| `DELETE` | `/api/conversations/{id}/`          | Supprime                                  |
| `POST`   | `/api/conversations/{id}/ask/`      | Nouvelle question → appels parallèles     |

Le `/ask/` est synchrone : la requête ne retourne que quand les 6 providers ont tous répondu (ou échoué). Latence = max des latences. Pour une vraie UX streaming, il faudra passer à SSE (TODO).

## Limites connues

- Pas de streaming : chaque carte passe de "pending" à "done" d'un coup.
- Pas de gestion du contexte long : si la discussion dépasse la fenêtre d'un modèle, ça peut échouer côté provider.
- Les scores ELO dans la galerie sont des valeurs publiques approximatives (début 2026), pas des données live.
