var allTextLines="";
// .csv Select File Event 
function loadAJAX() {
    var req = new XMLHttpRequest();
    req.open('GET', 'data/covid19.csv');


    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            allTextLines = req.responseText.split("\n");
            displayTable(allTextLines);
            
        }
        if (req.readyState != 4 && req.status === 404) {
            var Error = '<div>Table not Found !</div>';
            document.getElementById('tableListing').innerHTML = Error;
        }
    };
    req.send();
}

// Show File Data
function displayTable(lines) {

    var table = document.getElementById('table');
    var rows = lines.length;
    var cols = lines[0].length;

    for (var i = 0; i < rows; i++) {
        var tr = document.createElement('tr');
        var tds = [];
        var word=lines[i].split(",");
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
    
  
    var input=document.getElementById("userInput").value;
    var data = allTextLines;
    var rows = data.length;
    var selectedCol;
  var heading =data[0].split(",");
    
    for (var i = 0; i < rows; i++) {
        if (input == heading[i]) {
            selectedCol = i;
            break;
        }
    }

    var x = "";
    var myData = [];

    for (var i = 1; i < rows; i++) {
        var Temp= data[i].split(",");
        
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
            labels.push(i+1);
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
            labels.push(i+1);
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
    else{
        
        heading = "" + heading + "";
        var title = heading.toLocaleUpperCase();
        barchart(demo,title,f,labels);
    }


    

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

function barchart(demo,title,f,labels) {

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