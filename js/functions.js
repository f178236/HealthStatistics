var allTextLines = [];
var data_location;
var covid_btn = document.getElementById("covid");
var heart_disease_btn = document.getElementById("heart_disease");
var maleria_btn = document.getElementById("maleria");
var hiv_btn = document.getElementById("hiv");
var cancer_btn = document.getElementById("cancer");
var sleep_btn = document.getElementById("sleep_disorder");

document.getElementById("ftColumn").style.display= "none";
document.getElementsByClassName("t_test_input")[0].style.display= "none";
document.getElementsByClassName("t_test_input")[1].style.display= "none";
document.getElementsByClassName("anova_input")[0].style.display= "none";
if (covid_btn.addEventListener) {
    covid_btn.addEventListener("click", function () {
        data_location = "data/covid19.csv";
        loadAjax();
    });
}

if (cancer_btn.addEventListener) {
    cancer_btn.addEventListener("click", function () {
        data_location = "data/mental_disease.csv";
        loadAjax();
    });
}
if (sleep_btn.addEventListener) {
    sleep_btn.addEventListener("click", function () {
        data_location = "data/sleep_disorder.csv";
        loadAjax();
    });
}

//Load file with AJAX at runtime
function loadAjax() {
    var req = new XMLHttpRequest();

    req.open('GET', data_location);
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            allTextLines = req.responseText.split("\n");
            
            document.getElementById("table").innerHTML="";
            document.getElementById("frequencyTablesContainer").innerHTML="";
            document.getElementsByClassName("frequencyTablesContainer")[0].innerHTML="";
            document.getElementById('filename').innerHTML = data_location;
            document.getElementById("ftColumn").style.display= "block";
            
            displayTable(allTextLines);

        }
        if (req.readyState != 4 && req.status === 404) {
            var Error = '<div>Table not Found !</div>';
            document.getElementById('filename').innerHTML = Error;
        }
    };
    req.send();

}





// Show File Data
function displayTable(lines) {

    var table = document.getElementById('table');
    var rows = lines.length;
    

    for (var i = 0; i < rows; i++) {
        var tr = document.createElement('tr');
        var tds = [];
        var word = lines[i].split(",");
        var cols = word.length;
        for (var j = 0; j < cols; j++) {
            tds.push(document.createElement('td'));

            tds[j].innerHTML = word[j];
        }
        for (var j = 0; j < cols; j++) {
            tr.appendChild(tds[j]);
        }
        table.appendChild(tr);
    }
}

