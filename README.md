# Ajaxer
Convert all (or some) traditional forms in your page to ajax. 

_This library is independent and does not require jQuery or any other library to work_

Simply add the Ajaxer library to your site like this
   
      <script src="Ajaxer.js"></script>
      
And you're good to go!

Let's say you have a html form

       <form method="POST" action="login.php" id="loginform">
          <input type="text" name="name" />
          <input type="password" name="password" />
          <input type="submit" value="Login" />
       </form>
       
 You can tell Ajaxer to convert this form and send it through Ajax instead of the traditional way, using the `convert` method
 
       var loginForm = $('#loginform');
       Ajaxer.convert(form, function(status, http){
            var self = this; // The scope of 'this' inside the callback function is the form which was converted
            if(status === true){
              self.innerHTML += "Your data has been sent. The server responded with this data: "+http.responseText;
            }
            else{
              alert(http.statusText);
            }
       });
       
and that's it. Now when the `loginform` is submitted, it will be submitted through ajax and the data returned by the server will be sent to the callback function! Ajaxer can be used to upload files as well.

You can also tell Ajaxer to convert all of the forms in your page by using the `convertAll` method

       Ajaxer.convertAll(function(status, http){
            var self = this; // The scope of 'this' inside the callback function is the form which was converted
            if(this.id === "loginform"){ // Yes we got our loginform!
              if(status === true){
                self.innerHTML += "Your data has been sent. The server responded with this data: "+http.responseText;
              }
              else{
                alert(http.statusText);
              }
           }
           else{ // some other form was sent
              // code logic
           }
       });
       
 __NOTE:__ The `convertAll` method takes only one parameter, that is the callback, and Ajaxer calls the same callback function for all the forms. So a good way of knowing which form was submitted is to use the `this` variable inside the callback function which always points to the form which was currently executed
 
## Some additional methods which may be used are
   
   - `Ajaxer.onPre` This function will be called just before sending a form data through Ajax. You might write the logic to show a loader/spinner here.
   - `Ajaxer.onPost` This function is called after the ajax call is complete. You might write the logic to hide the loader/spinner here.
   - `Ajaxer.onProgress` This function is called if any file is being uploaded. Ajaxer will pass one parameter, i.e, the percentage uploaded to this function.
   - Using `this` inside any of the above mentioned functions will always point to the form currently submitted
   
    
 For further implementation details, refer the index.html file, which has a working demo (requires PHP)
