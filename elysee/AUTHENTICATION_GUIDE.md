# 📱 Guide d'Authentification - Élysée Store

## ✨ Nouvelles Fonctionnalités Implémentées

### 1. **Système d'Authentification**
- ✅ **Inscription** : Création de compte avec email et mot de passe
- ✅ **Connexion** : Authentification sécurisée
- ✅ **Déconnexion** : Terminer la session utilisateur
- ✅ **Validation** : Vérification des emails uniques et mots de passe

### 2. **Profils Utilisateur**
- ✅ **Page Profil** : Affichage des infos utilisateur
- ✅ **Avatar** : Emoji personnalisé
- ✅ **Statistiques** : Commandes, Posts, Amis
- ✅ **Bio** : Description personnelle
- ✅ **Historique** : Date de création du compte

### 3. **Messagerie Privée**
- ✅ **Conversations** : Liste de toutes les discussions
- ✅ **Messages Directs** : Envoyer/recevoir des messages
- ✅ **Historique** : Tous les messages sont sauvegardés
- ✅ **Timestamps** : Heure de chaque message
- ✅ **Status de lecture** : Savoir si un message a été lu

### 4. **Système d'Amis**
- ✅ **Liste d'Amis** : Voir tous vos contacts
- ✅ **Statut Online** : Indicateur en ligne/hors ligne
- ✅ **Ajout d'Amis** : Possibilité d'ajouter des contacts
- ✅ **Amis Suggérés** : Recommandations basées sur les utilisateurs

---

## 🔑 Démonstration - Comptes de Test

### Utilisateur 1 - Alice
- **Email**: `alice@example.com`
- **Mot de passe**: `password123`
- **Avatar**: 👩‍💼
- **Bio**: "Passionnée par le shopping"

### Utilisateur 2 - Bob
- **Email**: `bob@example.com`
- **Mot de passe**: `password123`
- **Avatar**: 👨‍💻
- **Bio**: "Tech enthusiast"

> **Créez aussi votre propre compte!** Cliquez sur "Créer un compte" pour vous inscrire.

---

## 📝 Comment Utiliser

### Inscription
1. Cliquez sur le lien "Créer un compte" sur la page de connexion
2. Remplissez les informations:
   - Nom complet
   - Email (doit être unique)
   - Mot de passe (minimum 6 caractères)
   - Confirmer le mot de passe
3. Cliquez sur "S'inscrire"

### Connexion
1. Allez sur la page "Connexion"
2. Entrez votre email et mot de passe
3. Cliquez sur "Se connecter"

### Profil
1. Cliquez sur "👤 Profil" dans le menu
2. Consultez vos statistiques
3. Voyez vos amis connectés
4. Cliquez sur "Déconnexion" pour vous déconnecter

### Messagerie
1. Cliquez sur "✉️ Messages" dans le menu
2. Sélectionnez une conversation dans la liste
3. Écrivez votre message et cliquez "Envoyer"
4. Les messages sont automatiquement sauvegardés

### Amis
Votre liste d'amis s'affiche sur votre profil avec:
- Emoji d'avatar
- Nom de l'ami
- Statut online/offline (point vert ou gris)

---

## 💾 Stockage des Données

Toutes les données sont sauvegardées **localement** dans le navigateur :
- Comptes utilisateurs
- Messages privés
- Amis
- Couleurs préférées
- Panier et commandes

Les données persistent même après fermeture du navigateur.

---

## 🔒 Sécurité

- Les mots de passe sont encodés (Base64) - **à améliorer en production**
- Pas de transmission sur internet
- Chaque session utilisateur est stockée localement

> ⚠️ **Note** : Pour la production, utilisez:
> - Hachage bcrypt ou Argon2
> - Authentification JWT
> - HTTPS pour les communications
> - Base de données sécurisée

---

## 🎨 Intégration avec Existant

### Pages Disponibles
- 🛍️ **Shop** : Boutique avec produits et panier
- 🎬 **Shorts** : Vidéos avec likes/comments
- 📱 **Posts** : Fil social
- 🎮 **Games** : Mini-jeux
- 💬 **Chat** : Support client
- 🎨 **Couleurs** : Personnalisation des couleurs
- **Nouvelles** :
  - 🔐 Connexion/Inscription
  - 👤 Profil
  - ✉️ Messages privés

### Flux Utilisateur Complet
1. S'inscrire ou se connecter
2. Naviguer dans la boutique
3. Ajouter au panier
4. Faire du shopping
5. Envoyer des messages aux amis
6. Suivre les posts et vidéos
7. Personnaliser les couleurs
8. Se déconnecter

---

## 🚀 Améliorations Futures

- [ ] Édition du profil (avatar, bio)
- [ ] Suppression de compte
- [ ] Récupération de mot de passe
- [ ] Notifications de messages
- [ ] Recherche d'utilisateurs
- [ ] Demandes d'amis
- [ ] Blocage d'utilisateurs
- [ ] Photos de profil
- [ ] Deux facteurs d'authentification
- [ ] Intégration backend (MongoDB)

---

## 📞 Support

Pour toute question, utilisez la page **Chat** pour contacter le support client!

---

**Version**: 1.0  
**Date**: 2024  
**Framework**: HTML5 + CSS3 + JavaScript ES6+  
**Stockage**: LocalStorage
