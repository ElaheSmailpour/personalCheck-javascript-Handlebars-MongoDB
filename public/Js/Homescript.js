
const error = new URLSearchParams(window.location.search).get("error")
if(error)
alert(error)
const startWork=()=>{
    window.location.assign("/home/startWork")
}

const endWork=()=>{
    window.location.assign("/home/endWork")
}
const startPause=()=>{
    window.location.assign("/home/startPause")
}
const endPause=()=>{
    window.location.assign("/home/endPause")
}
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
function onDayClick(day) {
   document.querySelector(".datePickerInput1").value = day.split("/").join(".");
   document.querySelector(".datePickerInput2").value = day.split("/").join(".");
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
datepicker('.datePickerInput1', {
    formatter: (input, date, instance) => {
        const value = date.toLocaleDateString()
        input.value = value // => '1/1/2099'
      }
  })
  datepicker('.datePickerInput2', {
    formatter: (input, date, instance) => {
        const value = date.toLocaleDateString()
        input.value = value // => '1/1/2099'
      }
  })