// Frequency Table Find Event
var calculateFrequencyTable = document.getElementById('calculateFrequencyTable');
calculateFrequencyTable.addEventListener('click', function () {

    document.getElementsByClassName("t_test_input")[0].style.display= "block";
    document.getElementsByClassName("t_test_input")[1].style.display= "block";
    document.getElementsByClassName("anova_input")[0].style.display= "block";
    var input = document.getElementById("userInput").value;
    var data = allTextLines;
    var rows = data.length;
    var selectedCol;
    var heading = data[0].split(",");

    for (var i = 0; i < rows; i++) {
        if (input == heading[i]) {
            selectedCol = i;
            break;
        }
    }

    var x = "";
    var myData = [];

    for (var i = 1; i < rows; i++) {
        var Temp = data[i].split(",");

        x = parseInt(Temp[selectedCol]);
        myData.push(x);
    }


    var table = new Table();

    table.addRow();
    table.addCol('Class');
    table.addCol('Frequency');
    table.addCol('Commulative Frequency');
    table.addCol('Relative Frequency');
    table.addCol('Percentage');
    table.addCol('Commulative Relative Frequency');

    var t = table.getTable();
    t.classList.add("tableContainer");

    var demo = document.getElementById('frequencyTablesContainer');
    // demo.appendChild(h2);
    demo.appendChild(t);

    var d = new Data(myData);
    var max = d.max();

    var labels = [];
    var rows = d.getNoOfRows();
    var min = d.min();
    var interval = d.getClassInterval();

    var first, second, f, cf, rf, p, crf;
    first = min;
    second = first + interval;
    c = d.getClass();
    f = d.getFrequencyArray();
    cf = d.getCommulativeFreqArray();
    rf = d.getRelativeFreqArray();
    p = d.getPercentageArray();
    crf = d.getCommulativeRelativeFrequencyArray();

    if (interval != 0) {
        for (var i = 0; i < rows; i++) {
            table.addRow();
            table.addCol(first + " - " + second);
            table.addCol(f[i]);
            table.addCol(cf[i]);
            table.addCol(rf[i]);
            table.addCol(p[i] + " %");
            table.addCol(crf[i] + " %");
            first = second;
            second += interval;
            labels.push(i + 1);
        }
    } else {
        for (var i = 0; i < rows; i++) {
            table.addRow();
            table.addCol(first);
            table.addCol(f[i]);
            table.addCol(cf[i]);
            table.addCol(rf[i]);
            table.addCol(p[i] + " %");
            table.addCol(crf[i] + " %");
            first++;
            labels.push(i + 1);
        }
    }

    table.addRow();
    table.addCol();
    table.addCol('sum = ' + d.length());
    table.addCol();
    table.addCol();
    table.addCol();
    table.addCol();


    var meanTable = new Table();
    meanTable.addRow();
    meanTable.addCol('Mean');
    meanTable.addCol('Standard Deviation');
    meanTable.addRow();
    meanTable.addCol(meanFunc(d.getData()));
    meanTable.addCol(standardDeviation(d.getData()));

    var t = meanTable.getTable();
    demo.appendChild(t);

   





    if (interval > 0)
        histogram(f, c, interval, max, heading);
    else {

        alert("Hi");
        heading = "" + heading + "";
        var title = heading.toLocaleUpperCase();
        barchart(demo, title, f, labels);
    }


    


});
var T_Test_Simple_Btn=document.getElementById("t_test_simple_btn");
T_Test_Simple_Btn.addEventListener('click',function(){
    var col1=document.getElementById("col1_t_test_simple_input").value;
    var data = allTextLines;
    var rows = data.length;
    var selectedCol1;
    var heading = data[0].split(",");


    for (var i = 0; i < rows; i++) {
        if (col1 == heading[i]) {
            selectedCol1 = i;
            break;
        }
    }



    var x = "";
    var col1_data = [];

    for (var i = 1; i < rows; i++) {
        var Temp = data[i].split(",");

        x = parseInt(Temp[selectedCol1]);
        if(!(Number.isNaN(x))){
            col1_data.push(x);
        }
        
    }
    
    console.log(col1_data);
    
    
    var filter_col1=[];
    for(var x=0;x<col1_data.length*0.1;x++){
        filter_col1[x]=col1_data[Math.floor(Math.random() * col1_data.length)];

    }
    
    // Calculate size of first array. 
    var t_mean=ss.mean(col1_data);
    var t=ss.tTest(filter_col1,t_mean);
    


    var p=jStat.ttest( t, col1_data.length*0.1, 2);
    


    var showtest=document.getElementById('frequencyTablesContainer');
    var T_Test = new Table();
    T_Test.addRow();
    T_Test.addCol('T Test (t value)');
    T_Test.addCol('T Test (p value)');
    T_Test.addRow();
    T_Test.addCol(t);
    T_Test.addCol(p);

    showtest.appendChild(T_Test.getTable());


});

