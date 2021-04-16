# OpenClassrooms - Septième projet
**⚠️ Ce projet est archivé et n'est plus maintenu à jour.**

Créez un réseau social d’entreprise.

[![CodeQL](https://github.com/matheograil/MatheoGrail_7_11032021/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/matheograil/MatheoGrail_7_11032021/actions/workflows/codeql-analysis.yml)
- Nom et Prénom : Grail Mathéo
- Projet : #07
- Date de début : 11/03/2021
## 💻 • Configuration du _back-end_
⚠️ La technologie utilisée pour la base de données est _MySQL_. La création des tables est gérée automatiquement par _Sequelize_. **Il est important de préciser que lors d'un redémarrage de l'application _back-end_, les anciennes tables sont réinitialisées. C'est donc un paramètre à prendre en compte dans un environnement de production.**
* Plusieurs paramètres sont à modifier dans le fichier `/back/.env` pour le bon fonctionnement de l'application _back-end_ :

| Nom  | Description |
| --- | --- |
| **JWT_TOKEN** | Clé de chiffrement utilisée pour les sessions (à modifier dès que possible) |
| **DB_HOST** | Adresse IP/nom de domaine de la base de données |
| **DB_USER** | Utilisateur de la base de données |
| **DB_DATABASE** | Nom de la base de données |
| **DB_PASSWORD** | Mot de passe de la base de données |
* Le _back-end_ nécessite également l'installation de _Node.js_ et _NPM_ (avec _nodemon_).
## 💻 • Démarrage du _back-end_
Dans le dossier de l'application `/back`, faire les commandes suivantes :
* `npm install`
* `nodemon start`

Si tout s'est bien passé, un message dans la console devrait apparaître :
> Connexion à la base de données réussie.
## 🎨 • Configuration du _front-end_
* Le _front-end_ nécessite l'installation de _Node.js_,  _NPM_ et _Vue.js_.
## 🎨 • Démarrage du _front-end_
Dans le dossier de l'application `/front`, faire les commandes suivantes :
* `npm install`
* `npm run serve`

Si tout s'est bien passé, un message dans la console devrait apparaître :
>  Compiled successfully.
