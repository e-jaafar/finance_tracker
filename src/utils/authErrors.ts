export function getAuthErrorMessage(error: any): string {
    const errorCode = error?.code;

    switch (errorCode) {
        case "auth/invalid-email":
            return "L'adresse email n'est pas valide.";
        case "auth/user-disabled":
            return "Ce compte utilisateur a été désactivé.";
        case "auth/user-not-found":
        case "auth/invalid-credential":
            return "Email ou mot de passe incorrect.";
        case "auth/wrong-password":
            return "Mot de passe incorrect.";
        case "auth/email-already-in-use":
            return "Cette adresse email est déjà utilisée par un autre compte.";
        case "auth/weak-password":
            return "Le mot de passe doit contenir au moins 6 caractères.";
        case "auth/operation-not-allowed":
            return "La connexion par email/mot de passe n'est pas activée.";
        case "auth/popup-closed-by-user":
            return "La fenêtre de connexion a été fermée.";
        case "auth/cancelled-popup-request":
            return "Une seule demande de fenêtre contextuelle est autorisée à la fois.";
        default:
            console.error("Auth Error:", error);
            return error?.message || "Une erreur inconnue est survenue.";
    }
}
