# QRcode
# QRCodeProjet

## Présentation du projet :  

Ce projet sera suivi par une équipe de la MIAGE d'Evry composé de :  
* BERTOUX Jeanne
* CORBEL Kilian
* DARKAOUI Fakih

  
Il sera suivi par des professeurs et des étudiants pour l'étude du besoin et les tests.

Ce projet consiste à mettre en place une application qui permettra de dématérialiser la notion de “feuille de présence”.  

Existant :
* Création et gestion des QR Codes
* Création des espaces administrateur, étudiants et enseignants

Besoins 2018 : 
* B1.1 Faciliter la création des QR Codes
* B1.2 Faciliter l'inscription des étudiants
* B1.3 Automatiser la sortie papier de la feuille de présence et l'envoi par courriel à Mme .... secrétaire MIAGE

Besoins 2019 : 
* B2.1 Import sur un dépôt cloud des PDF générés
* B2.2 Suivre les heures effectuées par mois et matière
* B2.3 Afficher les absences 
* B2.4 Automatiser l'envoie des absences par courriel à Mme ... secrétaire MIAGE
* B2.5 Préparer la création des qrcode en fonction de VT
* B2.6 Mettre en ligne l'application

Fonctionnalités faites :
* Import CSV pour inscrire des étudiants/enseignants --> B1.2
* Mise à jour du visuel (tableau, liste, ...) 
* Génération PDF de la feuille de présence et envoie par mail --> B1.3
* 
* B1.1 Import sur un dépôt cloud des PDF générés --> B2.1
* B1.2 Suivre les heures effectuées par mois et matière --> B2.2
* B1.3 Afficher les absences --> B2.3

Fonctionnalités faites Novembre - Décembre 2019 : 
* installation du server Seafile sur une machine Virtual Box sous l'OS Ubuntu 18.04.

A l’aide de la technologie QR Code, le serveur pourra générer automatiquement (avec un planificateur de tâches : node-cron) des QR Codes (avant la 1ère plage horaire de cours) qui changeront pour chaque heure de cours en fonction de l’emploi du temps de chaque professeur (emploi du temps renseigné dans la bdd ; L’objectif suivant étant de le lié au VT d’Evry). Une fois cette action terminée, le serveur enverra un mail aux enseignants contenant les QR codes leurs correspondants. Ce code sera affiché par le professeur à chaque début de plage horaire. Les élèves devront scanner ce code à chaque début de plage horaire afin de notifier leur présence en cours.  

Lorsque l’on scanne le QR Code, celui-ci nous renvoie une URL contenant toutes les informations cryptées (afin d’éviter toute fraude des étudiants) sur la séance et qui permet à l’étudiant de signaler sa présence. Les chaînes de caractères cryptées seront stockées dans la base de données et seront “mappées” avec les informations correspondantes.    

Lorsque l’étudiant scanne le QR Code sur le poste de l’enseignant (ou l’image qu’il aura imprimé), il est redirigé sur une page confirmant sa présence à la séance (rappel des informations). Il obtiendra le statut “présent”. Flasher de nouveau le QR Code (dans la même plage horaire) ne changera rien. Sur le poste de l’enseignant, il y aura d’un côté le QR Code à scanner et de l’autre la liste des étudiants (mise à jour après chaque scannage).  

QR Code est valide seulement pour une plage horaire, en dehors de cette plage, le Serveur n’en prendra pas compte.  
  
Ci-dessous un schéma qui résume le déroulement du processus réalisé :
  
![Déroulement du processus](processus.png)   
  
Ci-après le schéma de la base de données : 
  
![Base de données](Screenshot_6.png)
  
Afin de faire une prévisualisation de l'application, nous avons créé 2 maquettes représentant,  
La page de connexion :  
  
![Page de connexion maquette](Page_de_connexion.png)

Rendu final de la page de connexion 
![Page de connexion effective](connexion_qrcode.PNG)
  
La feuille de présence dématerialisé :
  
![Feuille](Feuille_de_présence.png)  

Rendu visuel final de la page de validation de la séance (version tableau)

![valide_seance_tab](seances_valider.png) 

Rendu visuel final de la page de validation de la séance (version trombinoscope)

![valide_seance_tromb](valide_cours_part3.PNG) 

Un exemple de la page séance qui affiche les séances par promo et par matière

![affichage_seance](page_seance_qrcode.PNG) 

Un exemple de la version PDF d'une feuille de présence

![génération_pdf](feuille_presence_exemple.png) 

