# OpenClassrooms - Septième projet
Créez un réseau social d’entreprise.

[![CodeQL](https://github.com/matheograil/MatheoGrail_7_11032021/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/matheograil/MatheoGrail_7_11032021/actions/workflows/codeql-analysis.yml)

- Nom et Prénom : Grail Mathéo
- Projet : #07
- Date de début : 11/03/2021

## Configuration du _back-end_

* Plusieurs paramètres sont à modifier dans le fichier `.env` pour le bon fonctionnement de l'application _back-end_ :

| Nom  | Description |
| --- | --- |
| **DB_HOST** | Adresse IP/nom de domaine de la base de données (MySQL) |
| **DB_USER** | Utilisateur de la base de données (MySQL) |
| **DB_DATABASE** | Nom de la base de données (MySQL) |
| **DB_PASSWORD** | Mot de passe de la base de données (MySQL) |

* Le _back-end_ nécessite l'installation de _Node.js_ et _NPM (avec nodemon)_.

## Démarrage du _back-end_

Dans le dossier de l'application `/back`, faire les commandes suivantes :

* `npm install`
* `nodemon start`

Si tout s'est bien passé, un message dans la console devrait apparaître :
> Connexion à la base de données réussie.
