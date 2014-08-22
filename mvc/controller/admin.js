 /*******************
 Administration
 *******************/

module.exports.controller = function(app) {

 /****** admin users ******/
 
 app.get('/admin/users', function(req, res) {


	res.render('admin-users')
   
   //res.send('Home Controller');
   
 });
 

}