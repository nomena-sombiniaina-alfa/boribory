export type Lang = "fr" | "en";

export const translations = {
  fr: {
    // Sidebar
    "sidebar.collapse": "Réduire la barre latérale",
    "sidebar.expand": "Afficher la barre latérale",
    "sidebar.newConversation": "Nouvelle discussion",
    "sidebar.conversations": "Discussions",
    "sidebar.noConversations": "Aucune discussion",
    "sidebar.guest": "Invité",
    "sidebar.userAccount": "Compte utilisateur",
    "sidebar.logout": "Se déconnecter",
    "sidebar.darkMode": "Mode sombre",
    "sidebar.lightMode": "Mode clair",
    "sidebar.switchToDark": "Passer en mode sombre",
    "sidebar.switchToLight": "Passer en mode clair",
    "sidebar.english": "English",
    "sidebar.french": "Français",
    "sidebar.switchToEnglish": "Switch to English",
    "sidebar.switchToFrench": "Passer en français",
    "sidebar.settings": "Paramètres",

    // Header
    "header.home": "Accueil",

    // Welcome / empty state
    "welcome.title": "Bienvenue, {name}.",
    "welcome.subtitle":
      "Démarre une discussion pour interroger plusieurs IA en parallèle.",
    "welcome.cta": "Nouvelle discussion",

    // ChatThread empty state
    "chat.emptyTitle": "Pose une question, reçois plusieurs avis.",
    "chat.emptySubtitle":
      "Tape ta question en bas. Chaque IA de ton conseil répondra dans sa propre carte.",
    "chat.questionLabel": "Question",

    // ResponseCard
    "response.pending": "En attente…",
    "response.error": "Erreur du modèle",
    "response.reply": "Répondre",
    "response.replyTo": "Répondre à {label}",
    "response.continueWith": "Continuer avec {label}…",
    "response.cancel": "Annuler",
    "response.cancelEsc": "Annuler (Échap)",
    "response.send": "Envoyer",
    "response.sendTo": "Envoyer à {label}",

    // QuestionInput
    "input.placeholder": "Pose ta question au panel…",
    "input.send": "Envoyer",

    // ModelGallery
    "gallery.badge": "Nouvelle discussion",
    "gallery.title": "Compose ton conseil d'IA",
    "gallery.descriptionPrefix": "Sélectionne jusqu'à ",
    "gallery.descriptionModels": "{max} modèles",
    "gallery.descriptionSuffix":
      ". Chacun répondra à ta question de son côté, sans se concerter. Compare les angles, croise les sources, tranche.",
    "gallery.eloDisclaimer":
      "Scores ELO : valeurs publiques approximatives du classement LMSYS Chatbot Arena (début 2026). Elles évoluent chaque semaine — à prendre comme ordre de grandeur, pas comme vérité absolue.",
    "gallery.selected": "/ {max} sélectionné(s)",
    "gallery.start": "Commencer la discussion",

    // ModelCard
    "model.company": "Entreprise",
    "model.country": "Pays",
    "model.released": "Sortie",
    "model.size": "Taille",
    "model.context": "Contexte",
    "model.arenaTitle": "LMSYS Chatbot Arena",
    "model.arenaPublic": "public",

    // Auth
    "auth.subtitle": "Ton conseil de modèles d'IA",
    "auth.login": "Se connecter",
    "auth.register": "S'inscrire",
    "auth.username": "Nom d'utilisateur",
    "auth.password": "Mot de passe",
    "auth.minChars": "8 caractères minimum",
    "auth.submitLogin": "Se connecter",
    "auth.submitRegister": "Créer le compte",
    "auth.unexpectedError": "Erreur inattendue",

    // Settings
    "settings.title": "Paramètres",
    "settings.profile": "Profil",
    "settings.language": "Langue",
    "settings.conversations": "Conversations",
    "settings.dangerZone": "Zone sensible",
    "settings.usernameLabel": "Nom d'utilisateur",
    "settings.save": "Enregistrer",
    "settings.saved": "Enregistré ✓",
    "settings.close": "Fermer",
    "settings.selectAll": "Tout sélectionner",
    "settings.selectNone": "Tout désélectionner",
    "settings.deleteSelected": "Supprimer la sélection ({count})",
    "settings.deleteAll": "Supprimer toutes les conversations",
    "settings.noConversations": "Aucune conversation.",
    "settings.confirmDeleteSelected":
      "Supprimer {count} conversation(s) ? Cette action est irréversible.",
    "settings.confirmDeleteAll":
      "Supprimer TOUTES les conversations ? Cette action est irréversible.",

    // Generic
    "error.network": "erreur réseau",
  },
  en: {
    "sidebar.collapse": "Collapse sidebar",
    "sidebar.expand": "Show sidebar",
    "sidebar.newConversation": "New conversation",
    "sidebar.conversations": "Conversations",
    "sidebar.noConversations": "No conversations",
    "sidebar.guest": "Guest",
    "sidebar.userAccount": "User account",
    "sidebar.logout": "Sign out",
    "sidebar.darkMode": "Dark mode",
    "sidebar.lightMode": "Light mode",
    "sidebar.switchToDark": "Switch to dark mode",
    "sidebar.switchToLight": "Switch to light mode",
    "sidebar.english": "English",
    "sidebar.french": "Français",
    "sidebar.switchToEnglish": "Switch to English",
    "sidebar.switchToFrench": "Switch to French",
    "sidebar.settings": "Settings",

    "header.home": "Home",

    "welcome.title": "Welcome, {name}.",
    "welcome.subtitle":
      "Start a conversation to query several AIs in parallel.",
    "welcome.cta": "New conversation",

    "chat.emptyTitle": "Ask a question, get several opinions.",
    "chat.emptySubtitle":
      "Type your question below. Each AI in your council will answer in its own card.",
    "chat.questionLabel": "Question",

    "response.pending": "Waiting…",
    "response.error": "Model error",
    "response.reply": "Reply",
    "response.replyTo": "Reply to {label}",
    "response.continueWith": "Continue with {label}…",
    "response.cancel": "Cancel",
    "response.cancelEsc": "Cancel (Esc)",
    "response.send": "Send",
    "response.sendTo": "Send to {label}",

    "input.placeholder": "Ask your panel…",
    "input.send": "Send",

    "gallery.badge": "New conversation",
    "gallery.title": "Compose your AI council",
    "gallery.descriptionPrefix": "Select up to ",
    "gallery.descriptionModels": "{max} models",
    "gallery.descriptionSuffix":
      ". Each will answer your question on its own, without conferring. Compare angles, cross-check sources, decide.",
    "gallery.eloDisclaimer":
      "ELO scores: approximate public values from the LMSYS Chatbot Arena leaderboard (early 2026). They shift weekly — treat them as orders of magnitude, not absolute truth.",
    "gallery.selected": "/ {max} selected",
    "gallery.start": "Start the conversation",

    "model.company": "Company",
    "model.country": "Country",
    "model.released": "Released",
    "model.size": "Size",
    "model.context": "Context",
    "model.arenaTitle": "LMSYS Chatbot Arena",
    "model.arenaPublic": "public",

    "auth.subtitle": "Your AI models council",
    "auth.login": "Sign in",
    "auth.register": "Sign up",
    "auth.username": "Username",
    "auth.password": "Password",
    "auth.minChars": "8 characters minimum",
    "auth.submitLogin": "Sign in",
    "auth.submitRegister": "Create account",
    "auth.unexpectedError": "Unexpected error",

    "settings.title": "Settings",
    "settings.profile": "Profile",
    "settings.language": "Language",
    "settings.conversations": "Conversations",
    "settings.dangerZone": "Danger zone",
    "settings.usernameLabel": "Username",
    "settings.save": "Save",
    "settings.saved": "Saved ✓",
    "settings.close": "Close",
    "settings.selectAll": "Select all",
    "settings.selectNone": "Clear selection",
    "settings.deleteSelected": "Delete selected ({count})",
    "settings.deleteAll": "Delete all conversations",
    "settings.noConversations": "No conversations.",
    "settings.confirmDeleteSelected":
      "Delete {count} conversation(s)? This action is irreversible.",
    "settings.confirmDeleteAll":
      "Delete ALL conversations? This action is irreversible.",

    "error.network": "network error",
  },
} as const;

export type TKey = keyof (typeof translations)["fr"];

export function translate(
  lang: Lang,
  key: TKey,
  vars?: Record<string, string | number>,
): string {
  const dict = translations[lang] ?? translations.fr;
  let s: string = dict[key] ?? translations.fr[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replaceAll(`{${k}}`, String(v));
    }
  }
  return s;
}