var T_Test_Btn=document.getElementById("t_test_btn");
T_Test_Btn.addEventListener('click',function(){
    var col1=document.getElementById("col1_t_test_input").value;
    var col2=document.getElementById("col2_t_test_input").value;
    var data = allTextLines;
    var rows = data.length;
    var selectedCol1,selectedCol2;
    var heading = data[0].split(",");


    for (var i = 0; i < rows; i++) {
        if (col1 == heading[i]) {
            selectedCol1 = i;
            break;
        }
    }
    for (var i = 0; i < rows; i++) {
        if (col2 == heading[i]) {
            selectedCol2 = i;
            break;
        }
    }


    var x = "";
    var col1_data = [];
    var col2_data = [];

    for (var i = 1; i < rows; i++) {
        var Temp = data[i].split(",");

        x = parseInt(Temp[selectedCol1]);
        if(!(Number.isNaN(x))){
            col1_data.push(x);
        }
        
    }
    
    for (var i = 1; i < rows; i++) {
        var Temp = data[i].split(",");

        x = parseInt(Temp[selectedCol2]);
        if(!(Number.isNaN(x))){
            col2_data.push(x);
        }
    }
    console.log(col1_data);
    
    console.log(ss.mean(col1_data));
    var filter_col1=[];
    var filter_col2=[];
    for(var x=0;x<col1_data.length*0.1;x++){
        filter_col1[x]=col1_data[Math.floor(Math.random() * col1_data.length)];
        filter_col2[x]=col2_data[Math.floor(Math.random() * col2_data.length)];

    }
    
    // Calculate size of first array. 
    
    var t=CalculateTTest(filter_col1,filter_col2);
    


    var p=jStat.ttest( t, col1_data.length*0.1, 2);
    


    var showtest=document.getElementById('frequencyTablesContainer');
    var T_Test = new Table();
    T_Test.addRow();
    T_Test.addCol('T Test (t value)');
    T_Test.addCol('T Test (p value)');
    T_Test.addRow();
    T_Test.addCol(t);
    T_Test.addCol(p);

    showtest.appendChild(T_Test.getTable());


});


var Anova_Btn=document.getElementById("anova_btn");
Anova_Btn.addEventListener('click',function(){
    var col1=document.getElementById("col1_anova_input").value;
    var col2=document.getElementById("col2_anova_input").value;



    // test,Cullas,ahsjahjsha
   
    var data = allTextLines;
    var rows = data.length;
    var selectedCol1,selectedCol2;
    var heading = data[0].split(",");

    
    for (var i = 0; i < rows; i++) {
        if (col1 == heading[i]) {
            selectedCol1 = i;
            break;
        }
    }
    for (var i = 0; i < rows; i++) {
        if (col2 == heading[i]) {
            selectedCol2 = i;
            break;
        }
    }


    var x = "";
    //Arrays
    var col1_data = [];
    var col2_data = [];

    for (var i = 1; i < rows; i++) {
        var Temp = data[i].split(",");

        x = parseInt(Temp[selectedCol1]);
        col1_data.push(x);
    }
    
    for (var i = 1; i < rows; i++) {
        var Temp = data[i].split(",");

        x = parseInt(Temp[selectedCol2]);
        col2_data.push(x);
    }


    
    var filter_col1=[];
    var filter_col2=[];
    for(var x=0;x<col1_data.length;x++){

        if(!(Number.isNaN(col1_data[x]))){
            filter_col1[i]=col1_data[x];
            i++;
        }
 
    }
    i=0;
    for(var x=0;x<col2_data.length;x++){

        if(!(Number.isNaN(col2_data[x]))){
            filter_col2[i]=col2_data[x];
            i++;
        }
 
    }
    //2,78,1,221
    
    // Calculate size of first array. 
    
    var t=jStat.anovafscore(filter_col1,filter_col2);

    var p=jStat.anovaftest(filter_col1,filter_col2);



    var showtest=document.getElementById('frequencyTablesContainer');
    var T_Test = new Table();
    T_Test.addRow();
    T_Test.addCol('Anova Test (f value)');
    T_Test.addCol('Anova Test (p value)');
    T_Test.addRow();
    T_Test.addCol(t);
    T_Test.addCol(p);

    showtest.appendChild(T_Test.getTable());


});









function histogram(f, c, interval, max, heading) {

    var data = [];
    for (var i = 0; i < f.length; i++) {
        var obj = {
            x: "" + c[i] + "",
            y: f[i]
        };
        data[i] = obj;
    }
    var binInc = interval;
    var maxBin = max;

    console.log(maxBin);
    console.log(binInc);

    heading = "" + heading + "";

    var title = heading.toLocaleUpperCase();

    createHistogram(data, maxBin, binInc, title);
}

function barchart(demo, title, f, labels) {

    var canvas = document.createElement('canvas');
    canvas.style.width = "600px";
    canvas.style.height = "600px";
    canvas.style.margin = "auto";
    demo.appendChild(canvas);


    var id = canvas;
    var data = f;
    var labels = labels;
    var label = title;

    barChart(id, data, labels, label);
}