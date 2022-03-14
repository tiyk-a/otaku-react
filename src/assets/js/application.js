// // https://ics.media/entry/14771/
window.addEventListener("DOMContentLoaded", init);

function init() {
  var elem = document.getElementById('target');
  if (elem.innerHTML === '') {
    elem.innerHTML = 'default';
  } else {
    console.log(elem);
  }
}

function acceptTitle() {
  const formElements = document.forms.info;
  var arg1 = document.getElementById('target');
  arg1.innerHTML = formElements.title.value;
  init();
}

