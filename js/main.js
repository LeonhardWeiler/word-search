/*
Project: Copied Project (students have to change this if written yourself)
Author:  Copilot ChatGPT OpenAI Codex Tabnine CodeT5 Polycoder Cogram (students have to change this if written yourself)
Date:    not a long time ago in this galaxy (students have to change this if written yourself)
*/
// nächste Zeile ist eigentlich unnötig da dies schon in eslint ausgenommen ist.
/*global document:true*/
'use strict';
import '/css/style.css';
import '/css/bootstrap.min.css';
import '/css/font-awesome.min.css';
import '/js/bootstrap.bundle.min.js';
const APPNAME = 'Template Version: 2025_02_21_vite';
document.title = APPNAME;
const myHeading1 = document.getElementById('myHeading1');
if (myHeading1) {
  myHeading1.innerHTML = APPNAME;
}
const elemOutputNew = document.createElement('div'); // Create new Element
elemOutputNew.classList.add('container', 'jumbotron'); // Add two Classes
elemOutputNew.style.cssText = 'opacity:0.3;background-color:#000;color: #fff'; // css
elemOutputNew.setAttribute('id', 'elemOutputNew'); // add id to Element
const myLastDiv = document.querySelector('body > div:last-of-type'); // find last div
if (myLastDiv) {
  myLastDiv.appendChild(elemOutputNew);  // add after last div
} else {
  document.body.appendChild(elemOutputNew);
}

// -----
// GAM says: Keep the lines above - Change value of const APPNAME  and Project Description, Author and Date
// -----

const output = document.getElementById('output');
const output2 = document.getElementById('output2');

const changeMyNameIn = document.getElementById('changeMyNameIn');
const changeMyNameBtn = document.getElementById('changeMyNameBtn');

changeMyNameBtn.addEventListener('click', function () {
  output.innerText = '';
  let changeMyName = changeMyNameIn.value;
  output.innerHTML += changeMyName;
});

output.innerHTML += APPNAME;
output2.innerHTML += 'Der Winter ist nah!';
elemOutputNew.innerText += 'Der Winter ist nah!';
console.log(changeMyNameIn.value);
