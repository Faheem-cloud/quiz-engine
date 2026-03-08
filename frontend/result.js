
// ===== Get Student Details =====

let name = localStorage.getItem("username")
let vtuno = localStorage.getItem("vtuno")

document.getElementById("name").innerText = name
document.getElementById("vtuno").innerText = vtuno


// ===== Get Scores =====

let htmlScore = Number(localStorage.getItem("html_score")) || 0
let cssScore = Number(localStorage.getItem("css_score")) || 0
let jsScore = Number(localStorage.getItem("javascript_score")) || 0

let total = htmlScore + cssScore + jsScore


// ===== Show Scores =====

document.getElementById("html").innerText = htmlScore
document.getElementById("css").innerText = cssScore
document.getElementById("js").innerText = jsScore
document.getElementById("total").innerText = total


// ===== Pass / Fail Logic =====

let passMark = 15
let certificateBtn = document.getElementById("actionBtn")

if(total >= passMark){

// mark completed locally
localStorage.setItem(vtuno + "_completed", "true")

}else{

certificateBtn.innerText = "Try Again"

certificateBtn.onclick = function(){

// clear previous scores
localStorage.removeItem("html_score")
localStorage.removeItem("css_score")
localStorage.removeItem("javascript_score")

// allow new DB save
sessionStorage.removeItem("result_saved")

// reset completion flag
localStorage.removeItem(vtuno + "_completed")

// restart quiz
window.location.href = "quiz.html"

}

}


// ===== Save Result To Database (ONLY ONCE) =====

let saved = sessionStorage.getItem("result_saved")

if(!saved){

fetch("https://quiz-engine-mt13.onrender.com/submit-quiz", {

method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({

name: name,
vtuno: vtuno,
html: htmlScore,
css: cssScore,
javascript: jsScore

})

})
.then(res => res.json())
.then(data => {

console.log("Saved to DB:", data)

// prevent duplicate save
sessionStorage.setItem("result_saved","true")

})
.catch(err => console.log("Error saving:", err))

}


// ===== Certificate Generator =====

function downloadCertificate(){

if(total < 15){

alert("You must score at least 15 marks to download the certificate.")
return

}

const jsPDF = window.jspdf.jsPDF
const doc = new jsPDF("landscape")

const pageWidth = doc.internal.pageSize.getWidth()
const pageHeight = doc.internal.pageSize.getHeight()

const today = new Date().toLocaleDateString()
const certificateID = "CERT-" + Math.floor(100000 + Math.random() * 900000)


// Background
doc.setFillColor(15,12,41)
doc.rect(0,0,pageWidth,pageHeight,"F")


// Border
doc.setDrawColor(0,245,255)
doc.setLineWidth(5)
doc.rect(10,10,pageWidth-20,pageHeight-20)


// Title
doc.setTextColor(255,0,204)
doc.setFont("helvetica","bold")
doc.setFontSize(34)
doc.text("CERTIFICATE OF COMPLETION",pageWidth/2,45,{align:"center"})


// Subtitle
doc.setTextColor(255,255,255)
doc.setFontSize(18)
doc.setFont("helvetica","normal")
doc.text("This certificate is proudly presented to",pageWidth/2,75,{align:"center"})


// Name
doc.setTextColor(0,245,255)
doc.setFont("times","bold")
doc.setFontSize(30)
doc.text(name.toUpperCase(),pageWidth/2,100,{align:"center"})


// VTU Number
doc.setFontSize(16)
doc.setTextColor(255,255,255)
doc.text("VTU Number : " + vtuno,pageWidth/2,115,{align:"center"})


// Course
doc.setFontSize(18)
doc.text("For successfully completing the course",pageWidth/2,135,{align:"center"})

doc.setFont("helvetica","bold")
doc.text("FULLSTACK WITH JAVA QUIZ",pageWidth/2,150,{align:"center"})


// Score
doc.setFont("helvetica","normal")
doc.setFontSize(18)
doc.text("Total Score : " + total + " / 30",pageWidth/2,170,{align:"center"})


// Footer
doc.setFontSize(14)
doc.text("Date : " + today,30,pageHeight-30)
doc.text("Certificate ID : " + certificateID,pageWidth-120,pageHeight-30)


// Download
doc.save(name + "_certificate.pdf")

}


// ===== Home Button =====

function goHome(){

window.location.href = "index.html"

}

