Create Database qrcode;

Drop table if exists Promotion;
CREATE TABLE Promotion (
idP INT AUTO_INCREMENT PRIMARY KEY,
nomP VARCHAR(50) NOT NULL
);

Drop table if exists Utilisateur;
CREATE TABLE Utilisateur (
idU INT AUTO_INCREMENT PRIMARY KEY,
nomU VARCHAR(50) NOT NULL,
prenomU VARCHAR(50) NOT NULL,
mailU VARCHAR(100) NOT NULL,
roleU VARCHAR(25) NOT NULL,
login varchar(25) NOT NULL,
mdp varchar(100) NOT NULL,
promotionU INT,
FOREIGN KEY (promotionU) REFERENCES Promotion(idP)
);

Drop table if exists Matiere;
CREATE TABLE Matiere (
idM INT AUTO_INCREMENT PRIMARY KEY,
nomM VARCHAR(50) NOT NULL,
promotionS INT,
FOREIGN KEY (promotionS) REFERENCES Promotion(idP)
);

Drop table if exists Seance;
CREATE TABLE Seance (
idS INT AUTO_INCREMENT PRIMARY KEY,
heureDebut datetime NOT NULL,
heureFin datetime NOT NULL,
matiereS INT,
utilisateurS INT,
FOREIGN KEY (matiereS) REFERENCES Promotion(idM),
FOREIGN KEY (utilisateurS) REFERENCES Promotion(idU)
);

Drop table if exists Badge;
CREATE TABLE Badge (
idB INT AUTO_INCREMENT PRIMARY KEY,
seanceB INT,
utilisateurB INT,
FOREIGN KEY (seanceB) REFERENCES Promotion(idS),
FOREIGN KEY (utilisateurB) REFERENCES Promotion(idU)
);
