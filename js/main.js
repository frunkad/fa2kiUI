$(document).ready(function(){

  $("#addressSearch").click(function(){
    event.preventDefault();
    var userPassed = document.addresssearch.search.value;
    var dummy = userPassed;
    userPassed=userPassed.replace(/(^\s+|[^a-zA-Z0-9 ]+|\s+$)/g,"");   //this one
    userPassed=userPassed.replace(/\s+/g, "+");
    var lat=28.6500340000;
    var lng=77.4225610000;
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+userPassed+'&key=AIzaSyAQF1IHXvQpG4nEP1wQA1n-9eHcbnk3w3w';
    $.ajax({
        url : url,
        type: 'GET',
		    dataType:'json',
		    processData: false,
		    complete: function(data) {
            var d =  JSON.stringify(data);
            var d1 = JSON.parse(d);
            var abc = d1.responseJSON.results;
            $.each(abc,function(i,v){
                var outLat = v.geometry.location.lat;
                var outLng = v.geometry.location.lng;
                console.log(outLat,outLng);
                formData = JSON.stringify({
                  "lattitude":outLat,
                  "longitude":outLng
                });
                console.log(formData);
                validateAddress(formData,dummy);
            });
          console.log(d1);
		    },
		    error: function() {
			       console.log('fail');
             Materialize.toast('Please pass an address', 4000)
		    },

    });


    console.log('YAHA');
  });
});

function validateAddress(formData,dummy) {
  $.ajax({
      url : 'http://192.168.0.104:8000/valiaddress',
      type: 'POST',
      data: formData,
      dataType:'json',
      processData: false,
      contentType: 'application/json',
      complete: function(response) {
           console.log(response);
           var x = JSON.stringify(response);
           var res = JSON.parse(x);
           if(res.responseJSON.pocketId)
           {
             var pocketId=res.responseJSON.pocketId;
             if(window.localStorage){
               localStorage.setItem("pocketId",pocketId);
               localStorage.setItem("address",dummy);
               localStorage.setItem("addValue",formData);
                console.log(pocketId);
                var xformData = JSON.parse(formData);
                var lat = xformData.lattitude;
                var lng = xformData.longitude;
                var dUrl = lat+','+lng;
                console.log(xformData);
                var url = "https://www.google.com/maps/embed/v1/view?key=AIzaSyAQF1IHXvQpG4nEP1wQA1n-9eHcbnk3w3w&zoom=18&center="+dUrl;
                var nextButton = "<a class=btn-floating btn-large waves-effect waves-light red href=listview.html><i class=material-icons>arrow_forward</i></a>"
                $('#test').append(nextButton);
             }

           }
      },
      error: function(data) {
           console.log(data);
           Materialize.toast('Sorry we dont serve here yet', 4000)
           var xformData = JSON.parse(formData);
           var lat = xformData.lattitude;
           var lng = xformData.longitude;
           var dUrl = lat+','+lng;
           console.log(dUrl);
           var url = "https://www.google.com/maps/embed/v1/view?key=AIzaSyAQF1IHXvQpG4nEP1wQA1n-9eHcbnk3w3w&zoom=18&center="+dUrl;
          document.getElementById('addressMap').src = url;
      },
      fail: function(data){
          console.log(data);
      },
  });
}
