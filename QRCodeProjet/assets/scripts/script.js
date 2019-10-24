function formPromoOK (idItem, chemin) {

    var valueNom = window.document.promomodif.nom.value;

    if (valueNom == "")
        alert("Tous les champs ne sont pas remplis");
    else {
        modifyItem(idItem, chemin);
        window.document.getElementById("redirection").click();
    }
}

function formMatiereOK (idItem, chemin) {

    var valueNom = window.document.matieremodif.nom.value;

    if (valueNom == "")
        alert("Tous les champs ne sont pas remplis");
    else {
        modifyItem(idItem, chemin);
        window.document.getElementById("redirection").click();
    }
}

function formSeanceOK (idItem, chemin) {

    var valueNom = window.document.seancemodif.nom.value;
    var valueDate = window.document.seancemodif.date.value;
    var valuehDebut = window.document.seancemodif.hDebut.value;
    var valuehFin = window.document.seancemodif.hFin.value;
    if (valueNom == "" || valueDate =="" || valuehDebut == "" || valuehFin =="")
        alert("Tous les champs ne sont pas remplis");
    else {
        modifyItem(idItem, chemin);
        window.document.getElementById("redirection").click();
    }
}

function formUserOK (idItem, chemin) {

    var valueNom = window.document.usermodif.nom.value;
    var valuePrenom = window.document.usermodif.prenom.value;
    var valueMail = window.document.usermodif.mail.value;

    var expr = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (valueNom =="" || valuePrenom =="" || valueMail =="")
        alert("Tous les champs ne sont pas remplis");
    else if(!expr.test(valueMail))
        alert("Veuillez renseigner une adresse email");
    else {
        modifyItem(idItem, chemin);
        window.document.getElementById("redirection").click();
    }
}

function confirmBeforeDelete(idItem, chemin) {
    var txt;
    var r = confirm("Attention, supprimer cet élément entrainera la suppression des éléments associés.");
    if (r == true) {
        deleteItem(idItem, chemin)
    }
}

function confirmBeforeDeleteAdmin(idItem, chemin) {
    var txt;
    var r = confirm("Attention, vous êtes sur le point de supprimer un administrateur. Êtes-vous sûr ?");
    if (r == true) {
        deleteItem(idItem, chemin)
    }
}

function deleteItem(idItem, chemin) {
	$.ajax({
		//url: "http://qrcode.guillaumeperes.fr/"+chemin+idItem,
		url:"http://localhost:8080/"+chemin+idItem,
		type: 'delete',
    });
}

function modifyItem(idItem, chemin) {
    $.ajax({
        //url: "http://qrcode.guillaumeperes.fr/"+chemin+idItem,
        url:"http://localhost:8080/"+chemin+idItem,
        data: $("#form").serialize(),
        type: 'put',
    });
}

function CachePromo() {
    var x = document.getElementById("role").value;
    if(x=="ENSEIGNANT" || x=="ADMINISTRATION")
    {
        document.getElementById("promovisible").style.visibility = "hidden";
    }
}

function chargeListEtudiant() {
    $("#switch").toggleClass("trombi");
    if(!($("#switch").hasClass("trombi")))
        $("#listEtu").load("listEtuStandard");
    else
        $("#listEtu").load("listEtuTrombinoscope");
}
