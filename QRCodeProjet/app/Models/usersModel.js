var connection=require('../../config/dbconnection');

var Users={
    ObtAllUsers:function(callback)
    {
        return connection.query("select * from users u LEFT JOIN promotion p ON u.promotionU=p.idP Order by nomU, prenomU ASC", callback);
    },

    ObtAllEnseignants:function(callback)
    {
        return connection.query("select * from users u LEFT JOIN promotion p ON u.promotionU=p.idP where u.roleU='ENSEIGNANT' Order by nomU, prenomU ASC", callback);
    },

    ObtUserId:function(id, callback) {
        return connection.query("select * from users where id=? Order by nomU, prenomU ASC", [id], callback)
    },

    PutUserId:function(id, username, password, nom, prenom, mail, promo, callback) {
        return connection.query("update users SET username=?, password=?, nomU=?, prenomU=?, mailU=?, promotionU=? where id=?", [username, password, nom, prenom, mail, promo, id], callback)
    },
    PutUserIdImgProfil:function(id, namefile, callback) {
        return connection.query("update users SET imageProfileU=? where id=?", [namefile, id], callback)
    },

    DelUserId:function(id) {
        return connection.query("delete from users where id=?", [id])
    },

    AddUser:function(username, pass, prenom, nom, mail, role, promotion, image, callback) {
        return connection.query("INSERT INTO users ( username, password, prenomU, nomU, mailU, roleU, promotionU, imageProfileU) values (?,?,?,?,?,?,?,?)", [username, pass, prenom, nom, mail, role, promotion, image], callback);

    }
};
module.exports=Users;
